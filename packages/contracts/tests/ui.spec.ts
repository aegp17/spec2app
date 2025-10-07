import { describe, it, expect } from 'vitest';

import { UISchema } from '../src/ui';

describe('UISchema', () => {
  it('should validate complete UI configuration', () => {
    const validUI = {
      routes: ['/', '/reports', '/reports/:id'],
      components: ['ReportForm', 'ReportList', 'MapView'],
    };

    const result = UISchema.safeParse(validUI);
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.routes).toHaveLength(3);
      expect(result.data.components).toHaveLength(3);
    }
  });

  it('should require routes array', () => {
    const invalidUI = {
      components: ['ReportForm'],
    };

    const result = UISchema.safeParse(invalidUI);
    expect(result.success).toBe(false);
  });

  it('should require components array', () => {
    const invalidUI = {
      routes: ['/'],
    };

    const result = UISchema.safeParse(invalidUI);
    expect(result.success).toBe(false);
  });

  it('should require at least one route', () => {
    const invalidUI = {
      routes: [],
      components: ['ReportForm'],
    };

    const result = UISchema.safeParse(invalidUI);
    expect(result.success).toBe(false);
  });

  it('should require at least one component', () => {
    const invalidUI = {
      routes: ['/'],
      components: [],
    };

    const result = UISchema.safeParse(invalidUI);
    expect(result.success).toBe(false);
  });

  it('should validate route format', () => {
    const validUI = {
      routes: ['/', '/reports', '/reports/:id', '/users/:userId/posts/:postId'],
      components: ['ReportForm'],
    };

    const result = UISchema.safeParse(validUI);
    expect(result.success).toBe(true);
  });

  it('should enforce PascalCase for component names', () => {
    const invalidUI = {
      routes: ['/'],
      components: ['reportForm', 'report_list'],
    };

    const result = UISchema.safeParse(invalidUI);
    expect(result.success).toBe(false);
  });

  it('should allow optional theme configuration', () => {
    const uiWithTheme = {
      routes: ['/'],
      components: ['ReportForm'],
      theme: 'light',
    };

    const result = UISchema.safeParse(uiWithTheme);
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.theme).toBe('light');
    }
  });

  it('should allow optional layout configuration', () => {
    const uiWithLayout = {
      routes: ['/'],
      components: ['ReportForm'],
      layout: 'sidebar',
    };

    const result = UISchema.safeParse(uiWithLayout);
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.layout).toBe('sidebar');
    }
  });
});

