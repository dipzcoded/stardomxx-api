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
  param("postId")
    .isInt({
      min: 1,
    })
    .withMessage("postId must be a integer type with a minimum value of 1")
    .not()
    .isEmpty()
    .withMessage("postId is required"),
  param("commentReplyId")
    .isInt({
      min: 1,
    })
    .withMessage(
      "commentReplyId must be a integer type with a minimum value of 1"
    )
    .not()
    .isEmpty()
    .withMessage("commentReplyId is required"),
];
