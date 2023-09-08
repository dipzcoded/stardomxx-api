import { ParsedQs } from "qs";
export interface GetOwnContentPostQueryDto extends ParsedQs {
  page: number;
  perPage: number;
  search?: string;
  findContestPost?: string;
}
