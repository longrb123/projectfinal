
const mongoose = require("mongoose");
const Category = mongoose.model("Category")

const joi = require("@hapi/joi")



// module.exports.managercategory = async function (req, res) {
//      const page = parseInt(req.query.page)
//      const limit = 3;
//      const skip = (page - 1) * limit

//      const totalDocuments = await Category.find().countDocuments()
//      //console.log(totalDocuments);

//      const totalPages = Math.ceil(totalDocuments / limit)
//      const range = []
//      const rangerForDot = []
//      const deltal = 2

//      const left = page - deltal
//      const right = page + deltal
//      //console.log(right)
//      for (let i = 1; i <= totalPages; i++) {
//           if (i === 1 || i === totalPages || (i >= left && i <= right)) {
//                range.push(i)
//           }
//      }
//      //console.log(range)
//      let temp
//      range.map((i) => {
//           if (temp) {
//                if (i - temp === 2) {
//                     rangerForDot.push(i - 1)
//                } else if (i - temp !== 1) {
//                     rangerForDot.push("...")
//                }
//           }
//           temp = i
//           //console.log("temp", temp)
//           rangerForDot.push(i)

//      })
//      //console.log(rangerForDot)
//      const categories = await Category.find().sort("-_id").populate("cate_id").limit(limit).skip(skip)
//      //console.log("product",products);
//      //console.log("req.query", req.query);
//      //console.log(req.session)
//      res.render("admin/pages/managercategory", { categories, range: rangerForDot, page, totalPages })
// }

module.exports.managercategory = async function (req, res) {
     const categories = await Category.find()
     res.render("admin/pages/managecategory", { categories })

}

module.exports.delete = async function (req, res) {
     const { id } = req.params
     if (!mongoose.Types.ObjectId.isValid(id)) {
          return res.redirect("/admin/category")
     }
     await Category.findByIdAndDelete(id)
     return res.redirect("/admin/category")
}


module.exports.addcategory = async function (req, res) {

     res.render("admin/pages/manageaddcategory"), {
          error: ""
     }
}
module.exports.save = async function (req, res) {
     const bodySchema = joi.object({ cate_name: joi.string().required() }).unknown()
     const value = await bodySchema.validateAsync(req.body).catch(err => err)
     if (value instanceof Error) {
          return res.redirect("/admin/addcategory")
     }

     const newcategory = new Category({
          cate_name: value.cate_name
     })
     await newcategory.save()
     return res.redirect("/admin/category")
}
module.exports.editcategory = async function (req, res) {
     const { id } = req.params
     const category = await Category.findById(id)
     res.render("admin/pages/manageeditcategory", { category })
}
module.exports.updatecategory = async function (req, res) {
     const { id } = req.params
     const bodySchema = joi.object().keys({ cate_name: joi.string().required() }).unknown()

     console.log(req.body)

     const value = await bodySchema.validateAsync(req.body).catch(err => err)
     console.log(value)
     if (value instanceof Error) {
          return res.redirect(`/admin/editcategory/${id}`)
     }
     let error;

     const category = await Category.findById(id)

     if (category) {
          await Category.updateOne({
               _id: id
          }, {
               $set: {
                    cate_name: value.cate_name
               }
          })

     }
     return res.redirect("/admin/category")
}