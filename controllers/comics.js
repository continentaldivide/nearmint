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
  res.render("comics/index");
});

router.get("/search", async (req, res) => {
  try {
    let [newTime, newHash] = getTimeAndHash();
    let url = `https://gateway.marvel.com:443/v1/public/comics?titleStartsWith=${encodeURIComponent(
      req.query.series
    )}&orderBy=-focDate&ts=${newTime}&apikey=${
      process.env.PUB_KEY
    }&hash=${newHash}`;
    const response = await fetch(url);
    const responseJson = await response.json();
    res.render("comics/search", {
      series: req.query.series,
      comics: responseJson.data.results,
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
      await db.comic.findOrCreate({
        where: {
          marvel_id: req.body.id,
          user_id: res.locals.user.id,
        },
        defaults: {
          title: req.body.title,
          series: req.body.series,
          issue_number: req.body.issue_number,
          thumbnail_url: req.body.thumbnail_url,
          marvel_url: req.body.marvel_url,
          owned: req.body.owned || null,
          wishlist: req.body.wishlist || null,
        },
      });
      res.status(204).send();
    }
  } catch (error) {
    console.log(error);
  }
});

router.get("/collection", async (req, res) => {
  try {
    let collection = await db.comic.findAll({
      where: {
        user_id: res.locals.user.id,
        owned: true,
      },
    });
    console.log(collection);
    res.render("comics/collection", {
      collection,
    });
  } catch (error) {
    console.log(error);
  }
});

router.delete("/collection", async (req, res) => {
  try {
    await db.comic.destroy({
      where: {
        id: req.body.id,
        user_id: res.locals.user.id,
      },
    });
    let collection = await db.comic.findAll({
      where: {
        user_id: res.locals.user.id,
        owned: true,
      },
    });
    res.redirect("./collection");
  } catch (error) {
    console.log(error);
  }
});

module.exports = router;
