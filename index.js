require('dotenv').config();

const express = require('express');
const path = require('path');
const methodOverride = require('method-override');
const { connectToMongoDB } = require('./connect');
const URL = require('./models/url');

// Import routers
const urlRoute = require('./routes/url');
const staticRoute = require('./routes/staticRouter');

const app = express();
const PORT = process.env.PORT; // No fallback; Render provides PORT

// MongoDB connection
connectToMongoDB(process.env.MONGODB_URI || "mongodb://localhost:27017/short-url")
  .then(() => console.log("✅ MongoDB Connected Successfully"))
  .catch(err => {
    console.error("❌ MongoDB Connection Failed:", err.message);
    process.exit(1);
  });

// View engine setup
app.set("view engine", "ejs");
app.set("views", path.resolve("./views"));

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(methodOverride('_method'));
app.use(express.static(path.join(__dirname, 'public')));

// Routes
app.use("/url", urlRoute);
app.use("/", staticRoute);

// Dynamic redirect handler
app.get("/:shortId", async (req, res) => {
  const shortId = req.params.shortId;
  try {
    const entry = await URL.findOneAndUpdate(
      { shortId },
      { $push: { visitHistory: { timestamp: Date.now() } } },
      { new: true }
    );
    if (!entry) {
      return res.status(404).render('home', {
        error: 'Short URL not found',
        urls: await URL.find({}).sort({ createdAt: -1 })
      });
    }
    res.redirect(entry.redirectURL);
  } catch (error) {
    console.error("Redirect error:", error);
    res.status(500).json({ error: "Server error" });
  }
});

// Error handling
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});

// Start server on 0.0.0.0 for Render
app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Server Started on port ${PORT}`);
});