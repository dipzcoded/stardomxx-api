import { Request, Response, NextFunction } from "express";
import { SearchAndPaginationQueryDto } from "../../../dtos/v1/query";
import {
  CommentPostControllerInterface,
  CommentPostResponseInterface,
} from "../../../interfaces/v1/comments-post";
import { UserLoggedInRequest, prismaClient } from "../../../utils/v1";
import {
  ResponseStatusCodeEnum,
  ResponseStatusSignalEnum,
} from "../../../enums/v1";
import { PostIdParamDto } from "../../../dtos/v1/param";
import {
  CommentDTO,
  CommentIdParamDto,
  CommentPostIdDto,
  DeleteCommentReplyId,
} from "../../../dtos/v1/comments-post";
import { BadRequestError, NotFoundError } from "../../../classes/error";

class CommentsPostController implements CommentPostControllerInterface {
  async getYourAllCommentsOnPosts(
    req: Request<
      {},
      any,
      any,
      SearchAndPaginationQueryDto,
      Record<string, any>
    >,
    res: Response<
      CommentPostResponseInterface.getPostComments,
      Record<string, any>
    >,
    next: NextFunction
  ): Promise<void> {
    const { page, perPage } = req.query;
    const offSet = (page - 1) * perPage;
    const customRequest = req as UserLoggedInRequest;
    let userComments = await prismaClient.userPostComment.findMany({
      where: {
        userId: customRequest.user.id,
      },
      skip: offSet,
      take: perPage,
      orderBy: {
        updatedAt: "asc",
      },
      include: {
        post: true,
        user: true,
      },
    });

    userComments = userComments.map((el) => {
      // @ts-ignore
      delete el.user.password;
      return el;
    });

    res.status(ResponseStatusCodeEnum.OK).json({
      status: ResponseStatusSignalEnum.SUCCESS,
      payload: userComments,
    });
  }
  async getCommentsByPostId(
    req: Request<
      PostIdParamDto,
      any,
      any,
      SearchAndPaginationQueryDto,
      Record<string, any>
    >,
    res: Response<
      CommentPostResponseInterface.getPostComments,
      Record<string, any>
    >,
    next: NextFunction
  ): Promise<void> {
    const { postId } = req.params;
    const { page, perPage } = req.query;
    const offSet = (page - 1) * perPage;

    let postComments = await prismaClient.userPostComment.findMany({
      where: {
        postId,
      },
      skip: offSet,
      take: perPage,
      include: {
        post: true,
        user: true,
      },
      orderBy: {
        updatedAt: "asc",
      },
    });

    postComments = postComments.map((el) => {
      // @ts-ignore
      delete el.user.password;
      return el;
    });

    res.status(ResponseStatusCodeEnum.OK).json({
      status: ResponseStatusSignalEnum.SUCCESS,
      payload: postComments,
    });
  }

  async getRepliesOnCommentId(
    req: Request<
      CommentIdParamDto,
      any,
      any,
      SearchAndPaginationQueryDto,
      Record<string, any>
    >,
    res: Response<
      CommentPostResponseInterface.getCommentReplies,
      Record<string, any>
    >,
    next: NextFunction
  ): Promise<void> {
    const { commentId } = req.params;
    const { page, perPage } = req.query;
    const offSet = (page - 1) * perPage;
    // const customRequest = req as UserLoggedInRequest;
    let commentReplies = await prismaClient.userPostCommentReply.findMany({
      where: {
        commentId,
      },
      skip: offSet,
      take: perPage,
      orderBy: {
        updatedAt: "asc",
      },
      include: {
        user: true,
      },
    });

    commentReplies = commentReplies.map((el) => {
      // @ts-ignore
      delete el.user.password;
      return el;
    });

    res.status(ResponseStatusCodeEnum.OK).json({
      status: ResponseStatusSignalEnum.SUCCESS,
      payload: commentReplies,
    });
  }
  async createCommentOnPost(
    req: Request<PostIdParamDto, any, CommentDTO, {}, Record<string, any>>,
    res: Response<
      CommentPostResponseInterface.createAndUpdatePostComment,
      Record<string, any>
    >,
    next: NextFunction
  ): Promise<void> {
    const { postId } = req.params;
    const { comment } = req.body;
    const customRequest = req as UserLoggedInRequest;
    const post = await prismaClient.userPosts.findUnique({
      where: {
        id: postId,
      },
    });
    if (!post) {
      next(new NotFoundError("post not found"));
      return;
    }

    // create user comment
    const userComment = await prismaClient.userComment.create({
      data: {
        comment,
        userId: customRequest.user.id,
      },
    });

    // attach comment to a post
    const postComment = await prismaClient.userPostComment.create({
      data: {
        postId: post.id,
        commentId: userComment.id,
        userId: customRequest.user.id,
      },
    });

    res.status(ResponseStatusCodeEnum.CREATED).json({
      status: ResponseStatusSignalEnum.SUCCESS,
      payload: postComment,
    });
  }

