import { 
  DesignContract, 
  validateDesignContract,
} from '@spec2app/contracts';

import { EntityExtractor } from './entity-extractor';
import { MetadataExtractor } from './metadata-extractor';
import { ServiceExtractor } from './service-extractor';
import { UIExtractor } from './ui-extractor';

/**
 * Analyst Agent
 * Transforms natural language specifications into Design Contracts
 */
export class Analyst {
  private entityExtractor: EntityExtractor;
  private serviceExtractor: ServiceExtractor;
  private uiExtractor: UIExtractor;
  private metadataExtractor: MetadataExtractor;

  constructor() {
    this.entityExtractor = new EntityExtractor();
    this.serviceExtractor = new ServiceExtractor();
    this.uiExtractor = new UIExtractor();
    this.metadataExtractor = new MetadataExtractor();
  }

  /**
   * Analyzes natural language specification and returns Design Contract
   */
  analyze(specification: string): DesignContract {
    // Extract all components
    const metadata = this.metadataExtractor.extract(specification);
    const entities = this.entityExtractor.extract(specification);
    const services = this.serviceExtractor.extract(specification);
    const entityNames = entities.map(e => e.name);
    const ui = this.uiExtractor.extract(specification, entityNames);

    // Ensure we have at least one entity
    const finalEntities = entities.length > 0 ? entities : this.generateDefaultEntity();

    // Ensure we have at least one service
    const finalServices = services.length > 0 ? services : this.generateDefaultService(finalEntities[0].name);

    const contract: DesignContract = {
      metadata,
      entities: finalEntities,
      services: finalServices,
      ui,
    };

    return contract;
  }

  /**
   * Validates a Design Contract
   */
  validate(contract: unknown): ReturnType<typeof validateDesignContract> {
    return validateDesignContract(contract);
  }

  /**
   * Generates a default entity when none is found
   */
  private generateDefaultEntity() {
    return [
      {
        name: 'Item',
        attributes: [
          { name: 'id', type: 'uuid' as const, required: true },
          { name: 'name', type: 'string' as const, required: true },
          { name: 'createdAt', type: 'date' as const, required: true },
        ],
      },
    ];
  }

  /**
   * Generates a default service for an entity
   */
  private generateDefaultService(entityName: string) {
    return [
      {
        name: `${entityName}Service`,
        operations: [
          {
            name: `create${entityName}`,
            input: `${entityName}Input`,
            output: entityName,
            method: 'POST' as const,
          },
          {
            name: `get${entityName}`,
            input: 'string',
            output: entityName,
            method: 'GET' as const,
          },
        ],
      },
    ];
  }
}

