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
import fs from "graceful-fs";
import { PathLike } from "fs";
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
    let onGoingContestPost = await prismaClient.userPosts.findMany({
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
      skip: offSet,
      take: perPage,
      include: {
        user: true,
        userPostComments: true,
        userPostLikes: true,
      },
    });

    onGoingContestPost = onGoingContestPost.map((el) => {
      // @ts-ignore
      delete el.user?.password;

      return el;
    });

    res.status(ResponseStatusCodeEnum.OK).json({
      status: ResponseStatusSignalEnum.SUCCESS,
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
    let userPosts;

    if (findContestPost) {
      let isContestPost = JSON.parse(findContestPost) as boolean;
      userPosts = await prismaClient.userPosts.findMany({
        where: {
          userId: customRequest.user.id,
          isContestPost,
        },
        skip: offSet,
        take: perPage,
        include: {
          user: true,
          userPostComments: true,
          userPostLikes: true,
        },
      });
    } else {
      userPosts = await prismaClient.userPosts.findMany({
        where: {
          userId: customRequest.user.id,
        },
        skip: offSet,
        take: perPage,
        include: {
          user: true,
          userPostComments: true,
          userPostLikes: true,
        },
      });
    }

    userPosts = userPosts.map((el) => {
      // @ts-ignore
      delete el.user?.password;
      return el;
    });

    res.status(ResponseStatusCodeEnum.OK).json({
      status: ResponseStatusSignalEnum.SUCCESS,
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
    let userFollowingPosts = await prismaClient.userPosts.findMany({
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
      skip: offSet,
      take: perPage,
      include: {
        user: true,
        userPostComments: true,
        userPostLikes: true,
      },
    });

    userFollowingPosts = userFollowingPosts.map((el) => {
      // @ts-ignore
      delete el.user?.password;

      return el;
    });

    res.status(ResponseStatusCodeEnum.OK).json({
      status: ResponseStatusSignalEnum.SUCCESS,
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
    const { content } = req.body;

    const customRequest = req as UserLoggedInRequest;
    if (customRequest.files === undefined || !customRequest.files.length) {
      next(new BadRequestError("a file must be uploaded"));
      return;
    }

    const files = req.files as Express.Multer.File[];

    let mediaContent = "";

    for (let x = 0; x < files.length; x++) {
      const filePath = files[x]["path"] as PathLike;
      const fileName = files[x]["filename"];
      try {
        fs.open(filePath, "r", (openErr, fd) => {
          if (openErr) {
            throw openErr;
          }

          fs.close(fd, (closeErr) => {
            if (closeErr) {
              throw closeErr;
            }

            cloudinaryV2.uploader.upload(
              filePath.toString(),
              {
                resource_type: "raw",
                folder: "storgae/upload/",
                public_id: fileName,
                use_filename: true,
                unique_filename: false,
              },
              async (cloudErr, result) => {
                if (cloudErr) {
                  throw cloudErr;
                }

                mediaContent += `${result!.secure_url}${
                  files?.length - 1 === x ? "" : ","
                }`;

                fs.unlink(filePath, (unlinkErr) => {
                  if (unlinkErr) {
                    throw unlinkErr;
                  }
                });
              }
            );
          });
        });
      } catch (error) {
        next(error);
        return;
      }
    }

    const post = await prismaClient.userPosts.create({
      data: {
        userId: customRequest.user.id,
        mediaContent,
        content: content ? content : null,
        type: PostContentType.IMAGE_CONTENT_UPLOAD,
      },
    });

    res.status(ResponseStatusCodeEnum.OK).json({
      status: ResponseStatusSignalEnum.SUCCESS,
      payload: post,
    });
  }

  async postVideoContent(
    req: Request<{}, any, PostContentBodyDto, {}, Record<string, any>>,
    res: Response<
      PostControllerInterfaceResponse.postContent,
      Record<string, any>
    >,
    next: NextFunction
  ): Promise<void> {
    const { content } = req.body;
    const customRequest = req as UserLoggedInRequest;
    if (customRequest.files === undefined || !customRequest.files.length) {
      next(new BadRequestError("a file must be uploaded"));
      return;
    }

    const files = req.files as Express.Multer.File[];
    let mediaContent = "";
    const filePath = files[0]["path"] as PathLike;
    const fileName = files[0]["filename"];

    try {
      fs.open(filePath, "r", (openErr, fd) => {
        if (openErr) {
          throw openErr;
        }

        fs.close(fd, (closeErr) => {
          if (closeErr) {
            throw closeErr;
          }

          cloudinaryV2.uploader.upload(
            filePath.toString(),
            {
              resource_type: "raw",
              folder: "storgae/upload/",
              public_id: fileName,
              use_filename: true,
              unique_filename: false,
            },
            async (cloudErr, result) => {
              if (cloudErr) {
                throw cloudErr;
              }

              mediaContent = result!.secure_url;

              fs.unlink(filePath, (unlinkErr) => {
                if (unlinkErr) {
                  throw unlinkErr;
                }
              });
            }
          );
        });
      });
    } catch (error) {
      next(error);
      return;
    }

    const post = await prismaClient.userPosts.create({
      data: {
        userId: customRequest.user.id,
        mediaContent,
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
    const { content } = req.body;
    const customRequest = req as UserLoggedInRequest;

    if (customRequest.files === undefined || !customRequest.files.length) {
      next(new BadRequestError("a file must be uploaded"));
      return;
    }
    const contest = await prismaClient.contest.findFirst({
      where: {
        id: contestId,
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

    const files = req.files as Express.Multer.File[];
    let mediaContent = "";
    const filePath = files[0]["path"] as PathLike;
    const fileName = files[0]["filename"];

    try {
      fs.open(filePath, "r", (openErr, fd) => {
        if (openErr) {
          throw openErr;
        }

        fs.close(fd, (closeErr) => {
          if (closeErr) {
            throw closeErr;
          }

          cloudinaryV2.uploader.upload(
            filePath.toString(),
            {
              resource_type: "raw",
              folder: "storgae/upload/",
              public_id: fileName,
              use_filename: true,
              unique_filename: false,
            },
            async (cloudErr, result) => {
              if (cloudErr) {
                throw cloudErr;
              }

              mediaContent = result!.secure_url;

              fs.unlink(filePath, (unlinkErr) => {
                if (unlinkErr) {
                  throw unlinkErr;
                }
              });
            }
          );
        });
      });
    } catch (error) {
      next(error);
      return;
    }

    const contestPost = await prismaClient.userPosts.create({
      data: {
        type: PostContentType.VIDEO_CONTENT_UPLOAD,
        contestId,
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
    const { content } = req.body;
    const customRequest = req as UserLoggedInRequest;

    if (customRequest.files === undefined || !customRequest.files.length) {
      next(new BadRequestError("a file must be uploaded"));
      return;
    }
    const contest = await prismaClient.contest.findFirst({
      where: {
        id: contestId,
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

    const files = req.files as Express.Multer.File[];
    let mediaContent = "";
    const filePath = files[0]["path"] as PathLike;
    const fileName = files[0]["filename"];

    try {
      fs.open(filePath, "r", (openErr, fd) => {
        if (openErr) {
          throw openErr;
        }

        fs.close(fd, (closeErr) => {
          if (closeErr) {
            throw closeErr;
          }

          cloudinaryV2.uploader.upload(
            filePath.toString(),
            {
              resource_type: "raw",
              folder: "storgae/upload/",
              public_id: fileName,
              use_filename: true,
              unique_filename: false,
            },
            async (cloudErr, result) => {
              if (cloudErr) {
                throw cloudErr;
              }

              mediaContent = result!.secure_url;

              fs.unlink(filePath, (unlinkErr) => {
                if (unlinkErr) {
                  throw unlinkErr;
                }
              });
            }
          );
        });
      });
    } catch (error) {
      next(error);
      return;
    }

    const contestPost = await prismaClient.userPosts.create({
      data: {
        type: PostContentType.VIDEO_CONTENT_UPLOAD,
        contestId,
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
        id: postId,
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
        id: postId,
      },
    });

    res.status(ResponseStatusCodeEnum.OK).json({
      status: ResponseStatusSignalEnum.SUCCESS,
      payload: "post deleted successfully!",
    });
  }
}

export default PostsController;
