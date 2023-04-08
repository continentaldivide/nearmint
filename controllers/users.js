// required packages
const express = require("express");
const router = express.Router();
const db = require("../models");
const bcrypt = require("bcrypt");
const cryptoJs = require("crypto-js");

router.get("/new", (req, res) => {
  res.render("users/new");
});

router.post("/", async (req, res) => {
  try {
    console.log(
      `user creation attempt at ${new Date().toString()}: username = ${
        req.body.username
      } email = ${req.body.email}`
    );
    // do a find or create with the user's given email
    const [newUser, created] = await db.user.findOrCreate({
      where: {
        username: req.body.username,
      },
    });
    if (!created) {
      console.log("user account exists");
      res.redirect(
        "users/login?message='Account exists.  Please log in to continue.'"
      );
    } else {
      const hashedPassword = bcrypt.hashSync(req.body.password, 12);
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

// GET /users/login -- show route for a form that lets a user log in
router.get("/login", (req, res) => {
  res.send("show a form that lets the user log in");
});

// POST /users/login -- authenticate a user's credentials
router.post("/login", (req, res) => {
  res.send("verify credentials that are given by the user to log in");
});

// GET /users/logout -- log out the current user
router.get("/logout", (req, res) => {
  res.send("log a user out");
});

// GET /users/profile -- show authorized users their profile page
router.get("/profile", (req, res) => {
  res.send("show the currently logged in user their personal profile page");
});

// export the router instance
module.exports = router;
