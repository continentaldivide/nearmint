const express = require("express");
const router = express.Router();
const db = require("../models");
const bcrypt = require("bcrypt");
const cryptoJs = require("crypto-js");
const { Op } = require("sequelize");

const userMessages = {
  requestSignIn: "Please sign in to continue.",
  failedSignIn: "Incorrect username or password.",
  accountAlreadyExists:
    "Account exists for that username or email.  Please sign in to continue.",
};

const getTimeAndHash = () => {
  const timeStamp = new Date().getTime();
  const payload = timeStamp + process.env.PRIV_KEY + process.env.PUB_KEY;
  const hash = cryptoJs.MD5(payload).toString();
  return [timeStamp, hash];
};

router.get("/new", (req, res) => {
  res.render("users/new");
});

router.post("/", async (req, res) => {
  try {
    console.log(
      `user creation attempt at ${new Date().toLocaleString()}: username = ${
        req.body.username
      } email = ${req.body.email}`
    );
    const [newUser, created] = await db.user.findOrCreate({
      where: {
        [Op.or]: [{ username: req.body.username }, { email: req.body.email }],
      },
      defaults: {
        collection_public: false,
      },
    });
    if (!created) {
      console.log("user account exists");
      res.redirect("users/login?aae=true");
    } else {
      const hashedPassword = bcrypt.hashSync(req.body.password, 12);
      newUser.username = req.body.username;
      newUser.email = req.body.email;
      newUser.password = hashedPassword;
      await newUser.save();
      const encryptedPk = cryptoJs.AES.encrypt(
        newUser.id.toString(),
        process.env.ENC_KEY
      );
      res.cookie("userSession", encryptedPk.toString());
      res.redirect(`users/${newUser.username}/profile`);
    }
  } catch (error) {
    console.log(error);
  }
});

router.get("/login", (req, res) => {
  let infoMessage;
  if (req.query.rsi) {
    infoMessage = userMessages.requestSignIn;
  } else if (req.query.fsi) {
    infoMessage = userMessages.failedSignIn;
  } else if (req.query.aae) {
    infoMessage = userMessages.accountAlreadyExists;
  }
  res.render("users/login.ejs", {
    infoMessage,
  });
});

// POST /users/login -- authenticate a user's credentials
router.post("/login", async (req, res) => {
  try {
    const foundUser = await db.user.findOne({
      where: {
        username: req.body.username,
      },
    });
    if (!foundUser) {
      console.log("User trying to log in was not found in db");
      res.redirect("/users/login?fsi=true");
    } else if (!bcrypt.compareSync(req.body.password, foundUser.password)) {
      console.log("User trying to log in has incorrect password");
      res.redirect("/users/login?fsi=true");
    } else {
      const encryptedPk = cryptoJs.AES.encrypt(
        foundUser.id.toString(),
        process.env.ENC_KEY
      );
      res.cookie("userSession", encryptedPk.toString());
      res.redirect("/");
    }
  } catch (error) {
    console.log("login POST error:" + error);
  }
});

router.get("/logout", (req, res) => {
  console.log("logging user out");
  res.clearCookie("userSession");
  res.redirect("/");
});

router.get("/:username/:destination", async (req, res) => {
  try {
    // for any GET route with a username in the path...

    // if there isn't a signed-in user, request sign in
    if (!res.locals.user) {
      res.redirect("/users/login?rsi=true");
      return;
    }
    // if the signed-in user's username doesn't match the one in the path,
    if (req.params.username !== res.locals.user.username) {
      // find the user referenced in the path
      let pathUser = await db.user.findOne({
        where: {
          username: req.params.username,
        },
      });
      // user referenced in path doesn't exist?  goodbye
      if (!pathUser) {
        res.render("users/unauthorized");
        return;
      }
      // check whether the successfully-found path user has their collection set
      // to public, and if so, pass a bool asking the client to hide the delete
      // from collection button (button won't work anyway, hiding is just cosmetic)
      if (pathUser.dataValues.collection_public) {
        let collection = await pathUser.getComics({
          where: {
            in_collection: true,
          },
          order: [
            ["series", "ASC"],
            ["issue_number", "DESC"],
          ],
        });
        let showDeleteButton = false;
        res.render("users/collection", {
          collection,
          showDeleteButton,
        });
        return;
      }
      // if path user collection not set to public, goodbye
      else {
        res.render("users/unauthorized");
        return;
      }
    }
    // otherwise, direct them to profile, collection, wishlist, or
    // pull list, depending on the request, and then complete any
    // necessary actions as needed
    if (req.params.destination === "profile") {
      res.render("users/profile");
      return;
    }
    if (req.params.destination === "collection") {
      let collection = await res.locals.user.getComics({
        where: {
          in_collection: true,
        },
        order: [
          ["series", "ASC"],
          ["issue_number", "DESC"],
        ],
      });

      res.render("users/collection", {
        collection,
        showDeleteButton: true,
      });
      return;
    }
    if (req.params.destination === "wishlist") {
      let wishlist = await res.locals.user.getComics({
        where: {
          in_wishlist: true,
        },
      });
      res.render("users/wishlist", {
        wishlist,
      });
      return;
    }
    if (req.params.destination === "pull_list") {
      let pull_list = await res.locals.user.getSeries();
      let seriesString = "";
      let responseJson = { data: { results: [] } };
      if (pull_list.length > 0) {
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
        responseJson = await response.json();
      }
      res.render("users/pull_list", {
        pull_list,
        comics: responseJson.data.results,
      });
      return;
    }
    // and if they haven't provided a known/expected route, deliver an error
    else {
      res.redirect("/error");
      return res.status(404).send();
    }
  } catch (error) {
    console.log(error);
  }
});

router.post("/:username/:destination", async (req, res) => {
  try {
    // for any POST route with a username in the path...

    // if there isn't a signed-in user, request sign in
    if (!res.locals.user) {
      res.redirect("/users/login?rsi=true");
      return;
    }
    // if they're posting a comic, use this block
    if (
      req.params.destination === "collection" ||
      req.params.destination === "wishlist"
    ) {
      let [newComic, created] = await db.comic.findOrCreate({
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
        },
      });
      // checks whether to add new comic to collection
      // or wishlist based on route of post request
      req.params.destination === "collection"
        ? (newComic.in_collection = true)
        : (newComic.in_wishlist = true);
      await newComic.save();
      res.status(204).send();
    }
    // if they're posting a series, use this block
    else if (req.params.destination === "pull_list") {
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

router.put("/:username/collection", async (req, res) => {
  try {
    let [comic] = await res.locals.user.getComics({
      where: {
        id: req.body.id,
      },
    });
    comic.set({
      in_collection: true,
      in_wishlist: null,
    });
    await comic.save();
    res.redirect("./wishlist");
  } catch (error) {
    console.log(error);
  }
});

router.delete("/:username/collection", async (req, res) => {
  try {
    await db.comic.destroy({
      where: {
        id: req.body.id,
        user_id: res.locals.user.id,
      },
    });
    res.redirect("./collection");
  } catch (error) {
    console.log(error);
  }
});

router.delete("/:username/wishlist", async (req, res) => {
  try {
    await db.comic.destroy({
      where: {
        id: req.body.id,
        user_id: res.locals.user.id,
      },
    });
    res.redirect("./wishlist");
  } catch (error) {
    console.log(error);
  }
});

router.delete("/:username/pull_list", async (req, res) => {
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
