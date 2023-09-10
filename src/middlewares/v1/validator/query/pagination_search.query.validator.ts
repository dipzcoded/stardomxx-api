import { query } from "express-validator";

export default [
  query("page")
    .isInt({
      min: 1,
    })
    .withMessage("page must be an integer with a minimum value of 1")
    .not()
    .isEmpty()
    .withMessage("page is required"),
  query("perPage")
    .isInt({
      min: 1,
    })
    .withMessage("perPage musy be an integer with a minimum value of 1")
    .not()
    .isEmpty()
    .withMessage("perPage is required"),
  query("search")
    .optional({ values: "null" })
    .trim()
    .isString()
    .withMessage("search must be string type"),
];
