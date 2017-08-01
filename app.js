// GENERAL MIDDLEWARE
const express = require("express");
const expressLayouts = require("express-ejs-layouts");
const path = require("path");
const favicon = require("serve-favicon");
const logger = require("morgan");
const cookieParser = require("cookie-parser");
const bodyParser = require("body-parser");
const session = require("express-session");

// DB MIDDLEWARE
const mongoose = require("mongoose");
const MongoStore = require("connect-mongo")(session);

// AUTH MIDDLEWARE
const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const FbStrategy = require("passport-facebook").Strategy;
const bcrypt = require("bcrypt");
const flash = require("connect-flash");

// MODELS
const User = require("./models/user");

// CONNECT TO DB
mongoose.connect("mongodb://localhost/foodstr-development");

// DEFINE routes
const index = require("./routes/index");
const authentication = require("./routes/authentication");
const privateRoutes = require("./routes/private");

// DEFINE EXPRESS APP
const app = express();

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

// OTHER MIDDLEWARE
app.use(favicon(path.join(__dirname, "public", "/images/favicon.ico")));
app.use(logger("dev"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

// PASSPORT USE/SERIALIZE/DESERIALIZE /////////////////////////////////////////
app.use(
  session({
    secret: "foodstrdev",
    resave: false,
    saveUninitialized: true,
    store: new MongoStore({ mongooseConnection: mongoose.connection })
  })
);

passport.serializeUser((user, cb) => {
  cb(null, user.id);
});

passport.deserializeUser((id, cb) => {
  User.findById(id, (err, user) => {
    if (err) {
      return cb(err);
    }
    cb(null, user);
  });
});

// AUTHENTICATION STRATEGIES /////////////////////////////////////////////////

app.use(flash());

// LOCAL SIGN UP //
passport.use(
  "local-signup",
  new LocalStrategy(
    { passReqToCallback: true },
    (req, email, password, next) => {
      // To avoid race conditions
      console.log(email);
      process.nextTick(() => {
        console.log("DEBUG");

        User.findOne({ email: email }, (err, user) => {
          if (err) {
            return next(err);
          }

          if (user) {
            return next(null, false);
          } else {
            // Destructure the body
            const { firstName, lastName } = req.body;
            const hashPass = bcrypt.hashSync(
              password,
              bcrypt.genSaltSync(8),
              null
            );
            const newUser = new User({
              email,
              password: hashPass,
              firstName,
              lastName
            });

            newUser.save(err => {
              if (err) {
                next(err);
              }
              return next(null, newUser);
            });
          }
        });
      });
    }
  )
);

// LOCAL LOG IN //
passport.use(
  "local-login",
  new LocalStrategy((email, password, next) => {
    User.findOne({ email }, (err, user) => {
      if (err) {
        return next(err);
      }
      if (!user) {
        return next(null, false, {
          message: "Incorrect email and/or password"
        });
      }
      if (!bcrypt.compareSync(password, user.password)) {
        return next(null, false, {
          message: "Incorrect email and/or password"
        });
      }

      return next(null, user);
    });
  })
);

// PASSPORT FACEBOOK STRETEGY //
passport.use(
  new FbStrategy(
    {
      clientID: "1459747944109187",
      clientSecret: "015ff40129d43b9aad6bc3036ac96111",
      callbackURL: "/auth/facebook/callback",
      profileFields: ["id", "name", "emails"]
    },
    (accessToken, refreshToken, profile, done) => {
      User.findOne({ facebookID: profile.id }, (err, user) => {
        if (err) {
          return done(err);
        }
        if (user) {
          return done(null, user);
        }

        const newUser = new User({
          facebookID: profile.id,
          firstName: profile.name.givenName,
          lastName: profile.name.familyName,
          email: profile.emails[0].value
        });

        newUser.save(err => {
          if (err) {
            return done(err);
          }
          done(null, newUser);
        });
      });
    }
  )
);

// PASSPORT INITITALIZATION ///////////////////////////////////////////////////
app.use(passport.initialize());
app.use(passport.session());

// ADD USER TO LOCALS /////////////////////////////////////////////////////////
app.use((req, res, next) => {
  res.locals.user = req.user;
  next();
});

// USE ROUTES /////////////////////////////////////////////////////////////////
app.use("/", index);
app.use("/", authentication);
app.use("/", privateRoutes);

/// ERROR HANDLING ///////////////////////////////////////////////////////////
// catch 404 and forward to error handler
app.use(function(req, res, next) {
  const err = new Error("Not Found");
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render("error");
});

module.exports = app;
