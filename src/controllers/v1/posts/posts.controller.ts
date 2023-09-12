import { Request, Response, NextFunction } from "express";
import {
  PostControllerInterface,
  PostControllerInterfaceResponse,
} from "../../../interfaces/v1/posts";
import {
  prismaClient,
  cloudinaryV2,
  UserLoggedInRequest,
} from "../../../utils/v1";
import {
  PostContentBodyDto,
  GetOwnContentPostQueryDto,
} from "../../../dtos/v1/posts";
import { SearchAndPaginationQueryDto } from "../../../dtos/v1/query";
import { IdParamDto, PostIdParamDto } from "../../../dtos/v1/param";
import {
  ResponseStatusCodeEnum,
  ResponseStatusSignalEnum,
} from "../../../enums/v1";
import {
  BadRequestError,
  ForbiddenError,
  InvalidRequestError,
  NotFoundError,
} from "../../../classes/error";
import { PostContentType } from "../../../enums/v1/post";

class PostsController implements PostControllerInterface {
  async getOnGoingContestPost(
    req: Request<
      {},
      any,
      any,
      SearchAndPaginationQueryDto,
      Record<string, any>
    >,
    res: Response<
      PostControllerInterfaceResponse.getPostContent,
      Record<string, any>
    >,
    next: NextFunction
  ): Promise<void> {
    const { page, perPage } = req.query;
    const customRequest = req as UserLoggedInRequest;
    const offSet = (page - 1) * perPage;
    let [onGoingContestPost, onGoingContestPostCounts] =
      await prismaClient.$transaction([
        prismaClient.userPosts.findMany({
          where: {
            OR: [
              {
                isContestPost: true,
                contest: {
                  OR: [
                    {
                      isCompetitionOn: true,
                    },
                    {
                      isOpenForEntry: true,
                    },
                  ],
                },
              },
              {
                isContestPost: true,
                contest: {
                  OR: [
                    {
                      isCompetitionOn: true,
                    },
                    {
                      isOpenForEntry: true,
                    },
                  ],
                },
                user: {
                  userFollowing: {
                    every: {
                      userFollowing: {
                        every: {
                          id: {
                            not: {
                              equals: customRequest.user.id,
                            },
                          },
                        },
                      },
                    },
                  },
                },
              },
            ],
          },
          skip: Number(offSet),
          take: Number(perPage),
          include: {
            user: true,
            userPostComments: true,
            userPostLikes: true,
          },
        }),
        prismaClient.userPosts.count({
          where: {
            OR: [
              {
                isContestPost: true,
                contest: {
                  OR: [
                    {
                      isCompetitionOn: true,
                    },
                    {
                      isOpenForEntry: true,
                    },
                  ],
                },
              },
              {
                isContestPost: true,
                contest: {
                  OR: [
                    {
                      isCompetitionOn: true,
                    },
                    {
                      isOpenForEntry: true,
                    },
                  ],
                },
                user: {
                  userFollowing: {
                    every: {
                      userFollowing: {
                        every: {
                          id: {
                            not: {
                              equals: customRequest.user.id,
                            },
                          },
                        },
                      },
                    },
                  },
                },
              },
            ],
          },
        }),
      ]);

    onGoingContestPost = onGoingContestPost.map((el) => {
      // @ts-ignore
      delete el.user?.password;

      return el;
    });

    res.status(ResponseStatusCodeEnum.OK).json({
      status: ResponseStatusSignalEnum.SUCCESS,
      resultLength: onGoingContestPostCounts,
      payload: onGoingContestPost,
    });
  }

  async getYourPostContents(
    req: Request<{}, any, any, GetOwnContentPostQueryDto, Record<string, any>>,
    res: Response<
      PostControllerInterfaceResponse.getPostContent,
      Record<string, any>
    >,
    next: NextFunction
  ): Promise<void> {
    const { page, perPage, findContestPost } = req.query;

    const offSet = (page - 1) * perPage;
    const customRequest = req as UserLoggedInRequest;

    let isContestPost = findContestPost
      ? (JSON.parse(findContestPost) as boolean)
      : false;

    let [userPosts, userPostsCounts] = await prismaClient.$transaction([
      isContestPost
        ? prismaClient.userPosts.findMany({
            where: {
              userId: customRequest.user.id,
              isContestPost,
            },
            skip: Number(offSet),
            take: Number(perPage),
            include: {
              user: true,
              userPostComments: true,
              userPostLikes: true,
            },
          })
        : prismaClient.userPosts.findMany({
            where: {
              userId: customRequest.user.id,
            },
            skip: Number(offSet),
            take: Number(perPage),
            include: {
              user: true,
              userPostComments: true,
              userPostLikes: true,
            },
          }),
      isContestPost
        ? prismaClient.userPosts.count({
            where: {
              userId: customRequest.user.id,
              isContestPost,
            },
          })
        : prismaClient.userPosts.count({
            where: {
              userId: customRequest.user.id,
            },
          }),
    ]);

    userPosts = userPosts.map((el) => {
      // @ts-ignore
      delete el.user?.password;
      return el;
    });

    res.status(ResponseStatusCodeEnum.OK).json({
      status: ResponseStatusSignalEnum.SUCCESS,
      resultLength: userPostsCounts,
      payload: userPosts,
    });
  }

