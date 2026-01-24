require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const axios = require('axios');
const { GoogleGenerativeAI } = require("@google/generative-ai");
const Article = require('./models/Article');

const app = express();
app.use(cors());
app.use(express.json());

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

const CATEGORIES = ['technology', 'sports', 'business', 'india', 'world']; 
const MAX_PER_CATEGORY = 2; 

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('✅ Connected to MongoDB'))
  .catch(err => console.error('❌ MongoDB Connection Error:', err));

// --- FALLBACKS ---
const SLANG_SUFFIXES = [" 💀", " (Real)", " No Cap", " fr fr", " 💅", " It's giving drama"];
const SLANG_PREFIXES = ["POV: ", "Just in: ", "Y'all... ", "Oop- ", "Wait... "];

function manualBrainrot(text) {
    const prefix = SLANG_PREFIXES[Math.floor(Math.random() * SLANG_PREFIXES.length)];
    const suffix = SLANG_SUFFIXES[Math.floor(Math.random() * SLANG_SUFFIXES.length)];
    return prefix + text + suffix;
}

// --- MAIN FETCH ---
async function fetchAndProcessNews() {
  console.log('🤖 Bot: Waking up...');
  const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" }); 

  try {
    for (const category of CATEGORIES) {
      console.log(`\n🔍 Fetching category: ${category.toUpperCase()}...`);
      let apiUrl = `https://newsdata.io/api/1/latest?apikey=${process.env.NEWSDATA_API_KEY}&language=en`;
      if (category === 'india') apiUrl += `&country=in`; 
      else apiUrl += `&category=${category}&country=in`; 

      let articles = [];
      try {
        const response = await axios.get(apiUrl);
        articles = response.data.results;
      } catch (err) {
        console.log(`⚠️ API Error: ${err.message}`);
        continue;
      }

      if (!articles || articles.length === 0) continue;

      for (let i = 0; i < Math.min(articles.length, MAX_PER_CATEGORY); i++) {
        const article = articles[i];
        
        const exists = await Article.findOne({ url: article.link });
        if (exists) { console.log(`⏭️  Skipped duplicate.`); continue; }

        console.log(`🤔 Processing: "${article.title.substring(0, 30)}..."`);
        
        let finalTitle = article.title;
        let finalSummary = "Check the vibes on this one.";
        let isAiSuccess = false;

        try {
            // *** UPDATED PROMPT FOR PARAGRAPH ***
            const prompt = `
              Headline: "${article.title}"
              
              Task: 
              1. Rewrite headline in viral Gen Z slang (short & punchy).
              2. Summarize the news in a short, funny paragraph (3-4 sentences). Explain what happened using slang like "finna", "caught in 4k", "bestie", etc.
              Return ONLY JSON: { "genZTitle": "text", "summary": "text" }
            `;

            const result = await model.generateContent(prompt);
            const response = await result.response;
            const text = response.text();
            
            const jsonString = text.replace(/```json/g, '').replace(/```/g, '').trim();
            const aiData = JSON.parse(jsonString);
            
            if (aiData.genZTitle) {
                finalTitle = aiData.genZTitle;
                finalSummary = aiData.summary;
                isAiSuccess = true;
                console.log(`✨ AI SUCCESS: ${finalTitle}`);
            }
        } catch (e) {
            console.log(`⚠️ AI Failed. Using fallback.`);
        }

        if (!isAiSuccess) {
            finalTitle = manualBrainrot(article.title);
        }

        await Article.create({
          title: finalTitle,       
          summary: finalSummary,
          category: category,      
          section: (i === 0) ? 'trending' : 'latest',        
          image_url: article.image_url || `https://placehold.co/600x400/161b22/7ee787?text=${category}`,     
          url: article.link,
          publishedAt: article.pubDate
        });

        console.log("⏳ Cooling down (10s)...");
        await delay(10000); 
      }
    }
    console.log("\n💤 Cycle complete. Sleeping...");

  } catch (error) {
    console.error('❌ Critical Error:', error.message);
  }
}

app.get('/api/news', async (req, res) => {
  try {
    const articles = await Article.find().sort({ createdAt: -1 }).limit(100);
    res.json(articles);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  fetchAndProcessNews(); 
});