import type { Entity, Attribute, AttributeType } from '@spec2app/contracts';

/**
 * EntityExtractor
 * Extracts entity definitions from natural language text
 */
export class EntityExtractor {
  /**
   * Extracts entities from natural language specification
   */
  extract(text: string): Entity[] {
    const entities: Entity[] = [];

    // Pattern to find entity definitions
    const entityPatterns = [
      /(?:create|build|add|need)?\s*(?:a|an)?\s*([A-Z][a-zA-Z]*)\s*(?:entity|model|table)/gi,
      /([A-Z][a-zA-Z]*)\s+(?:has|have|with|contains?)/g,
    ];

    const foundEntities = new Set<string>();

    for (const pattern of entityPatterns) {
      let match;
      while ((match = pattern.exec(text)) !== null) {
        const entityName = match[1];
        if (entityName && this.isValidEntityName(entityName)) {
          foundEntities.add(entityName);
        }
      }
    }

    for (const entityName of foundEntities) {
      const attributes = this.extractAttributesForEntity(text, entityName);
      if (attributes.length > 0) {
        entities.push({
          name: entityName,
          attributes,
        });
      }
    }

    return entities;
  }

  /**
   * Extracts attributes for a specific entity
   */
  private extractAttributesForEntity(text: string, entityName: string): Attribute[] {
    const attributes: Attribute[] = [];
    
    // Find the sentence(s) that mention this entity
    const sentences = text.split(/[.!?]/);
    const relevantSentences = sentences.filter(s => 
      s.includes(entityName) || s.toLowerCase().includes(entityName.toLowerCase())
    );

    for (const sentence of relevantSentences) {
      // Extract attribute definitions
      const attrPatterns = [
        /(\w+)\s*\((optional\s+)?(\w+)(?::\s*([^)]+))?\)/gi,
        /(\w+)\s+\((?:required\s+)?(\w+)\)/gi,
      ];

      for (const pattern of attrPatterns) {
        let match;
        while ((match = pattern.exec(sentence)) !== null) {
          const name = match[1];
          const optional = match[2]?.includes('optional');
          const type = this.normalizeType(match[3] || match[2]);
          const enumValues = match[4];

          if (this.isValidAttributeName(name)) {
            const attribute: Attribute = {
              name: this.toCamelCase(name),
              type: type as AttributeType,
              required: !optional,
            };

            if (type === 'enum' && enumValues) {
              attribute.validation = enumValues.split(/[,|]/).map(v => v.trim().toUpperCase()).join('|');
            }

            attributes.push(attribute);
          }
        }
      }

      // Also look for simple attribute lists (only if no attributes found via patterns)
      if (attributes.length === 0) {
        const simplePattern = /(?:with|has|have)\s+([a-z][a-zA-Z0-9]*(?:,\s*(?:and\s+)?[a-z][a-zA-Z0-9]*)*)/;
        const simpleMatch = sentence.match(simplePattern);
        if (simpleMatch) {
          const attrList = simpleMatch[1];
          const words = attrList.split(/,\s*(?:and\s+)?/);
          
          for (const word of words) {
            const trimmed = word.trim();
            if (trimmed && this.isSimpleAttributeName(trimmed) && !attributes.some(a => a.name === trimmed)) {
              // If no explicit type in parentheses, try to infer
              const inferredType = this.inferTypeFromName(trimmed);
              attributes.push({
                name: this.toCamelCase(trimmed),
                type: inferredType,
                required: true,
              });
            }
          }
        }
      }
    }

    return attributes;
  }

  /**
   * Normalizes type names to standard types
   */
  private normalizeType(type: string): string {
    const normalized = type.toLowerCase().trim();
    
    const typeMap: Record<string, string> = {
      'str': 'string',
      'text': 'string',
      'int': 'number',
      'integer': 'number',
      'float': 'number',
      'double': 'number',
      'bool': 'boolean',
      'datetime': 'date',
      'timestamp': 'date',
      'location': 'geo',
      'coordinates': 'geo',
      'enum': 'enum',
      'uuid': 'uuid',
      'id': 'uuid',
    };

    return typeMap[normalized] || normalized;
  }

  /**
   * Infers type from attribute name
   */
  private inferTypeFromName(name: string): AttributeType {
    const lower = name.toLowerCase();
    
    if (lower === 'id' || lower.endsWith('id')) return 'uuid';
    if (lower.includes('date') || lower.includes('time')) return 'date';
    if (lower.includes('count') || lower.includes('age') || lower.includes('priority')) return 'number';
    if (lower.includes('active') || lower.includes('completed') || lower.includes('enabled')) return 'boolean';
    if (lower.includes('location') || lower.includes('position')) return 'geo';
    if (lower.includes('status') || lower.includes('type') || lower.includes('role')) return 'enum';
    
    return 'string';
  }

  /**
   * Checks if a name is a valid entity name
   */
  private isValidEntityName(name: string): boolean {
    // Should be PascalCase and not a common word
    const commonWords = ['create', 'build', 'add', 'with', 'and', 'the', 'a', 'an'];
    return /^[A-Z][a-zA-Z]*$/.test(name) && !commonWords.includes(name.toLowerCase());
  }

  /**
   * Checks if a name is a valid attribute name
   */
  private isValidAttributeName(name: string): boolean {
    // Should be alphanumeric and not empty
    const cleaned = name.replace(/[^a-zA-Z0-9]/g, '');
    return cleaned.length > 0 && cleaned.length < 50;
  }

  /**
   * Checks if a name is a simple valid attribute name (more strict)
   */
  private isSimpleAttributeName(name: string): boolean {
    // Should be lowercase alphanumeric starting with letter
    return /^[a-z][a-zA-Z0-9]*$/.test(name) && name.length >= 2 && name.length < 30;
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

