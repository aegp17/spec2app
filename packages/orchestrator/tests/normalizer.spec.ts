import { describe, it, expect } from 'vitest';

import { Normalizer } from '../src/normalizer';

describe('Normalizer', () => {
  const normalizer = new Normalizer();

  it('should add version if missing', () => {
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

    const normalized = normalizer.normalize(contract);

    expect(normalized.metadata.version).toBeDefined();
    expect(normalized.metadata.version).toBe('1.0.0');
  });

  it('should preserve existing version', () => {
    const contract = {
      metadata: {
        name: 'TestApp',
        domain: 'test',
        locale: 'en-US',
        version: '2.5.0',
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

    const normalized = normalizer.normalize(contract);

    expect(normalized.metadata.version).toBe('2.5.0');
  });

  it('should ensure all entities have id attribute', () => {
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

    const normalized = normalizer.normalize(contract);

    const user = normalized.entities.find(e => e.name === 'User');
    const idAttr = user?.attributes.find(a => a.name === 'id');
    
    expect(idAttr).toBeDefined();
    expect(idAttr?.type).toBe('uuid');
    expect(idAttr?.required).toBe(true);
  });

  it('should sort entities alphabetically', () => {
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
          name: 'Post',
          attributes: [{ name: 'id', type: 'uuid', required: true }],
        },
        {
          name: 'Comment',
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

    const normalized = normalizer.normalize(contract);

    expect(normalized.entities[0].name).toBe('Comment');
    expect(normalized.entities[1].name).toBe('Post');
    expect(normalized.entities[2].name).toBe('User');
  });

  it('should add standard timestamps to entities', () => {
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

    const normalized = normalizer.normalize(contract);

    const user = normalized.entities.find(e => e.name === 'User');
    const createdAt = user?.attributes.find(a => a.name === 'createdAt');
    const updatedAt = user?.attributes.find(a => a.name === 'updatedAt');
    
    expect(createdAt).toBeDefined();
    expect(createdAt?.type).toBe('date');
    expect(updatedAt).toBeDefined();
    expect(updatedAt?.type).toBe('date');
  });
});

