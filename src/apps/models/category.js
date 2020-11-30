const mongoose = require("mongoose");

const CategoryModel = new mongoose.Schema({
  cate_name: {
    type: String,
    unique: true
  },
});

mongoose.model("Category", CategoryModel, "category");
