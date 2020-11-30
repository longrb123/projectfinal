const mongoose = require("mongoose");

const ProductSchema = new mongoose.Schema(
  {
    cate_id: {
      type: mongoose.Schema.ObjectId,
      ref: "Category"
    },
    user_id: {
      type: mongoose.Schema.ObjectId,
      ref: "User"
    },
    prd_title: {
      type: String,
      text: true,
    },
    prd_detail: String,
    prd_image: String,
    prd_price: String,
  },
  {
    timestamps: true,
  }
);

mongoose.model("Product", ProductSchema, "products");