import { ParsedQs } from "qs";

export interface SearchAndPaginationQueryDto extends ParsedQs {
  page: number;
  perPage: number;
  search?: string;
}
