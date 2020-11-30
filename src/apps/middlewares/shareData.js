const mongoose = require("mongoose")
const Category = mongoose.model("Category")
module.exports = async function (req, res, next) {

    res.locals.menus = await Category.find()
    res.locals.user = req.session.user || null
    next()
}