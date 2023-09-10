import { param } from "express-validator";

export default [
  param("postId")
    .isInt({
      min: 1,
    })
    .withMessage("postId must be an integer type with a minimum value of 1")
    .not()
    .isEmpty()
    .withMessage("postId is required"),
];
