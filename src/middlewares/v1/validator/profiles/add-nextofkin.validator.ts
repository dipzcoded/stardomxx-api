import { body } from "express-validator";

export default [
  body("address")
    .isString()
    .withMessage("address must be a string ")
    .trim()
    .not()
    .isEmpty()
    .withMessage("address is required"),
  body("name")
    .isString()
    .withMessage("name must be a string ")
    .trim()
    .not()
    .isEmpty()
    .withMessage("name is required"),
  body("phoneNumber")
    .isString()
    .withMessage("phoneNumber must be a string ")
    .trim()
    .not()
    .isEmpty()
    .withMessage("phoneNumber is required"),
  body("relationshipType")
    .isString()
    .withMessage("relationshipType must be a string ")
    .trim()
    .not()
    .isEmpty()
    .withMessage("relationshipType is required"),
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
