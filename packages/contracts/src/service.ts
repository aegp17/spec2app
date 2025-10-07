import { z } from 'zod';

/**
 * HTTP methods supported for service operations
 */
export const HTTPMethodSchema = z.enum(['GET', 'POST', 'PUT', 'PATCH', 'DELETE']);

export type HTTPMethod = z.infer<typeof HTTPMethodSchema>;

/**
 * Schema for service operations
 * Represents an API endpoint operation
 */
export const OperationSchema = z.object({
  name: z
    .string()
    .min(1)
    .regex(/^[a-z][a-zA-Z0-9]*$/, 'Operation name must be in camelCase'),
  description: z.string().optional(),
  input: z.string().min(1, 'Input type is required'),
  output: z.string().min(1, 'Output type is required'),
  method: HTTPMethodSchema,
  path: z.string().optional(),
});

export type Operation = z.infer<typeof OperationSchema>;

/**
 * Schema for services
 * Represents a service that groups related operations
 */
export const ServiceSchema = z.object({
  name: z
    .string()
    .min(1)
    .regex(/^[A-Z][a-zA-Z0-9]*$/, 'Service name must be in PascalCase'),
  description: z.string().optional(),
  operations: z.array(OperationSchema).min(1, 'Service must have at least one operation'),
});

export type Service = z.infer<typeof ServiceSchema>;

