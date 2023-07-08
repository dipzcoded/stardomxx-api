import { JwtPayloadFormatType } from "../../types/v1";
import { Request } from "express";

// Declare the extended interface with your custom variable
export interface UserLoggedInRequest extends Request {
  user: JwtPayloadFormatType;
}
