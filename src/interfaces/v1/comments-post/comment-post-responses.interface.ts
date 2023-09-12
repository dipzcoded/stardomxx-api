import { UserPostComment, UserPostCommentReply } from "@prisma/client";
import { ResponseStatusSignalEnum } from "../../../enums/v1";

export interface getPostComments {
  status: ResponseStatusSignalEnum;
  resultLength: number;
  payload: UserPostComment[];
}

export interface getCommentReplies {
  status: ResponseStatusSignalEnum;
  resultLength: number;
  payload: UserPostCommentReply[];
}

export interface createAndUpdatePostComment {
  status: ResponseStatusSignalEnum;
  payload: UserPostComment;
}

export interface deletePostCommentAndReplyComment {
  status: ResponseStatusSignalEnum;
  payload: string;
}

export interface replyToComment {
  status: ResponseStatusSignalEnum;
  payload: UserPostCommentReply;
}
