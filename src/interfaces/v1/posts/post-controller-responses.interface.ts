import { UserPosts } from "@prisma/client";
import { ResponseStatusSignalEnum } from "../../../enums/v1";
export interface getYourPostContents {
  status: ResponseStatusSignalEnum;
  payload: UserPosts[];
}

export interface getFollowingContents {
  status: ResponseStatusSignalEnum;
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
