import { param } from "express-validator";

export default [
  param("commentId")
    .isInt({
      min: 1,
    })
    .withMessage("commentId must be a integer type with a minimum value of 1")
    .not()
    .isEmpty()
    .withMessage("commentId is required"),
];
