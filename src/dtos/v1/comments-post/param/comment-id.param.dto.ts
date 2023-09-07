import { ParamsDictionary } from "express-serve-static-core";
export interface CommentIdParamDto extends ParamsDictionary {
  commentId: number;
}
