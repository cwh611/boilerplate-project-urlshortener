require('dotenv').config();
const express = require('express');
const cors = require('cors');
const app = express();
const dns = require('dns');

const port = process.env.PORT || 3000;

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
  if ( !/^https?:\/\//.test(originalUrl) ) {
    res.json({ error: "invalid url" });
    return
  }
  console.log(originalUrl);
  const { hostname } = new URL(originalUrl);
  dns.lookup(hostname, (err, addresses, family) => {
    if (err) {
      res.json({ error: "invalid url" });
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
  console.log(shortUrl, originalUrl);
  if ( originalUrl ) {
    res.redirect(originalUrl)
  } else  {
    res.json({error: "invalid url"})
  }
})

app.listen(port, function() {
  console.log(`Listening on port ${port}`);
});
