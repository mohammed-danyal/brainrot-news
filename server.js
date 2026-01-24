// server.js

require("dotenv").config(); // Safe: ignored on Render, used locally

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const axios = require("axios");
const { GoogleGenerativeAI } = require("@google/generative-ai");
const Article = require("./models/Article");

const app = express();
app.use(cors());
app.use(express.json());

// ---------------- CONFIG ----------------
const CATEGORIES = ["technology", "sports", "business", "india", "world"];
const MAX_PER_CATEGORY = 2;
const FETCH_DELAY_MS = 10_000;

// ---------------- HELPERS ----------------
const delay = (ms) => new Promise((res) => setTimeout(res, ms));

const SLANG_SUFFIXES = [" 💀", " (Real)", " No Cap", " fr fr", " 💅", " It's giving drama"];
const SLANG_PREFIXES = ["POV: ", "Just in: ", "Y'all... ", "Oop- ", "Wait... "];

function manualBrainrot(text) {
  const prefix = SLANG_PREFIXES[Math.floor(Math.random() * SLANG_PREFIXES.length)];
  const suffix = SLANG_SUFFIXES[Math.floor(Math.random() * SLANG_SUFFIXES.length)];
  return prefix + text + suffix;
}

function safeJsonParse(text) {
  const match = text.match(/\{[\s\S]*\}/);
  if (!match) return null;
  try {
    return JSON.parse(match[0]);
  } catch {
    return null;
  }
}

async function generateWithRetry(model, prompt, retries = 1) {
  try {
    return await model.generateContent(prompt);
  } catch (err) {
    if (retries > 0) {
      console.log("🔁 Retrying Gemini...");
      await delay(2000);
      return generateWithRetry(model, prompt, retries - 1);
    }
    throw err;
  }
}

// ---------------- DATABASE ----------------
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB connected"))
  .catch((err) => {
    console.error("❌ MongoDB error:", err.message);
    process.exit(1); // Kill app so Render restarts it
  });

// ---------------- MAIN BOT ----------------
async function fetchAndProcessNews() {
  console.log("🤖 News bot started");

  const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

  for (const category of CATEGORIES) {
    console.log(`\n🔍 Category: ${category.toUpperCase()}`);

    let apiUrl = `https://newsdata.io/api/1/latest?apikey=${process.env.NEWSDATA_API_KEY}&language=en`;

    if (category === "india") apiUrl += "&country=in";
    else apiUrl += `&category=${category}&country=in`;

    let articles = [];

    try {
      const res = await axios.get(apiUrl, { timeout: 15_000 });
      articles = res.data?.results || [];
    } catch (err) {
      console.log("⚠️ News API failed:", err.message);
      continue;
    }

    for (let i = 0; i < Math.min(articles.length, MAX_PER_CATEGORY); i++) {
      const article = articles[i];
      if (!article?.link || !article?.title) continue;

      const exists = await Article.findOne({ url: article.link });
      if (exists) {
        console.log("⏭️ Duplicate skipped");
        continue;
      }

      let finalTitle = article.title;
      let finalSummary = "This news just dropped. Internet is reacting.";
      let isAiSuccess = false;

      try {
        const prompt = `
You are a JSON API.

STRICT RULES:
- Output VALID JSON ONLY
- No markdown
- No emojis
- No extra text

Schema:
{
  "genZTitle": string,
  "summary": string
}

Headline: "${article.title}"

Rewrite the headline in viral Gen Z slang (short & punchy).
Summarize the news in a funny Gen Z paragraph (3–4 sentences).
        `;

        const result = await generateWithRetry(model, prompt);
        const text = result.response.text();

        const aiData = safeJsonParse(text);
        if (!aiData) throw new Error("Invalid JSON");

        if (
          typeof aiData.genZTitle !== "string" ||
          typeof aiData.summary !== "string"
        ) {
          throw new Error("Missing fields");
        }

        finalTitle = aiData.genZTitle;
        finalSummary = aiData.summary;
        isAiSuccess = true;

        console.log("✨ AI success");
      } catch (err) {
        console.log("⚠️ AI failed:", err.message);
      }

      if (!isAiSuccess) {
        finalTitle = manualBrainrot(article.title);
        finalSummary = manualBrainrot(
          "This story just dropped and bestie, people are talking."
        );
      }

      await Article.create({
        title: finalTitle,
        summary: finalSummary,
        category,
        section: i === 0 ? "trending" : "latest",
        image_url:
          article.image_url ||
          `https://placehold.co/600x400/161b22/7ee787?text=${category}`,
        url: article.link,
        publishedAt: article.pubDate,
      });

      console.log("⏳ Cooldown...");
      await delay(FETCH_DELAY_MS);
    }
  }

  console.log("💤 Bot cycle complete");
}

// ---------------- ROUTES ----------------
app.get("/api/news", async (req, res) => {
  try {
    const articles = await Article.find()
      .sort({ createdAt: -1 })
      .limit(100);
    res.json(articles);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ---------------- SERVER ----------------
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  fetchAndProcessNews(); // Auto-run on Render start
});
