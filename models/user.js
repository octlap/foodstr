const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userSchema = new Schema({
  email: String,
  password: String,
  firstName: String,
  lastName: String,
  facebookID: String,
  city: String // maybe Google place ID
  // places = []
});

const User = mongoose.model("User", userSchema);

module.exports = User;
