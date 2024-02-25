const express = require("express");
const router = express.Router();

router.get("/", (req, res, next) => {
  try {
    res.send("Hello from catalog");
  } catch (err) {
    console.log(err);
  }
});

module.exports = router;
