import { describe, it, expect } from 'vitest';

import { DesignContractSchema, validateDesignContract } from '../src/design-contract';

describe('DesignContractSchema', () => {
  it('should validate a complete design contract', () => {
    const validContract = {
      metadata: {
        name: 'PotholeReporter',
        domain: 'civic-tech',
        locale: 'en-US',
        version: '1.0.0',
        description: 'An app to report potholes',
      },
      entities: [
        {
          name: 'Report',
          attributes: [
            { name: 'id', type: 'uuid', required: true },
            { name: 'location', type: 'geo', required: true },
            { name: 'status', type: 'enum', required: true, validation: 'OPEN|CLOSED' },
            { name: 'description', type: 'string', required: false },
          ],
        },
      ],
      services: [
        {
          name: 'ReportService',
          operations: [
            {
              name: 'createReport',
              input: 'ReportInput',
              output: 'Report',
              method: 'POST',
            },
            {
              name: 'getReport',
              input: 'string',
              output: 'Report',
              method: 'GET',
            },
          ],
        },
      ],
      ui: {
        routes: ['/', '/reports', '/reports/:id'],
        components: ['ReportForm', 'ReportList', 'MapView'],
      },
    };

    const result = DesignContractSchema.safeParse(validContract);
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.metadata.name).toBe('PotholeReporter');
      expect(result.data.entities).toHaveLength(1);
      expect(result.data.services).toHaveLength(1);
      expect(result.data.ui.routes).toHaveLength(3);
    }
  });

  it('should require metadata', () => {
    const invalidContract = {
      entities: [
        {
          name: 'Report',
          attributes: [
            { name: 'id', type: 'uuid', required: true },
          ],
        },
      ],
      services: [
        {
          name: 'ReportService',
          operations: [
            {
              name: 'createReport',
              input: 'ReportInput',
              output: 'Report',
              method: 'POST',
            },
          ],
        },
      ],
      ui: {
        routes: ['/'],
        components: ['ReportForm'],
      },
    };

    const result = DesignContractSchema.safeParse(invalidContract);
    expect(result.success).toBe(false);
  });

  it('should require at least one entity', () => {
    const invalidContract = {
      metadata: {
        name: 'PotholeReporter',
        domain: 'civic-tech',
        locale: 'en-US',
      },
      entities: [],
      services: [
        {
          name: 'ReportService',
          operations: [
            {
              name: 'createReport',
              input: 'ReportInput',
              output: 'Report',
              method: 'POST',
            },
          ],
        },
      ],
      ui: {
        routes: ['/'],
        components: ['ReportForm'],
      },
    };

    const result = DesignContractSchema.safeParse(invalidContract);
    expect(result.success).toBe(false);
  });

  it('should require at least one service', () => {
    const invalidContract = {
      metadata: {
        name: 'PotholeReporter',
        domain: 'civic-tech',
        locale: 'en-US',
      },
      entities: [
        {
          name: 'Report',
          attributes: [
            { name: 'id', type: 'uuid', required: true },
          ],
        },
      ],
      services: [],
      ui: {
        routes: ['/'],
        components: ['ReportForm'],
      },
    };

    const result = DesignContractSchema.safeParse(invalidContract);
    expect(result.success).toBe(false);
  });

  it('should require ui configuration', () => {
    const invalidContract = {
      metadata: {
        name: 'PotholeReporter',
        domain: 'civic-tech',
        locale: 'en-US',
      },
      entities: [
        {
          name: 'Report',
          attributes: [
            { name: 'id', type: 'uuid', required: true },
          ],
        },
      ],
      services: [
        {
          name: 'ReportService',
          operations: [
            {
              name: 'createReport',
              input: 'ReportInput',
              output: 'Report',
              method: 'POST',
            },
          ],
        },
      ],
    };

    const result = DesignContractSchema.safeParse(invalidContract);
    expect(result.success).toBe(false);
  });

  it('should validate complex multi-entity contract', () => {
    const complexContract = {
      metadata: {
        name: 'TaskManager',
        domain: 'productivity',
        locale: 'en-US',
      },
      entities: [
        {
          name: 'User',
          attributes: [
            { name: 'id', type: 'uuid', required: true },
            { name: 'email', type: 'string', required: true },
            { name: 'name', type: 'string', required: true },
          ],
        },
        {
          name: 'Task',
          attributes: [
            { name: 'id', type: 'uuid', required: true },
            { name: 'title', type: 'string', required: true },
            { name: 'completed', type: 'boolean', required: true },
            { name: 'userId', type: 'uuid', required: true },
          ],
        },
      ],
      services: [
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
        {
          name: 'TaskService',
          operations: [
            {
              name: 'createTask',
              input: 'TaskInput',
              output: 'Task',
              method: 'POST',
            },
            {
              name: 'getTasks',
              input: 'void',
              output: 'Task[]',
              method: 'GET',
            },
          ],
        },
      ],
      ui: {
        routes: ['/', '/tasks', '/profile'],
        components: ['TaskList', 'TaskForm', 'UserProfile'],
      },
    };

    const result = DesignContractSchema.safeParse(complexContract);
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.entities).toHaveLength(2);
      expect(result.data.services).toHaveLength(2);
    }
  });
});

describe('validateDesignContract', () => {
  it('should return success for valid contract', () => {
    const validContract = {
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
        components: ['UserProfile'],
      },
    };

    const result = validateDesignContract(validContract);
    expect(result.success).toBe(true);
    expect(result.data).toBeDefined();
    expect(result.errors).toBeUndefined();
  });

  it('should return errors for invalid contract', () => {
    const invalidContract = {
      metadata: {
        name: 'invalid-name',
        domain: 'test',
      },
    };

    const result = validateDesignContract(invalidContract);
    expect(result.success).toBe(false);
    expect(result.data).toBeUndefined();
    expect(result.errors).toBeDefined();
  });
});

