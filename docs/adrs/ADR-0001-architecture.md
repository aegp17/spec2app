# ADR-0001: System Architecture

## Status
Accepted

## Date
2025-10-07

## Context
Spec2App requires a robust, modular architecture to transform natural language specifications into executable applications. The system must support multiple interoperating agents (Analyst, Orchestrator, Coder) that communicate through a standardized interface.

## Decision
We will implement a **multi-agent architecture with a canonical Design Contract** as the primary communication interface between agents.

### Key Architectural Components:

1. **Design Contract (Canonical Interface)**
   - JSON schema validated with Zod
   - Contains: metadata, entities, services, APIs, UI, NFRs, risks, WBS
   - Single source of truth for all agents

2. **Agent-Based Architecture**
   - **Analyst Agent**: NLP → extracts entities, services, requirements
   - **Orchestrator**: Validates, normalizes, ensures consistency
   - **Coder Agent**: Generates code artifacts (OpenAPI, React, NestJS, tests)

3. **Monorepo Structure (pnpm workspaces)**
   - `apps/`: API (NestJS) and Web (React+Vite)
   - `packages/`: Shared contracts, UI kit, SDK
   - `tools/`: Code generators and scripts
   - `docs/`: ADRs, OpenAPI specs, UML diagrams

4. **Technology Stack**
   - TypeScript end-to-end (strict mode)
   - Backend: NestJS with Prisma ORM
   - Frontend: React + Vite + Zustand
   - Testing: Vitest + Supertest + Playwright
   - Quality: ESLint + Prettier + Husky

## Consequences

### Positive
- Clear separation of concerns
- Type-safe communication between agents
- Testable and modular design
- Scalable to add more agents (DocWriter, QA, Modeler)
- Contract-first approach ensures consistency

### Negative
- Complexity in maintaining Design Contract schema
- Learning curve for multi-agent coordination
- Need to version Design Contract carefully

## Alternatives Considered

1. **Monolithic code generator**
   - Rejected: Less flexible, harder to extend

2. **Microservices per agent**
   - Deferred: Overhead not justified for MVP
   - May revisit for production scale

3. **LangChain/LlamaIndex frameworks**
   - Considered: May integrate for NLP tasks
   - Decision: Use as tools, not core architecture

## References
- Design Document v1.0
- Clean Architecture (Robert C. Martin)
- Hexagonal Architecture (Alistair Cockburn)


