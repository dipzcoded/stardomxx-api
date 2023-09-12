import { UserPosts } from "@prisma/client";
import { ResponseStatusSignalEnum } from "../../../enums/v1";
export interface getPostContent {
  status: ResponseStatusSignalEnum;
  resultLength: number;
  payload: UserPosts[];
}
export interface postContent {
  status: ResponseStatusSignalEnum;
  payload: UserPosts;
}

export interface deleteYourPostContent {
  status: ResponseStatusSignalEnum;
  payload: string;
}
