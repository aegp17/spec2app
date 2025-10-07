# ADR-0001: Monorepo Structure with pnpm Workspaces

## Status

Accepted

## Context

Spec2App is a multi-agent system that needs to share code between different components (Analyst, Orchestrator, Coder agents) while maintaining clear boundaries and independent deployability.

## Decision

We will use a **monorepo structure** with **pnpm workspaces** to organize the codebase.

### Structure

```
spec2app/
├── packages/
│   ├── contracts/     # Shared Design Contract schemas (Zod)
│   └── analyst/       # Analyst Agent implementation
├── apps/              # Future: API and Web applications
├── tools/             # Future: Code generation tools
└── docs/              # Documentation and ADRs
```

### Key Benefits

1. **Shared Dependencies**: Common packages like TypeScript, ESLint, Prettier are installed once at the root
2. **Type Safety**: TypeScript project references ensure type-safe imports between packages
3. **Atomic Changes**: Related changes across packages can be committed together
4. **Fast CI/CD**: pnpm's efficient installation and caching speeds up CI
5. **Independent Versioning**: Each package can be versioned independently if needed

### Technologies

- **pnpm workspaces**: Fast, disk-efficient package manager
- **TypeScript**: Strict mode with project references
- **Vitest**: Fast unit testing with excellent TypeScript support
- **ESLint + Prettier**: Code quality and formatting

## Consequences

### Positive

- Single `node_modules` at root saves disk space
- Shared configuration reduces duplication
- Easy to refactor and move code between packages
- Better developer experience with unified tooling

### Negative

- Learning curve for developers unfamiliar with monorepos
- Build order matters (contracts must build before analyst)
- More complex CI/CD setup compared to single repo

## Alternatives Considered

1. **Multi-repo**: Rejected due to difficulty in coordinating changes across repos
2. **Lerna**: Rejected in favor of pnpm's native workspace support (simpler, faster)
3. **Nx/Turborepo**: Deferred for now, may add later for advanced caching

## References

- [pnpm Workspaces Documentation](https://pnpm.io/workspaces)
- [TypeScript Project References](https://www.typescriptlang.org/docs/handbook/project-references.html)

