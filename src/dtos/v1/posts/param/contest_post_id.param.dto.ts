import { ParamsDictionary } from "express-serve-static-core";

export interface ContestPostIdParamDto extends ParamsDictionary {
  contesId: number;
  postId: number;
}
