import { ParamsDictionary } from "express-serve-static-core";

export interface SearchQueryDto extends ParamsDictionary {
  search: string;
}
