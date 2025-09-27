// This file handles the connection to your MongoDB database using Mongoose.

// It makes your connectomongodb function return a Promise that can be awaited.

// This lets you pause execution until MongoDB connects, while still keeping your app non-blocking.

require('dotenv').config(); // Load .env variables
const mongoose = require('mongoose');

async function connectomongodb() {
  const url = process.env.MONGODB_URI;
  if (!url) {
    throw new Error("MONGODB_URI is not set in .env file");
  }
  try {
    await mongoose.connect(url);
    console.log("Connected to MongoDB Atlas successfully!");
  } catch (error) {
    console.error("MongoDB connection error:", error.message);
  }
}

module.exports = {
  connectomongodb
};