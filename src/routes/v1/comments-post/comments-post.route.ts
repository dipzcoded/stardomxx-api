import express, { Router } from "express";
import {
  requiresAuthMiddleware,
  //   restrictUsersFromResourceMiddleware,
} from "../../../middlewares/v1/auth";
import { requestValidationMiddleware } from "../../../middlewares/v1/validator";
import { CommentsPostController } from "../../../controllers/v1";
import {
  commentBodyValidator,
  commentIdParamValidator,
  commentPostIdParamValidator,
  deleteCommentReplyParamValidator,
} from "../../../middlewares/v1/validator/comments-post";
import { postidParamValidator } from "../../../middlewares/v1/validator/param";
import { paginationSearchQueryValidator } from "../../../middlewares/v1/validator/query";

const router: Router = express.Router();

const comment = new CommentsPostController();

router
  .route("/me2")
  .get(
    requiresAuthMiddleware,
    paginationSearchQueryValidator,
    requestValidationMiddleware,
    comment.getYourAllCommentsOnPosts
  );

router
  .route("/post/:postId")
  .get(
    requiresAuthMiddleware,
    postidParamValidator,
    paginationSearchQueryValidator,
    requestValidationMiddleware,
    comment.getCommentsByPostId
  );

router
  .route("/comment/:commentId/replies")
  .get(
    requiresAuthMiddleware,
    commentIdParamValidator,
    paginationSearchQueryValidator,
    requestValidationMiddleware,
    comment.getRepliesOnCommentId
  );

router
  .route("/post/:postId")
  .post(
    requiresAuthMiddleware,
    postidParamValidator,
    commentBodyValidator,
    requestValidationMiddleware,
    comment.createCommentOnPost
  );

router
  .route("/post/:postId/comment/:commentId/reply")
  .post(
    requiresAuthMiddleware,
    commentPostIdParamValidator,
    commentBodyValidator,
    requestValidationMiddleware,
    comment.createCommentOnAComment
  );

router
  .route("/post/:postId/comment/:commentId")
  .delete(
    requiresAuthMiddleware,
    commentPostIdParamValidator,
    requestValidationMiddleware,
    comment.deleteCommentOnPost
  );

router
  .route("/comment/:commentId/replies/:commentReplyId")
  .delete(
    requiresAuthMiddleware,
    deleteCommentReplyParamValidator,
    requestValidationMiddleware,
    comment.deleteReplyOnComment
  );

export default router;
