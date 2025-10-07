# Multi-stage build for Spec2App API

# Stage 1: Build
FROM node:20-alpine AS builder

# Install pnpm
RUN corepack enable && corepack prepare pnpm@8.15.0 --activate

WORKDIR /app

# Copy package files
COPY package.json pnpm-workspace.yaml pnpm-lock.yaml ./
COPY packages/contracts/package.json ./packages/contracts/
COPY packages/analyst/package.json ./packages/analyst/
COPY packages/orchestrator/package.json ./packages/orchestrator/
COPY apps/api/package.json ./apps/api/

# Install dependencies
RUN pnpm install --no-frozen-lockfile

# Copy source code
COPY tsconfig.json ./
COPY packages/ ./packages/
COPY apps/api/ ./apps/api/

# Build all packages
RUN pnpm build

# Stage 2: Production
FROM node:20-alpine AS runner

# Install pnpm
RUN corepack enable && corepack prepare pnpm@8.15.0 --activate

WORKDIR /app

# Copy package files
COPY package.json pnpm-workspace.yaml pnpm-lock.yaml ./
COPY packages/contracts/package.json ./packages/contracts/
COPY packages/analyst/package.json ./packages/analyst/
COPY packages/orchestrator/package.json ./packages/orchestrator/
COPY apps/api/package.json ./apps/api/

# Install production dependencies only
RUN pnpm install --no-frozen-lockfile --prod

# Copy built files from builder
COPY --from=builder /app/packages/contracts/dist ./packages/contracts/dist
COPY --from=builder /app/packages/analyst/dist ./packages/analyst/dist
COPY --from=builder /app/packages/orchestrator/dist ./packages/orchestrator/dist
COPY --from=builder /app/apps/api/dist ./apps/api/dist

# Set environment
ENV NODE_ENV=production
ENV PORT=3000
ENV HOST=0.0.0.0

# Expose port
EXPOSE 3000

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD node -e "require('http').get('http://localhost:3000/health', (r) => { process.exit(r.statusCode === 200 ? 0 : 1); })"

# Start the application
CMD ["node", "apps/api/dist/index.js"]

