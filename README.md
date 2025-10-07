# Spec2App 🚀

**Transform Natural Language Specifications into Design Contracts**

Spec2App is a multi-agent system that transforms natural language descriptions (e.g., "create a task manager app") into structured Design Contracts with entities, services, and UI specifications. The system uses AI agents to analyze requirements, validate consistency, and generate production-ready architectural designs.

---

## ✨ Features

- 🗣️ **Natural Language Input**: Describe your app in plain English
- 🤖 **Multi-Agent System**: Analyst and Orchestrator agents work together
- 📝 **Design Contract**: Canonical JSON interface validated with Zod
- 🎨 **Modern Web Interface**: React + Vite + TypeScript + Tailwind CSS
- ⚡ **Fast API**: Fastify backend with type-safe endpoints
- 🧪 **Test-Driven**: 100% test coverage with Vitest
- 🐳 **Docker Ready**: Production-ready containers
- 🔒 **Type-Safe**: TypeScript strict mode end-to-end

---

## 🚀 Quick Start (3 Steps)

### Prerequisites

- **Node.js** >= 18.0.0
- **pnpm** >= 8.0.0
- **Docker** (optional, for containerized deployment)

### 1. Installation

```bash
# Clone the repository
git clone https://github.com/yourusername/spec2app.git
cd spec2app

# Install pnpm if not installed
npm install -g pnpm

# Install dependencies
pnpm install

# Build all packages
pnpm build
```

### 2. Run the Application

**Option A: Run Everything with One Command** ⭐
```bash
pnpm dev
```

This starts:
- 🔧 API at `http://localhost:3000`
- 🌐 Web at `http://localhost:5173`

**Option B: Run Services Separately**
```bash
# Terminal 1: Start API
pnpm dev:api

# Terminal 2: Start Web
pnpm dev:web
```

**Option C: Use Docker**
```bash
docker-compose up -d
```

### 3. Open and Test

Open your browser at **http://localhost:5173**

Try one of the examples:
1. Click on "Create a task manager app"
2. Click "Analyze Specification"
3. See the generated Design Contract! ✨

---

## 📸 What You'll See

```
┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┓
┃  Spec2App                    🟢 API Online    ┃
┃  Transform natural language into Contracts    ┃
┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛

Input Specification        →    Generated Contract
─────────────────────           ─────────────────────
"Create a task manager"         📊 Metadata
                                  • Name: TaskManager
[Analyze]  [Clear]                • Domain: productivity
                                  
Examples:                        📦 Entities
• Task manager                     • User (id, name, email)
• E-commerce store                 • Task (id, title, done)
• Blog platform                  
• Social network                 🔧 Services
• Healthcare app                   • TaskService (CRUD)
                                
                                 [Download JSON]
```

---

## 📦 Project Structure

```
spec2app/
├── apps/
│   ├── api/               # Fastify backend API
│   │   └── src/
│   │       └── index.ts   # Main API server
│   └── web/               # React + Vite frontend
│       └── src/
│           ├── components/    # React components
│           ├── api.ts         # API client
│           └── App.tsx        # Main app
├── packages/
│   ├── contracts/         # Design Contract schemas (Zod)
│   ├── analyst/           # Analyst Agent logic
│   └── orchestrator/      # Orchestrator Agent logic
├── docs/                  # Documentation
├── .github/               # CI/CD workflows
└── docker-compose.yml     # Docker setup
```

---

## 🏗️ Architecture

Spec2App uses a **multi-agent architecture** with a canonical **Design Contract**:

```
Natural Language
       ↓
┌──────────────┐
│   Analyst    │  Extracts entities, services, UI
└──────┬───────┘
       ↓
┌──────────────┐
│ Orchestrator │  Validates, normalizes, ensures consistency
└──────┬───────┘
       ↓
  Design Contract (JSON)
```

### Agents

1. **Analyst Agent** (`packages/analyst/`)
   - Parses natural language specifications
   - Extracts entities with attributes
   - Identifies services and operations
   - Generates UI routes and components

2. **Orchestrator** (`packages/orchestrator/`)
   - Validates Design Contracts against schemas
   - Checks for logical consistency
   - Normalizes and enriches contracts
   - Adds default fields (id, timestamps)

3. **Coder Agent** _(Coming Soon)_
   - Will generate OpenAPI specs
   - Will scaffold backend code
   - Will create frontend components

---

## 🧪 Testing

All packages have **100% test coverage** ✅

```bash
# Run all tests
pnpm test

# Run tests with coverage
pnpm test:coverage

# Run tests in watch mode
pnpm test:watch

# Run tests for specific package
pnpm --filter @spec2app/contracts test
```

---

## 📋 Design Contract Example

The Design Contract is a strongly-typed JSON schema:

