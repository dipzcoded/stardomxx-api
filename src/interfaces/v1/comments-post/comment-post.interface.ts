import { Request, Response, NextFunction } from "express";

export interface CommentPostControllerInterface {
  getYourAllCommentsOnPosts(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void>;

  getCommentsByPostId(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void>;

  createCommentOnPost(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void>;

  createCommentOnAComment(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void>;

  updateCommentByUserOnPost(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void>;

  deleteCommentOnPost(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void>;

  deleteReplyOnComment(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void>;
}
