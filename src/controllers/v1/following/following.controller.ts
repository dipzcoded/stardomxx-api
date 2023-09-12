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
      next(new NotFoundError("user not found"));
      return;
    }

    if (userExist.id === customRequest.user.id) {
      next(new ForbiddenError("cannot perform this action"));
      return;
    }

    const userFollowing = await prismaClient.userFollowing.findMany({
      where: {
        userId: customRequest.user.id,
      },
    });

    if (!userFollowing.length) {
      next(new BadRequestError("you dont have followers yet"));
      return;
    } else {
      const userFollowing = await prismaClient.userFollowing.findFirst({
        where: {
          userId: customRequest.user.id,
          userFollowing: {
            some: {
              id: userExist.id,
            },
          },
        },
      });

      if (!userFollowing) {
        next(new InvalidRequestError("you are not folllowing the user"));
        return;
      } else {
        const userHaveFollowers = await prismaClient.userFollowers.findFirst({
          where: {
            userId: userExist.id,
          },
        });

        if (!userHaveFollowers) {
          next(new NotFoundError("user does not have any Followers"));
          return;
        }

        await prismaClient.userFollowing.update({
          where: {
            id: userFollowing.id,
          },
          data: {
            userFollowing: {
              disconnect: {
                id: userExist.id,
              },
            },
          },
        });
        await prismaClient.userFollowers.update({
          where: {
            id: userHaveFollowers.id,
          },
          data: {
            userFollowers: {
              disconnect: {
                id: customRequest.user.id,
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
      next(new NotFoundError("user does not exist"));
      return;
    }

    if (userExist.id === customRequest.user.id) {
      next(new InvalidRequestError("cannot follow yourself"));
      return;
    }
    // checking if user have any followers
    const userFollowingCounts = await prismaClient.userFollowing.count({
      where: {
        userId: customRequest.user.id,
      },
    });

    const userFollowing2Counts = await prismaClient.userFollowers.count({
      where: {
        userId: userExist.id,
      },
    });

    if (!userFollowingCounts && !userFollowing2Counts) {
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
      const userHaveFollowing = await prismaClient.userFollowing.findFirst({
        where: {
          userId: customRequest.user.id,
        },
      });

      if (userHaveFollowing) {
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
          next(new InvalidRequestError("user already followed"));
          return;
        } else {
          const userHaveFollowers = await prismaClient.userFollowers.findFirst({
            where: {
              userId: userExist.id,
            },
          });

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

          userHaveFollowers
            ? await prismaClient.userFollowers.update({
                where: {
                  id: userHaveFollowers.id,
                },
                data: {
                  userFollowers: {
                    connect: {
                      id: customRequest.user.id,
                    },
                  },
                },
              })
            : await prismaClient.userFollowers.create({
                data: {
                  userId: userExist.id,
                  userFollowers: {
                    connect: {
                      id: customRequest.user.id,
                    },
                  },
                },
              });
        }
      } else {
        const userHaveFollower = await prismaClient.userFollowers.findFirst({
          where: {
            userId: userExist.id,
            userFollowers: {
              none: {
                id: customRequest.user.id,
              },
            },
          },
        });

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

        if (userHaveFollower) {
          await prismaClient.userFollowers.update({
            where: {
              id: userHaveFollower.id,
            },
            data: {
              userFollowers: {
                connect: {
                  id: customRequest.user.id,
                },
              },
            },
          });
        }
      }
    }

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

    const userExist = await prismaClient.user.findUnique({
      where: {
        id: Number(userId),
      },
    });
    if (!userExist) {
      next(new NotFoundError("user not found"));
      return;
    }

    if (userExist.id === customRequest.user.id) {
      next(new ForbiddenError("cannot perform this action"));
      return;
    }
    // checking if user have any followers
    const userFollowersCount = await prismaClient.userFollowers.count({
      where: {
        userId: customRequest.user.id,
      },
    });

    if (!userFollowersCount) {
      next(new NotFoundError("dont have any followers to unfollow"));
      return;
    } else {
      const userNotFollowing = await prismaClient.userFollowers.findFirst({
        where: {
          userId: customRequest.user.id,
          userFollowers: {
            some: {
              id: userExist.id,
            },
          },
        },
      });

      if (!userNotFollowing) {
        next(new NotFoundError("the user is not following you"));
        return;
      } else {
        const userFollowing = await prismaClient.userFollowing.findFirst({
          where: {
            userId: userExist.id,
          },
        });

        if (!userFollowing) {
          next(new NotFoundError("user does not have any following"));
          return;
        }

        await prismaClient.userFollowers.update({
          where: {
            id: userNotFollowing.id,
          },
          data: {
            userFollowers: {
              disconnect: {
                id: userExist.id,
              },
            },
          },
        });

        await prismaClient.userFollowing.update({
          where: {
            id: userFollowing.id,
          },
          data: {
            userFollowing: {
              disconnect: {
                id: customRequest.user.id,
              },
            },
          },
        });
      }

      res.status(ResponseStatusCodeEnum.OK).json({
        status: ResponseStatusSignalEnum.SUCCESS,
        payload: "user follower removed",
      });
    }
  }
}

export default FollowingController;
