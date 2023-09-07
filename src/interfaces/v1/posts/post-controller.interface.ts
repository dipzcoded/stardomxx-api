import { Request, Response, NextFunction } from "express";

export interface PostControllerInterface {
  getYourPostContents(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void>;
  getFollowingContents(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void>;
  postImageContent(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void>;
  postVideoContent(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void>;
  postTextContent(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void>;
  deleteYourPostContent(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void>;
  postVideoForContest(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void>;
  getOnGoingContestPost(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void>;
}
