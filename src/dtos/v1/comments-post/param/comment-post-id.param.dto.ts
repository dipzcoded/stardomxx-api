import { ParamsDictionary } from "express-serve-static-core";
export interface CommentPostIdDto extends ParamsDictionary {
  postId: number;
  commentId: number;
}
