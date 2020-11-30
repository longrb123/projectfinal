const mongoose = require("mongoose");

const Category = mongoose.model("Category");
const Product = mongoose.model("Product");
const User = mongoose.model("User");

module.exports.dashboard = async function (req, res) {

  const number_category = await Category.countDocuments()
  const number_post = await Product.countDocuments()
  const number_user = await User.countDocuments()

  // res.render("admin/pages/dashboard")
  res.render("admin/pages/dashboard", { data: {}, number_category, number_post, number_user })

};

module.exports.login = function (req, res) {
  res.render("admin/pages/login", { error: "" });
};
module.exports.postLogin = async function (req, res) {
  const email = req.body.mail;
  const pass = req.body.pass;
  const user = await User.findOne({ user_mail: email })
  console.log(user)
  let error;
  if (!user) {
    error = "Email or password invalid"
  }


  if (user && user.user_pass === pass) {
    req.session.user = user
    return res.redirect("/admin/dashboard");
  }

  res.render("admin/pages/login", {
    error
  });
};
module.exports.logout = function (req, res) {
  req.session.destroy();
  res.redirect("/login");
};



