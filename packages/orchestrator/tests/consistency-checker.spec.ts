import { describe, it, expect } from 'vitest';

import { ConsistencyChecker } from '../src/consistency-checker';

describe('ConsistencyChecker', () => {
  const checker = new ConsistencyChecker();

  it('should pass when services reference existing entities', () => {
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

    const result = checker.check(contract);

    expect(result.consistent).toBe(true);
    expect(result.issues).toEqual([]);
  });

  it('should detect when service references non-existent entity', () => {
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

    const result = checker.check(contract);

    expect(result.consistent).toBe(false);
    expect(result.issues.length).toBeGreaterThan(0);
    expect(result.issues[0]).toContain('Product');
  });

  it('should check service naming conventions', () => {
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
          name: 'User',
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

    const result = checker.check(contract);

    expect(result.consistent).toBe(false);
    expect(result.issues.some(issue => issue.includes('Service'))).toBe(true);
  });

  it('should check for duplicate entity names', () => {
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

    const result = checker.check(contract);

    expect(result.consistent).toBe(false);
    expect(result.issues.some(issue => issue.includes('duplicate'))).toBe(true);
  });

  it('should check for duplicate service names', () => {
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
        {
          name: 'UserService',
          operations: [
            {
              name: 'createUser',
              input: 'UserInput',
              output: 'User',
              method: 'POST',
            },
          ],
        },
      ],
      ui: {
        routes: ['/'],
        components: ['UserForm'],
      },
    };

    const result = checker.check(contract);

    expect(result.consistent).toBe(false);
    expect(result.issues.some(issue => issue.includes('duplicate'))).toBe(true);
  });
});

