const express = require("express");
const router = express.Router();
const passport = require("passport");
const { ensureLoggedIn, ensureLoggedOut } = require("connect-ensure-login");

// SIGN UP - GET
router.get("/signup", ensureLoggedOut(), (req, res, next) => {
  res.render("authentication/signup", { message: req.flash("error") });
});

// SIGN UP - POST
router.post(
  "/signup",
  ensureLoggedOut(),
  passport.authenticate("local-signup", {
    successRedirect: "/home",
    failureRedirect: "/signup",
    failureFlash: true,
    passReqToCallback: true
  })
);

// LOG IN - GET
router.get("/login", ensureLoggedOut(), (req, res, next) => {
  res.render("authentication/login", { message: req.flash("error") });
});

// LOG IN - POST
router.post(
  "/login",
  ensureLoggedOut(),
  passport.authenticate("local-login", {
    successRedirect: "/home",
    failureRedirect: "/login",
    failureFlash: true,
    passReqToCallback: true
  })
);

// LOG OUT - POST
router.post("/logout", ensureLoggedIn(), (req, res) => {
  req.logout();
  res.redirect("/");
});

// FACEBOOK login
router.get(
  "/auth/facebook",
  passport.authenticate("facebook", {
    scope: ["email"]
  })
);
router.get(
  "/auth/facebook/callback",
  passport.authenticate("facebook", {
    successRedirect: "/home",
    failureRedirect: "/login"
  })
);

module.exports = router;
