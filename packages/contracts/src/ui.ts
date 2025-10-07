import { z } from 'zod';

/**
 * Schema for UI configuration
 * Defines the frontend structure and components
 */
export const UISchema = z.object({
  routes: z
    .array(z.string().regex(/^\/[a-z0-9/:_-]*$/i, 'Invalid route format'))
    .min(1, 'At least one route is required'),
  components: z
    .array(
      z.string().regex(/^[A-Z][a-zA-Z0-9]*$/, 'Component name must be in PascalCase')
    )
    .min(1, 'At least one component is required'),
  theme: z.string().optional(),
  layout: z.string().optional(),
});

export type UI = z.infer<typeof UISchema>;

