import { body } from "express-validator";

export default [
  body("comment")
    .isString()
    .withMessage("comment must be a string type")
    .trim()
    .not()
    .isEmpty()
    .withMessage("comment is required"),
];
