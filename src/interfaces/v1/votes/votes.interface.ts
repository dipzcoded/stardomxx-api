import { Request, Response, NextFunction } from "express";
export interface VotesControllerInterface {
  getPostVoteCounts(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void>;
  getContestantVoteCounts(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void>;
  voteForAContestPost(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void>;

  voteForContestant(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void>;
}
