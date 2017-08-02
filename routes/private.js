const express = require("express");
const router = express.Router();
const { ensureLoggedIn, ensureLoggedOut } = require("connect-ensure-login");
const Place = require("../models/place");
const User = require("../models/user");

// HOME PAGE //////////////////////////////////////////////////////////////////
router.get("/home", ensureLoggedIn("/login"), (req, res, next) => {
  res.render("private/home", {
    title: "Foosdstr"
  });
});

// NEW PLACE PAGE /////////////////////////////////////////////////////////////
router.get("/new", ensureLoggedIn("/login"), (req, res, next) => {
  res.render("private/new", {
    title: "Add a new place"
  });
});

router.post("/new", ensureLoggedIn("/login"), (req, res, next) => {
  const newPlace = {
    name: req.body.name,
    address: req.body.address,
    googlePlaceId: req.body.googlePlaceId,
    photo: req.body.photo
  };

  // First add place in Place collection if it doesn't already exist
  Place.findOneAndUpdate({ googlePlaceId: req.body.googlePlaceId }, newPlace, {
    new: true,
    upsert: true,
    setDefaultsOnInsert: true
  })
    .then(place => {
      // Create new place object
      const userPlace = {
        _placeId: place._id,
        status: req.body.status
      };

      // Only add to user's places vector if not already added
      return User.findOneAndUpdate(
        { _id: req.user._id, "places._placeId": { $ne: userPlace._placeId } },
        { $push: { places: userPlace } },
        {
          new: true,
          setDefaultsOnInsert: true
        }
      );
    })
    .then(result => {
      // If place already exists refresh page and suggest adding another one
      if (result == null) {
        res.render("private/new", {
          message:
            "You've already saved this place " +
            req.user.firstName +
            "! Maybe another one?"
        });
      } else {
        res.redirect("/profile");
      }
    })
    .catch(err => {
      console.log(err);
    });
});

// PROFILE PAGE ///////////////////////////////////////////////////////////////
router.get("/profile", ensureLoggedIn("/login"), async (req, res, next) => {
  const places = [];

  for (let i = 0; i < req.user.places.length; i++) {
    console.log(req.user.places[i]._placeId);
    const place = await Place.findOne({ _id: req.user.places[i]._placeId });
    places.push({
      name: place.name,
      address: place.address,
      googlePlaceId: place.googlePlaceId,
      photo: place.photo
    });
  }

  res.render("private/profile", {
    title: "Foodstr - " + req.user.firstName + "'s profile",
    user: req.user,
    places
  });
});

module.exports = router;
