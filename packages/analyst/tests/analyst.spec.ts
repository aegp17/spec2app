import { describe, it, expect } from 'vitest';

import { Analyst } from '../src/analyst';

describe('Analyst', () => {
  const analyst = new Analyst();

  it('should analyze complete specification and return design contract', () => {
    const specification = `
      Create PotholeReporter, a civic tech app for reporting potholes in Miami.
      
      We need a Report entity with id (uuid), location (geo), description (string), 
      and status (enum: OPEN, IN_PROGRESS, CLOSED).
      
      Create ReportService with operations to create, get, update, and list reports.
      
      The UI should have pages for home (/), reports list (/reports), and report details (/reports/:id).
      Include components: ReportForm, ReportList, MapView.
    `;

    const contract = analyst.analyze(specification);

    expect(contract.metadata.name).toBe('PotholeReporter');
    expect(contract.metadata.domain).toBe('civic-tech');
    expect(contract.entities).toHaveLength(1);
    expect(contract.entities[0].name).toBe('Report');
    expect(contract.services).toHaveLength(1);
    expect(contract.services[0].name).toBe('ReportService');
    expect(contract.ui.routes).toContain('/');
    expect(contract.ui.components).toContain('ReportForm');
  });

  it('should handle multiple entities', () => {
    const specification = `
      Create TaskManager for productivity.
      We need User entity with id, name, email.
      We need Task entity with id, title, completed, userId.
    `;

    const contract = analyst.analyze(specification);

    expect(contract.entities.length).toBeGreaterThanOrEqual(2);
    const entityNames = contract.entities.map(e => e.name);
    expect(entityNames).toContain('User');
    expect(entityNames).toContain('Task');
  });

  it('should handle simple specifications', () => {
    const specification = 'Create a simple todo app.';

    const contract = analyst.analyze(specification);

    expect(contract.metadata.name).toBeTruthy();
    expect(contract.entities.length).toBeGreaterThan(0);
    expect(contract.services.length).toBeGreaterThan(0);
    expect(contract.ui.routes.length).toBeGreaterThan(0);
  });

  it('should validate generated contract', () => {
    const specification = `
      Create BlogApp for content management.
      Post entity with id, title, content, publishedAt.
      CRUD operations for posts.
    `;

    const contract = analyst.analyze(specification);

    // Should not throw
    expect(() => {
      const result = analyst.validate(contract);
      expect(result.success).toBe(true);
    }).not.toThrow();
  });

  it('should return validation errors for incomplete analysis', () => {
    const invalidContract = {
      metadata: {
        name: 'Test',
        domain: 'test',
        locale: 'en-US',
      },
      entities: [],
      services: [],
      ui: { routes: [], components: [] },
    };

    const result = analyst.validate(invalidContract);

    expect(result.success).toBe(false);
    expect(result.errors).toBeDefined();
  });
});

