import { body } from "express-validator";

export default [
  body("comment")
    .trim()
    .isString()
    .withMessage("comment must be a string type")
    .not()
    .isEmpty()
    .withMessage("comment is required"),
];
