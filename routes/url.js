
// Defines routes for creating new short URLs and fetching analytics.

const express = require("express");
const{handleGenerateNewShortURl, handleGetAnalytics, handleDeleteShortUrl} = require("../controllers/url"); // imports the object exported from it location
const router = express.Router(); // creates a mini Express application A router lets you group related routes together, instead of writing everything in app.js.

router.post('/', handleGenerateNewShortURl); // defines a route that listens for POST requests. - path for this route -  handleGenerateNewShortURl → the function that will run when someone sends a POST request.

router.get('/analytics/:shortId', handleGetAnalytics)

router.delete('/delete/:shortId', handleDeleteShortUrl); // New DELETE route

module.exports = router;