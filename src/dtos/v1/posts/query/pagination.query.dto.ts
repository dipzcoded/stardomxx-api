import { ParsedQs } from "qs";
export interface PostPaginationQueryDTO extends ParsedQs {
  page: number;
  perPage: number;
}
