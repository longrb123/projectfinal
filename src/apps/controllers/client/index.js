const mongoose = require("mongoose")
const User = mongoose.model("User")
const Product = mongoose.model("Product")
const Category = mongoose.model("Category")
const path = require("path")
const fs = require("fs")
const joi = require("@hapi/joi")

const { sendMailforSignup } = require("../../../libs/sendMail")




module.exports.login = function (req, res) {
    res.render("admin/pages/login", { error: "" })
}
module.exports.postLogin = async function (req, res) {
    const email = req.body.mail;
    const pass = req.body.pass;

    const user = await User.findOne({ user_mail: email })

    let error = "Email or password invalid"

    if (user && user.user_pass === pass) {
        req.session.user = user
        return res.redirect("/home");
    }

    res.render("admin/pages/login", {
        error
    });
}
module.exports.logout = function (req, res) {
    req.session.destroy();
    res.redirect("/login");
};

module.exports.home = async function (req, res) {
    const PostFind = await Product.find().populate("user_id").populate("cate_id")
        .populate("user_fullName").populate("cate_name").populate("user_img")
    const CateFind = await Category.find()
    const UserFind = await User.find()
    res.render("admin/pages/home", { PostFind, CateFind, UserFind })
}
module.exports.signup = function (req, res) {

    res.render("admin/pages/signup", { error: "" })
}
module.exports.saveuser = async function (req, res) {
    const email = req.body.user_mail
    const file = req.file

    if (file) {
        const pathUpload = path.resolve("src", "public", "images", "users")
        const contentFile = fs.readFileSync(file.path)
        fs.unlinkSync(file.path)
        // console.log(file)
        // console.log(path.join(pathUpload, file.originalname))
        fs.writeFileSync(path.join(pathUpload, file.originalname), contentFile)
    }
    //validate
    const bodySchema = joi.object({
        user_mail: joi.string().required(),
        password: joi.string().required(),
    }).unknown()

    const value = await bodySchema.validateAsync(req.body).catch(err => err)
    console.log(value)
    if (value instanceof Error) {
        return res.redirect("/signup")
    }
    let error
    const user = await User.findOne({ user_mail: email })
    if (user) {
        error = "Email has already"
    }

    if (!user) {
        const user = new User({
            user_mail: value.user_mail,
            user_pass: value.password,
            user_fullName: value.full_name,
            user_address: value.address,
            user_phone: value.phone,
            user_level: value.user_level,
            user_img: file.originalname,
            user_gender: value.gender,
            user_dob: value.birthday,
        })
        console.log("user", user)
        await user.save()

        sendMailforSignup(value.user_mail)

        return res.redirect("/login")
    }
    req.flash("error", "Email has already")
    res.redirect("/login")
}
module.exports.showDetail = async function (req, res) {

    const { id } = req.params

    if (!mongoose.Types.ObjectId.isValid(id)) {
        throw new Error("Id not found")
    }

    const product = await Product.findById(id).populate("user_id").populate("cate_id")

    if (!product) throw new Error("Product not found")
    console.log(product)

    res.render("admin/pages/showdetails", { product })
}

module.exports.addPost = async function (req, res) {
    const categories = await Category.find()
    res.render("admin/pages/addpost", { categories, err: "" })
}

