import { ParamsDictionary } from "express-serve-static-core";

export interface UserContestIdParamDto extends ParamsDictionary {
  userId: number;
  contestId: number;
}
