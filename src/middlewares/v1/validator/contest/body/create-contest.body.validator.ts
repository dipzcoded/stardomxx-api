import { body } from "express-validator";
export default [
  body("name")
    .isString()
    .withMessage("name must be a string type")
    .trim()
    .not()
    .isEmpty()
    .withMessage("name is required"),
  body("category")
    .isString()
    .withMessage("category must be a string type")
    .trim()
    .not()
    .isEmpty()
    .withMessage("category is required"),
  body("prize")
    .isFloat({
      min: 1,
    })
    .withMessage("prize must be an integer type with a mimimum value of 1")
    .not()
    .isEmpty()
    .withMessage("prize is required"),
  body("maxContestant")
    .isInt({
      min: 1,
    })
    .withMessage(
      "maxContestant must be an integer type with minimum value of 1"
    )
    .not()
    .isEmpty()
    .withMessage("maxContestant is required"),
  body("noFreeWildCards")
    .isInt({
      min: 1,
    })
    .withMessage(
      "noFreeWildCards must be an integer type with minimum value of 1"
    )
    .not()
    .isEmpty()
    .withMessage("noFreeWildCards is required"),
  body("startDate")
    .isDate()
    .withMessage("startDate must be date format")
    .not()
    .isEmpty()
    .withMessage("startDate is required"),
  body("endDate")
    .isDate()
    .withMessage("endDate must be date format")
    .not()
    .isEmpty()
    .withMessage("endDate is required"),
];
