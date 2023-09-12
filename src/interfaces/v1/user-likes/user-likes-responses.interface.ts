import {
  UserPostLikes,
  UserPostCommentLikes,
  UserPostCommentReplyLikes,
} from "@prisma/client";
import { ResponseStatusSignalEnum } from "../../../enums/v1";

export interface getPostCountLikes {
  status: ResponseStatusSignalEnum;
  payload: number;
}

export interface getPostLikes {
  status: ResponseStatusSignalEnum;
  resultLength: number;
  payload: UserPostLikes[];
}

export interface getCommentLikes {
  status: ResponseStatusSignalEnum;
  payload: number;
}

export interface getCommentReplyLikes {
  status: ResponseStatusSignalEnum;
  payload: number;
}

export interface getLikesCount {
  status: ResponseStatusSignalEnum;
  payload: number;
}

export interface likePost {
  status: ResponseStatusSignalEnum;
  payload: UserPostLikes;
}

export interface likeComment {
  status: ResponseStatusSignalEnum;
  payload: UserPostCommentLikes;
}

export interface likeCommentReply {
  status: ResponseStatusSignalEnum;
  payload: UserPostCommentReplyLikes;
}

export interface unLikePostAndComment {
  status: ResponseStatusSignalEnum;
  payload: string;
}
