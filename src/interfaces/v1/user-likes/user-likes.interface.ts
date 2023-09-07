import { Request, Response, NextFunction } from "express";

export interface UserLikesPostAndCommentControllerInterface {
  userGetLikesPost(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void>;
  getPostLikesCount(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void>;
  getPostCommentLikesCount(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void>;
  getPostCommentReplyLikeCount(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void>;
  likePost(req: Request, res: Response, next: NextFunction): Promise<void>;
  unlikePost(req: Request, res: Response, next: NextFunction): Promise<void>;
  likeComment(req: Request, res: Response, next: NextFunction): Promise<void>;
  unlikeComment(req: Request, res: Response, next: NextFunction): Promise<void>;
  likeCommentReply(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void>;
  unlikeCommentReply(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void>;
}
