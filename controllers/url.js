const shortid = require("shortid");
const URL = require("../models/url");

async function handleGenerateNewShortURl(req, res) {
  const body = req.body;
  if (!body.url) return res.status(400).json({ error: "url is required" });
  const shortID = shortid();

  await URL.create({
    shortId: shortID,
    redirectURL: body.url,
    visitHistory: [],
  });

  const baseUrl = `${req.protocol}://${req.get('host')}`;
  return res.json({ id: shortID, shortUrl: `${baseUrl}/url/${shortID}` });
}

async function handleGetAnalytics(req, res) {
  const shortId = req.params.shortId;
  const result = await URL.findOne({ shortId });
  return res.json({
    totalClicks: result.visitHistory.length,
    analytics: result.visitHistory,
  });
}

async function handleDeleteShortUrl(req, res) {
  const shortId = req.params.shortId;
  const result = await URL.findOneAndDelete({ shortId });
  if (!result) {
    return res.status(404).json({ error: "URL not found" });
  }
  return res.json({ success: true }); // Return JSON to trigger client-side update
}

module.exports = {
  handleGenerateNewShortURl,
  handleGetAnalytics,
  handleDeleteShortUrl,
};