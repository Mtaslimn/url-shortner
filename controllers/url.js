const shortid = require("shortid");
const URL = require("../models/url");

async function handleGenerateNewShortURl(req, res) {
  try {
    const body = req.body;
    if (!body.url) return res.status(400).json({ error: "url is required" });
    
    const shortID = shortid();

    await URL.create({
      shortId: shortID,
      redirectURL: body.url,
      visitHistory: [],
    });

    const baseUrl = `${req.protocol}://${req.get('host')}`;
    // FIXED: Removed /url/ prefix to match /:shortId route
    return res.json({ 
      id: shortID, 
      shortUrl: `${baseUrl}/${shortID}` 
    });
  } catch (error) {
    console.error("Error generating short URL:", error);
    return res.status(500).json({ error: "Server error" });
  }
}

async function handleGetAnalytics(req, res) {
  try {
    const shortId = req.params.shortId;
    const result = await URL.findOne({ shortId });
    
    if (!result) {
      return res.status(404).json({ error: "URL not found" });
    }
    
    return res.json({
      totalClicks: result.visitHistory.length,
      analytics: result.visitHistory,
    });
  } catch (error) {
    console.error("Error fetching analytics:", error);
    return res.status(500).json({ error: "Server error" });
  }
}

async function handleDeleteShortUrl(req, res) {
  try {
    const shortId = req.params.shortId;
    const result = await URL.findOneAndDelete({ shortId });
    
    if (!result) {
      return res.status(404).json({ error: "URL not found" });
    }
    
    return res.json({ success: true });
  } catch (error) {
    console.error("Error deleting URL:", error);
    return res.status(500).json({ error: "Server error" });
  }
}

module.exports = {
  handleGenerateNewShortURl,
  handleGetAnalytics,
  handleDeleteShortUrl,
};