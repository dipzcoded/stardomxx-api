import { body } from "express-validator";

export default [
  body("address")
    .isString()
    .withMessage("address must be a string ")
    .trim()
    .not()
    .isEmpty()
    .withMessage("address is required"),
  body("state")
    .isString()
    .withMessage("state must be a string ")
    .trim()
    .not()
    .isEmpty()
    .withMessage("state is required"),
  body("town")
    .isString()
    .withMessage("town must be a string ")
    .trim()
    .not()
    .isEmpty()
    .withMessage("town is required"),
  body("address2")
    .optional({ values: "null" })
    .isString()
    .withMessage("address2 must be a string ")
    .trim()
    .not()
    .isEmpty()
    .withMessage("address2 is required"),
];
