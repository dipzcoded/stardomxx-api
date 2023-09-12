import express, { Router } from "express";
import { FollowingController } from "../../../controllers/v1";
import { requiresAuthMiddleware } from "../../../middlewares/v1/auth";
import { userIdParamValidator } from "../../../middlewares/v1/validator/following";
import { requestValidationMiddleware } from "../../../middlewares/v1/validator";
const router: Router = express.Router();

const followingController = new FollowingController();

router
  .route("/user-follow/:userId")
  .patch(
    requiresAuthMiddleware,
    userIdParamValidator,
    requestValidationMiddleware,
    followingController.followUser
  );

router
  .route("/unfollow-follower/:userId")
  .patch(
    requiresAuthMiddleware,
    userIdParamValidator,
    requestValidationMiddleware,
    followingController.unfollowFollower
  );

router
  .route("/unfollow-following/:userId")
  .patch(
    requiresAuthMiddleware,
    userIdParamValidator,
    requestValidationMiddleware,
    followingController.unFollowFollowing
  );

export default router;
