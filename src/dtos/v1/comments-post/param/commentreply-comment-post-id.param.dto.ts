import { ParamsDictionary } from "express-serve-static-core";

export interface CommentReplyCommentPostIdDto extends ParamsDictionary {
  postId: number;
  commentId: number;
  commentReplyId: number
}
