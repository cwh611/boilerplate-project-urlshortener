require('dotenv').config();
const express = require('express');
const cors = require('cors');
const app = express();
const dns = require('dns');

const port = process.env.PORT || 3000;

app.use((req, res, next) => {
  res.setHeader(
    "Content-Security-Policy",
    "script-src 'self' https://chunk-url-shortener-b4adf6660818.herokuapp.com; connect-src 'self' https://chunk-url-shortener-b4adf6660818.herokuapp.com;"
  );
  next();
});

app.use(cors());

app.use('/public', express.static(`${process.cwd()}/public`));

app.use(express.json());

app.get('/', function(req, res) {
  res.sendFile(process.cwd() + '/views/index.html');
});

app.get('/api/hello', function(req, res) {
  res.json({ greeting: 'hello API' });
});

let urlDatabase = {};
let shortUrlCounter = 1;

app.post("/api/shorturl", function (req, res) {
  const originalUrl = req.body.url;
  if (!originalUrl) {
    res.status(400).json({ error: "URL is required" });
    return
  } else if ( !/^https?:\/\/.test(originalUrl) ) {
    res.status(400).json({ error: "invalid url" });
    return
  }
  const { hostname } = new URL(originalUrl);
  dns.lookup(hostname, (err, addresses, family) => {
    if (err) {
      res.status(400).json({ error: "invalid url" });
      return
    } 
    const shortUrl = shortUrlCounter;
    urlDatabase[shortUrl] = originalUrl;
    res.json({
      original_url: originalUrl,
      short_url: shortUrl
    })
    shortUrlCounter++
  })
})

app.get("/api/shorturl/:shorturl", function (req, res) {
  const shortUrl = req.params.shorturl;
  const originalUrl = urlDatabase[shortUrl];
  if ( !originalUrl ) {
    return res.status(404).json({ error: "Short URL not found" })
  }
  res.redirect(originalUrl);
})

app.listen(port, function() {
  console.log(`Listening on port ${port}`);
});
