# Spec2App 🚀

**Natural Language to Modular App Generator**

Spec2App transforms specifications in natural language (e.g., "create an app to report potholes in Miami") into engineering artifacts and executable code. The system uses interoperating AI agents to analyze requirements, design architecture, and generate production-ready applications.

## 🎯 Features

- **Natural Language Input**: Describe your app in plain English
- **Multi-Agent System**: Analyst, Orchestrator, and Coder agents work together
- **Full-Stack Generation**: React + Vite frontend, NestJS backend
- **Design Contract**: Canonical JSON interface between all agents
- **Type-Safe**: TypeScript end-to-end with strict mode
- **Test-Driven**: Comprehensive test coverage with Vitest
- **Production Ready**: ESLint, Prettier, CI/CD, Docker support

## 📦 Monorepo Structure

```
spec2app/
├── apps/
│   ├── api/          # NestJS backend API
│   └── web/          # React + Vite frontend
├── packages/
│   ├── contracts/    # Design Contract schemas (Zod)
│   ├── ui-kit/       # Shared UI components
│   └── sdk/          # Auto-generated TypeScript SDK
├── tools/
│   ├── codegen/      # Code generation utilities
│   └── scripts/      # Build and deployment scripts
├── docs/
│   ├── adrs/         # Architecture Decision Records
│   ├── openapi/      # OpenAPI specifications
│   └── uml/          # UML diagrams
└── .github/          # CI/CD workflows
```

## 🚀 Quick Start

### Prerequisites

- Node.js >= 18.0.0
- pnpm >= 8.0.0

### Installation

```bash
# Install pnpm if not already installed
npm install -g pnpm

# Install dependencies
pnpm install

# Run tests
pnpm test

# Build all packages
pnpm build
```

### Development

```bash
# Run all apps in development mode
pnpm dev

# Run tests in watch mode
pnpm test:watch

# Lint and format code
pnpm lint:fix
pnpm format
```

## 🏗️ Architecture

Spec2App uses a **multi-agent architecture** with a canonical **Design Contract** as the communication interface:

1. **Analyst Agent**: Extracts entities, services, and requirements from natural language
2. **Orchestrator**: Validates, normalizes, and ensures consistency
3. **Coder Agent**: Generates OpenAPI specs, backend code, frontend components, and tests

For detailed architecture decisions, see [ADR-0001](./docs/adrs/ADR-0001-architecture.md).

## 🧪 Testing

We follow **Test-Driven Development (TDD)**:

```bash
# Run all tests
pnpm test

# Run tests with coverage
pnpm test:coverage

# Run tests for a specific package
pnpm --filter @spec2app/contracts test
```

Current test coverage: **100%** on core packages ✅

## 📋 Design Contract

The Design Contract is the canonical interface between agents. It's a strongly-typed JSON schema validated with Zod:

```typescript
import { DesignContractSchema } from '@spec2app/contracts';

const contract = {
  metadata: {
    name: 'PotholeReporter',
    domain: 'civic-tech',
    locale: 'en-US',
  },
  entities: [
    {
      name: 'Report',
      attributes: [
        { name: 'id', type: 'uuid', required: true },
        { name: 'location', type: 'geo', required: true },
        { name: 'status', type: 'enum', required: true, validation: 'OPEN|CLOSED' },
      ],
    },
  ],
  services: [
    {
      name: 'ReportService',
      operations: [
        { name: 'createReport', input: 'ReportInput', output: 'Report', method: 'POST' },
      ],
    },
  ],
  ui: {
    routes: ['/', '/reports'],
    components: ['ReportForm', 'ReportList', 'MapView'],
  },
};

const result = DesignContractSchema.safeParse(contract);
```

## 🛠️ Tech Stack

- **Language**: TypeScript (strict mode)
- **Backend**: NestJS, Prisma ORM, PostgreSQL
- **Frontend**: React, Vite, Zustand, Tailwind CSS
- **Testing**: Vitest, Supertest, Playwright
- **Quality**: ESLint, Prettier, Husky, lint-staged
- **CI/CD**: GitHub Actions
- **Containerization**: Docker, docker-compose

## 📚 Documentation

- [Architecture Decision Records](./docs/adrs/)
- [Design Document](./CodeVibe_Spec2App_DesignDoc.pdf)
- [Contributing Guidelines](./CONTRIBUTING.md) _(coming soon)_

## 🗺️ Roadmap

### Phase 0: Foundations ✅
- [x] Monorepo structure with pnpm workspaces
- [x] TypeScript, ESLint, Prettier configuration
- [x] Design Contract schemas with Zod
- [x] CI/CD pipeline (GitHub Actions)

### Phase 1: Analyst Agent 🚧
- [ ] NLP prompt templates
- [ ] Entity and service extraction
- [ ] Non-functional requirements parsing
- [ ] Backlog generation (epics → stories)

### Phase 2: Orchestrator 📋
- [ ] Design Contract validation
- [ ] Consistency checks
- [ ] Architecture pattern selection
- [ ] Normalization rules

### Phase 3: Coder Agent 📋
- [ ] OpenAPI specification generation
- [ ] NestJS controller/service scaffolding
- [ ] Prisma schema generation
- [ ] React component generation
- [ ] Test generation

### Phase 4: Documentation & Demo 📋
- [ ] README generation
- [ ] ADR generation
- [ ] UML diagram generation
- [ ] Docker Compose setup
- [ ] Demo: "Pothole Reporter" app

## 🤝 Contributing

Contributions are welcome! Please read our [Contributing Guidelines](./CONTRIBUTING.md) _(coming soon)_.

## 📄 License

MIT License - see [LICENSE](./LICENSE) for details.

## 👥 Authors

**CodeVibe Team**

---

**Note**: This project is under active development. The MVP is targeted for December 2025.
CodeVibe Spec2App turns natural language specs (e.g., “create an app to report potholes in Miami”) into engineering artifacts and executable code. It uses agents: Analyst (NLP → requirements) and Coder (architecture, UML, API, React/Node). Future: Modeler, DocWriter, and QA.
