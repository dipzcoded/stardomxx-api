import { router } from "../../../utils/v1";
import { VoteController } from "../../../controllers/v1";
import {
  voteContestantParamValidator,
  votePostContestParamValidator,
} from "../../../middlewares/v1/validator/votes";
import { requiresAuthMiddleware } from "../../../middlewares/v1/auth";
import { requestValidationMiddleware } from "../../../middlewares/v1/validator";
const vote = new VoteController();
router
  .route("/contest/:contestId/post/:postId")
  .get(
    requiresAuthMiddleware,
    votePostContestParamValidator,
    requestValidationMiddleware,
    vote.getPostVoteCounts
  );

router
  .route("/contest/:contestId/contestant/:userId")
  .get(
    requiresAuthMiddleware,
    voteContestantParamValidator,
    requestValidationMiddleware,
    vote.getContestantVoteCounts
  );

router
  .route("/contest/:contestId/post/:postId")
  .patch(
    requiresAuthMiddleware,
    votePostContestParamValidator,
    requestValidationMiddleware,
    vote.voteForAContestPost
  );

router
  .route("/contest/:contestId/contestant/:userId")
  .patch(
    requiresAuthMiddleware,
    voteContestantParamValidator,
    requestValidationMiddleware,
    vote.voteForContestant
  );

export default router;
