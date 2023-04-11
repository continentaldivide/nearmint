const express = require("express");
const router = express.Router();
require("dotenv").config();
const cryptoJs = require("crypto-js");
const user = require("../models/user");

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
    const responseJson = await response.json();
    await res.locals.user.createComic({
      marvel_id: responseJson.data.results[0].id,
    });
    res.render("comics/search", {
      series: req.query.series,
      comics: responseJson.data.results,
    });
  } catch (error) {
    console.log(error);
  }
});

module.exports = router;
