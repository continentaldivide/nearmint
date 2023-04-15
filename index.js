// required packages
require("dotenv").config();
const express = require("express");
const cookieParser = require("cookie-parser");
const cryptoJs = require("crypto-js");
const db = require("./models");
const methodOverride = require("method-override");

// app config
const app = express();
const PORT = process.env.PORT || 8000;
app.set("view engine", "ejs");

// middlewares
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static("public"));
app.use(methodOverride("_method"));
app.use((req, res, next) => {
  console.log(`[${new Date().toLocaleString()}]: ${req.method} ${req.url}`);
  next();
});

// custom auth middleware
app.use(async (req, res, next) => {
  try {
    if (req.cookies.userSession) {
      const decryptedPk = cryptoJs.AES.decrypt(
        req.cookies.userSession,
        process.env.ENC_KEY
      );
      const decryptedPkString = decryptedPk.toString(cryptoJs.enc.Utf8);
      const user = await db.user.findByPk(decryptedPkString); //
      res.locals.user = user;
    } else {
      res.locals.user = null;
    }
  } catch (error) {
    console.log(error);
    res.locals.user = null;
  } finally {
    next();
  }
});

// routes and controllers
app.get("/", (req, res) => {
  if (req.cookies.userSession) {
    res.render("index_signed_in", {
      user: res.locals.user,
    });
  } else {
    res.render("index_not_signed_in");
  }
});

app.get("/error", (req, res) => {
  res.render("error");
});

app.use("/users", require("./controllers/users.js"));
app.use("/search", require("./controllers/search.js"));

// listen on a port

app.listen(PORT, () => {
  console.log(`listening on ${PORT}`);
});
