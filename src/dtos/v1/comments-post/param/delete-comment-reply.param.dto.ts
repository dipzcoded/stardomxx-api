import { ParamsDictionary } from "express-serve-static-core";

export interface DeleteCommentReplyId extends ParamsDictionary {
  commentReplyId: number;
  commentId: number;
}
