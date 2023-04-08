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
  try {
    let [newTime, newHash] = getTimeAndHash();
    let url = `https://gateway.marvel.com:443/v1/public/characters?nameStartsWith=${req.query.characterName}&ts=${newTime}&apikey=${process.env.PUB_KEY}&hash=${newHash}`;
    const response = await fetch(url);
    const responseJson = await response.json();
    console.log(req.query.characterName);
    res.render("comics/index", {
      characterName: req.query.characterName,
      data: responseJson.data.results,
    });
  } catch (error) {
    console.log(error);
  }
});

module.exports = router;
