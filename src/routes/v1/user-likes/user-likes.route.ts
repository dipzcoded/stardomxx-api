import { UserLikesController } from "../../../controllers/v1";
import { requiresAuthMiddleware } from "../../../middlewares/v1/auth";
import { requestValidationMiddleware } from "../../../middlewares/v1/validator";
import { paginationSearchQueryValidator } from "../../../middlewares/v1/validator/query";
import {
  commentPostIdParamValidator,
  commentReplyCommentPostIdParamValidator,
} from "../../../middlewares/v1/validator/comments-post";
import {
  idParamValidator,
  postidParamValidator,
} from "../../../middlewares/v1/validator/param";
import router from "../users/user.route";

const userLikes = new UserLikesController();

router
  .route("/me/posts")
  .get(
    requiresAuthMiddleware,
    paginationSearchQueryValidator,
    requestValidationMiddleware,
    userLikes.userGetLikesPost
  );

router
  .route("/post/:id/counts")
  .get(
    requiresAuthMiddleware,
    idParamValidator,
    requestValidationMiddleware,
    userLikes.getPostLikesCount
  );

router
  .route("/comment/:id/counts")
  .get(
    requiresAuthMiddleware,
    idParamValidator,
    requestValidationMiddleware,
    userLikes.getPostCommentReplyLikeCount
  );

router
  .route("/comment-reply/:id/counts")
  .get(
    requiresAuthMiddleware,
    idParamValidator,
    requestValidationMiddleware,
    userLikes.getPostCommentReplyLikeCount
  );

router
  .route("/post/:postId/like")
  .patch(
    requiresAuthMiddleware,
    postidParamValidator,
    requestValidationMiddleware,
    userLikes.likePost
  );

router
  .route("/post/:postId/unlike")
  .patch(
    requiresAuthMiddleware,
    postidParamValidator,
    requestValidationMiddleware,
    userLikes.unlikePost
  );

router
  .route("/post/:postId/comment/:commentId/like")
  .patch(
    requiresAuthMiddleware,
    commentPostIdParamValidator,
    requestValidationMiddleware,
    userLikes.likeComment
  );

router
  .route("/post/:postId/comment/:commentId/unlike")
  .patch(
    requiresAuthMiddleware,
    commentPostIdParamValidator,
    requestValidationMiddleware,
    userLikes.unlikeComment
  );

router
  .route("/post/:postId/comment/:commentId/reply/:commentReplyId/like")
  .patch(
    requiresAuthMiddleware,
    commentReplyCommentPostIdParamValidator,
    requestValidationMiddleware,
    userLikes.likeCommentReply
  );

router
  .route("/post/:postId/comment/:commentId/reply/:commentReplyId/unlike")
  .patch(
    requiresAuthMiddleware,
    commentReplyCommentPostIdParamValidator,
    requestValidationMiddleware,
    userLikes.unlikeCommentReply
  );

export default router;
