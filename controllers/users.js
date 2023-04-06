// required packages
const express = require("express");
const router = express.Router();

// GET /users/new -- show route for a form that creates a new user (sign up for the app)
router.get("/new", (req, res) => {
  res.render("users/new");
  // res.send("show a form to sign up for the app");
});

// POST /users -- CREATE a new user from the form @ GET /users/new
router.post("/", (req, res) => {
  console.log(req.body);
  // do a find or create with the user's given email
  // if the user returns as found -- don't let them sign up; redirect them to the login page
  // hash the user's password before we add it to the db
  // save the users in the db
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
