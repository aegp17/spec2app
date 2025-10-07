import type { DesignContract } from '@spec2app/contracts';

/**
 * Normalizer
 * Normalizes and enriches Design Contracts with defaults
 */
export class Normalizer {
  /**
   * Normalizes a design contract
   */
  normalize(contract: DesignContract): DesignContract {
    const normalized = JSON.parse(JSON.stringify(contract)) as DesignContract;

    // Add default version if missing
    if (!normalized.metadata.version) {
      normalized.metadata.version = '1.0.0';
    }

    // Sort entities alphabetically
    normalized.entities.sort((a, b) => a.name.localeCompare(b.name));

    // Enrich each entity
    for (const entity of normalized.entities) {
      // Ensure id attribute exists
      const hasId = entity.attributes.some(attr => attr.name === 'id');
      if (!hasId) {
        entity.attributes.unshift({
          name: 'id',
          type: 'uuid',
          required: true,
        });
      }

      // Add timestamps if not present
      const hasCreatedAt = entity.attributes.some(attr => attr.name === 'createdAt');
      if (!hasCreatedAt) {
        entity.attributes.push({
          name: 'createdAt',
          type: 'date',
          required: true,
        });
      }

      const hasUpdatedAt = entity.attributes.some(attr => attr.name === 'updatedAt');
      if (!hasUpdatedAt) {
        entity.attributes.push({
          name: 'updatedAt',
          type: 'date',
          required: true,
        });
      }
    }

    // Sort services alphabetically
    normalized.services.sort((a, b) => a.name.localeCompare(b.name));

    // Sort routes
    normalized.ui.routes.sort();

    // Sort components
    normalized.ui.components.sort();

    return normalized;
  }
}

