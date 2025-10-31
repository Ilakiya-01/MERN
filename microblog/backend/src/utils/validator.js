const { body } = require("express-validator");

exports.registerValidator = [
  body("username").notEmpty().withMessage("Username required"),
  body("email").isEmail().withMessage("Valid email required"),
  body("password")
    .isLength({ min: 6 })
    .withMessage("Password 6+ chars required"),
];

exports.loginValidator = [
  body("email").isEmail().withMessage("Valid email required"),
  body("password").notEmpty().withMessage("Password required"),
];

exports.postValidator = [
  body("content")
    .notEmpty()
    .withMessage("Content required")
    .isLength({ max: 280 })
    .withMessage("Max 280 chars allowed"),
];
