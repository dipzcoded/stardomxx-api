import { query } from "express-validator";

export default [
  query("token")
    .isString()
    .withMessage("token must be a string")
    .trim()
    .not()
    .isEmpty()
    .withMessage("token is required"),
];
