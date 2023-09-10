import { param } from "express-validator";

export default [
  param("userId")
    .isInt({
      min: 1,
    })
    .withMessage("userId must be a integer type with a minimum value of 1")
    .not()
    .isEmpty()
    .withMessage("userId is required"),
  param("contestId")
    .isInt({
      min: 1,
    })
    .withMessage("contestId must be a integer type with a minimum value of 1")
    .not()
    .isEmpty()
    .withMessage("contestId is required"),
];
