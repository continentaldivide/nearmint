const express = require("express");
const router = express.Router();
require("dotenv").config();
const cryptoJs = require("crypto-js");

const getTimeAndHash = () => {
  const timeStamp = new Date().getTime();
  const payload = timeStamp + process.env.PRIV_KEY + process.env.PUB_KEY;
  const hash = cryptoJs.MD5(payload).toString();
  return [timeStamp, hash];
};

router.get("/", async (req, res) => {
  res.render("comics/index");
});

router.get("/search", async (req, res) => {
  try {
    let [newTime, newHash] = getTimeAndHash();
    let url = `https://gateway.marvel.com:443/v1/public/comics?titleStartsWith=${req.query.series}&orderBy=-focDate&ts=${newTime}&apikey=${process.env.PUB_KEY}&hash=${newHash}`;
    const response = await fetch(url);
    console.log(url)
    const responseJson = await response.json();
    console.log(req.query.series);
    res.render("comics/search", {
      series: req.query.series,
      comics: responseJson.data.results,
    });
  } catch (error) {
    console.log(error);
  }
});

module.exports = router;
