# Docker Deployment Guide

## 🐳 Quick Start

```bash
# Build and run with Docker Compose
docker-compose up -d

# Check container status
docker ps

# View logs
docker logs spec2app-api

# Stop containers
docker-compose down
```

## 🚀 API Endpoints

### Health Check
```bash
curl http://localhost:3000/health
```

### API Info
```bash
curl http://localhost:3000/api/info
```

### Analyze Specification
```bash
curl -X POST http://localhost:3000/api/analyze \
  -H "Content-Type: application/json" \
  -d '{
    "specification": "Create TaskManager for managing daily tasks"
  }'
```

### Validate Design Contract
```bash
curl -X POST http://localhost:3000/api/validate \
  -H "Content-Type: application/json" \
  -d '{
    "metadata": {
      "name": "TestApp",
      "domain": "test",
      "locale": "en-US"
    },
    "entities": [...],
    "services": [...],
    "ui": {...}
  }'
```

## 📦 Docker Image

- **Base**: `node:20-alpine`
- **Multi-stage build**: Builder + Runner
- **Size optimization**: Production dependencies only
- **Health check**: Built-in endpoint monitoring

## 🏗️ Build Details

### Build Arguments
- Node.js 20 Alpine
- pnpm 8.15.0
- Multi-stage for smaller image size

### Stages
1. **Builder**: Installs all dependencies and builds TypeScript
2. **Runner**: Production image with only runtime dependencies

## 🔧 Configuration

### Environment Variables

- `PORT`: Server port (default: 3000)
- `HOST`: Server host (default: 0.0.0.0)
- `NODE_ENV`: Environment (production/development)

### Ports

- **3000**: API HTTP port

## 📊 Docker Compose Services

- **spec2app-api**: Main API service
- **Network**: Bridge network for inter-service communication

## 🐛 Troubleshooting

### View logs
```bash
docker logs -f spec2app-api
```

### Restart container
```bash
docker-compose restart
```

### Rebuild image
```bash
docker build -t spec2app-api:latest .
docker-compose up -d
```

### Enter container shell
```bash
docker exec -it spec2app-api sh
```

## 📝 Example Usage

```bash
# 1. Start services
docker-compose up -d

# 2. Test health check
curl http://localhost:3000/health

# 3. Analyze a specification
curl -X POST http://localhost:3000/api/analyze \
  -H "Content-Type: application/json" \
  -d '{
    "specification": "Create a blogging platform with Post entity (id, title, content, publishedAt) and Author entity (id, name, email). CRUD operations for both. Routes: /, /posts, /authors."
  }' | jq '.'

# 4. Expected response: Complete Design Contract with:
# - Normalized metadata (name, domain, locale, version)
# - Entities with timestamps (createdAt, updatedAt)
# - Services with CRUD operations
# - UI routes and components
```

## 🎯 Production Deployment

For production deployment:

1. **Use proper secrets management** for environment variables
2. **Add reverse proxy** (nginx, Traefik)
3. **Enable HTTPS** with Let's Encrypt
4. **Add monitoring** (Prometheus, Grafana)
5. **Configure logging** (ELK stack, CloudWatch)
6. **Set up CI/CD** with GitHub Actions

## 🔐 Security

- Runs as non-root user
- Production dependencies only
- Alpine Linux base (minimal attack surface)
- Health checks enabled
- No sensitive data in image

## Performance

- **Build time**: ~2-3 minutes (with cache)
- **Image size**: ~200MB
- **Memory**: ~100MB runtime
- **CPU**: Minimal usage for typical workloads

