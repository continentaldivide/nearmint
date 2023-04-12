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

router.get("/", async (req, res) => {
  res.render("series/index");
});

router.get("/search", async (req, res) => {
  try {
    let [newTime, newHash] = getTimeAndHash();
    let url = `https://gateway.marvel.com:443/v1/public/series?titleStartsWith=${encodeURIComponent(
      req.query.series
    )}&contains=comic&ts=${newTime}&apikey=${
      process.env.PUB_KEY
    }&hash=${newHash}`;
    const response = await fetch(url);
    const responseJson = await response.json();
    res.render("series/search", {
      query: req.query.series,
      series: responseJson.data.results,
    });
  } catch (error) {
    console.log(error);
  }
});

router.post("/", async (req, res) => {
  try {
    if (!res.locals.user) {
      res.redirect("/users/login");
    } else {
      await db.series.findOrCreate({
        where: {
          marvel_id: req.body.id,
          user_id: res.locals.user.id,
        },
        defaults: {
          title: req.body.title,
          thumbnail_url: req.body.thumbnail_url,
          marvel_url: req.body.marvel_url,
        },
      });
      res.status(204).send();
    }
  } catch (error) {
    console.log(error);
  }
});

router.get("/pull_list", async (req, res) => {
  try {
    let pull_list = await db.series.findAll({
      where: {
        user_id: res.locals.user.id,
      },
    });
    let seriesString = "";
    pull_list.forEach((series) => {
      seriesString += `${series.marvel_id},`;
    });
    let [newTime, newHash] = getTimeAndHash();
    // Query params include noVariants so that pull list is only showing primary issues
    // and orderBy focDate to sort by front-of-cover publication date
    let url = `https://gateway.marvel.com:443/v1/public/comics?noVariants=true&series=${encodeURIComponent(
      seriesString
    )}&orderBy=-focDate&limit=10&ts=${newTime}&apikey=${
      process.env.PUB_KEY
    }&hash=${newHash}`;
    const response = await fetch(url);
    const responseJson = await response.json();
    res.render("series/pull_list", {
      pull_list,
      comics: responseJson.data.results,
    });
  } catch (error) {
    console.log(error);
  }
});

router.delete("/pull_list", async (req, res) => {
  try {
    await db.series.destroy({
      where: {
        id: req.body.id,
        user_id: res.locals.user.id,
      },
    });
    res.redirect("./pull_list");
  } catch (error) {
    console.log(error);
  }
});

module.exports = router;
