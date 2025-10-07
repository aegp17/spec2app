import { describe, it, expect } from 'vitest';

import { EntityExtractor } from '../src/entity-extractor';

describe('EntityExtractor', () => {
  const extractor = new EntityExtractor();

  it('should extract a simple entity from text', () => {
    const text = 'Create a Report entity with id (uuid), location (geo), and status (enum: OPEN, CLOSED).';
    
    const entities = extractor.extract(text);
    
    expect(entities).toHaveLength(1);
    expect(entities[0].name).toBe('Report');
    expect(entities[0].attributes).toHaveLength(3);
  });

  it('should extract entity with string attributes', () => {
    const text = 'A User has an id (uuid), name (string), and email (string).';
    
    const entities = extractor.extract(text);
    
    expect(entities).toHaveLength(1);
    expect(entities[0].name).toBe('User');
    
    const nameAttr = entities[0].attributes.find(a => a.name === 'name');
    expect(nameAttr?.type).toBe('string');
  });

  it('should extract entity with boolean attributes', () => {
    const text = 'A Task entity with id (uuid), title (string), completed (boolean), and priority (number).';
    
    const entities = extractor.extract(text);
    
    expect(entities).toHaveLength(1);
    const completedAttr = entities[0].attributes.find(a => a.name === 'completed');
    expect(completedAttr?.type).toBe('boolean');
  });

  it('should extract multiple entities from text', () => {
    const text = `
      We need a User entity with id, name, and email.
      Also a Task entity with id, title, and completed status.
    `;
    
    const entities = extractor.extract(text);
    
    expect(entities.length).toBeGreaterThanOrEqual(2);
    const entityNames = entities.map(e => e.name);
    expect(entityNames).toContain('User');
    expect(entityNames).toContain('Task');
  });

  it('should mark required attributes', () => {
    const text = 'A User entity with id (required uuid), name (required string), and bio (optional string).';
    
    const entities = extractor.extract(text);
    
    expect(entities).toHaveLength(1);
    const idAttr = entities[0].attributes.find(a => a.name === 'id');
    const bioAttr = entities[0].attributes.find(a => a.name === 'bio');
    
    expect(idAttr?.required).toBe(true);
    expect(bioAttr?.required).toBe(false);
  });

  it('should extract enum validation', () => {
    const text = 'A Report entity with status (enum: OPEN, IN_PROGRESS, CLOSED).';
    
    const entities = extractor.extract(text);
    
    expect(entities).toHaveLength(1);
    const statusAttr = entities[0].attributes.find(a => a.name === 'status');
    expect(statusAttr?.type).toBe('enum');
    expect(statusAttr?.validation).toContain('OPEN');
    expect(statusAttr?.validation).toContain('CLOSED');
  });

  it('should handle date attributes', () => {
    const text = 'A Post entity with id, title, content, and createdAt (date).';
    
    const entities = extractor.extract(text);
    
    expect(entities).toHaveLength(1);
    const createdAtAttr = entities[0].attributes.find(a => a.name === 'createdAt');
    expect(createdAtAttr?.type).toBe('date');
  });

  it('should return empty array for text without entities', () => {
    const text = 'This is just a description with no entities mentioned.';
    
    const entities = extractor.extract(text);
    
    expect(entities).toEqual([]);
  });
});

