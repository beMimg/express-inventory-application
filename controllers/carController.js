const mongoose = require("mongoose");
const Brand = require("../models/brand");
const Car = require("../models/car");
const Category = require("../models/category");

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
    console.log(err);
  }
};

exports.car_list = async (req, res, next) => {
  try {
    const allCars = await Car.find({}, "name brand")
      .populate("brand")
      .sort({ "brand.name": 1 })
      .exec();

    console.log(allCars);
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

    console.log(car);
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
