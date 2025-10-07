# 🎨 Frontend Guide - Spec2App Web

Interfaz web moderna para transformar especificaciones en lenguaje natural a Design Contracts.

## 🚀 Inicio Rápido

### Opción 1: Desarrollo Local

```bash
# Desde el root del monorepo
pnpm install

# Levantar solo el frontend (requiere API corriendo)
pnpm dev:web

# O levantar frontend + API juntos
pnpm dev
```

**URLs:**
- Frontend: http://localhost:5173
- API: http://localhost:3000

### Opción 2: Docker

```bash
# Levantar ambos servicios
docker-compose up -d

# Solo frontend
docker build -t spec2app-web ./apps/web
docker run -p 5173:80 spec2app-web
```

---

## 📸 Captura de Pantalla

```
┌─────────────────────────────────────────────────────────┐
│  Spec2App                           🟢 API Online       │
│  Transform natural language into Design Contracts       │
└─────────────────────────────────────────────────────────┘

┌──────────────────────────────┬──────────────────────────┐
│ Enter Your Specification     │  Generated Design Contract│
│                              │                           │
│  ┌────────────────────────┐  │  📊 Metadata              │
│  │ Describe your app...   │  │  • Name: TaskManager      │
│  │                        │  │  • Domain: productivity   │
│  │                        │  │  • Version: 1.0.0         │
│  └────────────────────────┘  │                           │
│                              │  📦 Entities (2)          │
│  [Analyze Specification]     │  • User                   │
│                              │    - id: uuid (required)  │
│  Try these examples:         │    - name: string         │
│  • Create a task manager...  │  • Task                   │
│  • Create an e-commerce...   │    - id: uuid (required)  │
│  • Create a blog...          │    - title: string        │
│                              │                           │
└──────────────────────────────┴──────────────────────────┘
```

---

## 🎯 Características

### ✅ Interfaz de Usuario

- **Diseño Responsive**: Funciona en móviles, tablets y desktop
- **Tema Moderno**: Gradientes, sombras y transiciones suaves
- **Estado de API**: Indicador en tiempo real del estado del servidor
- **Ejemplos Rápidos**: 5 ejemplos listos para probar con un click
- **Vista Organizada**: Secciones claras para Metadata, Entities, Services, UI

### ✅ Funcionalidad

- **Análisis en Tiempo Real**: Envía especificaciones a la API y obtiene resultados
- **Validación Visual**: Muestra errores de forma clara y amigable
- **Descarga JSON**: Exporta el Design Contract generado
- **Loading States**: Feedback visual durante operaciones asíncronas

### ✅ Tecnología

- **React 18**: Últimas características y hooks
- **TypeScript**: Type-safe en todo el código
- **Vite**: Build ultra-rápido y HMR instantáneo
- **Tailwind CSS**: Utilidades CSS modernas
- **Nginx**: Servidor de producción optimizado

---

## 📁 Estructura del Proyecto

```
apps/web/
├── src/
│   ├── components/
│   │   ├── Header.tsx              # Header con estado de API
│   │   ├── SpecificationInput.tsx  # Formulario de entrada
│   │   └── ContractDisplay.tsx     # Visualización del contrato
│   ├── api.ts                      # Cliente API
│   ├── types.ts                    # Tipos TypeScript
│   ├── App.tsx                     # Componente principal
│   ├── main.tsx                    # Entry point
│   ├── index.css                   # Estilos Tailwind
│   └── vite-env.d.ts              # Tipos de Vite
├── public/                         # Assets estáticos
├── index.html                      # Template HTML
├── vite.config.ts                 # Configuración Vite
├── tailwind.config.js             # Configuración Tailwind
├── postcss.config.js              # Configuración PostCSS
├── tsconfig.json                  # Configuración TypeScript
├── tsconfig.node.json             # Config para archivos de build
├── package.json                   # Dependencias
├── Dockerfile                     # Build de Docker
├── nginx.conf                     # Configuración Nginx
└── README.md                      # Documentación
```

---

## 🔧 Componentes

### 1. Header
```tsx
<Header />
```
- Muestra título y descripción
- Indicador de estado de API (verde/rojo/gris)
- Auto-refresh cada 30 segundos

### 2. SpecificationInput
```tsx
<SpecificationInput 
  onAnalyze={handleAnalyze}
  isLoading={isLoading}
/>
```
- Textarea para entrada de texto
- Botón de análisis con loading state
- 5 ejemplos predefinidos
- Botón de limpiar

### 3. ContractDisplay
```tsx
<ContractDisplay 
  contract={contract}
  error={error}
/>
```
- Vista organizada del Design Contract
- Secciones con colores distintivos
- Badges para tipos y modificadores
- Botón de descarga JSON

---

## 🎨 Guía de Estilos

### Colores

