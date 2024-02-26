const mongoose = require("mongoose");
const Category = require("../models/category");
const Car = require("../models/car");

exports.category_list = async (req, res, next) => {
  try {
    const category_list = await Category.find().sort({ name: 1 }).exec();

    res.render("category-list", {
      title: "Category List",
      category_list: category_list,
    });
  } catch (err) {
    console.log(err);
  }
};

exports.category_detail = async (req, res, next) => {
  try {
    const [categoryDetail, carsInCategory] = await Promise.all([
      await Category.findById(req.params.id).exec(),
      await Car.find({ category: req.params.id }, "name brand")
        .populate("brand")
        .exec(),
    ]);

    console.log(carsInCategory);
    res.render("category-detail", {
      title: "Category Detail",
      category_detail: categoryDetail,
      cars_in_category: carsInCategory,
    });
  } catch (err) {
    console.log(err);
  }
};
