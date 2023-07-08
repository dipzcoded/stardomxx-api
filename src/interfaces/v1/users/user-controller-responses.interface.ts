import { User } from "@prisma/client";
import { ResponseStatusSignalEnum } from "../../../enums/v1";

export interface UserResponse {
  status: ResponseStatusSignalEnum;
  payload: string;
}

export interface GetCurrentLoggedinUserResponse {
  status: ResponseStatusSignalEnum;
  payload: User;
}
