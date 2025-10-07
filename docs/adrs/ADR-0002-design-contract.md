# ADR-0002: Design Contract as Canonical Interface

## Status

Accepted

## Context

Spec2App uses multiple AI agents (Analyst, Orchestrator, Coder) that need to communicate and pass information between each other. We need a structured, type-safe way to represent application specifications.

## Decision

We will use a **Design Contract** as the canonical interface between all agents. The Design Contract is a strongly-typed JSON schema validated with Zod.

### Schema Structure

```typescript
{
  metadata: {
    name: string;          // PascalCase app name
    domain: string;        // kebab-case domain
    locale: string;        // xx-XX format
    version?: string;
    description?: string;
  },
  entities: Array<{
    name: string;          // PascalCase
    attributes: Array<{
      name: string;        // camelCase
      type: AttributeType; // string|number|boolean|date|uuid|enum|geo
      required: boolean;
      validation?: string;
      description?: string;
    }>;
    description?: string;
  }>,
  services: Array<{
    name: string;          // PascalCase, ends with 'Service'
    operations: Array<{
      name: string;        // camelCase
      input: string;
      output: string;
      method: HTTPMethod;  // GET|POST|PUT|PATCH|DELETE
      path?: string;
      description?: string;
    }>;
    description?: string;
  }>,
  ui: {
    routes: string[];      // Array of routes
    components: string[];  // Array of PascalCase component names
    theme?: string;
    layout?: string;
  }
}
```

### Validation

- **Zod**: Runtime validation with excellent TypeScript integration
- **Strict Naming**: Enforces naming conventions (PascalCase, camelCase, kebab-case)
- **Type Safety**: Full end-to-end type safety from generation to consumption

## Consequences

### Positive

- **Single Source of Truth**: All agents work with the same data structure
- **Type Safety**: Compile-time and runtime validation
- **Extensibility**: Easy to add new fields without breaking existing agents
- **Testability**: Easy to create mock contracts for testing
- **Documentation**: Schema serves as living documentation

### Negative

- **Schema Evolution**: Changes to the schema require coordinating all agents
- **Complexity**: Might be over-engineered for simple apps
- **Learning Curve**: Team needs to understand the schema structure

## Agent Workflow

1. **Analyst**: Natural language → Design Contract
2. **Orchestrator**: Design Contract → Validated & Normalized Contract
3. **Coder**: Validated Contract → Code, OpenAPI, Tests

## Alternatives Considered

1. **Protobuf**: Rejected - overkill for JavaScript/TypeScript project
2. **JSON Schema**: Rejected - Zod provides better TypeScript integration
3. **GraphQL Schema**: Rejected - not appropriate for internal data structure
4. **Free-form JSON**: Rejected - no validation or type safety

## References

- [Zod Documentation](https://zod.dev/)
- [Design by Contract](https://en.wikipedia.org/wiki/Design_by_contract)

