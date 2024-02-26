const mongoose = require("mongoose");
const Category = require("../models/category");
const Car = require("../models/car");
const { body, validationResult } = require("express-validator");
require("dotenv").config();

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

    res.render("category-detail", {
      title: "Category Detail",
      category_detail: categoryDetail,
      cars_in_category: carsInCategory,
    });
  } catch (err) {
    const error = new Error("Could find this category");
    error.status = 404;
    return next(error);
  }
};

exports.category_create_get = (req, res, next) => {
  res.render("category-form", {
    title: "Create a category",
  });
};

exports.category_create_post = [
  body("category_name").trim().isLength({ min: 1 }).escape(),
  body("category_description").trim().isLength({ max: 80 }).escape(),

  async (req, res, next) => {
    try {
      const errors = validationResult(req);

      const category = new Category({
        name: req.body.category_name,
        description: req.body.category_description,
      });

      if (!errors.isEmpty()) {
        res.render("category-form", {
          title: "Create a category",
          category: category,
          errors: errors.array(),
        });
        return;
      }
      const existsCategory = await Category.findOne({
        name: req.body.category_name,
      });

      if (existsCategory) {
        res.redirect(existsCategory.url);
        return;
      } else {
        await category.save();
        res.redirect(category.url);
      }
    } catch (err) {
      const error = new Error("Coudn't create this category.");
      err.status(500);
      return next(error);
    }
  },
];

exports.category_delete_get = async (req, res, next) => {
  try {
    const [category, carsInCategory] = await Promise.all([
      await Category.findById(req.params.id).exec(),
      await Car.find({ category: req.params.id }, "name").exec(),
    ]);

    res.render("category-delete", {
      title: "Delete category",
      category: category,
      cars_in_category: carsInCategory,
    });
  } catch (err) {
    return next(err);
  }
};

exports.category_delete_post = async (req, res, next) => {
  try {
    if (req.body.admin_password === process.env.ADMIN_PW) {
      await Category.findByIdAndDelete(req.body.category_id);
      res.redirect("/catalog/categories");
      return;
    } else {
      res.send("Admin paswword incorrect");
    }
  } catch (err) {
    return next(err);
  }
};

exports.category_update_get = async (req, res, next) => {
  try {
    const category = await Category.findById(req.params.id).exec();

    res.render("category-form", {
      title: "Update category",
      category: category,
    });
  } catch (err) {
    return next(err);
  }
};

exports.category_update_post = [
  body("category_name").trim().isLength({ min: 1 }).escape(),
  body("category_description").trim().isLength({ max: 80 }).escape(),

  async (req, res, next) => {
    try {
      const errors = validationResult(req);

      const category = new Category({
        name: req.body.category_name,
        description: req.body.category_description,
        _id: req.params.id,
      });

      if (!errors.isEmpty()) {
        res.render("category-form", {
          title: "Update Category",
          category: category,
          errors: errors.array(),
        });
        return;
      }

      const existsCategory = await Category.findOne({
        name: req.body.category_name,
      }).exec();

      if (existsCategory) {
        res.redirect(existsCategory.url);
        return;
      } else {
        await Category.findByIdAndUpdate(req.params.id, category, {});
        res.redirect(category.url);
      }
    } catch (err) {
      return next(err);
    }
  },
];
