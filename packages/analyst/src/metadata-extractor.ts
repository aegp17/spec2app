import type { Metadata } from '@spec2app/contracts';

/**
 * MetadataExtractor
 * Extracts application metadata from natural language text
 */
export class MetadataExtractor {
  /**
   * Extracts metadata from natural language specification
   */
  extract(text: string): Metadata {
    const name = this.extractName(text);
    const domain = this.extractDomain(text);
    const locale = this.extractLocale(text);
    const description = this.extractDescription(text);

    const metadata: Metadata = {
      name,
      domain,
      locale,
    };

    if (description) {
      metadata.description = description;
    }

    return metadata;
  }

  /**
   * Extracts application name from text
   */
  private extractName(text: string): string {
    // Pattern to find app name
    const patterns = [
      /(?:called|named)\s+([A-Z][a-zA-Z]*)/,
      /(?:create|build)\s+([A-Z][a-zA-Z]*),/,
      /([A-Z][a-zA-Z]*),\s+(?:a|an)/,
      /(?:create|build)\s+(?:an?\s+)?(?:app\s+)?([A-Z][a-zA-Z]+)/,
    ];

    for (const pattern of patterns) {
      const match = text.match(pattern);
      if (match && this.isValidAppName(match[1])) {
        return match[1];
      }
    }

    // Generate default name from domain/description
    const domain = this.extractDomain(text);
    return this.generateNameFromDomain(domain);
  }

  /**
   * Extracts domain from text
   */
  private extractDomain(text: string): string {
    const lowerText = text.toLowerCase();

    const domainMap: Record<string, string> = {
      'civic': 'civic-tech',
      'community': 'civic-tech',
      'government': 'civic-tech',
      'productivity': 'productivity',
      'task': 'productivity',
      'todo': 'productivity',
      'project management': 'productivity',
      'e-commerce': 'e-commerce',
      'shop': 'e-commerce',
      'store': 'e-commerce',
      'selling': 'e-commerce',
      'social': 'social',
      'networking': 'social',
      'chat': 'social',
      'healthcare': 'healthcare',
      'medical': 'healthcare',
      'education': 'education',
      'learning': 'education',
      'finance': 'finance',
      'banking': 'finance',
      'payment': 'finance',
    };

    for (const [keyword, domain] of Object.entries(domainMap)) {
      if (lowerText.includes(keyword)) {
        return domain;
      }
    }

    // Default domain
    return 'general';
  }

  /**
   * Extracts locale from text
   */
  private extractLocale(text: string): string {
    // Pattern to find locale
    const localePattern = /\b([a-z]{2}-[A-Z]{2})\b/;
    const match = text.match(localePattern);
    
    if (match) {
      return match[1];
    }

    // Check for language mentions
    const languageMap: Record<string, string> = {
      'spanish': 'es-ES',
      'french': 'fr-FR',
      'german': 'de-DE',
      'italian': 'it-IT',
      'portuguese': 'pt-PT',
      'chinese': 'zh-CN',
      'japanese': 'ja-JP',
    };

    const lowerText = text.toLowerCase();
    for (const [language, locale] of Object.entries(languageMap)) {
      if (lowerText.includes(language)) {
        return locale;
      }
    }

    // Default to English US
    return 'en-US';
  }

  /**
   * Extracts description from text
   */
  private extractDescription(text: string): string | undefined {
    // Take the first sentence as description
    const firstSentence = text.split(/[.!?]/)[0].trim();
    
    if (firstSentence.length > 10 && firstSentence.length < 200) {
      return firstSentence;
    }

    return undefined;
  }

  /**
   * Checks if a name is valid for an app
   */
  private isValidAppName(name: string): boolean {
    // Should be PascalCase and not a common word
    const commonWords = ['Create', 'Build', 'Add', 'Make', 'The', 'A', 'An'];
    return /^[A-Z][a-zA-Z]*$/.test(name) && 
           name.length >= 3 && 
           !commonWords.includes(name);
  }

  /**
   * Generates a name from domain
   */
  private generateNameFromDomain(domain: string): string {
    const nameMap: Record<string, string> = {
      'civic-tech': 'CivicApp',
      'productivity': 'TaskManager',
      'e-commerce': 'ShopApp',
      'social': 'SocialHub',
      'healthcare': 'HealthApp',
      'education': 'LearnHub',
      'finance': 'FinanceApp',
      'general': 'MyApp',
    };

    return nameMap[domain] || 'MyApp';
  }
}

