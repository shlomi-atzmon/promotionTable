import PromotionAttrs from './promotion-attrs';

// Describes the properties of a paginated data response
export default interface PaginatedResults {
  info: {
    limit: number;
    total?: number;
    nextPage?: number;
    previousPage?: number;
  };
  results: PromotionAttrs[];
}
