const mongoose = require('mongoose');

const ArticleSchema = new mongoose.Schema({
  title: String,       // The Gen Z Title (e.g. "AI just cooked hard fr")
  summary: String,     // The Gossip Summary
  category: String,    // "tech", "sports", etc.
  section: String,     // "trending" or "latest"
  image_url: String,   // The visual
  url: { type: String, unique: true }, // Keep URL only to prevent duplicates
  publishedAt: Date,
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Article', ArticleSchema);
