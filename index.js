const express = require("express");
const path = require('path');
const urlRoute = require("./routes/url");
const { connectomongodb } = require("./connect");
const staticRoute = require("./routes/staticRouter");
const URL = require("./models/url");
const app = express();
const PORT = 8001;

// Connect on startup (optional, for testing)
connectomongodb().catch(console.error);

app.set('view engine', "ejs");
app.set('views', path.resolve("./views"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
const methodOverride = require('method-override');
app.use(methodOverride('_method'));
app.use("/url", urlRoute);
app.use("/", staticRoute);
app.use(express.static('public'));

app.get("/url/:shortId", async (req, res) => {
  const shortId = req.params.shortId;
  const entry = await URL.findOneAndUpdate(
    { shortId },
    { $push: { visitHistory: { timestamp: Date.now() } } }
  );
  res.redirect(entry.redirectURL);
});

// Test route
app.get('/test-db', async (req, res) => {
  try {
    await connectomongodb();
    res.send('DB connected!');
  } catch (error) {
    res.status(500).send('DB error: ' + error.message);
  }
});

app.listen(PORT, () => console.log(`Server started at PORT:${PORT}`));