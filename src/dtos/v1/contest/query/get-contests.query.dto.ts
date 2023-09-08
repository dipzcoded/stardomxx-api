import { ParsedQs } from "qs";

export interface GetContestPostQuery extends ParsedQs {
  page: number;
  perPage: number;
  search?: string;
  isOngoing?: string;
  isAllowingEntry?: string;
  category?: string;
}
