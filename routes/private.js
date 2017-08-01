const express = require("express");
const router = express.Router();
const { ensureLoggedIn, ensureLoggedOut } = require("connect-ensure-login");
const Place = require("../models/place");

router.get("/home", ensureLoggedIn("/login"), (req, res, next) => {
  res.render("private/home");
});

router.get("/new", ensureLoggedIn("/login"), (req, res, next) => {
  res.render("private/new");
});

router.post("/new", ensureLoggedIn("/login"), (req, res, next) => {
  const newPlace = {
    name: req.body.name,
    address: req.body.address,
    googlePlaceId: req.body.googlePlaceId
  };

  Place.findOneAndUpdate({ googlePlaceId: req.body.googlePlaceId }, newPlace, {
    upsert: true,
    setDefaultsOnInsert: true
  })
    .then(res => {
      console.log("Success!");
    })
    .catch(err => {
      console.log(err);
    });

  res.redirect("/home");
});

module.exports = router;
