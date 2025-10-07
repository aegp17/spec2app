# 🧪 Guía de Pruebas Locales - Spec2App API

## ✅ Estado Actual
**La API está corriendo en: `http://localhost:3001`**

## 🚀 Inicio Rápido

### 1. Verificar que la API está corriendo
```bash
curl http://localhost:3001/health
```

**Respuesta esperada:**
```json
{
  "status": "ok",
  "timestamp": "2025-10-07T15:40:25.380Z"
}
```

---

## 📝 Pruebas de Endpoints

### 2. Ver información de la API
```bash
curl http://localhost:3001/api/info | jq '.'
```

**Respuesta esperada:**
```json
{
  "name": "Spec2App API",
  "version": "0.1.0",
  "description": "Transform natural language specifications into Design Contracts",
  "endpoints": [
    {
      "method": "POST",
      "path": "/api/analyze",
      "description": "Analyze natural language specification and generate Design Contract"
    },
    {
      "method": "POST",
      "path": "/api/validate",
      "description": "Validate and normalize a Design Contract"
    },
    {
      "method": "GET",
      "path": "/health",
      "description": "Health check endpoint"
    }
  ]
}
```

---

## 🔍 Prueba 1: Análisis Simple

### Especificación de ejemplo: Task Manager
```bash
curl -X POST http://localhost:3001/api/analyze \
  -H "Content-Type: application/json" \
  -d '{
    "specification": "Create TaskManager for managing daily tasks"
  }' | jq '.'
```

**Resultado:**
- ✅ Genera metadata con nombre, dominio, locale
- ✅ Crea entidades con timestamps automáticos
- ✅ Genera servicios CRUD
- ✅ Define rutas y componentes UI

---

## 🔍 Prueba 2: App de Blog

```bash
curl -X POST http://localhost:3001/api/analyze \
  -H "Content-Type: application/json" \
  -d '{
    "specification": "Create BlogPlatform, a blogging app. Post entity with id, title, content, publishedAt. Author entity with id, name, email. CRUD operations for both. Routes: /, /posts, /authors."
  }' | jq '.'
```

**Resultado esperado:**
```json
{
  "success": true,
  "contract": {
    "metadata": {
      "name": "BlogPlatform",
      "domain": "...",
      "locale": "en-US",
      "version": "1.0.0"
    },
    "entities": [
      {
        "name": "Author",
        "attributes": [...con timestamps automáticos]
      },
      {
        "name": "Post",
        "attributes": [...con timestamps automáticos]
      }
    ],
    "services": [
      {
        "name": "AuthorService",
        "operations": [...]
      },
      {
        "name": "PostService",
        "operations": [...]
      }
    ],
    "ui": {
      "routes": ["/", "/authors", "/posts"],
      "components": [...]
    }
  }
}
```

---

## 🔍 Prueba 3: E-Commerce App

```bash
curl -X POST http://localhost:3001/api/analyze \
  -H "Content-Type: application/json" \
  -d '{
    "specification": "Create ShopApp, an e-commerce platform. Product entity (id, name, price, stock). Order entity (id, total, status as enum: PENDING, COMPLETED, CANCELLED). CRUD for products and orders."
  }' | jq '.contract.entities'
```

**Muestra solo las entidades generadas**

---

## 🔍 Prueba 4: Validación de Design Contract

### Contrato válido
```bash
curl -X POST http://localhost:3001/api/validate \
  -H "Content-Type: application/json" \
  -d '{
    "metadata": {
      "name": "TestApp",
      "domain": "test",
      "locale": "en-US"
    },
    "entities": [
      {
        "name": "User",
        "attributes": [
          {"name": "id", "type": "uuid", "required": true},
          {"name": "name", "type": "string", "required": true}
        ]
      }
    ],
    "services": [
      {
        "name": "UserService",
        "operations": [
          {
            "name": "getUser",
            "input": "string",
            "output": "User",
            "method": "GET"
          }
        ]
      }
    ],
    "ui": {
      "routes": ["/"],
      "components": ["UserForm"]
    }
  }' | jq '.'
```

**Resultado:**
- ✅ Valida el schema
- ✅ Verifica consistencia (servicios referencian entidades existentes)
- ✅ Normaliza: agrega id, timestamps, ordena alfabéticamente

---

### Contrato inválido (para ver errores)
```bash
curl -X POST http://localhost:3001/api/validate \
  -H "Content-Type: application/json" \
  -d '{
    "metadata": {
      "name": "invalid-name",
      "domain": "test",
      "locale": "en-US"
    },
    "entities": [],
    "services": [],
    "ui": {
      "routes": [],
      "components": []
    }
  }' | jq '.'
```

**Resultado:**
```json
{
  "valid": false,
  "errors": [
    "metadata.name: Name must be in PascalCase",
    "entities: At least one entity is required",
    "services: At least one service is required",
    ...
  ]
}
```

---

## 🔍 Prueba 5: App Compleja (Pothole Reporter)

