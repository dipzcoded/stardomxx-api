import { body } from "express-validator";

export default [
  body("firstName")
    .isString()
    .withMessage("firstName must be a string")
    .trim()
    .not()
    .isEmpty()
    .withMessage("firstName is required"),

  body("lastName")
    .isString()
    .withMessage("lastName must be a string")
    .trim()
    .not()
    .isEmpty()
    .withMessage("lastName is required"),
  body("country")
    .isString()
    .withMessage("country must be a string")
    .trim()
    .not()
    .isEmpty()
    .withMessage("country is required"),

  body("email")
    .isString()
    .withMessage("email must be a string")
    .trim()
    .not()
    .isEmpty()
    .withMessage("email is required")
    .isEmail()
    .withMessage("must be a valid email address format"),

  body("password")
    .isString()
    .withMessage("password must be a string")
    .trim()
    .not()
    .isEmpty()
    .withMessage("password is required"),

  body("phoneNumber")
    .isString()
    .withMessage("phoneNumber must be a string")
    .trim()
    .not()
    .isEmpty()
    .withMessage("phoneNumber is required"),
];
