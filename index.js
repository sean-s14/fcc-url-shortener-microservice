require("dotenv").config();
const express = require("express");
const cors = require("cors");
const app = express();
const dns = require("dns");

// Basic Configuration
const port = process.env.PORT || 3000;

app.use(cors());

app.use(express.urlencoded({ extended: false }));
app.use(express.json());

app.use("/public", express.static(`${process.cwd()}/public`));

app.get("/", function (req, res) {
  res.sendFile(process.cwd() + "/views/index.html");
});

// Your first API endpoint
app.get("/api/hello", function (req, res) {
  res.json({ greeting: "hello API" });
});

const short_urls = {};

app.post("/api/shorturl", (req, res) => {
  const { url } = req.body;

  const regex = new RegExp(/https?:\/\/.+\..+/);
  if (!regex.test(url)) {
    return res.json({ error: "invalid url" });
  }

  const id = Object.keys(short_urls).length + 1;
  short_urls[id] = url;
  console.log("Short Urls :", short_urls);

  return res.json({ original_url: url, short_url: id });
});

app.get("/api/shorturl/:shorturl", (req, res) => {
  const { shorturl } = req.params;
  return res.redirect(short_urls[shorturl]);
});

app.listen(port, function () {
  console.log(`Listening on port ${port}`);
});
