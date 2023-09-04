import { param } from "express-validator";

export default [
  param("userId")
    .isInt({
      min: 1,
    })
    .withMessage("userId must be an integer")
    .not()
    .isEmpty()
    .withMessage("userId is required"),
];
