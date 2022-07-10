import PromotionAttrs from './promotion-attrs';

// Describes the properties of a paginated data response
export default interface PaginatedResults {
  limit: number;
  total: number;
  pages: number;
  nextPage?: number;
  previousPage?: number;
  results: PromotionAttrs[];
}
