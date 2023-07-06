import { NextFunction, Request, Response } from "express";
import { PreRegisterAccountWithEmailResponse } from "./user-controller-responses.interface";

export interface UserControllerInterface {
  preRegisterAccountWithEmail(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void>;
  completeUserRegistration(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void>;
  login(req: Request, res: Response, next: NextFunction): Promise<void>;
  activateAccountWithOtp(
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
}