  async getFollowingContents(
    req: Request<
      {},
      any,
      any,
      SearchAndPaginationQueryDto,
      Record<string, any>
    >,
    res: Response<
      PostControllerInterfaceResponse.getPostContent,
      Record<string, any>
    >,
    next: NextFunction
  ): Promise<void> {
    const customRequest = req as UserLoggedInRequest;
    const { page, perPage } = req.query;
    const offSet = (page - 1) * perPage;
    let [userFollowingPosts, userFollowingPostsCounts] =
      await prismaClient.$transaction([
        prismaClient.userPosts.findMany({
          where: {
            user: {
              userFollowing: {
                every: {
                  userFollowing: {
                    every: {
                      id: {
                        not: {
                          equals: customRequest.user.id,
                        },
                      },
                    },
                  },
                },
              },
            },
          },
          skip: Number(offSet),
          take: Number(perPage),
          include: {
            user: true,
            userPostComments: true,
            userPostLikes: true,
          },
        }),
        prismaClient.userPosts.count({
          where: {
            user: {
              userFollowing: {
                every: {
                  userFollowing: {
                    every: {
                      id: {
                        not: {
                          equals: customRequest.user.id,
                        },
                      },
                    },
                  },
                },
              },
            },
          },
        }),
      ]);

    userFollowingPosts = userFollowingPosts.map((el) => {
      // @ts-ignore
      delete el.user?.password;

      return el;
    });

    res.status(ResponseStatusCodeEnum.OK).json({
      status: ResponseStatusSignalEnum.SUCCESS,
      resultLength: userFollowingPostsCounts,
      payload: userFollowingPosts,
    });
  }

  async postImageContent(
    req: Request<{}, any, PostContentBodyDto, {}, Record<string, any>>,
    res: Response<
      PostControllerInterfaceResponse.postContent,
      Record<string, any>
    >,
    next: NextFunction
  ): Promise<void> {
    const { content, mediaContent } = req.body;

    const customRequest = req as UserLoggedInRequest;

    try {
      const post = await prismaClient.userPosts.create({
        data: {
          userId: customRequest.user.id,
          mediaContent: mediaContent ? mediaContent : null,
          content: content ? content : null,
          type: PostContentType.IMAGE_CONTENT_UPLOAD,
        },
      });

      res.status(ResponseStatusCodeEnum.OK).json({
        status: ResponseStatusSignalEnum.SUCCESS,
        payload: post,
      });
    } catch (error) {
      next(error);
      return;
    }
  }

  async postVideoContent(
    req: Request<{}, any, PostContentBodyDto, {}, Record<string, any>>,
    res: Response<
      PostControllerInterfaceResponse.postContent,
      Record<string, any>
    >,
    next: NextFunction
  ): Promise<void> {
    const { content, mediaContent } = req.body;
    const customRequest = req as UserLoggedInRequest;

    const post = await prismaClient.userPosts.create({
      data: {
        userId: customRequest.user.id,
        mediaContent: mediaContent ? mediaContent : null,
        content: content ? content : null,
        type: PostContentType.VIDEO_CONTENT_UPLOAD,
      },
    });

    res.status(ResponseStatusCodeEnum.OK).json({
      status: ResponseStatusSignalEnum.SUCCESS,
      payload: post,
    });
  }

  async postTextContent(
    req: Request<{}, {}, PostContentBodyDto, {}, Record<string, any>>,
    res: Response<
      PostControllerInterfaceResponse.postContent,
      Record<string, any>
    >,
    next: NextFunction
  ): Promise<void> {
    const { content } = req.body;

    const customRequest = req as UserLoggedInRequest;

    if (!content) {
      next(new BadRequestError("content is required"));
      return;
    }

    const post = await prismaClient.userPosts.create({
      data: {
        content,
        userId: customRequest.user.id,
        type: PostContentType.TEXT_CONTENT_UPLOAD,
      },
    });

    res.status(ResponseStatusCodeEnum.OK).json({
      status: ResponseStatusSignalEnum.SUCCESS,
      payload: post,
    });
  }

