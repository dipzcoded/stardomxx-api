import { ResponseStatusSignalEnum } from "../../../enums/v1";

export interface FollowingResponse {
  status: ResponseStatusSignalEnum;
  payload: string;
}
