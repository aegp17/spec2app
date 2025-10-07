import { describe, it, expect } from 'vitest';

import { EntitySchema, AttributeSchema } from '../src/entity';

describe('AttributeSchema', () => {
  it('should validate a basic attribute', () => {
    const validAttribute = {
      name: 'id',
      type: 'uuid',
      required: true,
    };

    const result = AttributeSchema.safeParse(validAttribute);
    expect(result.success).toBe(true);
  });

  it('should support string type', () => {
    const attribute = {
      name: 'title',
      type: 'string',
      required: true,
    };

    const result = AttributeSchema.safeParse(attribute);
    expect(result.success).toBe(true);
  });

  it('should support number type', () => {
    const attribute = {
      name: 'age',
      type: 'number',
      required: false,
    };

    const result = AttributeSchema.safeParse(attribute);
    expect(result.success).toBe(true);
  });

  it('should support boolean type', () => {
    const attribute = {
      name: 'active',
      type: 'boolean',
      required: true,
    };

    const result = AttributeSchema.safeParse(attribute);
    expect(result.success).toBe(true);
  });

  it('should support date type', () => {
    const attribute = {
      name: 'createdAt',
      type: 'date',
      required: true,
    };

    const result = AttributeSchema.safeParse(attribute);
    expect(result.success).toBe(true);
  });

  it('should support enum type with validation', () => {
    const attribute = {
      name: 'status',
      type: 'enum',
      required: true,
      validation: 'OPEN|IN_PROGRESS|CLOSED',
    };

    const result = AttributeSchema.safeParse(attribute);
    expect(result.success).toBe(true);
  });

  it('should require validation for enum type', () => {
    const attribute = {
      name: 'status',
      type: 'enum',
      required: true,
    };

    const result = AttributeSchema.safeParse(attribute);
    expect(result.success).toBe(false);
  });

  it('should support geo type', () => {
    const attribute = {
      name: 'location',
      type: 'geo',
      required: true,
    };

    const result = AttributeSchema.safeParse(attribute);
    expect(result.success).toBe(true);
  });

  it('should support optional validation patterns', () => {
    const attribute = {
      name: 'email',
      type: 'string',
      required: true,
      validation: '^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,}$',
    };

    const result = AttributeSchema.safeParse(attribute);
    expect(result.success).toBe(true);
  });

  it('should enforce camelCase for attribute names', () => {
    const invalidAttribute = {
      name: 'CreatedAt',
      type: 'date',
      required: true,
    };

    const result = AttributeSchema.safeParse(invalidAttribute);
    expect(result.success).toBe(false);
  });
});

describe('EntitySchema', () => {
  it('should validate a complete entity', () => {
    const validEntity = {
      name: 'Report',
      attributes: [
        { name: 'id', type: 'uuid', required: true },
        { name: 'location', type: 'geo', required: true },
        { name: 'status', type: 'enum', required: true, validation: 'OPEN|CLOSED' },
        { name: 'description', type: 'string', required: false },
      ],
    };

    const result = EntitySchema.safeParse(validEntity);
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.attributes).toHaveLength(4);
    }
  });

  it('should require entity name', () => {
    const invalidEntity = {
      attributes: [
        { name: 'id', type: 'uuid', required: true },
      ],
    };

    const result = EntitySchema.safeParse(invalidEntity);
    expect(result.success).toBe(false);
  });

  it('should require at least one attribute', () => {
    const invalidEntity = {
      name: 'Report',
      attributes: [],
    };

    const result = EntitySchema.safeParse(invalidEntity);
    expect(result.success).toBe(false);
  });

  it('should enforce PascalCase for entity names', () => {
    const invalidEntity = {
      name: 'report',
      attributes: [
        { name: 'id', type: 'uuid', required: true },
      ],
    };

    const result = EntitySchema.safeParse(invalidEntity);
    expect(result.success).toBe(false);
  });

  it('should allow optional description', () => {
    const entityWithDescription = {
      name: 'Report',
      description: 'A pothole report',
      attributes: [
        { name: 'id', type: 'uuid', required: true },
      ],
    };

    const result = EntitySchema.safeParse(entityWithDescription);
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.description).toBe('A pothole report');
    }
  });
});

