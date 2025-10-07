import { z } from 'zod';

import { EntitySchema } from './entity.js';
import { MetadataSchema } from './metadata.js';
import { ServiceSchema } from './service.js';
import { UISchema } from './ui.js';

/**
 * Design Contract Schema
 * This is the canonical interface between all agents in the Spec2App system.
 * It represents the complete specification of an application.
 */
export const DesignContractSchema = z.object({
  metadata: MetadataSchema,
  entities: z.array(EntitySchema).min(1, 'At least one entity is required'),
  services: z.array(ServiceSchema).min(1, 'At least one service is required'),
  ui: UISchema,
});

export type DesignContract = z.infer<typeof DesignContractSchema>;

/**
 * Validates a design contract and returns either the parsed contract or errors
 */
export function validateDesignContract(data: unknown): {
  success: boolean;
  data?: DesignContract;
  errors?: z.ZodError;
} {
  const result = DesignContractSchema.safeParse(data);
  
  if (result.success) {
    return { success: true, data: result.data };
  }
  
  return { success: false, errors: result.error };
}
