import { z } from 'zod';

/**
 * Schema for application metadata
 * Defines basic information about the generated application
 */
export const MetadataSchema = z.object({
  name: z
    .string()
    .min(1)
    .regex(/^[A-Z][a-zA-Z0-9]*$/, 'Name must be in PascalCase'),
  domain: z
    .string()
    .min(1)
    .regex(/^[a-z][a-z0-9-]*$/, 'Domain must be in kebab-case'),
  locale: z
    .string()
    .regex(/^[a-z]{2}-[A-Z]{2}$/, 'Locale must be in format: xx-XX (e.g., en-US)'),
  version: z.string().optional(),
  description: z.string().optional(),
});

export type Metadata = z.infer<typeof MetadataSchema>;

