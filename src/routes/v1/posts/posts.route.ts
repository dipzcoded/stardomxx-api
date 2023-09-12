import express, { Router } from "express";
import { PostsController } from "../../../controllers/v1";
import {
  getOwnpostQueryValidator,
  postContentBodyValidator,
  postContentWithMediaBodyValidator,
} from "../../../middlewares/v1/validator/posts";
import { postidParamValidator } from "../../../middlewares/v1/validator/param";
import { paginationSearchQueryValidator } from "../../../middlewares/v1/validator/query";
import { requiresAuthMiddleware } from "../../../middlewares/v1/auth";
import { requestValidationMiddleware } from "../../../middlewares/v1/validator";
const router: Router = express.Router();
const post = new PostsController();

router
  .route("/me")
  .get(
    requiresAuthMiddleware,
    getOwnpostQueryValidator,
    requestValidationMiddleware,
    post.getYourPostContents
  );

router
  .route("/on-going/contests")
  .get(
    requiresAuthMiddleware,
    paginationSearchQueryValidator,
    requestValidationMiddleware,
    post.getOnGoingContestPost
  );

router
  .route("/me/following")
  .get(
    requiresAuthMiddleware,
    paginationSearchQueryValidator,
    requestValidationMiddleware,
    post.getFollowingContents
  );

router
  .route("/create-image/content")
  .post(
    requiresAuthMiddleware,
    postContentWithMediaBodyValidator,
    requestValidationMiddleware,
    post.postImageContent
  );

router
  .route("/create-video/content")
  .post(
    requiresAuthMiddleware,
    postContentWithMediaBodyValidator,
    requestValidationMiddleware,
    post.postVideoContent
  );

router
  .route("/create-text/content")
  .post(
    requiresAuthMiddleware,
    postContentBodyValidator,
    requestValidationMiddleware,
    post.postTextContent
  );

router
  .route("/create-video/content/:id/contest-ongoing")
  .post(
    requiresAuthMiddleware,
    postContentWithMediaBodyValidator,
    requestValidationMiddleware,
    post.postVideoForCompetitionContest
  );

router
  .route("/create-video/content/:id/contest-onentry")
  .post(
    requiresAuthMiddleware,
    postContentWithMediaBodyValidator,
    requestValidationMiddleware,
    post.postVideoForContestEntry
  );

router
  .route("/:postId")
  .delete(
    requiresAuthMiddleware,
    postidParamValidator,
    requestValidationMiddleware,
    post.deleteYourPostContent
  );

export default router;
