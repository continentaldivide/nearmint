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
      // where: {
      //   username: req.body.username,
      // },
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
      res.redirect("/users/profile");
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

// GET /users/profile -- show authorized users their profile page
router.get("/profile", (req, res) => {
  if (!res.locals.user) {
    res.redirect("/users/login?rsi=true");
  } else {
    res.render("users/profile", {
      user: res.locals.user,
    });
  }
});

module.exports = router;
