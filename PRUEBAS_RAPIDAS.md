# 🚀 Guía Rápida de Pruebas - Contenedor Docker

## ✅ Estado Actual
**Contenedor corriendo:** `spec2app-api` en `http://localhost:3000`

---

## 🎯 PRUEBAS SIMPLES (Copia y Pega)

### 1️⃣ Verificar que funciona
```bash
curl http://localhost:3000/health
```
✅ **Resultado esperado:** `{"status":"ok","timestamp":"..."}`

---

### 2️⃣ Crear un Task Manager
```bash
curl -X POST http://localhost:3000/api/analyze \
  -H "Content-Type: application/json" \
  -d '{
    "specification": "Create a task manager app"
  }'
```
✅ **Genera:** Entidades, servicios, rutas y componentes automáticamente

---

### 3️⃣ Crear una Tienda Online
```bash
curl -X POST http://localhost:3000/api/analyze \
  -H "Content-Type: application/json" \
  -d '{
    "specification": "Create an online store for selling products"
  }'
```
✅ **Detecta dominio:** e-commerce

---

### 4️⃣ Crear un Blog
```bash
curl -X POST http://localhost:3000/api/analyze \
  -H "Content-Type: application/json" \
  -d '{
    "specification": "Create a blog with posts and authors"
  }'
```
✅ **Genera:** Entidades Post y Author

---

### 5️⃣ App con Enums
```bash
curl -X POST http://localhost:3000/api/analyze \
  -H "Content-Type: application/json" \
  -d '{
    "specification": "Create OrderTracker with Order entity. Order has status: PENDING, SHIPPED, DELIVERED"
  }'
```
✅ **Detecta:** Enum con valores PENDING, SHIPPED, DELIVERED

---

## 📊 Ver solo Metadata (más limpio)

```bash
curl -X POST http://localhost:3000/api/analyze \
  -H "Content-Type: application/json" \
  -d '{"specification": "Create TaskManager for productivity"}' \
  | jq '.contract.metadata'
```

---

## 📊 Ver solo Entidades

```bash
curl -X POST http://localhost:3000/api/analyze \
  -H "Content-Type: application/json" \
  -d '{"specification": "Create a blog"}' \
  | jq '.contract.entities'
```

---

## 📊 Ver solo Servicios

```bash
curl -X POST http://localhost:3000/api/analyze \
  -H "Content-Type: application/json" \
  -d '{"specification": "Create a blog"}' \
  | jq '.contract.services'
```

---

## 🎨 PRUEBAS MÁS COMPLEJAS

### App de Salud
```bash
curl -X POST http://localhost:3000/api/analyze \
  -H "Content-Type: application/json" \
  -d '{
    "specification": "Create HealthTracker, a healthcare app. Patient entity with id, name, age. Appointment entity with id, patientId, date, status enum: SCHEDULED, COMPLETED, CANCELLED. CRUD operations for both."
  }' | jq '.'
```

### Red Social
```bash
curl -X POST http://localhost:3000/api/analyze \
  -H "Content-Type: application/json" \
  -d '{
    "specification": "Create SocialHub, a social networking platform. User entity with id, username, email. Post entity with id, userId, content, likes. Comment entity with id, postId, userId, text."
  }' | jq '.'
```

---

## 🔍 Validar un Design Contract

```bash
curl -X POST http://localhost:3000/api/validate \
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

---

## 🛠️ COMANDOS ÚTILES

### Ver logs del contenedor
```bash
docker logs spec2app-api
```

### Ver logs en tiempo real
```bash
docker logs -f spec2app-api
```

### Ver estado del contenedor
```bash
docker ps
```

### Reiniciar contenedor
```bash
docker-compose restart
```

### Detener contenedor
```bash
docker-compose down
```

### Levantar contenedor
```bash
docker-compose up -d
```

### Reconstruir y levantar
```bash
docker-compose down
docker build -t spec2app-api:latest .
docker-compose up -d
```

---

## 🌐 Probar desde el Navegador

Abre tu navegador y ve a:
- **Health Check:** http://localhost:3000/health
- **API Info:** http://localhost:3000/api/info

Para POST requests, usa **Postman**, **Insomnia** o **Thunder Client** (VS Code)

---

## 🐛 Troubleshooting

### El contenedor no responde
```bash
# Ver si está corriendo
docker ps

# Ver logs de error
docker logs spec2app-api

# Reiniciar
docker-compose restart
```

### Puerto ocupado
```bash
# Ver qué está usando el puerto 3000
lsof -i :3000

# Cambiar puerto en docker-compose.yml:
# ports:
#   - "3001:3000"
```

---

## 🎯 Lo que hace la API

1. **Recibe especificación en lenguaje natural**
2. **Extrae entidades, servicios, UI** (Analyst Agent)
3. **Valida y normaliza** (Orchestrator)
4. **Devuelve Design Contract completo**

### Ejemplo de transformación:

**INPUT:**
```
"Create a task manager app"
```

**OUTPUT:**
```json
{
  "metadata": {
    "name": "TaskManager",
    "domain": "productivity",
    "locale": "en-US",
    "version": "1.0.0"
  },
  "entities": [...con timestamps automáticos...],
  "services": [...CRUD operations...],
  "ui": {
    "routes": ["/"],
    "components": [...]
  }
}
```

---

## ✨ Features Automáticas

- ✅ **Agrega version 1.0.0** si no existe
- ✅ **Agrega id (uuid)** a todas las entidades
- ✅ **Agrega createdAt y updatedAt** a todas las entidades
- ✅ **Ordena alfabéticamente** entidades y servicios
- ✅ **Detecta dominio** automáticamente (productivity, e-commerce, social, etc.)
- ✅ **Valida naming conventions** (PascalCase, camelCase)
- ✅ **Verifica consistencia** (servicios referencian entidades existentes)

---

## 📚 Más Información

- **Docker:** `DOCKER.md`
- **Pruebas detalladas:** `LOCAL_TESTING.md`
- **Código:** `apps/api/src/index.ts`

---

## 🎉 ¡Listo para Probar!

Empieza con el comando más simple:
```bash
curl http://localhost:3000/health
```

Y luego prueba crear tu primera app:
```bash
curl -X POST http://localhost:3000/api/analyze \
  -H "Content-Type: application/json" \
  -d '{"specification": "Create MY_COOL_APP for MY_PURPOSE"}'
```

¡Diviértete! 🚀

