import { RolesEnum } from "../../enums/v1";

export type JwtPayloadFormatType = {
  id: number;
  email: string;
  role: RolesEnum;
};
