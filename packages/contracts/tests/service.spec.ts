import { describe, it, expect } from 'vitest';

import { ServiceSchema, OperationSchema } from '../src/service';

describe('OperationSchema', () => {
  it('should validate a basic operation', () => {
    const validOperation = {
      name: 'createReport',
      input: 'ReportInput',
      output: 'Report',
      method: 'POST',
    };

    const result = OperationSchema.safeParse(validOperation);
    expect(result.success).toBe(true);
  });

  it('should support GET method', () => {
    const operation = {
      name: 'getReport',
      input: 'string',
      output: 'Report',
      method: 'GET',
    };

    const result = OperationSchema.safeParse(operation);
    expect(result.success).toBe(true);
  });

  it('should support PUT method', () => {
    const operation = {
      name: 'updateReport',
      input: 'ReportUpdate',
      output: 'Report',
      method: 'PUT',
    };

    const result = OperationSchema.safeParse(operation);
    expect(result.success).toBe(true);
  });

  it('should support DELETE method', () => {
    const operation = {
      name: 'deleteReport',
      input: 'string',
      output: 'void',
      method: 'DELETE',
    };

    const result = OperationSchema.safeParse(operation);
    expect(result.success).toBe(true);
  });

  it('should support PATCH method', () => {
    const operation = {
      name: 'patchReport',
      input: 'ReportPatch',
      output: 'Report',
      method: 'PATCH',
    };

    const result = OperationSchema.safeParse(operation);
    expect(result.success).toBe(true);
  });

  it('should require operation name', () => {
    const invalidOperation = {
      input: 'ReportInput',
      output: 'Report',
      method: 'POST',
    };

    const result = OperationSchema.safeParse(invalidOperation);
    expect(result.success).toBe(false);
  });

  it('should enforce camelCase for operation names', () => {
    const invalidOperation = {
      name: 'CreateReport',
      input: 'ReportInput',
      output: 'Report',
      method: 'POST',
    };

    const result = OperationSchema.safeParse(invalidOperation);
    expect(result.success).toBe(false);
  });

  it('should allow optional description', () => {
    const operationWithDescription = {
      name: 'createReport',
      description: 'Creates a new pothole report',
      input: 'ReportInput',
      output: 'Report',
      method: 'POST',
    };

    const result = OperationSchema.safeParse(operationWithDescription);
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.description).toBe('Creates a new pothole report');
    }
  });

  it('should allow optional path parameter', () => {
    const operationWithPath = {
      name: 'getReport',
      input: 'string',
      output: 'Report',
      method: 'GET',
      path: '/reports/:id',
    };

    const result = OperationSchema.safeParse(operationWithPath);
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.path).toBe('/reports/:id');
    }
  });
});

describe('ServiceSchema', () => {
  it('should validate a complete service', () => {
    const validService = {
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
    };

    const result = ServiceSchema.safeParse(validService);
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.operations).toHaveLength(2);
    }
  });

  it('should require service name', () => {
    const invalidService = {
      operations: [
        {
          name: 'createReport',
          input: 'ReportInput',
          output: 'Report',
          method: 'POST',
        },
      ],
    };

    const result = ServiceSchema.safeParse(invalidService);
    expect(result.success).toBe(false);
  });

  it('should require at least one operation', () => {
    const invalidService = {
      name: 'ReportService',
      operations: [],
    };

    const result = ServiceSchema.safeParse(invalidService);
    expect(result.success).toBe(false);
  });

  it('should enforce PascalCase for service names', () => {
    const invalidService = {
      name: 'reportService',
      operations: [
        {
          name: 'createReport',
          input: 'ReportInput',
          output: 'Report',
          method: 'POST',
        },
      ],
    };

    const result = ServiceSchema.safeParse(invalidService);
    expect(result.success).toBe(false);
  });

  it('should allow optional description', () => {
    const serviceWithDescription = {
      name: 'ReportService',
      description: 'Manages pothole reports',
      operations: [
        {
          name: 'createReport',
          input: 'ReportInput',
          output: 'Report',
          method: 'POST',
        },
      ],
    };

    const result = ServiceSchema.safeParse(serviceWithDescription);
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.description).toBe('Manages pothole reports');
    }
  });
});

