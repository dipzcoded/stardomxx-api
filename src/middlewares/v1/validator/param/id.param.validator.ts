import { param } from "express-validator";

export default [
  param("id")
    .isInt({
      min: 1,
    })
    .withMessage("id must be an integer type with a minimum value of 1")
    .not()
    .isEmpty()
    .withMessage("id is required"),
];
