import { Request, Response, NextFunction } from "express";
import jwt, {
  JsonWebTokenError,
  NotBeforeError,
  TokenExpiredError,
} from "jsonwebtoken";
import { ForbiddenError, InvalidRequestError } from "../../../classes/error";
import { JwtPayloadFormatType } from "../../../types/v1";

declare global {
  namespace Express {
    interface Request {
      user?: JwtPayloadFormatType;
    }
  }
}

export default (req: Request, res: Response, next: NextFunction) => {
  let token: string;
  if (
    req.headers["authorization"] &&
    req.headers["authorization"]?.startsWith("Bearer")
  ) {
    token = req.headers["authorization"].split(" ")[1];

    try {
      const payload = jwt.verify(
        token,
        process.env.JWT_SECRET!
      ) as JwtPayloadFormatType;
      req.user = payload;
      next();
    } catch (error) {
      if (error instanceof TokenExpiredError) {
        throw new InvalidRequestError("Authorization is Invalid");
      }

      if (error instanceof JsonWebTokenError) {
        throw new InvalidRequestError("Authorization is Invalid");
      }

      if (error instanceof NotBeforeError) {
        throw new InvalidRequestError("Authorization is Invalid");
      }
    }
  } else {
    throw new ForbiddenError("No Bearer token passed!");
  }
};
