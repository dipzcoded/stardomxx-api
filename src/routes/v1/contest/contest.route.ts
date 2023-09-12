import express, { Router } from "express";
import { ContestController } from "../../../controllers/v1";
import {
  requiresAuthMiddleware,
  //   restrictUsersFromResourceMiddleware,
} from "../../../middlewares/v1/auth";
import { requestValidationMiddleware } from "../../../middlewares/v1/validator";
import {
  createContestBodyValidator,
  getContestsQueryValidator,
  userContestIdParamValidator,
} from "../../../middlewares/v1/validator/contest";
import { paginationSearchQueryValidator } from "../../../middlewares/v1/validator/query";
import { idParamValidator } from "../../../middlewares/v1/validator/param";

const router: Router = express.Router();

const contest = new ContestController();

router
  .route("/")
  .get(
    requiresAuthMiddleware,
    getContestsQueryValidator,
    requestValidationMiddleware,
    contest.getAllContests
  );

router
  .route("/user/joined")
  .get(
    requiresAuthMiddleware,
    paginationSearchQueryValidator,
    requestValidationMiddleware,
    contest.userGettingAllJoinedContest
  );
// ADMIN ROUTES
router
  .route("/new")
  .post(
    requiresAuthMiddleware,
    createContestBodyValidator,
    requestValidationMiddleware,
    contest.adminCreateAContest
  );
router
  .route("/:id")
  .put(
    requiresAuthMiddleware,
    idParamValidator,
    createContestBodyValidator,
    requestValidationMiddleware,
    contest.adminUpdateContest
  );

router
  .route("/:id")
  .delete(
    requiresAuthMiddleware,
    idParamValidator,
    requestValidationMiddleware,
    contest.adminDeleteContest
  );

router
  .route("/:id/user/join")
  .patch(
    requiresAuthMiddleware,
    idParamValidator,
    requestValidationMiddleware,
    contest.userJoiningAContest
  );

router
  .route("/:contestId/remove/user/:userId")
  .patch(
    requiresAuthMiddleware,
    userContestIdParamValidator,
    requestValidationMiddleware,
    contest.adminRemoveContestantFromContest
  );

export default router;
