import { body } from "express-validator";

export default [
  body("content")
    .optional({
      values: "null",
    })
    .isString()
    .withMessage("content must be a string type")
    .trim()
    .not()
    .isEmpty()
    .withMessage("content is required"),
  body("mediaContent")
    .isURL({
      protocols: ["https"],
    })
    .withMessage("mediaContent must be a valid url")
    .trim()
    .not()
    .isEmpty()
    .withMessage("mediaContent is required"),
];
