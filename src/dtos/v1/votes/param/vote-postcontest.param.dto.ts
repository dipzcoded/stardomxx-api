import { ParamsDictionary } from "express-serve-static-core";

export interface VoteContestPostIdParamDto extends ParamsDictionary {
  contestId: number;
  postId: number;
}
