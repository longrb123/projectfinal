const mongoose = require("mongoose");
const Product = mongoose.model("Product")

const joi = require("@hapi/joi")

module.exports.managepost = async function (req, res) {
  const page = parseInt(req.query.page)
  const limit = 5
  const skip = (page - 1) * limit

  const totalDocuments = await Product.find().countDocuments()

  const totalPages = Math.ceil(totalDocuments / limit)
  const range = []
  const rangerForDot = []
  const deltal = 2

  const left = page - deltal
  const right = page + deltal
  //console.log(right)
  for (let i = 1; i <= totalPages; i++) {
    if (i === 1 || i === totalPages || (i >= left && i <= right)) {
      range.push(i)
    }
  }

  let temp
  range.map((i) => {
    if (temp) {
      if (i - temp === 2) {
        rangerForDot.push(i - 1)
      } else if (i - temp !== 1) {
        rangerForDot.push("...")
      }
    }
    temp = i
    //console.log("temp", temp)
    rangerForDot.push(i)

  })

  const products = await Product.find().populate("user_id").populate("cate_id").collation({ locale: "en_US", numericOrdering: true })
    .limit(limit).skip(skip)

  res.render("admin/pages/postmanage", {
    products,
    range: rangerForDot,
    page,
    totalPages,
  })
}

module.exports.deletepost = async function (req, res) {
  const { id } = req.params
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.redirect("/admin/post")
  }
  await Product.findByIdAndDelete(id)
  return res.redirect("/admin/post")
}