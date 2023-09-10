import { Request, Response, NextFunction } from "express";
import {
  VoteResponseControllerInterface,
  VotesControllerInterface,
} from "../../../interfaces/v1/votes";

import { UserLoggedInRequest, prismaClient } from "../../../utils/v1";
import {
  ForbiddenError,
  InvalidRequestError,
  NotFoundError,
} from "../../../classes/error";
import {
  ResponseStatusCodeEnum,
  ResponseStatusSignalEnum,
} from "../../../enums/v1";
import {
  VoteContestPostIdParamDto,
  VoteContestantIdParamDto,
} from "../../../dtos/v1/votes";

class VoteController implements VotesControllerInterface {
  async getPostVoteCounts(
    req: Request<VoteContestPostIdParamDto, any, any, {}, Record<string, any>>,
    res: Response<
      VoteResponseControllerInterface.voteResponse,
      Record<string, any>
    >,
    next: NextFunction
  ): Promise<void> {
    const { contestId, postId } = req.params;

    const contestFound = await prismaClient.contest.findUnique({
      where: {
        id: contestId,
      },
    });

    if (!contestFound) {
      next(new NotFoundError("contest not found"));
      return;
    }

    const isContestPost = await prismaClient.userPosts.findFirst({
      where: {
        id: postId,
        isContestPost: true,
        contestId,
      },
    });

    if (!isContestPost) {
      next(new NotFoundError("post not found"));
      return;
    }

    const contestPostVoteCounts = await prismaClient.contestPostVote.count({
      where: {
        contestPostId: isContestPost.id,
      },
    });

    res.status(ResponseStatusCodeEnum.OK).json({
      status: ResponseStatusSignalEnum.SUCCESS,
      payload: contestPostVoteCounts,
    });
  }
  async getContestantVoteCounts(
    req: Request<VoteContestantIdParamDto, any, any, {}, Record<string, any>>,
    res: Response<
      VoteResponseControllerInterface.voteResponse,
      Record<string, any>
    >,
    next: NextFunction
  ): Promise<void> {
    const { contestId, userId } = req.params;

    const contestFound = await prismaClient.contest.findUnique({
      where: {
        id: contestId,
      },
    });

    if (!contestFound) {
      next(new NotFoundError("contest not found"));
      return;
    }

    const contestant = await prismaClient.contestant.findFirst({
      where: {
        contestId,
        userId,
      },
    });

    if (!contestant) {
      next(new NotFoundError("User not a contestant of the contest"));
      return;
    }

    const voteContestantCount = await prismaClient.contestantVote.count({
      where: {
        contestantId: contestant.id,
      },
    });

    res.status(ResponseStatusCodeEnum.OK).json({
      status: ResponseStatusSignalEnum.SUCCESS,
      payload: voteContestantCount,
    });
  }
  async voteForAContestPost(
    req: Request<VoteContestPostIdParamDto, any, any, {}, Record<string, any>>,
    res: Response<
      VoteResponseControllerInterface.voteResponse,
      Record<string, any>
    >,
    next: NextFunction
  ): Promise<void> {
    const { postId, contestId } = req.params;

    const customRequest = req as UserLoggedInRequest;

    const contestFound = await prismaClient.contest.findUnique({
      where: {
        id: contestId,
      },
    });

    if (!contestFound) {
      next(new NotFoundError("contest not found"));
      return;
    }

    const contestPost = await prismaClient.userPosts.findFirst({
      where: {
        id: postId,
        contestId,
        isContestPost: true,
      },
    });

    if (!contestPost) {
      next(new NotFoundError("post not found"));
      return;
    }

    if (contestPost.userId === customRequest.user.id) {
      next(new ForbiddenError("cannot vote on your post"));
      return;
    }

    const isPostAlreadyVotedByUser =
      await prismaClient.contestPostVote.findFirst({
        where: {
          userId: customRequest.user.id,
          contestPostId: contestPost.id,
        },
      });

    if (isPostAlreadyVotedByUser) {
      next(new InvalidRequestError("post is already voted by user"));
      return;
    }

    const newVote = await prismaClient.contestPostVote.create({
      data: {
        contestPostId: contestPost.id,
        userId: customRequest.user.id,
      },
    });

    res.status(ResponseStatusCodeEnum.OK).json({
      status: ResponseStatusSignalEnum.SUCCESS,
      payload: newVote,
    });
  }
  async voteForContestant(
    req: Request<VoteContestantIdParamDto, any, any, {}, Record<string, any>>,
    res: Response<
      VoteResponseControllerInterface.voteResponse,
      Record<string, any>
    >,
    next: NextFunction
  ): Promise<void> {
    const { contestId, userId } = req.params;

    const customRequest = req as UserLoggedInRequest;

    const contestFound = await prismaClient.contest.findUnique({
      where: {
        id: contestId,
      },
    });

    if (!contestFound) {
      next(new NotFoundError("contest not found"));
      return;
    }

    const contestant = await prismaClient.contestant.findFirst({
      where: {
        contestId,
        userId,
      },
    });

    if (!contestant) {
      next(new NotFoundError("User not a contestant of the contest"));
      return;
    }

    if (customRequest.user.id === userId) {
      next(new ForbiddenError("cannot vote on yourself"));
      return;
    }

    const isContestantAlreadyVoted =
      await prismaClient.contestantVote.findFirst({
        where: {
          userId: customRequest.user.id,
          contestantId: userId,
          contestant: {
            contestId,
          },
        },
      });

    if (isContestantAlreadyVoted) {
      next(new InvalidRequestError("contestant is already voted"));
      return;
    }

    const newVote = await prismaClient.contestantVote.create({
      data: {
        contestantId: userId,
        userId: customRequest.user.id,
      },
    });

    res.status(ResponseStatusCodeEnum.OK).json({
      status: ResponseStatusSignalEnum.SUCCESS,
      payload: newVote,
    });
  }
}

export default VoteController;
