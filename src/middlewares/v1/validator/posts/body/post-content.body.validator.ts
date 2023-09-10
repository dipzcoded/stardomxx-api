import { body } from "express-validator";

export default [
  body("content")
    .trim()
    .isString()
    .withMessage("content must be a string type")
    .not()
    .isEmpty()
    .withMessage("content is required"),
];
