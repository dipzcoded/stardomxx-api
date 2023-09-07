import { ParsedQs } from "qs";
export interface QueryPaginationDTO extends ParsedQs {
  page: number;
  perPage: number;
}
