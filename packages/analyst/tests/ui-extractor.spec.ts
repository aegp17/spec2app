import { describe, it, expect } from 'vitest';

import { UIExtractor } from '../src/ui-extractor';

describe('UIExtractor', () => {
  const extractor = new UIExtractor();

  it('should extract routes from text', () => {
    const text = 'The app should have a home page (/), reports page (/reports), and report detail page (/reports/:id).';
    
    const ui = extractor.extract(text);
    
    expect(ui.routes).toContain('/');
    expect(ui.routes).toContain('/reports');
    expect(ui.routes).toContain('/reports/:id');
  });

  it('should extract component names', () => {
    const text = 'Create ReportForm, ReportList, and MapView components.';
    
    const ui = extractor.extract(text);
    
    expect(ui.components).toContain('ReportForm');
    expect(ui.components).toContain('ReportList');
    expect(ui.components).toContain('MapView');
  });

  it('should infer routes from entity names', () => {
    const text = 'We need pages for User management.';
    
    const ui = extractor.extract(text, ['User']);
    
    expect(ui.routes.length).toBeGreaterThan(0);
  });

  it('should infer components from entity names', () => {
    const text = 'Build a UI for managing Tasks.';
    
    const ui = extractor.extract(text, ['Task']);
    
    expect(ui.components.length).toBeGreaterThan(0);
    const componentStr = ui.components.join(',');
    expect(componentStr.toLowerCase()).toContain('task');
  });

  it('should handle explicit route definitions', () => {
    const text = 'Routes: /, /login, /dashboard, /profile.';
    
    const ui = extractor.extract(text);
    
    expect(ui.routes).toContain('/');
    expect(ui.routes).toContain('/login');
    expect(ui.routes).toContain('/dashboard');
    expect(ui.routes).toContain('/profile');
  });

  it('should extract theme preference', () => {
    const text = 'Use a dark theme for the application.';
    
    const ui = extractor.extract(text);
    
    expect(ui.theme).toBe('dark');
  });

  it('should extract layout preference', () => {
    const text = 'The app should use a sidebar layout.';
    
    const ui = extractor.extract(text);
    
    expect(ui.layout).toBe('sidebar');
  });

  it('should provide default route if none specified', () => {
    const text = 'Create a simple app.';
    
    const ui = extractor.extract(text);
    
    expect(ui.routes).toContain('/');
  });
});

