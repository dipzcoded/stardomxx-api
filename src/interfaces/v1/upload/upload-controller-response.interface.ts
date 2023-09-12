import { ResponseStatusSignalEnum } from "../../../enums/v1";

export interface UploadResponseInterface {
  status: ResponseStatusSignalEnum;
  payload: string;
}
