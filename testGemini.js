const { GoogleGenerativeAI } = require("@google/generative-ai");

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

async function test() {
  const model = genAI.getGenerativeModel({ model: "models/gemini-pro" });

  const result = await model.generateContent("Say hello in Gen Z slang");
  console.log(result.response.text());
}

test();
