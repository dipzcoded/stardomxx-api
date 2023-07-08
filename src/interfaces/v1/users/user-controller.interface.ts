import { NextFunction, Request, Response } from "express";
import { UserLoggedInRequest } from "../../../utils/v1";

export interface UserControllerInterface {
  init(req: Request, res: Response, next: NextFunction): Promise<void>;
  registration(req: Request, res: Response, next: NextFunction): Promise<void>;
  login(req: Request, res: Response, next: NextFunction): Promise<void>;
  activateAccountWithToken(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void>;
  forgotPassword(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void>;
  resetPassword(req: Request, res: Response, next: NextFunction): Promise<void>;
  getCurrentLoggedInUser(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void>;
}