  async createCommentOnAComment(
    req: Request<CommentPostIdDto, any, CommentDTO, {}, Record<string, any>>,
    res: Response<
      CommentPostResponseInterface.replyToComment,
      Record<string, any>
    >,
    next: NextFunction
  ): Promise<void> {
    const { commentId, postId } = req.params;
    const { comment } = req.body;
    const customRequest = req as UserLoggedInRequest;

    const post = await prismaClient.userPosts.findFirst({
      where: {
        id: postId,
      },
    });

    if (!post) {
      next(new NotFoundError("post not found"));
      return;
    }

    const commentMadeOnPost = await prismaClient.userPostComment.findFirst({
      where: {
        commentId,
        postId,
      },
    });

    if (!commentMadeOnPost) {
      next(new BadRequestError("comment not found in the post"));
      return;
    }

    const newComment = await prismaClient.userComment.create({
      data: {
        comment,
        userId: customRequest.user.id,
      },
    });

    const userReply = await prismaClient.userPostCommentReply.create({
      data: {
        commentId,
        postCommentId: commentMadeOnPost.id,
        userId: newComment.userId,
        commentReplyId: newComment.id,
        comment,
      },
    });

    res.status(ResponseStatusCodeEnum.OK).json({
      status: ResponseStatusSignalEnum.SUCCESS,
      payload: userReply,
    });
  }
  async updateCommentByUserOnPost(
    req: Request<CommentIdParamDto, any, CommentDTO, {}, Record<string, any>>,
    res: Response<
      CommentPostResponseInterface.createAndUpdatePostComment,
      Record<string, any>
    >,
    next: NextFunction
  ): Promise<void> {
    const { commentId } = req.params;
    const { comment } = req.body;
    const customRequest = req as UserLoggedInRequest;

    const commentFound = await prismaClient.userComment.findFirst({
      where: {
        id: commentId,
        userId: customRequest.user.id,
      },
    });

    if (!commentFound) {
      next(new NotFoundError("comment not found"));
      return;
    }

    const commentPostFound = await prismaClient.userPostComment.findFirst({
      where: {
        commentId: commentFound.id,
        userId: customRequest.user.id,
      },
    });

    if (!commentPostFound) {
      next(new NotFoundError("comment not found in the post "));
      return;
    }

    const updatedPostComment = await prismaClient.userPostComment.update({
      where: {
        id: commentPostFound.id,
      },
      data: {
        userComment: {
          update: {
            id: commentFound.id,
            comment,
          },
        },
      },
    });

    res.status(ResponseStatusCodeEnum.OK).json({
      status: ResponseStatusSignalEnum.SUCCESS,
      payload: updatedPostComment,
    });
  }
  async deleteCommentOnPost(
    req: Request<CommentPostIdDto, any, any, {}, Record<string, any>>,
    res: Response<
      CommentPostResponseInterface.deletePostCommentAndReplyComment,
      Record<string, any>
    >,
    next: NextFunction
  ): Promise<void> {
    const { commentId, postId } = req.params;
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

    const comment = await prismaClient.userComment.findFirst({
      where: {
        id: commentId,
        userId: customRequest.user.id,
      },
    });

    if (!comment) {
      next(new NotFoundError("comment not found"));
      return;
    }

    // delete comment replies
    await prismaClient.userPostCommentReply.deleteMany({
      where: {
        commentId,
      },
    });

    // delete post comment
    await prismaClient.userPostComment.delete({
      where: {
        commentId: commentId,
      },
    });

    // delete comment
    await prismaClient.userComment.delete({
      where: {
        id: commentId,
      },
    });

    res.status(ResponseStatusCodeEnum.OK).json({
      status: ResponseStatusSignalEnum.SUCCESS,
      payload: "comment deleted successfully!",
    });
  }

  async deleteReplyOnComment(
    req: Request<DeleteCommentReplyId, any, any, {}, Record<string, any>>,
    res: Response<
      CommentPostResponseInterface.deletePostCommentAndReplyComment,
      Record<string, any>
    >,
    next: NextFunction
  ): Promise<void> {
    const { commentId, commentReplyId } = req.params;

    const customRequest = req as UserLoggedInRequest;

    const comment = await prismaClient.userComment.findFirst({
      where: {
        id: commentId,
        userId: customRequest.user.id,
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
      next(new NotFoundError("comment not found a post"));
      return;
    }

    const commentAsReplyFound =
      await prismaClient.userPostCommentReply.findFirst({
        where: {
          commentReplyId,
          commentId,
        },
      });

    if (!commentAsReplyFound) {
      next(new NotFoundError("reply not found"));
      return;
    }

    await prismaClient.userComment.delete({
      where: {
        id: commentAsReplyFound.commentId,
      },
    });

    await prismaClient.userPostCommentReply.delete({
      where: {
        id: commentAsReplyFound.id,
      },
    });

    res.status(ResponseStatusCodeEnum.OK).json({
      status: ResponseStatusSignalEnum.SUCCESS,
      payload: "reply on a comment is deleted successfully!",
    });
  }
}

export default CommentsPostController;
