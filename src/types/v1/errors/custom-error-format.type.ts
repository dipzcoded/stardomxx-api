import { ResponseStatusSignalEnum } from "../../../enums/v1";

export type CustomErrorFormatType = {
  status: ResponseStatusSignalEnum;
  errors: { message: string; field?: string }[];
};
