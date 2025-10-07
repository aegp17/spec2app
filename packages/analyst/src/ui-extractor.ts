import type { UI } from '@spec2app/contracts';

/**
 * UIExtractor
 * Extracts UI configuration from natural language text
 */
export class UIExtractor {
  /**
   * Extracts UI configuration from natural language specification
   */
  extract(text: string, entityNames: string[] = []): UI {
    const routes = this.extractRoutes(text, entityNames);
    const components = this.extractComponents(text, entityNames);
    const theme = this.extractTheme(text);
    const layout = this.extractLayout(text);

    const ui: UI = {
      routes: routes.length > 0 ? routes : ['/'],
      components: components.length > 0 ? components : this.generateDefaultComponents(entityNames),
    };

    if (theme) ui.theme = theme;
    if (layout) ui.layout = layout;

    return ui;
  }

  /**
   * Extracts routes from text
   */
  private extractRoutes(text: string, entityNames: string[]): string[] {
    const routes = new Set<string>();

    // Always include home route
    routes.add('/');

    // Pattern to find explicit routes
    const routePattern = /\/[a-z0-9/:_-]*/gi;
    let match;
    while ((match = routePattern.exec(text)) !== null) {
      if (match[0].length > 1) {
        routes.add(match[0]);
      }
    }

    // Generate routes from entity names
    for (const entityName of entityNames) {
      const lower = entityName.toLowerCase();
      const pluralized = this.pluralize(lower);
      routes.add(`/${pluralized}`);
      routes.add(`/${pluralized}/:id`);
    }

    // Look for common page mentions
    const pagePatterns = [
      /(?:login|signin)\s+page/i,
      /(?:register|signup)\s+page/i,
      /dashboard/i,
      /profile/i,
      /settings/i,
    ];

    for (const pattern of pagePatterns) {
      if (pattern.test(text)) {
        const pageName = pattern.source.split(/[\\(|]/)[0].replace(/\s+page/, '');
        routes.add(`/${pageName.toLowerCase()}`);
      }
    }

    return Array.from(routes).sort();
  }

  /**
   * Extracts component names from text
   */
  private extractComponents(text: string, entityNames: string[]): string[] {
    const components = new Set<string>();

    // Pattern to find PascalCase component names
    const componentPattern = /([A-Z][a-zA-Z]*(?:Form|List|View|Card|Table|Modal|Dialog|Button))/g;
    let match;
    while ((match = componentPattern.exec(text)) !== null) {
      components.add(match[1]);
    }

    // Generate components from entity names
    for (const entityName of entityNames) {
      components.add(`${entityName}Form`);
      components.add(`${entityName}List`);
    }

    return Array.from(components).sort();
  }

  /**
   * Extracts theme preference from text
   */
  private extractTheme(text: string): string | undefined {
    const lowerText = text.toLowerCase();
    
    if (lowerText.includes('dark theme') || lowerText.includes('dark mode')) {
      return 'dark';
    } else if (lowerText.includes('light theme') || lowerText.includes('light mode')) {
      return 'light';
    }
    
    return undefined;
  }

  /**
   * Extracts layout preference from text
   */
  private extractLayout(text: string): string | undefined {
    const lowerText = text.toLowerCase();
    
    if (lowerText.includes('sidebar')) {
      return 'sidebar';
    } else if (lowerText.includes('top navigation') || lowerText.includes('navbar')) {
      return 'navbar';
    } else if (lowerText.includes('dashboard layout')) {
      return 'dashboard';
    }
    
    return undefined;
  }

  /**
   * Generates default components from entity names
   */
  private generateDefaultComponents(entityNames: string[]): string[] {
    const components: string[] = [];

    for (const entityName of entityNames) {
      components.push(`${entityName}Form`);
      components.push(`${entityName}List`);
    }

    // If no entities, add generic components
    if (components.length === 0) {
      components.push('HomePage');
    }

    return components;
  }

  /**
   * Simple pluralization
   */
  private pluralize(word: string): string {
    if (word.endsWith('y')) {
      return word.slice(0, -1) + 'ies';
    } else if (word.endsWith('s') || word.endsWith('x') || word.endsWith('z')) {
      return word + 'es';
    } else {
      return word + 's';
    }
  }
}

