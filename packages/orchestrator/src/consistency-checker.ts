import type { DesignContract } from '@spec2app/contracts';

/**
 * ConsistencyChecker
 * Checks for logical consistency in Design Contracts
 */
export class ConsistencyChecker {
  /**
   * Checks consistency of a design contract
   */
  check(contract: DesignContract): { consistent: boolean; issues: string[] } {
    const issues: string[] = [];

    // Check for duplicate entity names
    const entityNames = contract.entities.map(e => e.name);
    const duplicateEntities = entityNames.filter((name, index) => entityNames.indexOf(name) !== index);
    if (duplicateEntities.length > 0) {
      issues.push(`Found duplicate entity names: ${duplicateEntities.join(', ')}`);
    }

    // Check for duplicate service names
    const serviceNames = contract.services.map(s => s.name);
    const duplicateServices = serviceNames.filter((name, index) => serviceNames.indexOf(name) !== index);
    if (duplicateServices.length > 0) {
      issues.push(`Found duplicate service names: ${duplicateServices.join(', ')}`);
    }

    // Check that services follow naming convention (end with 'Service')
    for (const service of contract.services) {
      if (!service.name.endsWith('Service')) {
        issues.push(`Service '${service.name}' does not follow naming convention (should end with 'Service')`);
      }
    }

    // Check that service operations reference existing entities
    const entityNameSet = new Set(entityNames);
    
    for (const service of contract.services) {
      for (const operation of service.operations) {
        // Check output type
        const outputType = operation.output.replace('[]', '');
        if (outputType !== 'void' && outputType !== 'string' && !this.isPrimitiveType(outputType)) {
          if (!entityNameSet.has(outputType) && !outputType.includes('Input') && !outputType.includes('Update')) {
            issues.push(`Service '${service.name}' operation '${operation.name}' references non-existent entity '${outputType}'`);
          }
        }

        // Check input type
        const inputType = operation.input.replace('[]', '');
        if (inputType !== 'void' && inputType !== 'string' && !this.isPrimitiveType(inputType)) {
          if (!entityNameSet.has(inputType) && !inputType.includes('Input') && !inputType.includes('Update')) {
            issues.push(`Service '${service.name}' operation '${operation.name}' references non-existent entity '${inputType}' as input`);
          }
        }
      }
    }

    return {
      consistent: issues.length === 0,
      issues,
    };
  }

  /**
   * Checks if a type is a primitive type
   */
  private isPrimitiveType(type: string): boolean {
    const primitives = ['string', 'number', 'boolean', 'date', 'uuid', 'void'];
    return primitives.includes(type.toLowerCase());
  }
}