```css
/* Primarios */
bg-blue-600    /* Botones principales */
bg-purple-600  /* Degradados */

/* Estados */
bg-green-400   /* Online/Success */
bg-red-400     /* Offline/Error */
bg-gray-400    /* Loading/Inactive */

/* Badges */
bg-red-100 text-red-600      /* Required */
bg-purple-100 text-purple-600 /* Unique */
bg-blue-100 text-blue-700     /* HTTP methods */
```

### Espaciado

- Padding contenedor: `px-4 py-6`
- Gap entre elementos: `space-y-4` o `gap-4`
- Padding interno: `p-4`

### Tipografía

- Título principal: `text-3xl font-bold`
- Subtítulos: `text-2xl font-bold`
- Secciones: `text-lg font-semibold`
- Texto normal: `text-sm` o `text-base`

---

## 🔌 Integración con API

### Endpoints Usados

```typescript
// Health check (cada 30s)
GET /health
→ { status: "ok", timestamp: "..." }

// Análisis de especificación
POST /api/analyze
Body: { specification: string }
→ { success: boolean, contract?: DesignContract, errors?: string[] }

// Validación de contrato
POST /api/validate
Body: DesignContract
→ { valid: boolean, contract?: DesignContract, errors?: string[] }
```

### Variables de Entorno

```env
# .env
VITE_API_URL=http://localhost:3000
```

---

## 🧪 Pruebas

### Probar Localmente

1. **Levantar la API:**
   ```bash
   pnpm dev:api
   # o
   docker-compose up api
   ```

2. **Levantar el Frontend:**
   ```bash
   pnpm dev:web
   ```

3. **Abrir navegador:**
   ```
   http://localhost:5173
   ```

### Casos de Prueba

#### ✅ Caso 1: Task Manager
```
Especificación: "Create a task manager app"

Resultado esperado:
- Name: TaskManager
- Domain: productivity
- Entities: Task, User (con timestamps)
- Services: TaskService (CRUD)
```

#### ✅ Caso 2: E-Commerce
```
Especificación: "Create an online store for selling products"

Resultado esperado:
- Name: ShopApp
- Domain: e-commerce
- Entities: Product, Order
- Routes: /products, /products/:id
```

#### ✅ Caso 3: Con Enums
```
Especificación: "Create OrderTracker with Order entity. 
Order has status: PENDING, SHIPPED, DELIVERED"

Resultado esperado:
- Enum attribute con valores [PENDING, SHIPPED, DELIVERED]
```

#### ❌ Caso 4: API Offline
```
1. Detener la API
2. Abrir frontend
3. Ver indicador rojo "API Offline"
4. Intentar analizar → Error visible
```

---

## 🐛 Troubleshooting

### Problema: El frontend no conecta con la API

**Solución:**
```bash
# 1. Verificar que la API esté corriendo
curl http://localhost:3000/health

# 2. Verificar variable de entorno
echo $VITE_API_URL

# 3. Verificar en el navegador (DevTools > Network)
# Debe hacer requests a http://localhost:3000
```

### Problema: Error de CORS

**Solución:**
La API ya tiene CORS habilitado. Si aún hay problemas:

```typescript
// apps/api/src/index.ts
fastify.register(require('@fastify/cors'), {
  origin: 'http://localhost:5173'
});
```

### Problema: El build falla

**Solución:**
```bash
# Limpiar y reinstalar
pnpm clean
pnpm install

# Verificar TypeScript
pnpm --filter @spec2app/web typecheck
```

---

## 📦 Deployment

### Producción con Docker

```bash
# Build
docker-compose build web

# Run
docker-compose up -d

# La app estará en http://localhost:5173
```

### Build Manual

```bash
# Build
pnpm --filter @spec2app/web build

# Servir con un servidor estático
npx serve apps/web/dist
```

---

## 🚀 Mejoras Futuras

- [ ] Dark mode
- [ ] Historial de especificaciones
- [ ] Comparar versiones de contratos
- [ ] Editor de contratos manual
- [ ] Exportar a diferentes formatos (YAML, etc.)
- [ ] Preview del código generado
- [ ] Tests E2E con Playwright
- [ ] PWA (Progressive Web App)
- [ ] Internacionalización (i18n)

---

## 📚 Recursos

- [React Docs](https://react.dev/)
- [Vite Docs](https://vitejs.dev/)
- [Tailwind CSS](https://tailwindcss.com/)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)

---

## 🤝 Contribuir

1. Crear branch: `git checkout -b feature/nueva-funcionalidad`
2. Hacer cambios y commit: `git commit -m "feat: nueva funcionalidad"`
3. Push: `git push origin feature/nueva-funcionalidad`
4. Crear Pull Request

---

## 📝 Notas

- El frontend es **stateless**: no guarda datos en localStorage (por ahora)
- Diseñado para **single-page application** (SPA)
- Optimizado para **desarrollo rápido** con Vite HMR
- **Production-ready** con builds optimizados y Nginx

---

¡Disfruta construyendo con Spec2App! 🎉

