import { NextFunction, Request, Response } from "express";

export interface UploadControllerInterface {
  uploadImages(req: Request, res: Response, next: NextFunction): Promise<void>;
  uploadVideos(req: Request, res: Response, next: NextFunction): Promise<void>;
}
