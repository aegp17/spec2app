import { z } from 'zod';

/**
 * Supported attribute types in the Design Contract
 */
export const AttributeTypeSchema = z.enum([
  'string',
  'number',
  'boolean',
  'date',
  'uuid',
  'enum',
  'geo',
]);

export type AttributeType = z.infer<typeof AttributeTypeSchema>;

/**
 * Schema for entity attributes
 * Represents a field in an entity
 */
export const AttributeSchema = z
  .object({
    name: z
      .string()
      .min(1)
      .regex(/^[a-z][a-zA-Z0-9]*$/, 'Attribute name must be in camelCase'),
    type: AttributeTypeSchema,
    required: z.boolean(),
    validation: z.string().optional(),
    description: z.string().optional(),
  })
  .refine(
    (data) => {
      // If type is enum, validation is required
      if (data.type === 'enum') {
        return !!data.validation;
      }
      return true;
    },
    {
      message: 'Validation is required for enum type',
      path: ['validation'],
    }
  );

export type Attribute = z.infer<typeof AttributeSchema>;

/**
 * Schema for entities
 * Represents a domain entity in the application
 */
export const EntitySchema = z.object({
  name: z
    .string()
    .min(1)
    .regex(/^[A-Z][a-zA-Z0-9]*$/, 'Entity name must be in PascalCase'),
  description: z.string().optional(),
  attributes: z.array(AttributeSchema).min(1, 'Entity must have at least one attribute'),
});

export type Entity = z.infer<typeof EntitySchema>;

