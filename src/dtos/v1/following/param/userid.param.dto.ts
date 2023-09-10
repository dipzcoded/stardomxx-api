import { ParamsDictionary } from 'express-serve-static-core'
export interface UserIdParamDTO  extends ParamsDictionary{
  userId: number;
}
