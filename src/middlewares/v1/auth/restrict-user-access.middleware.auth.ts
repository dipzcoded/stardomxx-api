import { Request, Response, NextFunction } from "express";
import { ForbiddenError } from "../../../classes/error";
import { RolesEnum } from "../../../enums/v1";
export default (userRoles: RolesEnum[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!userRoles.includes(req.user!.role)) {
      throw new ForbiddenError("Forbidden Resource Access");
    }
    next();
  };
};
