import { describe, it, expect } from 'vitest';

import { MetadataExtractor } from '../src/metadata-extractor';

describe('MetadataExtractor', () => {
  const extractor = new MetadataExtractor();

  it('should extract app name from text', () => {
    const text = 'Create an app called PotholeReporter for reporting potholes in Miami.';
    
    const metadata = extractor.extract(text);
    
    expect(metadata.name).toBe('PotholeReporter');
  });

  it('should infer domain from description', () => {
    const text = 'Build a civic tech application for community reporting.';
    
    const metadata = extractor.extract(text);
    
    expect(metadata.domain).toBe('civic-tech');
  });

  it('should extract locale from text', () => {
    const text = 'Create a Spanish language app (es-ES) for task management.';
    
    const metadata = extractor.extract(text);
    
    expect(metadata.locale).toBe('es-ES');
  });

  it('should default to en-US locale if not specified', () => {
    const text = 'Build a simple task manager.';
    
    const metadata = extractor.extract(text);
    
    expect(metadata.locale).toBe('en-US');
  });

  it('should extract description', () => {
    const text = 'Create TaskMaster, a productivity app for managing daily tasks efficiently.';
    
    const metadata = extractor.extract(text);
    
    expect(metadata.description).toContain('productivity');
    expect(metadata.description).toContain('tasks');
  });

  it('should handle productivity domain', () => {
    const text = 'Build a productivity tool for teams.';
    
    const metadata = extractor.extract(text);
    
    expect(metadata.domain).toBe('productivity');
  });

  it('should handle e-commerce domain', () => {
    const text = 'Create an e-commerce platform for selling products.';
    
    const metadata = extractor.extract(text);
    
    expect(metadata.domain).toBe('e-commerce');
  });

  it('should handle social domain', () => {
    const text = 'Build a social networking app.';
    
    const metadata = extractor.extract(text);
    
    expect(metadata.domain).toBe('social');
  });

  it('should generate default name if not specified', () => {
    const text = 'Create an app for managing tasks.';
    
    const metadata = extractor.extract(text);
    
    expect(metadata.name).toBeTruthy();
    expect(metadata.name[0]).toMatch(/[A-Z]/);
  });
});

