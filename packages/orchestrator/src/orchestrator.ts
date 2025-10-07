import type { DesignContract } from '@spec2app/contracts';

import { ConsistencyChecker } from './consistency-checker.js';
import { Normalizer } from './normalizer.js';
import { Validator } from './validator.js';

/**
 * Orchestrator
 * Validates, checks consistency, and normalizes Design Contracts
 */
export class Orchestrator {
  private validator: Validator;
  private consistencyChecker: ConsistencyChecker;
  private normalizer: Normalizer;

  constructor() {
    this.validator = new Validator();
    this.consistencyChecker = new ConsistencyChecker();
    this.normalizer = new Normalizer();
  }

  /**
   * Processes a design contract
   * Returns validated, checked, and normalized contract
   */
  process(contract: unknown): {
    success: boolean;
    contract?: DesignContract;
    errors: string[];
  } {
    const errors: string[] = [];

    // Step 1: Validate schema
    const validationResult = this.validator.validate(contract);
    if (!validationResult.valid) {
      errors.push(...validationResult.errors);
      return { success: false, errors };
    }

    // Step 2: Check consistency
    const consistencyResult = this.consistencyChecker.check(contract as DesignContract);
    if (!consistencyResult.consistent) {
      errors.push(...consistencyResult.issues);
      return { success: false, errors };
    }

    // Step 3: Normalize
    const normalized = this.normalizer.normalize(contract as DesignContract);

    return {
      success: true,
      contract: normalized,
      errors: [],
    };
  }
}

