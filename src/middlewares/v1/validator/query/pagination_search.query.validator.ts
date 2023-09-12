import { query } from "express-validator";

export default [
  query("page")
    .isInt({
      min: 1,
      max: 100,
    })
    .withMessage(
      "page must be an integer with a minimum value of 1 and maximum of 100"
    )
    .not()
    .isEmpty()
    .withMessage("page is required"),
  query("perPage")
    .isInt({
      min: 1,
      max: 100,
    })
    .withMessage(
      "perPage musy be an integer with a minimum value of 1 and maximum of 100"
    )
    .not()
    .isEmpty()
    .withMessage("perPage is required"),
  query("search")
    .optional({ values: "null" })
    .isString()
    .withMessage("search must be string type")
    .trim(),
];
