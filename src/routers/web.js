const { Router } = require("express");

const multer = require("multer")
const Joi = require("@hapi/joi")
const path = require("path")

const { AdminController, CategoryController, UserController, ClientController, ChatController, ProductController } = require("../apps/controllers");

const router = Router();
const checkLogin = require("../apps/middlewares/login")
const checkLogout = require("../apps/middlewares/logout")
const checkLevel = require("../apps/middlewares/check-level");


const upload = multer({
  storage: multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, path.resolve("src", "storage"))
    },
    filename: function (req, file, cb) {
      cb(null, file.fieldname + "-" + Date.now())
    }
  })
})


router.route("/login").get(checkLogin, AdminController.login).post(checkLogin, AdminController.postLogin);
router.get("/", ClientController.home)
router.route("/signup").get(ClientController.signup).post(upload.single("user_img"), ClientController.saveuser)
router.use("/admin", checkLogout, checkLevel)
router.get("/logout", AdminController.logout);

router.get("/admin/dashboard", AdminController.dashboard);
router.get("/admin/category", CategoryController.managercategory)
router.get("/admin/post", ProductController.managepost)
router.route("/admin/addcategory").get(CategoryController.addcategory).post(CategoryController.save)
router.get("/admin/deletecategory/:id", CategoryController.delete)
router.route("/admin/editcategory/:id").get(CategoryController.editcategory).post(CategoryController.updatecategory)
router.get("/admin/user", UserController.manageruser)
router.get("/admin/deleteuser/:id", UserController.deleteuser)
router.get("/admin/deletepost/:id", ProductController.deletepost)

//Client

router.get("/home", ClientController.home)
router.get("/logout", ClientController.logout)
router.get("/category-:id", ClientController.category);
router.get("/postdetails-:id", ClientController.showDetail)
router.get("/chat", ChatController.chat)
router.route("/addpost").all(checkLogout).get(ClientController.addPost).post(upload.single("prd_image"), ClientController.savePost)
router.get("/deletepostbyuser/:id", ClientController.deletepostbyuser)
router.route("/editpost-:id").get(ClientController.editpost).post(upload.single("prd_image"), ClientController.updatepost)
router.get("/profile-:id", ClientController.profile)
router.route("/editprofile-:id").get(ClientController.edituser).post(upload.single("user_img"), ClientController.updateuser)
router.get("/search", ClientController.search)
module.exports = router;
