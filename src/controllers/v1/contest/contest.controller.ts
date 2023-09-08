import { Request, Response, NextFunction } from "express";
import {
  ContestControllerInterface,
  ContestControllerResponseInterface,
} from "../../../interfaces/v1/contest";
import { SearchAndPaginationQueryDto } from "../../../dtos/v1/query";
import { UserLoggedInRequest, prismaClient } from "../../../utils/v1";
import {
  ContestBodyDto,
  GetContestPostQuery,
  UserContestIdParamDto,
} from "../../../dtos/v1/contest";
import { Contest } from "@prisma/client";
import {
  ResponseStatusCodeEnum,
  ResponseStatusSignalEnum,
} from "../../../enums/v1";
import { IdParamDto } from "../../../dtos/v1/param";
import {
  BadRequestError,
  ForbiddenError,
  InvalidRequestError,
  NotFoundError,
} from "../../../classes/error";

class ContestController implements ContestControllerInterface {
  async adminGetAllContests(
    req: Request<{}, any, any, GetContestPostQuery, Record<string, any>>,
    res: Response<
      ContestControllerResponseInterface.GetAllContest,
      Record<string, any>
    >,
    next: NextFunction
  ): Promise<void> {
    const { page, perPage, isOngoing, isAllowingEntry } = req.query;

    const offSet = (page - 1) * perPage;

    let contests: Contest[] = [];
    let isBoolean: boolean;
    if (isOngoing && !isAllowingEntry) {
      isBoolean = JSON.parse(isOngoing) as boolean;
      contests = await prismaClient.contest.findMany({
        where: {
          isCompetitionOn: isBoolean,
          isOpenForEntry: false,
        },
        take: perPage,
        skip: offSet,
        include: {
          contestants: true,
          contestPosts: true,
        },
      });
    } else if (isAllowingEntry && !isOngoing) {
      isBoolean = JSON.parse(isAllowingEntry) as boolean;
      contests = await prismaClient.contest.findMany({
        where: {
          isCompetitionOn: false,
          isOpenForEntry: isBoolean,
        },
        take: perPage,
        skip: offSet,
        include: {
          contestants: {
            include: {
              user: true,
            },
          },
          contestPosts: true,
        },
      });
    } else {
      contests = await prismaClient.contest.findMany({
        where: {},
        take: perPage,
        skip: offSet,
        include: {
          contestants: true,
          contestPosts: true,
        },
      });
    }

    res.status(ResponseStatusCodeEnum.OK).json({
      status: ResponseStatusSignalEnum.SUCCESS,
      payload: contests,
    });
  }
  async adminCreateAContest(
    req: Request<{}, any, ContestBodyDto, {}, Record<string, any>>,
    res: Response<
      ContestControllerResponseInterface.updateAndCreateContest,
      Record<string, any>
    >,
    next: NextFunction
  ): Promise<void> {
    const {
      category,
      endDate,
      maxContestant,
      name,
      noFreeWildCards,
      prize,
      startDate,
    } = req.body;

    const startDateMilliSeconds = startDate.getTime();
    const endDateMilliSeconds = endDate.getTime();

    if (startDateMilliSeconds > endDateMilliSeconds) {
      next(new BadRequestError("start date is greater than the end date"));
      return;
    }

    const expirationDuration =
      (endDateMilliSeconds - startDateMilliSeconds) * 1000;

    const newContest = await prismaClient.contest.create({
      data: {
        name,
        category,
        endDate,
        startDate,
        prize,
        maxContestant,
        noFreeWildCards,
        durationExpiration: String(expirationDuration),
      },
    });

    res.status(ResponseStatusCodeEnum.CREATED).json({
      status: ResponseStatusSignalEnum.SUCCESS,
      payload: newContest,
    });
  }
  async adminUpdateContest(
    req: Request<IdParamDto, any, ContestBodyDto, {}, Record<string, any>>,
    res: Response<
      ContestControllerResponseInterface.updateAndCreateContest,
      Record<string, any>
    >,
    next: NextFunction
  ): Promise<void> {
    const { id: contestId } = req.params;
    const {
      category,
      endDate,
      maxContestant,
      name,
      noFreeWildCards,
      prize,
      startDate,
    } = req.body;

    const contest = await prismaClient.contest.findUnique({
      where: {
        id: contestId,
      },
    });

    if (!contest) {
      next(new NotFoundError("contest not found"));
      return;
    }

    const isCompetitionOn = contest.isCompetitionOn;

    const startDateMilliSeconds = startDate.getTime();
    const endDateMilliSeconds = endDate.getTime();

    if (startDateMilliSeconds > endDateMilliSeconds) {
      next(new BadRequestError("start date is greater than the end date"));
      return;
    }

    const durationExpiration = (endDate.getTime() - startDate.getTime()) * 1000;

    const updatedContest = await prismaClient.contest.update({
      where: {
        id: contestId,
      },
      data: {
        category: !isCompetitionOn && category ? category : contest.category,
        name: !isCompetitionOn && name ? name : contest.name,
        startDate,
        endDate,
        durationExpiration: String(durationExpiration),
        prize: !isCompetitionOn && prize ? prize : contest.prize,
        noFreeWildCards:
          !isCompetitionOn && noFreeWildCards
            ? noFreeWildCards
            : contest.noFreeWildCards,
        maxContestant:
          !isCompetitionOn && maxContestant
            ? maxContestant
            : contest.maxContestant,
      },
    });

    res.status(ResponseStatusCodeEnum.OK).json({
      status: ResponseStatusSignalEnum.SUCCESS,
      payload: updatedContest,
    });
  }
  async adminDeleteContest(
    req: Request<IdParamDto, any, any, {}, Record<string, any>>,
    res: Response<
      ContestControllerResponseInterface.deleteAndRemoveContest,
      Record<string, any>
    >,
    next: NextFunction
  ): Promise<void> {
    const { id: contestId } = req.params;
    const contest = await prismaClient.contest.findUnique({
      where: {
        id: contestId,
      },
    });

    if (!contest) {
      next(new NotFoundError("contest not found"));
      return;
    }

    await prismaClient.contest.delete({
      where: {
        id: contestId,
      },
    });

    res.status(ResponseStatusCodeEnum.OK).json({
      status: ResponseStatusSignalEnum.SUCCESS,
      payload: "contest deleted",
    });
  }
  async userJoiningAContest(
    req: Request<IdParamDto, any, any, {}, Record<string, any>>,
    res: Response<
      ContestControllerResponseInterface.joinContest,
      Record<string, any>
    >,
    next: NextFunction
  ): Promise<void> {
    const { id: contestId } = req.params;
    const customRequest = req as UserLoggedInRequest;

    const contest = await prismaClient.contest.findUnique({
      where: {
        id: contestId,
      },
    });

    if (!contest) {
      next(new NotFoundError("contest not found"));
      return;
    }

    if (!contest.isOpenForEntry) {
      next(new ForbiddenError("cannot join since the contest is ongoing"));
      return;
    }

    const hasUserAlreadyJoined = await prismaClient.contestant.findFirst({
      where: {
        contestId,
        userId: customRequest.user.id,
      },
    });

    if (hasUserAlreadyJoined) {
      next(
        new InvalidRequestError(
          "you have already joined the contest as a contestant"
        )
      );
      return;
    }

    const newContestant = await prismaClient.contestant.create({
      data: {
        userId: customRequest.user.id,
        contestId,
      },
    });

    res.status(ResponseStatusCodeEnum.OK).json({
      status: ResponseStatusSignalEnum.SUCCESS,
      payload: newContestant,
    });
  }
  async userGettingAllJoinedContest(
    req: Request<
      {},
      any,
      any,
      SearchAndPaginationQueryDto,
      Record<string, any>
    >,
    res: Response<
      ContestControllerResponseInterface.GetAllContest,
      Record<string, any>
    >,
    next: NextFunction
  ): Promise<void> {
    const { page, perPage } = req.query;
    const offSet = (page - 1) * perPage;
    const customRequest = req as UserLoggedInRequest;
    let joinedContests;
    joinedContests = await prismaClient.contest.findMany({
      where: {
        contestants: {
          every: {
            userId: customRequest.user.id,
          },
        },
      },
      skip: offSet,
      take: perPage,
      include: {
        contestants: true,
        contestPosts: true,
      },
    });

    res.status(ResponseStatusCodeEnum.OK).json({
      status: ResponseStatusSignalEnum.SUCCESS,
      payload: joinedContests,
    });
  }
  async adminRemoveContestantFromContest(
    req: Request<UserContestIdParamDto, any, any, {}, Record<string, any>>,
    res: Response<
      ContestControllerResponseInterface.deleteAndRemoveContest,
      Record<string, any>
    >,
    next: NextFunction
  ): Promise<void> {
    const { contestId, userId } = req.params;

    const contest = await prismaClient.contest.findUnique({
      where: {
        id: contestId,
      },
    });

    if (!contest) {
      next(new NotFoundError("contest not found"));
      return;
    }

    const user = await prismaClient.user.findUnique({
      where: {
        id: userId,
      },
    });

    if (!user) {
      next(new NotFoundError("user not found"));
      return;
    }

    const isUserAContestantForTheContest =
      await prismaClient.contestant.findFirst({
        where: {
          contestId,
          userId: user.id,
        },
      });

    if (!isUserAContestantForTheContest) {
      next(new InvalidRequestError("user is not part of the contest"));
      return;
    }

    await prismaClient.userPosts.deleteMany({
      where: {
        userId: user.id,
      },
    });

    await prismaClient.contestant.delete({
      where: {
        id: isUserAContestantForTheContest.id,
      },
    });

    res.status(ResponseStatusCodeEnum.OK).json({
      status: ResponseStatusSignalEnum.SUCCESS,
      payload: "contestant removed from the contest successfully!",
    });
  }
}

export default ContestController;
