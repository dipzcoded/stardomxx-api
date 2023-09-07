import { ParamsDictionary } from "express-serve-static-core";
export interface PostIdParamDto extends ParamsDictionary {
  postId: number;
}
