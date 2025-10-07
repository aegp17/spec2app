import { describe, it, expect } from 'vitest';

import { MetadataSchema } from '../src/metadata';

describe('MetadataSchema', () => {
  it('should validate correct metadata', () => {
    const validMetadata = {
      name: 'PotholeReporter',
      domain: 'civic-tech',
      locale: 'en-US',
      version: '1.0.0',
      description: 'An app to report potholes in Miami',
    };

    const result = MetadataSchema.safeParse(validMetadata);
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.name).toBe('PotholeReporter');
      expect(result.data.domain).toBe('civic-tech');
    }
  });

  it('should require name field', () => {
    const invalidMetadata = {
      domain: 'civic-tech',
      locale: 'en-US',
    };

    const result = MetadataSchema.safeParse(invalidMetadata);
    expect(result.success).toBe(false);
  });

  it('should require domain field', () => {
    const invalidMetadata = {
      name: 'PotholeReporter',
      locale: 'en-US',
    };

    const result = MetadataSchema.safeParse(invalidMetadata);
    expect(result.success).toBe(false);
  });

  it('should validate locale format', () => {
    const validMetadata = {
      name: 'PotholeReporter',
      domain: 'civic-tech',
      locale: 'es-ES',
    };

    const result = MetadataSchema.safeParse(validMetadata);
    expect(result.success).toBe(true);
  });

  it('should reject invalid locale format', () => {
    const invalidMetadata = {
      name: 'PotholeReporter',
      domain: 'civic-tech',
      locale: 'invalid',
    };

    const result = MetadataSchema.safeParse(invalidMetadata);
    expect(result.success).toBe(false);
  });

  it('should accept optional version field', () => {
    const metadataWithVersion = {
      name: 'PotholeReporter',
      domain: 'civic-tech',
      locale: 'en-US',
      version: '2.0.0',
    };

    const result = MetadataSchema.safeParse(metadataWithVersion);
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.version).toBe('2.0.0');
    }
  });

  it('should accept optional description field', () => {
    const metadataWithDescription = {
      name: 'PotholeReporter',
      domain: 'civic-tech',
      locale: 'en-US',
      description: 'Report potholes easily',
    };

    const result = MetadataSchema.safeParse(metadataWithDescription);
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.description).toBe('Report potholes easily');
    }
  });

  it('should enforce PascalCase for name', () => {
    const invalidName = {
      name: 'pothole_reporter',
      domain: 'civic-tech',
      locale: 'en-US',
    };

    const result = MetadataSchema.safeParse(invalidName);
    expect(result.success).toBe(false);
  });

  it('should enforce kebab-case for domain', () => {
    const invalidDomain = {
      name: 'PotholeReporter',
      domain: 'CivicTech',
      locale: 'en-US',
    };

    const result = MetadataSchema.safeParse(invalidDomain);
    expect(result.success).toBe(false);
  });
});