```bash
curl -X POST http://localhost:3001/api/analyze \
  -H "Content-Type: application/json" \
  -d '{
    "specification": "Create PotholeReporter, a civic tech app for reporting potholes in Miami. Report entity with id (uuid), location (geo), description (string), status (enum: OPEN, IN_PROGRESS, CLOSED), priority (number). User entity with id, name, email. ReportService with CRUD operations. UserService with authentication. Routes: /, /reports, /reports/:id, /map. Components: ReportForm, ReportList, MapView, UserProfile."
  }' | jq '.'
```

---

## 🛑 Detener la API

```bash
# Obtener el PID
cat /tmp/spec2app-api.pid

# Detener el proceso
kill $(cat /tmp/spec2app-api.pid)

# O encontrar y matar todos los procesos
pkill -f "node dist/index.js"
```

---

## 🔄 Reiniciar la API

```bash
cd /Users/aegp17/Dropbox/Mac/Documents/code/personal\ products/spec2app

# Asegurarse de que está compilada
pnpm build

# Iniciar en puerto 3001
cd apps/api
PORT=3001 node dist/index.js > /tmp/spec2app-local.log 2>&1 &
echo $! > /tmp/spec2app-api.pid

# Verificar
sleep 2
curl http://localhost:3001/health
```

---

## 📊 Ver Logs

```bash
# Ver logs en tiempo real
tail -f /tmp/spec2app-local.log

# Ver últimas 50 líneas
tail -50 /tmp/spec2app-local.log
```

---

## 🐛 Troubleshooting

### La API no responde
```bash
# Verificar que el proceso está corriendo
ps aux | grep "node dist/index.js"

# Ver si hay errores en los logs
cat /tmp/spec2app-local.log

# Reiniciar
pkill -f "node dist/index.js"
cd /Users/aegp17/Dropbox/Mac/Documents/code/personal\ products/spec2app/apps/api
PORT=3001 node dist/index.js &
```

### Puerto ocupado
```bash
# Ver qué está usando el puerto 3001
lsof -i :3001

# Cambiar a otro puerto
PORT=3002 node dist/index.js &
```

---

## 🎯 Pruebas con diferentes dominios

### Productivity App
```bash
curl -X POST http://localhost:3001/api/analyze \
  -H "Content-Type: application/json" \
  -d '{"specification": "Build a productivity tool for managing projects"}' \
  | jq '.contract.metadata.domain'
```
**Resultado:** `"productivity"`

### E-Commerce App
```bash
curl -X POST http://localhost:3001/api/analyze \
  -H "Content-Type: application/json" \
  -d '{"specification": "Create an online store for selling products"}' \
  | jq '.contract.metadata.domain'
```
**Resultado:** `"e-commerce"`

### Social App
```bash
curl -X POST http://localhost:3001/api/analyze \
  -H "Content-Type: application/json" \
  -d '{"specification": "Build a social networking platform"}' \
  | jq '.contract.metadata.domain'
```
**Resultado:** `"social"`

---

## 🌐 Probar con Postman / Insomnia

### Importar Collection (JSON)

```json
{
  "name": "Spec2App API",
  "requests": [
    {
      "name": "Health Check",
      "method": "GET",
      "url": "http://localhost:3001/health"
    },
    {
      "name": "API Info",
      "method": "GET",
      "url": "http://localhost:3001/api/info"
    },
    {
      "name": "Analyze Specification",
      "method": "POST",
      "url": "http://localhost:3001/api/analyze",
      "headers": {
        "Content-Type": "application/json"
      },
      "body": {
        "specification": "Create TaskManager for managing daily tasks"
      }
    }
  ]
}
```

---

## 📝 Ejemplos de Especificaciones

### 1. Simple
```
"Create TaskManager for managing daily tasks"
```

### 2. Con entidades explícitas
```
"Create BlogApp with Post entity (id, title, content) and User entity (id, name, email). CRUD operations for both."
```

### 3. Con enum
```
"Create OrderTracker with Order entity having status enum: PENDING, PROCESSING, SHIPPED, DELIVERED."
```

### 4. Con relaciones
```
"Create Library system. Book entity with id, title, author. User entity with id, name. Loan entity with bookId, userId, dueDate."
```

### 5. Completa
```
"Create HealthTracker, a healthcare app. Patient entity (id, name, age, bloodType). Appointment entity (id, patientId, doctorName, date, status: SCHEDULED, COMPLETED, CANCELLED). CRUD for both. Routes: /, /patients, /appointments. Components: PatientForm, AppointmentList, Calendar."
```

---

## ✅ Checklist de Pruebas

- [ ] Health check responde OK
- [ ] API info muestra endpoints
- [ ] Análisis simple genera contract válido
- [ ] Entidades incluyen timestamps automáticos
- [ ] Servicios se generan correctamente
- [ ] Validación rechaza contracts inválidos
- [ ] Normalización agrega defaults
- [ ] Diferentes dominios se detectan correctamente
- [ ] Enums se procesan correctamente
- [ ] UI routes y components se generan

---

## 🎉 ¡Listo para Desarrollar!

La API está funcionando correctamente. Puedes:
1. Probar diferentes especificaciones
2. Validar design contracts
3. Ver cómo el Orchestrator normaliza los datos
4. Experimentar con el Analyst Agent

**Puerto:** `http://localhost:3001`
**Logs:** `/tmp/spec2app-local.log`
**PID:** `/tmp/spec2app-api.pid`

