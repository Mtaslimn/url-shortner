require('dotenv').config();

const express = require('express');
const path = require('path');
const methodOverride = require('method-override');
const { connectomongodb } = require('./connect');
const URL = require('./models/url');

// Import routers
const urlRoute = require('./routes/url');
const staticRoute = require('./routes/staticRouter');

const app = express();
const PORT = process.env.PORT || 8001;

// MongoDB connection with error handling
connectomongodb(process.env.MONGODB_URI || "mongodb://localhost:27017/short-url")
  .then(() => console.log("✅ MongoDB Connected Successfully"))
  .catch(err => {
    console.error("❌ MongoDB Connection Failed:", err.message);
    process.exit(1); // Exit if database connection fails
  });

// View engine setup
app.set("view engine", "ejs");
app.set("views", path.resolve("./views"));

// Middleware
app.use(express.json()); // Parse JSON bodies
app.use(express.urlencoded({ extended: false })); // Parse URL-encoded bodies
app.use(methodOverride('_method')); // Support DELETE/PUT in forms
app.use(express.static(path.join(__dirname, 'public'))); // Serve static files

// Routes
app.use("/url", urlRoute); // API routes for URL operations
app.use("/", staticRoute); // Static pages

// Dynamic redirect handler - MUST be after other routes
app.get("/:shortId", async (req, res) => {
  const shortId = req.params.shortId;
  
  try {
    // Find and update URL with visit history
    const entry = await URL.findOneAndUpdate(
      { shortId },
      {
        $push: {
          visitHistory: {
            timestamp: Date.now(),
          },
        },
      },
      { new: true } // Return updated document
    );
    
    if (!entry) {
      return res.status(404).render('home', {
        error: 'Short URL not found',
        urls: await URL.find({}).sort({ createdAt: -1 })
      });
    }
    
    // Redirect to original URL
    res.redirect(entry.redirectURL);
  } catch (error) {
    console.error("Redirect error:", error);
    res.status(500).json({ error: "Server error" });
  }
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});

// Export for Vercel (replaces app.listen for serverless)
module.exports = app;

// Local server start (for development only)
if (process.env.NODE_ENV !== 'production') {
  app.listen(PORT, () => {
    console.log(`🚀 Server Started at http://localhost:${PORT}`);
  });
}