  async postVideoForContestEntry(
    req: Request<IdParamDto, any, PostContentBodyDto, {}, Record<string, any>>,
    res: Response<
      PostControllerInterfaceResponse.postContent,
      Record<string, any>
    >,
    next: NextFunction
  ): Promise<void> {
    const { id: contestId } = req.params;
    const { content, mediaContent } = req.body;
    const customRequest = req as UserLoggedInRequest;

    const contest = await prismaClient.contest.findFirst({
      where: {
        id: Number(contestId),
      },
    });

    if (!contest) {
      next(new NotFoundError("contest not found"));
      return;
    }

    if (Number(contest.durationExpiration) < Date.now()) {
      next(new InvalidRequestError("contest is not longer running"));
      return;
    }

    if (!contest.isOpenForEntry) {
      next(
        new InvalidRequestError(
          "contest is not longer avaliable for more entries"
        )
      );
      return;
    }

    const isContestantAppliedForContest =
      await prismaClient.contestant.findFirst({
        where: {
          contestId: contest.id,
          userId: customRequest.user.id,
        },
      });

    if (!isContestantAppliedForContest) {
      next(
        new ForbiddenError("Cannot post to an ongoing contest you didnt join")
      );
      return;
    }

    const contestPost = await prismaClient.userPosts.create({
      data: {
        type: PostContentType.VIDEO_CONTENT_UPLOAD,
        contestId: Number(contestId),
        userId: customRequest.user.id,
        mediaContent,
        content,
        isContestPost: true,
      },
    });

    res.status(ResponseStatusCodeEnum.CREATED).json({
      status: ResponseStatusSignalEnum.SUCCESS,
      payload: contestPost,
    });
  }

  async postVideoForCompetitionContest(
    req: Request<IdParamDto, any, PostContentBodyDto, {}, Record<string, any>>,
    res: Response<any, Record<string, any>>,
    next: NextFunction
  ): Promise<void> {
    const { id: contestId } = req.params;
    const { content, mediaContent } = req.body;
    const customRequest = req as UserLoggedInRequest;
    const contest = await prismaClient.contest.findFirst({
      where: {
        id: Number(contestId),
      },
    });

    if (!contest) {
      next(new NotFoundError("contest not found"));
      return;
    }

    if (Number(contest.durationExpiration) < Date.now()) {
      next(new InvalidRequestError("contest is not longer running"));
      return;
    }

    if (!contest.isCompetitionOn) {
      next(
        new InvalidRequestError(
          "contest is avaliable for more entries so can post for the main competition"
        )
      );
      return;
    }

    const isContestantAppliedForContest =
      await prismaClient.contestant.findFirst({
        where: {
          contestId: contest.id,
          userId: customRequest.user.id,
        },
      });

    if (!isContestantAppliedForContest) {
      next(
        new ForbiddenError("Cannot post to an ongoing contest you didnt join")
      );
      return;
    }

    const contestPost = await prismaClient.userPosts.create({
      data: {
        type: PostContentType.VIDEO_CONTENT_UPLOAD,
        contestId: Number(contestId),
        userId: customRequest.user.id,
        mediaContent,
        content,
        isContestPost: true,
      },
    });

    res.status(ResponseStatusCodeEnum.CREATED).json({
      status: ResponseStatusSignalEnum.SUCCESS,
      payload: contestPost,
    });
  }

  async deleteYourPostContent(
    req: Request<PostIdParamDto, any, any, {}, Record<string, any>>,
    res: Response<
      PostControllerInterfaceResponse.deleteYourPostContent,
      Record<string, any>
    >,
    next: NextFunction
  ): Promise<void> {
    const { postId } = req.params;

    const customRequest = req as UserLoggedInRequest;
    const post = await prismaClient.userPosts.findUnique({
      where: {
        id: Number(postId),
      },
    });

    if (!post) {
      next(new NotFoundError("post not found by id"));
      return;
    }

    if (post?.userId !== customRequest.user.id) {
      next(new ForbiddenError("post does not belong to you"));
      return;
    }
    await prismaClient.userPosts.delete({
      where: {
        id: Number(postId),
      },
    });

    res.status(ResponseStatusCodeEnum.OK).json({
      status: ResponseStatusSignalEnum.SUCCESS,
      payload: "post deleted successfully!",
    });
  }
}

export default PostsController;
