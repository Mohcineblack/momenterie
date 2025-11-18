import { z } from 'zod';

/**
 * Product query parameters validation
 */
export const productQuerySchema = z.object({
  page: z.coerce.number().min(1).default(1),
  pageSize: z.coerce.number().min(1).max(100).default(12),
  category: z.string().optional(),
  search: z.string().optional(),
  minPrice: z.coerce.number().min(0).optional(),
  maxPrice: z.coerce.number().min(0).optional(),
  featured: z.coerce.boolean().optional(),
  bestseller: z.coerce.boolean().optional(),
  sortBy: z.enum(['price-asc', 'price-desc', 'name-asc', 'name-desc', 'newest', 'popular']).default('newest'),
});

export type ProductQuery = z.infer<typeof productQuerySchema>;

/**
 * Product ID validation
 */
export const productIdSchema = z.object({
  id: z.string(),
});

/**
 * Search query validation
 */
export const searchQuerySchema = z.object({
  q: z.string().min(1),
  limit: z.coerce.number().min(1).max(50).default(10),
});

export type SearchQuery = z.infer<typeof searchQuerySchema>;
