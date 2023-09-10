import { param } from "express-validator";

export default [
  param("postId")
    .isInt({
      min: 1,
    })
    .withMessage("postId must be a integer type with a minimum value of 1")
    .not()
    .isEmpty()
    .withMessage("postId is required"),
  param("contestId")
    .isInt({
      min: 1,
    })
    .withMessage("contestId must be a integer type with a minimum value of 1")
    .not()
    .isEmpty()
    .withMessage("contestId is required"),
];
