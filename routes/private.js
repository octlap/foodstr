const express = require("express");
const router = express.Router();
const { ensureLoggedIn, ensureLoggedOut } = require("connect-ensure-login");

router.get("/home", ensureLoggedIn("/login"), (req, res, next) => {
  res.render("private/home");
});

router.get("/new", ensureLoggedIn("/login"), (req, res, next) => {
  res.render("private/new");
});

router.post;

module.exports = router;
