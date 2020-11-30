const mongoose = require("mongoose");


const UserSchema = new mongoose.Schema({
  user_mail: String,
  user_pass: String,
  user_fullName: String,
  user_address: String,
  user_phone: Number,
  user_level: 0,
  user_img: String,
  user_gender: String,
  user_dob: String,

});

mongoose.model("User", UserSchema, "users");