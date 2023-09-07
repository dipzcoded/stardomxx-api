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
import { PostContentBodyDto } from "../../../dtos/v1/posts";
import { QueryPaginationDTO } from "../../../dtos/v1/query";
import { PostIdParamDto } from "../../../dtos/v1/param";
import {
  ResponseStatusCodeEnum,
  ResponseStatusSignalEnum,
} from "../../../enums/v1";
import {
  BadRequestError,
  ForbiddenError,
  NotFoundError,
} from "../../../classes/error";
import fs from "graceful-fs";
import { PathLike } from "fs";
import { PostContentType } from "../../../enums/v1/post";
import { ParamsDictionary } from "express-serve-static-core";
import { ParsedQs } from "qs";

class PostsController implements PostControllerInterface {
  postVideoForContest(
    req: Request<ParamsDictionary, any, any, ParsedQs, Record<string, any>>,
    res: Response<any, Record<string, any>>,
    next: NextFunction
  ): Promise<void> {
    throw new Error("Method not implemented.");
  }
  getOnGoingContestPost(
    req: Request<ParamsDictionary, any, any, ParsedQs, Record<string, any>>,
    res: Response<any, Record<string, any>>,
    next: NextFunction
  ): Promise<void> {
    throw new Error("Method not implemented.");
  }
  async getYourPostContents(
    req: Request<{}, any, any, QueryPaginationDTO, Record<string, any>>,
    res: Response<
      PostControllerInterfaceResponse.getYourPostContents,
      Record<string, any>
    >,
    next: NextFunction
  ): Promise<void> {
    const { page, perPage } = req.query;
    const offSet = (page - 1) * perPage;
    const customRequest = req as UserLoggedInRequest;
    const userPosts = await prismaClient.userPosts.findMany({
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

    res.status(ResponseStatusCodeEnum.OK).json({
      status: ResponseStatusSignalEnum.SUCCESS,
      payload: userPosts,
    });
  }

  async getFollowingContents(
    req: Request<{}, any, any, QueryPaginationDTO, Record<string, any>>,
    res: Response<
      PostControllerInterfaceResponse.getFollowingContents,
      Record<string, any>
    >,
    next: NextFunction
  ): Promise<void> {
    const customRequest = req as UserLoggedInRequest;
    const { page, perPage } = req.query;
    const offSet = (page - 1) * perPage;
    const userFollowingPosts = await prismaClient.userPosts.findMany({
      where: {
        user: {
          userFollowing: {
            some: {
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
        userPostComments: true,
        userPostLikes: true,
      },
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
