import { ParamsDictionary } from "express-serve-static-core";

export interface VoteContestantIdParamDto extends ParamsDictionary {
  contestId: number;
  userId: number;
}
