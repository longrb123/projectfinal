const AdminController = require("./admin");
const ProductController = require("./admin/ManageProduct");
const CategoryController = require("./admin/ManageCategory")
const UserController = require("./admin/ManageUser")
const ClientController = require("./client/index")
const ChatController = require("./chat/index")
// const ProductController = require("./admin/product");
//
module.exports = {
  AdminController,
  ProductController,
  CategoryController,
  UserController,
  ClientController,
  ChatController
};
