import { NextFunction, Request, Response } from "express";

export interface ProfileControllerInterface {
  getUserProfile(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void>;
  createProfile(req: Request, res: Response, next: NextFunction): Promise<void>;
  updateProfile(req: Request, res: Response, next: NextFunction): Promise<void>;
  addPassportImage(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void>;
  addNextOfKin(req: Request, res: Response, next: NextFunction): Promise<void>;
  addEmergencyOfContact(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void>;
}
