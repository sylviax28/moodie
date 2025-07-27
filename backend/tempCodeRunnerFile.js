const express = require('express');
const axios = require('axios');
const qs = require('querystring');
const cors = require('cors');
const bodyParser = require('body-parser');
require('dotenv').config();

const app = express();
const PORT = 8888;

app.use(cors());
app.use(bodyParser.json());

app.post('/api/get_spotify_token', async (req, res) => {
  const code = req.body.code;
  const redirect_uri = 'http://127.0.0.1:5173/callback';
  const tokenEndpoint = 'https://accounts.spotify.com/api/token';
  const data = {
    grant_type: 'authorization_code',
    code: code,
    redirect_uri: redirect_uri,
    client_id: process.env.SPOTIFY_CLIENT_ID,
    client_secret: process.env.SPOTIFY_CLIENT_SECRET
  };

  try {
    const response = await axios.post(tokenEndpoint, qs.stringify(data), {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    });
    res.json(response.data);
  } catch (error) {
    console.error("Error receiving Spotify API access token", error.response?.data || error.message);
    res.status(400).json({ error: "Failed to get access token" });
  }
});

// Start server only once, after all routes
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
