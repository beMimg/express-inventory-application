const mongoose = require("mongoose");
const Brand = require("../models/brand");
const Car = require("../models/car");

exports.brand_list = async (req, res, next) => {
  try {
    const brand_list = await Brand.find().sort({ name: 1 }).exec();

    res.render("brand-list", {
      title: "Brand List",
      brand_list: brand_list,
    });
  } catch (err) {
    console.log(err);
  }
};

exports.brand_detail = async (req, res, next) => {
  try {
    const [brandDetail, carsInBrand] = await Promise.all([
      await Brand.findById(req.params.id).exec(),
      await Car.find({ brand: req.params.id }, "name").exec(),
    ]);

    res.render("brand-detail", {
      title: "Brand Detail",
      brand_detail: brandDetail,
      cars_in_brand: carsInBrand,
    });
  } catch (err) {
    const error = new Error("Couldn't find this brand");
    error.status = 404;
    return next(error);
  }
};
