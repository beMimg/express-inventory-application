const mongoose = require("mongoose");
const Brand = require("../models/brand");
const Car = require("../models/car");
const Category = require("../models/category");
const { body, validationResult } = require("express-validator");
require("dotenv").config();

exports.countAllDocuments = async (req, res, next) => {
  try {
    const [allBrands, allCars, allCategories] = await Promise.all([
      Brand.countDocuments().exec(),
      Car.countDocuments().exec(),
      Category.countDocuments().exec(),
    ]);

    res.render("catalog-homepage", {
      title: "Welcome to the cars catalog page",
      all_brands: allBrands,
      all_cars: allCars,
      all_categories: allCategories,
    });
  } catch (err) {
    return next(err);
  }
};

exports.car_list = async (req, res, next) => {
  try {
    const allCars = await Car.find({}, "name brand")
      .populate("brand")
      .sort({ "brand.name": 1 })
      .exec();

    res.render("car-list", {
      title: "Cars list",
      all_cars: allCars,
    });
  } catch (err) {
    console.log(err);
  }
};

exports.car_detail = async (req, res, next) => {
  try {
    const car = await Car.findById(req.params.id)
      .populate("category")
      .populate("brand")
      .exec();

    res.render("car-detail", {
      title: "Car detail",
      car: car,
    });
  } catch (err) {
    const error = new Error("Couldn't find this car");
    error.status = 404;
    return next(error);
  }
};

exports.car_create_get = async (req, res, next) => {
  try {
    const [allCategories, allBrands] = await Promise.all([
      Category.find().sort({ name: 1 }).exec(),
      Brand.find().sort({ name: 1 }).exec(),
    ]);

    if (allCategories.length === 0 || allBrands.length === 0) {
      res.render("error", {
        message: "You need at least one category and one brand to create a car",
        status: 500,
      });
      return;
    } else {
      res.render("car-form", {
        title: "Create a car",
        all_categories: allCategories,
        all_brands: allBrands,
      });
    }
  } catch (err) {
    const error = new Error("Coudn't get categories or brands");
    error.status = 404;
    return next(error);
  }
};

exports.car_create_post = [
  body("car_name").trim().isLength({ min: 1 }).escape(),
  body("car_description").trim().isLength({ min: 1 }).escape(),
  body("car_price").trim().isNumeric().isLength({ min: 1 }).escape(),
  body("car_number_in_stock").trim().isNumeric().isLength({ min: 1 }).escape(),
  body("car_category").trim().isLength({ min: 1 }).escape(),
  body("car_brand").trim().isLength({ min: 1 }).escape(),

  async (req, res, next) => {
    try {
      const errors = validationResult(req);

      const car = new Car({
        name: req.body.car_name,
        description: req.body.car_description,
        price: req.body.car_price,
        number_in_stock: req.body.car_number_in_stock,
        category: req.body.car_category,
        brand: req.body.car_brand,
      });

      if (!errors.isEmpty()) {
        res.render("car-form", {
          title: "Create a car",
          car: car,
        });
        return;
      }

      const existsCar = await Car.findOne({
        name: req.body.car_name,
        category: req.body.car_category,
        brand: req.body.car_brand,
      }).exec();

      if (existsCar) {
        res.redirect(existsCar.url);
        return;
      } else {
        await car.save();
        res.redirect(car.url);
      }
    } catch (err) {
      const error = new Error("Coudn't create this car.");
      error.status(500);
      return next(error);
    }
  },
];

exports.car_delete_get = async (req, res, next) => {
  try {
    const car = await Car.findById(req.params.id);

    res.render("car-delete", {
      title: "Delete car",
      car: car,
    });
  } catch (err) {
    return next(err);
  }
};

exports.car_delete_post = async (req, res, next) => {
  try {
    if (req.body.admin_password === process.env.ADMIN_PW) {
      await Car.findByIdAndDelete(req.body.car_id);
      res.redirect("/catalog/cars");
      return;
    } else {
      res.send("Admin password failed.");
    }
  } catch (err) {
    const error = new Error("Could not delete this car");
    error.status(500);
    return next(error);
  }
};

exports.car_update_get = async (req, res, next) => {
  try {
    const [car, allCategories, allBrands] = await Promise.all([
      await Car.findById(req.params.id).exec(),
      await Category.find({}, "name").sort({ name: 1 }).exec(),
      await Brand.find({}, "name").sort({ name: 1 }).exec(),
    ]);

    res.render("car-form", {
      title: "Update Car",
      car: car,
      all_categories: allCategories,
      all_brands: allBrands,
    });
  } catch (err) {
    return next(err);
  }
};

exports.car_update_post = [
  body("car_name").trim().isLength({ min: 1 }).escape(),
  body("car_description").trim().isLength({ min: 1 }).escape(),
  body("car_price").trim().isNumeric().isLength({ min: 1 }).escape(),
  body("car_number_in_stock").trim().isNumeric().isLength({ min: 1 }).escape(),
  body("car_category").trim().isLength({ min: 1 }).escape(),
  body("car_brand").trim().isLength({ min: 1 }).escape(),

  async (req, res, next) => {
    try {
      const errors = validationResult(req);

      const car = new Car({
        name: req.body.car_name,
        description: req.body.car_description,
        price: req.body.car_price,
        number_in_stock: req.body.car_number_in_stock,
        category: req.body.car_category,
        brand: req.body.car_brand,
        _id: req.params.id,
      });

      const [allCategories, allBrands] = await Promise.all([
        await Category.find({}, "name").sort({ name: 1 }).exec(),
        await Brand.find({}, "name").sort({ name: 1 }).exec(),
      ]);

      if (!errors.isEmpty()) {
        res.render("car-form", {
          title: "Create a car",
          car: car,
          all_categories: allCategories,
          all_brands: allBrands,
        });
        return;
      }

      const existsCar = await Car.findOne({
        name: req.body.car_name,
        category: req.body.car_category,
        brand: req.body.car_brand,
      }).exec();

      if (existsCar) {
        res.redirect(existsCar.url);
        return;
      } else {
        await Car.findByIdAndUpdate(req.params.id, car, {});
        res.redirect(car.url);
      }
    } catch (err) {
      return next(err);
    }
  },
];
