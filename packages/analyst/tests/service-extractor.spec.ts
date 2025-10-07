import { describe, it, expect } from 'vitest';

import { ServiceExtractor } from '../src/service-extractor';

describe('ServiceExtractor', () => {
  const extractor = new ServiceExtractor();

  it('should extract a simple service with operations', () => {
    const text = 'Create a ReportService with operations to create, get, and list reports.';
    
    const services = extractor.extract(text);
    
    expect(services).toHaveLength(1);
    expect(services[0].name).toBe('ReportService');
    expect(services[0].operations.length).toBeGreaterThan(0);
  });

  it('should extract POST operation', () => {
    const text = 'UserService should have a createUser operation (POST) that takes UserInput and returns User.';
    
    const services = extractor.extract(text);
    
    expect(services).toHaveLength(1);
    const createOp = services[0].operations.find(op => op.name === 'createUser');
    expect(createOp?.method).toBe('POST');
    expect(createOp?.input).toBe('UserInput');
    expect(createOp?.output).toBe('User');
  });

  it('should extract GET operation', () => {
    const text = 'ReportService needs a getReport operation (GET) that takes an id and returns a Report.';
    
    const services = extractor.extract(text);
    
    expect(services).toHaveLength(1);
    const getOp = services[0].operations.find(op => op.name === 'getReport');
    expect(getOp?.method).toBe('GET');
  });

  it('should extract PUT operation', () => {
    const text = 'TaskService with updateTask (PUT) that takes TaskUpdate and returns Task.';
    
    const services = extractor.extract(text);
    
    expect(services).toHaveLength(1);
    const updateOp = services[0].operations.find(op => op.name === 'updateTask');
    expect(updateOp?.method).toBe('PUT');
  });

  it('should extract DELETE operation', () => {
    const text = 'UserService needs deleteUser (DELETE) operation that takes id.';
    
    const services = extractor.extract(text);
    
    expect(services).toHaveLength(1);
    const deleteOp = services[0].operations.find(op => op.name === 'deleteUser');
    expect(deleteOp?.method).toBe('DELETE');
  });

  it('should extract multiple services', () => {
    const text = `
      Create UserService with user operations.
      Also create TaskService with task management operations.
    `;
    
    const services = extractor.extract(text);
    
    expect(services.length).toBeGreaterThanOrEqual(2);
    const serviceNames = services.map(s => s.name);
    expect(serviceNames).toContain('UserService');
    expect(serviceNames).toContain('TaskService');
  });

  it('should infer CRUD operations from entity names', () => {
    const text = 'We need CRUD operations for the Report entity.';
    
    const services = extractor.extract(text);
    
    expect(services).toHaveLength(1);
    expect(services[0].operations.length).toBeGreaterThanOrEqual(4);
    
    const operationNames = services[0].operations.map(op => op.name);
    expect(operationNames).toContain('createReport');
    expect(operationNames).toContain('getReport');
  });

  it('should return empty array for text without services', () => {
    const text = 'This is just a description with no services.';
    
    const services = extractor.extract(text);
    
    expect(services).toEqual([]);
  });
});

