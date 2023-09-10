import { Request, Response, NextFunction } from "express";
import {
  UserLikesPostAndCommentControllerInterface,
  UserLikesResponseInterface,
} from "../../../interfaces/v1/user-likes";
import { UserLoggedInRequest } from "../../../utils/v1";
import { prismaClient } from "../../../utils/v1";
import { SearchAndPaginationQueryDto } from "../../../dtos/v1/query";
import { PostIdParamDto, IdParamDto } from "../../../dtos/v1/param";
import {
  CommentPostIdDto,
  CommentReplyCommentPostIdDto,
} from "../../../dtos/v1/comments-post";
import {
  ResponseStatusCodeEnum,
  ResponseStatusSignalEnum,
} from "../../../enums/v1";
import { InvalidRequestError, NotFoundError } from "../../../classes/error";

class UserLikesController
  implements UserLikesPostAndCommentControllerInterface
{
  async userGetLikesPost(
    req: Request<
      {},
      any,
      any,
      SearchAndPaginationQueryDto,
      Record<string, any>
    >,
    res: Response<UserLikesResponseInterface.getPostLikes, Record<string, any>>,
    next: NextFunction
  ): Promise<void> {
    const { page, perPage } = req.query;
    const offSet = (page - 1) * perPage;
    const customRequest = req as UserLoggedInRequest;
    const userLikesPosts = await prismaClient.userPostLikes.findMany({
      where: {
        userId: customRequest.user.id,
      },
      skip: offSet,
      take: perPage,
      include: {
        post: true,
        user: true,
      },
    });

    res.status(ResponseStatusCodeEnum.OK).json({
      status: ResponseStatusSignalEnum.SUCCESS,
      payload: userLikesPosts,
    });
  }
  async getPostLikesCount(
    req: Request<IdParamDto, any, any, {}, Record<string, any>>,
    res: Response<
      UserLikesResponseInterface.getLikesCount,
      Record<string, any>
    >,
    next: NextFunction
  ): Promise<void> {
    const { id: postId } = req.params;

    const post = await prismaClient.userPosts.findFirst({
      where: {
        id: postId,
      },
    });

    if (!post) {
      next(new NotFoundError("post not found"));
      return;
    }

    const postLikesCount = await prismaClient.userPostLikes.count({
      where: {
        postId: post.id,
      },
    });

    res.status(ResponseStatusCodeEnum.OK).json({
      status: ResponseStatusSignalEnum.SUCCESS,
      payload: postLikesCount,
    });
  }

  async getPostCommentLikesCount(
    req: Request<IdParamDto, any, any, {}, Record<string, any>>,
    res: Response<
      UserLikesResponseInterface.getLikesCount,
      Record<string, any>
    >,
    next: NextFunction
  ): Promise<void> {
    const { id: commentId } = req.params;
    const comment = await prismaClient.userComment.findFirst({
      where: {
        id: commentId,
      },
    });

    if (!comment) {
      next(new NotFoundError("comment not found"));
      return;
    }

    const postComment = await prismaClient.userPostComment.findUnique({
      where: {
        commentId: comment.id,
      },
    });

    if (!postComment) {
      next(new NotFoundError("comment not found for a post"));
      return;
    }

    const commentLikesCount = await prismaClient.userPostCommentLikes.count({
      where: {
        postCommentId: postComment.id,
      },
    });

    res.status(ResponseStatusCodeEnum.OK).json({
      status: ResponseStatusSignalEnum.SUCCESS,
      payload: commentLikesCount,
    });
  }
  async getPostCommentReplyLikeCount(
    req: Request<IdParamDto, any, any, {}, Record<string, any>>,
    res: Response<
      UserLikesResponseInterface.getLikesCount,
      Record<string, any>
    >,
    next: NextFunction
  ): Promise<void> {
    const { id: commentReplyId } = req.params;

    const commentReply = await prismaClient.userPostCommentReply.findUnique({
      where: {
        id: commentReplyId,
      },
    });

    if (!commentReply) {
      next(new NotFoundError("reply to a comment not found"));
      return;
    }

    const replyCommentPostLikesCount =
      await prismaClient.userPostCommentReplyLikes.count({
        where: {
          postCommentReplyId: commentReply.id,
        },
      });

    res.status(ResponseStatusCodeEnum.OK).json({
      status: ResponseStatusSignalEnum.SUCCESS,
      payload: replyCommentPostLikesCount,
    });
  }

  async likePost(
    req: Request<PostIdParamDto, any, any, {}, Record<string, any>>,
    res: Response<UserLikesResponseInterface.likePost, Record<string, any>>,
    next: NextFunction
  ): Promise<void> {
    const { postId } = req.params;
    const customRequest = req as UserLoggedInRequest;
    const post = await prismaClient.userPosts.findFirst({
      where: {
        id: postId,
        userId: customRequest.user.id,
      },
    });

    if (!post) {
      next(new NotFoundError("post not found"));
      return;
    }

    const isPostAlreadyLiked = await prismaClient.userPostLikes.findFirst({
      where: {
        postId,
        userId: customRequest.user.id,
      },
    });

    if (isPostAlreadyLiked) {
      next(new InvalidRequestError("post is already liked"));
      return;
    }

    const postlike = await prismaClient.userPostLikes.create({
      data: {
        postId,
        userId: customRequest.user.id,
      },
    });

    res.status(ResponseStatusCodeEnum.OK).json({
      status: ResponseStatusSignalEnum.SUCCESS,
      payload: postlike,
    });
  }
  async unlikePost(
    req: Request<PostIdParamDto, any, any, {}, Record<string, any>>,
    res: Response<
      UserLikesResponseInterface.unLikePostAndComment,
      Record<string, any>
    >,
    next: NextFunction
  ): Promise<void> {
    const { postId } = req.params;
    const customRequest = req as UserLoggedInRequest;
    const post = await prismaClient.userPosts.findFirst({
      where: {
        id: postId,
        userId: customRequest.user.id,
      },
    });

    if (!post) {
      next(new NotFoundError("post not found"));
      return;
    }

    const isPostAlreadyLiked = await prismaClient.userPostLikes.findFirst({
      where: {
        postId,
        userId: customRequest.user.id,
      },
    });

    if (!isPostAlreadyLiked) {
      next(new InvalidRequestError("post has not been liked"));
      return;
    }

    await prismaClient.userPostLikes.delete({
      where: {
        id: isPostAlreadyLiked.id,
      },
    });

    res.status(ResponseStatusCodeEnum.OK).json({
      status: ResponseStatusSignalEnum.SUCCESS,
      payload: "post unliked successfullly",
    });
  }

  async likeComment(
    req: Request<CommentPostIdDto, any, any, {}, Record<string, any>>,
    res: Response<UserLikesResponseInterface.likeComment, Record<string, any>>,
    next: NextFunction
  ): Promise<void> {
    const { commentId, postId } = req.params;
    const customRequest = req as UserLoggedInRequest;

    const postComment = await prismaClient.userPostComment.findFirst({
      where: {
        postId,
        commentId,
      },
    });

    if (!postComment) {
      next(new NotFoundError("post and comment not found"));
      return;
    }

    const isCommentAlreadyLiked =
      await prismaClient.userPostCommentLikes.findFirst({
        where: {
          postCommentId: postComment.id,
          userId: customRequest.user.id,
        },
      });

    if (isCommentAlreadyLiked) {
      next(new InvalidRequestError("comment is already liked"));
      return;
    }

    const commentLiked = await prismaClient.userPostCommentLikes.create({
      data: {
        postCommentId: postComment.id,
        userId: customRequest.user.id,
      },
    });

    res.status(ResponseStatusCodeEnum.OK).json({
      status: ResponseStatusSignalEnum.SUCCESS,
      payload: commentLiked,
    });
  }
  async unlikeComment(
    req: Request<CommentPostIdDto, any, any, {}, Record<string, any>>,
    res: Response<
      UserLikesResponseInterface.unLikePostAndComment,
      Record<string, any>
    >,
    next: NextFunction
  ): Promise<void> {
    const { commentId, postId } = req.params;
    const customRequest = req as UserLoggedInRequest;

    const postComment = await prismaClient.userPostComment.findFirst({
      where: {
        postId,
        commentId,
      },
    });

    if (!postComment) {
      next(new NotFoundError("post and comment not found"));
      return;
    }

    const isCommentAlreadyLiked =
      await prismaClient.userPostCommentLikes.findFirst({
        where: {
          postCommentId: postComment.id,
          userId: customRequest.user.id,
        },
      });

    if (!isCommentAlreadyLiked) {
      next(new InvalidRequestError("comment is not liked"));
      return;
    }

    await prismaClient.userPostCommentLikes.delete({
      where: {
        id: isCommentAlreadyLiked.id,
      },
    });

    res.status(ResponseStatusCodeEnum.OK).json({
      status: ResponseStatusSignalEnum.SUCCESS,
      payload: "comment is unliked",
    });
  }
  async likeCommentReply(
    req: Request<
      CommentReplyCommentPostIdDto,
      any,
      any,
      {},
      Record<string, any>
    >,
    res: Response<
      UserLikesResponseInterface.likeCommentReply,
      Record<string, any>
    >,
    next: NextFunction
  ): Promise<void> {
    const { commentId, commentReplyId, postId } = req.params;
    const customRequest = req as UserLoggedInRequest;

    const postComment = await prismaClient.userPostComment.findFirst({
      where: {
        commentId,
        postId,
      },
    });

    if (!postComment) {
      next(new NotFoundError("post and comment not found"));
      return;
    }
    const postCommentReply = await prismaClient.userPostCommentReply.findFirst({
      where: {
        commentId,
        commentReplyId,
        postCommentId: postComment.id,
        userId: customRequest.user.id,
      },
    });

    if (!postCommentReply) {
      next(new NotFoundError("reply to comment on a post not found"));
      return;
    }

    const isReplyToCommentAlreadyLiked =
      await prismaClient.userPostCommentReplyLikes.findFirst({
        where: {
          postCommentReplyId: postCommentReply.id,
          userId: customRequest.user.id,
        },
      });

    if (isReplyToCommentAlreadyLiked) {
      next(new InvalidRequestError("reply to the comment is already liked"));
      return;
    }

    const replyPostCommentlike =
      await prismaClient.userPostCommentReplyLikes.create({
        data: {
          postCommentReplyId: postCommentReply.id,
          userId: customRequest.user.id,
        },
      });

    res.status(ResponseStatusCodeEnum.OK).json({
      status: ResponseStatusSignalEnum.SUCCESS,
      payload: replyPostCommentlike,
    });
  }
  async unlikeCommentReply(
    req: Request<
      CommentReplyCommentPostIdDto,
      any,
      any,
      {},
      Record<string, any>
    >,
    res: Response<
      UserLikesResponseInterface.unLikePostAndComment,
      Record<string, any>
    >,
    next: NextFunction
  ): Promise<void> {
    const { commentId, commentReplyId, postId } = req.params;
    const customRequest = req as UserLoggedInRequest;
    const postComment = await prismaClient.userPostComment.findFirst({
      where: {
        commentId,
        postId,
      },
    });

    if (!postComment) {
      next(new NotFoundError("post and comment not found"));
      return;
    }
    const postCommentReply = await prismaClient.userPostCommentReply.findFirst({
      where: {
        commentId,
        commentReplyId,
        postCommentId: postComment.id,
        userId: customRequest.user.id,
      },
    });

    if (!postCommentReply) {
      next(new NotFoundError("reply to comment on a post not found"));
      return;
    }

    const isReplyToCommentAlreadyLiked =
      await prismaClient.userPostCommentReplyLikes.findFirst({
        where: {
          postCommentReplyId: postCommentReply.id,
          userId: customRequest.user.id,
        },
      });

    if (!isReplyToCommentAlreadyLiked) {
      next(new InvalidRequestError("reply to the comment is not liked"));
      return;
    }

    await prismaClient.userPostCommentReplyLikes.delete({
      where: {
        id: isReplyToCommentAlreadyLiked.id,
      },
    });

    res.status(ResponseStatusCodeEnum.OK).json({
      status: ResponseStatusSignalEnum.SUCCESS,
      payload: "reply to the comment is unliked",
    });
  }
}

export default UserLikesController;
