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
  console.log("Post Request Method:", req.method);
  console.log("Post Request URL:", req.url);
  console.log("Post Request Headers:", JSON.stringify(req.headers, null, 2));
  console.log("Post Request Body:", JSON.stringify(req.body, null, 2));
  const originalUrl = req.body.url;
  console.log(`Original link sent by FCC: ${originalUrl}`);
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
    console.log(shortUrl);
    urlDatabase[shortUrl] = originalUrl;
    res.json({
      original_url: originalUrl,
      short_url: shortUrl
    })
    shortUrlCounter++;
    console.log(`shortUrlCounter on POST: ${shortUrlCounter}`);
    console.log(`urlDatabase on POST: ${JSON.stringify(urlDatabase, null, 2)}`)
  })
})

app.get("/api/shorturl/:shorturl", function (req, res) {
  console.log("Get Request Method:", req.method);
  console.log("Get Request URL:", req.url);
  console.log("Get Request Headers:", JSON.stringify(req.headers, null, 2));
  console.log("Get Request Body:", JSON.stringify(req.body, null, 2));
  const shortUrl = req.params.shorturl;
  console.log(`ShortUrl requested by FCC: ${shortUrl}`);
  if ( !shortUrl || !urlDatabase.hasOwnProperty(shortUrl) ) {
    res.json({error: "invalid url"});
    return
  }
  console.log(`SHORTURL ON REDIRECT: ${shortUrl}`);
  const originalUrl = urlDatabase[shortUrl];
  console.log(originalUrl);
  if ( originalUrl ) {
    res.redirect(originalUrl);
    console.log(`shortUrlCounter on GET / redirect: ${shortUrlCounter}`);
    console.log(`urlDatabase on GET / redirect: ${JSON.stringify(urlDatabase, null, 2)}`)
  } else  {
    res.json({error: "invalid url"})
  }
})

app.listen(port, function() {
  console.log(`Listening on port ${port}`);
});