```typescript
{
  "metadata": {
    "name": "TaskManager",
    "domain": "productivity",
    "locale": "en-US",
    "version": "1.0.0"
  },
  "entities": [
    {
      "name": "Task",
      "attributes": [
        { "name": "id", "type": "uuid", "required": true },
        { "name": "title", "type": "string", "required": true },
        { "name": "completed", "type": "boolean", "required": false },
        { "name": "createdAt", "type": "timestamp", "required": true },
        { "name": "updatedAt", "type": "timestamp", "required": true }
      ]
    }
  ],
  "services": [
    {
      "name": "TaskService",
      "operations": [
        { "name": "createTask", "input": "Task", "output": "Task", "method": "POST" },
        { "name": "getTasks", "input": "void", "output": "Task[]", "method": "GET" }
      ]
    }
  ],
  "ui": {
    "routes": ["/", "/tasks", "/tasks/:id"],
    "components": ["TaskForm", "TaskList"]
  }
}
```

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| **Language** | TypeScript (strict mode) |
| **Backend** | Fastify, Node.js |
| **Frontend** | React 18, Vite, Tailwind CSS |
| **Validation** | Zod |
| **Testing** | Vitest |
| **Linting** | ESLint, Prettier |
| **CI/CD** | GitHub Actions |
| **Containerization** | Docker, docker-compose |

---

## 📚 Documentation

- **[FRONTEND_GUIDE.md](./FRONTEND_GUIDE.md)** - Complete frontend guide
- **[LOCAL_TESTING.md](./LOCAL_TESTING.md)** - API testing guide with examples
- **[DOCKER.md](./DOCKER.md)** - Docker deployment guide
- **[ADRs](./docs/adrs/)** - Architecture Decision Records

---

## 🔌 API Endpoints

### Health Check
```bash
GET /health
→ { "status": "ok", "timestamp": "..." }
```

### Analyze Specification
```bash
POST /api/analyze
Content-Type: application/json

{
  "specification": "Create a blog with posts and authors"
}

→ { "success": true, "contract": { ... } }
```

### Validate Contract
```bash
POST /api/validate
Content-Type: application/json

{ ... Design Contract ... }

→ { "valid": true, "contract": { ... } }
```

---

## 🧩 Example Usage

### From the Web Interface

1. Open http://localhost:5173
2. Enter: "Create an e-commerce store with products and orders"
3. Click "Analyze Specification"
4. Download the generated JSON contract

### From the API (cURL)

```bash
curl -X POST http://localhost:3000/api/analyze \
  -H "Content-Type: application/json" \
  -d '{
    "specification": "Create a blog platform with posts and comments"
  }' | jq .
```

### From Code (TypeScript)

```typescript
import { api } from './api';

const response = await api.analyze(
  'Create a social network with users and posts'
);

console.log(response.contract);
```

---

## 🐳 Docker Deployment

```bash
# Build and run with docker-compose
docker-compose up -d

# View logs
docker logs -f spec2app-api

# Stop services
docker-compose down
```

Services:
- API: http://localhost:3000
- Web: http://localhost:5173

---

## 🗺️ Roadmap

### Phase 1: Foundation ✅ (COMPLETED)
- [x] Monorepo structure with pnpm workspaces
- [x] TypeScript, ESLint, Prettier configuration
- [x] Design Contract schemas with Zod
- [x] Analyst Agent with entity/service extraction
- [x] Orchestrator with validation and normalization
- [x] REST API with Fastify
- [x] React + Vite frontend
- [x] Docker support
- [x] CI/CD pipeline (GitHub Actions)
- [x] 100% test coverage

### Phase 2: Coder Agent 🚧 (IN PROGRESS)
- [ ] OpenAPI specification generation
- [ ] Backend code scaffolding
- [ ] Frontend component generation
- [ ] Database schema generation
- [ ] Test generation

### Phase 3: Advanced Features 📋 (PLANNED)
- [ ] Real AI/LLM integration (OpenAI, Claude)
- [ ] Advanced NLP for complex requirements
- [ ] Multiple framework support (Next.js, NestJS, etc.)
- [ ] Database support (Prisma, PostgreSQL, MongoDB)
- [ ] Authentication and authorization
- [ ] Deployment automation

---

## 🧪 Example Specifications to Try

1. **Task Manager**
   ```
   Create a task manager app with User and Task entities
   ```

2. **E-Commerce**
   ```
   Create an online store with Product, Order, and Customer entities
   ```

3. **Blog Platform**
   ```
   Create a blog with Post, Author, and Comment entities.
   Posts have title, content, and publishedAt.
   ```

4. **Social Network**
   ```
   Create a social network with User, Post, and Like entities.
   Users can create posts and like other users' posts.
   ```

5. **Healthcare App**
   ```
   Create HealthTracker with Patient and Appointment entities.
   Appointment has status: SCHEDULED, COMPLETED, CANCELLED.
   ```

---

## 🛑 Troubleshooting

### API shows "Offline" in the frontend

**Solution:**
```bash
# Check if API is running
curl http://localhost:3000/health

# If not running, start it
pnpm dev:api
```

### Port already in use

**Solution:**
```bash
# Kill process on port 3000
lsof -ti:3000 | xargs kill -9

# Kill process on port 5173
lsof -ti:5173 | xargs kill -9
```

### Build fails

**Solution:**
```bash
# Clean and reinstall
pnpm clean
pnpm install
pnpm build
```

---

## 🤝 Contributing

Contributions are welcome! Please:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'feat: add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## 📄 License

MIT License - see [LICENSE](./LICENSE) for details.

---

## 👥 Authors

**CodeVibe Team**

---

## ⭐ Show Your Support

If you find this project useful, please give it a ⭐ on GitHub!

---

**Built with ❤️ using React, TypeScript, Fastify, and Tailwind CSS**
