import { body } from "express-validator";

export default [
  body("resetToken")
    .isString()
    .withMessage("resetToken must be a string")
    .trim()
    .not()
    .isEmpty()
    .withMessage("resetToken is required"),
  body("newPassword")
    .isString()
    .withMessage("newPassword must be a string")
    .trim()
    .not()
    .isEmpty()
    .withMessage("newPassword is required"),
];
