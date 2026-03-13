require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
app.use(express.json());
app.use(cors());

// Connect to MongoDB using the URI from .env
const mongoUri = process.env.MONGO_URI;

if (!mongoUri) {
  console.error("MongoDB URI is not defined in the environment variables!");
  process.exit(1);
}

mongoose.connect(mongoUri)
  .then(() => {
    console.log('✅ Connected successfully to MongoDB Database!');
  })
  .catch((err) => {
    console.error('❌ MongoDB connection error:', err);
  });

// API Routes
const apiRoutes = require('./routes/api');
app.use('/api', apiRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
