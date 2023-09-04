import { NextFunction, Response, Request } from "express";

export interface FollowingControllerInterface {
  followUser(req: Request, res: Response, next: NextFunction): Promise<void>;
  unfollowFollower(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void>;
  unFollowFollowing(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void>;
}
