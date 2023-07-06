import { RolesEnum } from "../../enums/v1";

export type JwtPayloadFormatType = {
  id: string;
  email: string;
  role: RolesEnum;
};
