import { describe, it, expect } from 'vitest';

import { Orchestrator } from '../src/orchestrator';

describe('Orchestrator', () => {
  const orchestrator = new Orchestrator();

  it('should process a valid contract successfully', () => {
    const contract = {
      metadata: {
        name: 'TestApp',
        domain: 'test',
        locale: 'en-US',
      },
      entities: [
        {
          name: 'User',
          attributes: [
            { name: 'id', type: 'uuid', required: true },
            { name: 'name', type: 'string', required: true },
          ],
        },
      ],
      services: [
        {
          name: 'UserService',
          operations: [
            {
              name: 'getUser',
              input: 'string',
              output: 'User',
              method: 'GET',
            },
          ],
        },
      ],
      ui: {
        routes: ['/'],
        components: ['UserForm'],
      },
    };

    const result = orchestrator.process(contract);

    expect(result.success).toBe(true);
    expect(result.contract).toBeDefined();
    expect(result.errors).toEqual([]);
  });

  it('should reject invalid contract', () => {
    const contract = {
      metadata: {
        name: 'invalid-name',
        domain: 'test',
        locale: 'en-US',
      },
      entities: [],
      services: [],
      ui: {
        routes: [],
        components: [],
      },
    };

    const result = orchestrator.process(contract);

    expect(result.success).toBe(false);
    expect(result.errors.length).toBeGreaterThan(0);
  });

  it('should detect inconsistencies', () => {
    const contract = {
      metadata: {
        name: 'TestApp',
        domain: 'test',
        locale: 'en-US',
      },
      entities: [
        {
          name: 'User',
          attributes: [{ name: 'id', type: 'uuid', required: true }],
        },
      ],
      services: [
        {
          name: 'ProductService',
          operations: [
            {
              name: 'getProduct',
              input: 'string',
              output: 'Product',
              method: 'GET',
            },
          ],
        },
      ],
      ui: {
        routes: ['/'],
        components: ['UserForm'],
      },
    };

    const result = orchestrator.process(contract);

    expect(result.success).toBe(false);
    expect(result.errors.some(e => e.includes('Product'))).toBe(true);
  });

  it('should normalize valid contract', () => {
    const contract = {
      metadata: {
        name: 'TestApp',
        domain: 'test',
        locale: 'en-US',
      },
      entities: [
        {
          name: 'User',
          attributes: [{ name: 'name', type: 'string', required: true }],
        },
      ],
      services: [
        {
          name: 'UserService',
          operations: [
            {
              name: 'getUser',
              input: 'string',
              output: 'User',
              method: 'GET',
            },
          ],
        },
      ],
      ui: {
        routes: ['/'],
        components: ['UserForm'],
      },
    };

    const result = orchestrator.process(contract);

    expect(result.success).toBe(true);
    expect(result.contract?.metadata.version).toBeDefined();
    
    const user = result.contract?.entities.find(e => e.name === 'User');
    expect(user?.attributes.find(a => a.name === 'id')).toBeDefined();
  });

  it('should return validation errors and consistency issues together', () => {
    const contract = {
      metadata: {
        name: 'invalid-name',
        domain: 'test',
        locale: 'en-US',
      },
      entities: [
        {
          name: 'User',
          attributes: [{ name: 'id', type: 'uuid', required: true }],
        },
      ],
      services: [
        {
          name: 'ProductService',
          operations: [
            {
              name: 'getProduct',
              input: 'string',
              output: 'Product',
              method: 'GET',
            },
          ],
        },
      ],
      ui: {
        routes: ['/'],
        components: ['UserForm'],
      },
    };

    const result = orchestrator.process(contract);

    expect(result.success).toBe(false);
    expect(result.errors.length).toBeGreaterThanOrEqual(1);
  });
});

