import { Request, Response, NextFunction } from "express";
import { ForbiddenError } from "../../../classes/error";
import { RolesEnum } from "../../../enums/v1";
import { UserLoggedInRequest } from "../../../utils/v1";
export default (userRoles: RolesEnum[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const customRequest = req as UserLoggedInRequest;
    if (!Object.values(userRoles).includes(customRequest.user.role)) {
      throw new ForbiddenError("Forbidden Resource Access");
    }
    next();
  };
};
