const express = require("express");
const router = express.Router();
require("dotenv").config();
const cryptoJs = require("crypto-js");
const db = require("../models");

const getTimeAndHash = () => {
  const timeStamp = new Date().getTime();
  const payload = timeStamp + process.env.PRIV_KEY + process.env.PUB_KEY;
  const hash = cryptoJs.MD5(payload).toString();
  return [timeStamp, hash];
};

router.get("/comics", async (req, res) => {
  res.render("search/comics/index");
});

router.get("/comics/results", async (req, res) => {
  try {
    let [newTime, newHash] = getTimeAndHash();
    let url = `https://gateway.marvel.com:443/v1/public/comics?orderBy=-focDate&ts=${newTime}&apikey=${
      process.env.PUB_KEY
    }&hash=${newHash}&titleStartsWith=${encodeURIComponent(req.query.series)}`;
    if (req.query.issueNumber) {
      url += `&issueNumber=${req.query.issueNumber}`;
    }
    if (req.query.format.length > 0) {
      url += `&format=${encodeURIComponent(req.query.format)}`;
    }
    if (req.query.noVariants.length > 0) {
      url += `&noVariants=${req.query.noVariants}`;
    }
    if (req.query.dateRange.length > 0) {
      url += `&dateRange=${req.query.dateRange}`;
    }
    const response = await fetch(url);
    const responseJson = await response.json();
    res.render("search/comics/results", {
      series: req.query.series,
      comics: responseJson.data.results,
    });
  } catch (error) {
    console.log(error);
  }
});

router.get("/series", async (req, res) => {
  res.render("search/series/index");
});

router.get("/series/results", async (req, res) => {
  try {
    let [newTime, newHash] = getTimeAndHash();
    let url = `https://gateway.marvel.com:443/v1/public/series?titleStartsWith=${encodeURIComponent(
      req.query.series
    )}&contains=comic&ts=${newTime}&apikey=${
      process.env.PUB_KEY
    }&hash=${newHash}`;
    const response = await fetch(url);
    const responseJson = await response.json();
    res.render("search/series/results", {
      query: req.query.series,
      series: responseJson.data.results,
    });
  } catch (error) {
    console.log(error);
  }
});

module.exports = router;
