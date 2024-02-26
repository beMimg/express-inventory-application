const mongoose = require("mongoose");
const Brand = require("../models/brand");

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
