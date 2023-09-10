import { Request, Response, NextFunction } from "express";
import {
  FollowingControllerInterface,
  FollowingResponse,
} from "../../../interfaces/v1/following";
import { UserIdParamDTO } from "../../../dtos/v1/following";
import { UserLoggedInRequest, prismaClient } from "../../../utils/v1";
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

class FollowingController implements FollowingControllerInterface {
  async unFollowFollowing(
    req: Request<UserIdParamDTO, any, any, {}, Record<string, any>>,
    res: Response<FollowingResponse, Record<string, any>>,
    next: NextFunction
  ): Promise<void> {
    const { userId } = req.params;
    const customRequest = req as UserLoggedInRequest;

    // checking if user exist
    const userExist = await prismaClient.user.findUnique({
      where: {
        id: Number(userId),
      },
    });

    if (!userExist) {
      // TODO: throw an error
      next(new NotFoundError("user not found"));
      return;
    }

    if (userExist.id === customRequest.user.id) {
      // TODO: throw an error
      next(new ForbiddenError("cannot perform this action"));
      return;
    }

    const userFollowing = await prismaClient.userFollowing.findMany({
      where: {
        userId: customRequest.user.id,
      },
    });

    if (!userFollowing.length) {
      // TODO: throw an error
      next(new BadRequestError("you dont have followers yet"));
      return;
    } else {
      const userFollowing = await prismaClient.userFollowing.findFirst({
        where: {
          userId: customRequest.user.id,
          userFollowing: {
            none: {
              id: userExist.id,
            },
          },
        },
      });

      if (userFollowing) {
        // TODO: throw an error
        next(new InvalidRequestError("you are not folllowing the user"));
        return;
      } else {
        await prismaClient.user.update({
          where: {
            id: customRequest.user.id,
          },
          data: {
            userFollowing: {
              disconnect: {
                id: userExist.id,
              },
            },
          },
        });
      }

      res.status(ResponseStatusCodeEnum.OK).json({
        status: ResponseStatusSignalEnum.SUCCESS,
        payload: "user following unfollowed",
      });
    }
  }
  async followUser(
    req: Request<UserIdParamDTO, any, any, {}, Record<string, any>>,
    res: Response<FollowingResponse, Record<string, any>>,
    next: NextFunction
  ): Promise<void> {
    const { userId } = req.params;
    const customRequest = req as UserLoggedInRequest;

    const userExist = await prismaClient.user.findUnique({
      where: {
        id: Number(userId),
      },
    });
    if (!userExist) {
      // TODO: throw an error
      throw new Error("user not found");
    }

    if (userExist.id === customRequest.user.id) {
      // TODO: throw an error
      throw new Error("cannot peform this action");
    }
    // checking if user have any followers
    const userFollowing = await prismaClient.userFollowing.findMany({
      where: {
        userId: customRequest.user.id,
      },
    });

    const userFollowing2 = await prismaClient.userFollowers.findMany({
      where: {
        userId: userExist.id,
      },
    });

    if (!userFollowing.length && !userFollowing2.length) {
      await prismaClient.userFollowing.create({
        data: {
          userId: customRequest.user.id,
          userFollowing: {
            connect: {
              id: userExist.id,
            },
          },
        },
      });

      await prismaClient.userFollowers.create({
        data: {
          userId: userExist.id,
          userFollowers: {
            connect: {
              id: customRequest.user.id,
            },
          },
        },
      });
    } else {
      const userNotFollowing = await prismaClient.userFollowing.findFirst({
        where: {
          userId: customRequest.user.id,
          userFollowing: {
            none: {
              id: userExist.id,
            },
          },
        },
      });

      if (!userNotFollowing) {
        // TODO: throw an error
        // throw new Error("user already followed");
        next(new InvalidRequestError("user already followed"));
        return;
      }

      const userNotFollowing2 = await prismaClient.userFollowers.findFirst({
        where: {
          userId: userExist.id,
          userFollowers: {
            none: {
              id: customRequest.user.id,
            },
          },
        },
      });

      if (userNotFollowing2 && !userNotFollowing) {
        // TODO: throw an error
        // throw new Error("user already followed");
        next(new InvalidRequestError("already followed"));
        return;
      }

      await prismaClient.userFollowing.update({
        where: {
          id: userNotFollowing.id,
        },
        data: {
          userFollowing: {
            connect: {
              id: userExist.id,
            },
          },
        },
      });
    }

    await prismaClient.userFollowers.update({
      where: {
        id: userExist.id,
      },
      data: {
        userFollowers: {
          connect: {
            id: customRequest.user.id,
          },
        },
      },
    });

    res.status(ResponseStatusCodeEnum.OK).json({
      status: ResponseStatusSignalEnum.SUCCESS,
      payload: "User followed",
    });
  }
  async unfollowFollower(
    req: Request<UserIdParamDTO, any, any, {}, Record<string, any>>,
    res: Response<FollowingResponse, Record<string, any>>,
    next: NextFunction
  ): Promise<void> {
    const { userId } = req.params;
    const customRequest = req as UserLoggedInRequest;
   

    // check if user exist

    const userExist = await prismaClient.user.findUnique({
      where: {
        id: Number(userId),
      },
    });
    if (!userExist) {
      // TODO: throw an error
      next(new NotFoundError("user not found"));
      return;
    }

    if (userExist.id === customRequest.user.id) {
      // TODO: throw an error
      next(new ForbiddenError("cannot perform this action"));
      return;
    }
    // checking if user have any followers
    const userFollowers = await prismaClient.userFollowers.findMany({
      where: {
        userId: customRequest.user.id,
      },
    });

    if (!userFollowers.length) {
      // TODO: throw an error
      // throw new Error("user not following");
      next(new NotFoundError("dont have any followers to unfollow"));
      return;
    } else {
      const userNotFollowing = await prismaClient.userFollowers.findFirst({
        where: {
          userId: customRequest.user.id,
          userFollowers: {
            none: {
              id: userExist.id,
            },
          },
        },
      });

      if (userNotFollowing) {
        // TODO: throw an error
        // throw new Error("user not following");
        next(new NotFoundError("the user is not following you"));
        return;
      } else {
        await prismaClient.user.update({
          where: {
            id: customRequest.user.id,
          },
          data: {
            followers: {
              disconnect: {
                id: userExist.id,
              },
            },
          },
        });
      }

      res.status(ResponseStatusCodeEnum.OK).json({
        status: ResponseStatusSignalEnum.SUCCESS,
        payload: "user follower unfollowed",
      });
    }
  }
}

export default FollowingController;