module.exports.savePost = async function (req, res) {
    const file = req.file
    const user = req.session.user
    const pathUpload = path.resolve("src", "public", "images", "products")

    const contentFile = fs.readFileSync(file.path)
    fs.unlinkSync(file.path)
    console.log(file)
    // console.log(path.join(pathUpload, file.originalname))
    fs.writeFileSync(path.join(pathUpload, file.originalname), contentFile)


    const bodySchema = joi.object({
        prd_detail: joi.required(),
        prd_title: joi.required(),
        prd_price: joi.required(),

    }).unknown()

    const value = await bodySchema.validateAsync(req.body).catch(err => err)
    console.log("value", value)

    if (value instanceof Error) {
        return res.redirect("/addpost")
    }

    const product = new Product({
        cate_id: value.cate_id,
        user_id: user._id,
        prd_title: value.prd_title,
        prd_detail: value.prd_detail,
        prd_price: value.prd_price,
        prd_image: file.originalname,
    })

    await product.save()

    return res.redirect("/home")
}
module.exports.profile = async function (req, res) {

    const { id } = req.params

    const user = await User.findById(id)
    console.log(user)
    const findpostbyID = await Product.find({ user_id: id }).populate("user_id").populate("cate_id")
    // console.log("🚀 ~ file: index.js ~ line 159 ~ findpostbyID", findpostbyID)

    res.render("admin/pages/profile", { user, findpostbyID })
}
module.exports.category = async function (req, res) {
    const { id } = req.params
    if (!mongoose.Types.ObjectId.isValid(id)) {
        throw new Error("Id khong dung dinh dang")
    }

    const category = await Category.findById(id)

    const products = await Product.find({ cate_id: id }).populate("user_id").populate("cate_id")

    res.render("admin/pages/category", { products, category })
}
module.exports.edituser = async function (req, res) {
    const users = await User.find()
    return res.render("admin/pages/edituser", { users })
}

module.exports.updateuser = async function (req, res) {
    const { id } = req.params
    const file = req.file
    if (file) {
        const pathUpload = path.resolve("src", "public", "images", "users")
        const contentFile = fs.readFileSync(file.path)
        fs.unlinkSync(file.path)
        fs.writeFileSync(path.join(pathUpload, file.originalname), contentFile)
    }

    const bodySchema = joi.object({
        user_fullName: joi.string().required(),
    }).unknown()

    const value = await bodySchema.validateAsync(req.body).catch(err => err)
    if (value instanceof Error) {
        return res.redirect(`//editprofile-${id}`)
    }

    const userUpdate = {
        user_pass: value.user_pass,
        user_fullName: value.user_fullName,
        user_gender: value.user_gender,
        user_dob: value.user_dob,
        user_level: 0,
        user_phone: value.user_phone,
        user_address: value.user_address
    }
    if (file) {
        userUpdate[`user_img`] = file.originalname
    }
    await User.updateOne({ _id: id }, { $set: userUpdate })
    return res.redirect(`profile-${id}`)
}
module.exports.deletepostbyuser = async function (req, res) {
    const { id } = req.params
    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.redirect("/profile")
    }
    await Product.findByIdAndDelete(id)
    return res.redirect("/home")
}
module.exports.editpost = async function (req, res) {
    const { id } = req.params
    const categories = await Category.find()
    const product = await Product.findById(id).populate("cate_id")
    res.render("admin/pages/editpost", { categories, product })
}
module.exports.updatepost = async function (req, res) {
    const { id } = req.params
    const user = req.session.user
    const file = req.file
    if (file) {
        const pathUpload = path.resolve("src", "public", "images", "products")
        const contentFile = fs.readFileSync(file.path)
        fs.unlinkSync(file.path)
        fs.writeFileSync(path.join(pathUpload, file.originalname), contentFile)
    }

    const bodySchema = joi.object({
        prd_detail: joi.string().required(),
    }).unknown()

    const value = await bodySchema.validateAsync(req.body).catch(err => err)
    if (value instanceof Error) {
        return res.redirect(`//editpost-${id}`)
    }

    const postUpdate = {
        cate_id: value.cate_id,
        user_id: user._id,
        prd_detail: value.prd_detail,
        prd_title: value.prd_title,
        prd_price: value.prd_price,
    }
    if (file) {
        postUpdate[`prd_image`] = file.originalname
    }
    await Product.updateOne({ _id: id }, { $set: postUpdate })
    return res.redirect("/home")
}
exports.search = async function (req, res, next) {
    try {
        const { s = "" } = req.query;
        const products = await Product.find({
            $text: {
                $search: s,
            },
        });
        return res.render("admin/pages/search", { s, products })
    } catch (error) {
        next(error)
    }
}
