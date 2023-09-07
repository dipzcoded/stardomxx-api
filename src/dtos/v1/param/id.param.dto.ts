import { ParamsDictionary } from "express-serve-static-core";

export interface IdParamDto extends ParamsDictionary {
  id: number;
}
