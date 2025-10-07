import { describe, it, expect } from 'vitest';

import { Validator } from '../src/validator';

describe('Validator', () => {
  const validator = new Validator();

  it('should validate a correct design contract', () => {
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

    const result = validator.validate(contract);

    expect(result.valid).toBe(true);
    expect(result.errors).toEqual([]);
  });

  it('should reject contract with invalid metadata', () => {
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

    const result = validator.validate(contract);

    expect(result.valid).toBe(false);
    expect(result.errors.length).toBeGreaterThan(0);
  });

  it('should reject contract with missing required fields', () => {
    const contract = {
      metadata: {
        name: 'TestApp',
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

    const result = validator.validate(contract);

    expect(result.valid).toBe(false);
  });

  it('should validate entity attribute types', () => {
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
            { name: 'age', type: 'number', required: false },
            { name: 'active', type: 'boolean', required: true },
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

    const result = validator.validate(contract);

    expect(result.valid).toBe(true);
  });
});

