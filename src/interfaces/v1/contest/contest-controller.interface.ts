import { Request, Response, NextFunction } from "express";

export interface ContestControllerInterface {
  getAllContests(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void>;
  adminCreateAContest(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void>;
  adminUpdateContest(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void>;
  adminDeleteContest(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void>;
  userJoiningAContest(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void>;
  userGettingAllJoinedContest(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void>;
  adminRemoveContestantFromContest(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void>;
}
