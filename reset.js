require('dotenv').config();
const mongoose = require('mongoose');
const Article = require('./models/Article');

// Connect to Database
mongoose.connect(process.env.MONGO_URI)
  .then(async () => {
    console.log('✅ Connected to MongoDB...');
    
    // The "Nuke" Command
    console.log('🧨 Deleting all old news...');
    await Article.deleteMany({}); 
    
    console.log('✨ Database is sparkly clean! You can start fresh now.');
    process.exit(); // Stop the script
  })
  .catch(err => {
    console.error('❌ Error:', err);
    process.exit(1);
  });