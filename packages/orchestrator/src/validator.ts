import { validateDesignContract } from '@spec2app/contracts';

/**
 * Validator
 * Validates Design Contracts against the schema
 */
export class Validator {
  /**
   * Validates a design contract
   */
  validate(contract: unknown): { valid: boolean; errors: string[] } {
    const result = validateDesignContract(contract);

    if (result.success) {
      return { valid: true, errors: [] };
    }

    const errors = result.errors?.errors.map(err => {
      const path = err.path.join('.');
      return `${path}: ${err.message}`;
    }) || [];

    return { valid: false, errors };
  }
}

