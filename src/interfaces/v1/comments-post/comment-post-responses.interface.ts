import { UserPostComment, UserPostCommentReply } from "@prisma/client";
import { ResponseStatusSignalEnum } from "../../../enums/v1";

export interface getPostComments {
  status: ResponseStatusSignalEnum;
  payload: UserPostComment[];
}

export interface createAndUpdatePostComment {
  status: ResponseStatusSignalEnum;
  payload: UserPostComment;
}

export interface deletePostComment {
  status: ResponseStatusSignalEnum;
  payload: string;
}

export interface replyToComment {
  status: ResponseStatusSignalEnum;
  payload: UserPostCommentReply;
}
