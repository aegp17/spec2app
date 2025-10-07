import type { Service, Operation, HTTPMethod } from '@spec2app/contracts';

/**
 * ServiceExtractor
 * Extracts service and operation definitions from natural language text
 */
export class ServiceExtractor {
  /**
   * Extracts services from natural language specification
   */
  extract(text: string): Service[] {
    const services: Service[] = [];
    
    // Pattern to find service definitions
    const servicePattern = /([A-Z][a-zA-Z]*Service)/g;
    const foundServices = new Set<string>();
    
    let match;
    while ((match = servicePattern.exec(text)) !== null) {
      foundServices.add(match[1]);
    }

    // Also look for CRUD mentions
    const crudPattern = /(?:CRUD|crud)\s+(?:operations?\s+)?(?:for|on)\s+(?:the\s+)?([A-Z][a-zA-Z]*)/gi;
    while ((match = crudPattern.exec(text)) !== null) {
      const entityName = match[1];
      foundServices.add(`${entityName}Service`);
    }

    for (const serviceName of foundServices) {
      const operations = this.extractOperationsForService(text, serviceName);
      if (operations.length > 0) {
        services.push({
          name: serviceName,
          operations,
        });
      }
    }

    return services;
  }

  /**
   * Extracts operations for a specific service
   */
  private extractOperationsForService(text: string, serviceName: string): Operation[] {
    const operations: Operation[] = [];
    const entityName = serviceName.replace('Service', '');
    
    // Check if CRUD is mentioned
    if (text.match(/(?:CRUD|crud)/i)) {
      operations.push(...this.generateCRUDOperations(entityName));
    }

    // Extract explicit operations with HTTP methods
    const operationPatterns = [
      /(\w+)\s+operation\s+\(([A-Z]+)\)/gi,
      /(\w+)\s+\(([A-Z]+)\)/g,
    ];

    const sentences = text.split(/[.!?]/);
    const relevantText = sentences.filter(s => 
      s.includes(serviceName) || s.toLowerCase().includes(entityName.toLowerCase())
    ).join(' ');

    for (const pattern of operationPatterns) {
      let match;
      pattern.lastIndex = 0;
      while ((match = pattern.exec(relevantText)) !== null) {
        const opName = match[1];
        const method = match[2].toUpperCase() as HTTPMethod;
        
        if (this.isValidOperationName(opName) && this.isValidHTTPMethod(method)) {
          const { input, output } = this.inferInputOutput(opName, entityName, method);
          const finalName = this.toCamelCase(opName);
          
          // Avoid duplicates
          if (!operations.some(op => op.name === finalName)) {
            operations.push({
              name: finalName,
              input,
              output,
              method,
            });
          }
        }
      }
    }

    // Look for operation verbs
    const verbPatterns = [
      /(?:create|add|insert)\s+(?:a\s+)?(\w+)/gi,
      /(?:get|fetch|retrieve)\s+(?:a\s+)?(\w+)/gi,
      /(?:update|modify|edit)\s+(?:a\s+)?(\w+)/gi,
      /(?:delete|remove)\s+(?:a\s+)?(\w+)/gi,
      /(?:list|get\s+all)\s+(\w+)/gi,
    ];

    for (const sentence of relevantText.split(/[.!?]/)) {
      for (const pattern of verbPatterns) {
        let match;
        while ((match = pattern.exec(sentence)) !== null) {
          const verb = match[0].split(/\s+/)[0].toLowerCase();
          const method = this.verbToMethod(verb);
          const opName = `${verb}${entityName}`;
          
          if (!operations.some(op => op.name === opName)) {
            const { input, output } = this.inferInputOutput(opName, entityName, method);
            operations.push({
              name: this.toCamelCase(opName),
              input,
              output,
              method,
            });
          }
        }
      }
    }

    return operations;
  }

  /**
   * Generates standard CRUD operations
   */
  private generateCRUDOperations(entityName: string): Operation[] {
    return [
      {
        name: `create${entityName}`,
        input: `${entityName}Input`,
        output: entityName,
        method: 'POST' as HTTPMethod,
      },
      {
        name: `get${entityName}`,
        input: 'string',
        output: entityName,
        method: 'GET' as HTTPMethod,
      },
      {
        name: `update${entityName}`,
        input: `${entityName}Update`,
        output: entityName,
        method: 'PUT' as HTTPMethod,
      },
      {
        name: `delete${entityName}`,
        input: 'string',
        output: 'void',
        method: 'DELETE' as HTTPMethod,
      },
    ];
  }

  /**
   * Converts a verb to HTTP method
   */
  private verbToMethod(verb: string): HTTPMethod {
    const verbMap: Record<string, HTTPMethod> = {
      'create': 'POST',
      'add': 'POST',
      'insert': 'POST',
      'get': 'GET',
      'fetch': 'GET',
      'retrieve': 'GET',
      'list': 'GET',
      'update': 'PUT',
      'modify': 'PUT',
      'edit': 'PUT',
      'delete': 'DELETE',
      'remove': 'DELETE',
    };

    return verbMap[verb] || 'GET';
  }

  /**
   * Infers input and output types for an operation
   */
  private inferInputOutput(opName: string, entityName: string, method: HTTPMethod): { input: string; output: string } {
    const lower = opName.toLowerCase();
    
    if (method === 'POST') {
      return { input: `${entityName}Input`, output: entityName };
    } else if (method === 'PUT' || method === 'PATCH') {
      return { input: `${entityName}Update`, output: entityName };
    } else if (method === 'DELETE') {
      return { input: 'string', output: 'void' };
    } else if (lower.includes('list') || lower.includes('all')) {
      return { input: 'void', output: `${entityName}[]` };
    } else {
      return { input: 'string', output: entityName };
    }
  }

  /**
   * Checks if a name is a valid operation name
   */
  private isValidOperationName(name: string): boolean {
    return /^[a-zA-Z][a-zA-Z0-9]*$/.test(name);
  }

  /**
   * Checks if a string is a valid HTTP method
   */
  private isValidHTTPMethod(method: string): boolean {
    return ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'].includes(method.toUpperCase());
  }

  /**
   * Converts a string to camelCase
   */
  private toCamelCase(str: string): string {
    const cleaned = str.replace(/[^a-zA-Z0-9]/g, ' ').trim();
    const words = cleaned.split(/\s+/);
    
    if (words.length === 0) return '';
    
    return words[0].toLowerCase() + words.slice(1).map(w => 
      w.charAt(0).toUpperCase() + w.slice(1).toLowerCase()
    ).join('');
  }
}

