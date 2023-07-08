import { body } from "express-validator";

export default [
  body("email")
    .isString()
    .withMessage("email must be a string")
    .trim()
    .not()
    .isEmpty()
    .withMessage("email is required")
    .isEmail()
    .withMessage("must be a valid email address format"),
];
