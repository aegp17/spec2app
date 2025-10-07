# 🚀 Deployment Guide - Spec2App

Complete guide for deploying Spec2App to different environments.

---

## 📦 GitHub Pages Deployment

### Prerequisites

1. Repository on GitHub
2. GitHub Pages enabled in repository settings

### Setup Instructions

#### 1. Enable GitHub Pages

Go to your repository settings:

```
Repository → Settings → Pages
```

Configure:
- **Source**: GitHub Actions
- **Branch**: (will be managed by Actions)

#### 2. Update API URL

Edit `.github/workflows/deploy-pages.yml` and update the API URL:

```yaml
env:
  VITE_API_URL: https://your-api-domain.com  # ⚠️ Change this!
```

Or use environment secrets:

```yaml
env:
  VITE_API_URL: ${{ secrets.API_URL }}
```

To add secrets:
```
Repository → Settings → Secrets and variables → Actions → New repository secret
```

#### 3. Update Base Path (if needed)

If your repo name is NOT `spec2app`, update the base path in the workflow:

```yaml
env:
  VITE_BASE_PATH: /your-repo-name/
```

#### 4. Push to Trigger Deployment

```bash
git push origin main
# or
git push origin develop
```

#### 5. Monitor Deployment

Go to:
```
Repository → Actions → Deploy to GitHub Pages
```

#### 6. Access Your Site

After successful deployment:
```
https://yourusername.github.io/spec2app/
```

---

## 🔧 Manual Deployment

### Build for Production

```bash
# Build web app
pnpm --filter @spec2app/web build

# Build output will be in apps/web/dist/
```

### Deploy to Any Static Host

The `apps/web/dist/` folder contains static files that can be deployed to:

- **Netlify**: Drag & drop `dist/` folder
- **Vercel**: `vercel --prod`
- **AWS S3**: `aws s3 sync dist/ s3://your-bucket`
- **Firebase**: `firebase deploy`
- **Cloudflare Pages**: Connect via dashboard

---

## 🐳 Docker Deployment

### Build Docker Images

```bash
# Build API
docker build -t spec2app-api:latest .

# Build Web
docker build -t spec2app-web:latest ./apps/web
```

### Deploy with Docker Compose

```bash
# Production deployment
docker-compose -f docker-compose.prod.yml up -d
```

Create `docker-compose.prod.yml`:

```yaml
services:
  api:
    image: spec2app-api:latest
    restart: always
    ports:
      - "3000:3000"
    environment:
      - NODE_ENV=production
      - PORT=3000
    healthcheck:
      test: ["CMD", "wget", "--spider", "-q", "http://localhost:3000/health"]
      interval: 30s
      timeout: 10s
      retries: 3

  web:
    image: spec2app-web:latest
    restart: always
    ports:
      - "80:80"
    environment:
      - VITE_API_URL=http://localhost:3000
    depends_on:
      api:
        condition: service_healthy
```

---

## ☁️ Cloud Deployment Options

### Option 1: Vercel (Recommended for Frontend)

1. Install Vercel CLI:
   ```bash
   npm i -g vercel
   ```

2. Deploy:
   ```bash
   cd apps/web
   vercel --prod
   ```

3. Set environment variables in Vercel dashboard:
   ```
   VITE_API_URL=https://your-api.vercel.app
   ```

### Option 2: Railway (Recommended for API)

1. Install Railway CLI:
   ```bash
   npm i -g @railway/cli
   ```

2. Deploy API:
   ```bash
   railway up
   ```

3. Configure environment:
   ```bash
   railway variables set PORT=3000
   railway variables set NODE_ENV=production
   ```

### Option 3: Render

Create `render.yaml`:

```yaml
services:
  - type: web
    name: spec2app-api
    env: node
    buildCommand: pnpm install && pnpm build
    startCommand: pnpm --filter @spec2app/api start
    envVars:
      - key: NODE_ENV
        value: production
      - key: PORT
        value: 3000

  - type: web
    name: spec2app-web
    env: static
    buildCommand: pnpm install && pnpm --filter @spec2app/web build
    staticPublishPath: ./apps/web/dist
    envVars:
      - key: VITE_API_URL
        value: https://spec2app-api.onrender.com
```

### Option 4: AWS (Advanced)

**API on EC2 or ECS:**
```bash
# Build and push to ECR
docker build -t spec2app-api .
docker tag spec2app-api:latest YOUR_ECR_URL/spec2app-api:latest
docker push YOUR_ECR_URL/spec2app-api:latest
```

**Frontend on S3 + CloudFront:**
```bash
# Build
pnpm --filter @spec2app/web build

# Upload to S3
aws s3 sync apps/web/dist/ s3://your-bucket-name/ --delete

# Invalidate CloudFront cache
aws cloudfront create-invalidation --distribution-id YOUR_ID --paths "/*"
```

---

## 🔐 Environment Variables

### Production Environment Variables

Create `.env.production` files:

**apps/web/.env.production:**
```env
VITE_API_URL=https://api.yourdomain.com
VITE_BASE_PATH=/
```

**apps/api/.env.production:**
```env
NODE_ENV=production
PORT=3000
HOST=0.0.0.0
CORS_ORIGIN=https://yourdomain.com
```

### Using Secrets in GitHub Actions

Add secrets in repository settings and reference them:

```yaml
env:
  VITE_API_URL: ${{ secrets.API_URL }}
  DATABASE_URL: ${{ secrets.DATABASE_URL }}
```

---

## 🧪 Testing Deployment Locally

### Test Production Build

```bash
# Build for production
pnpm --filter @spec2app/web build

# Preview production build
pnpm --filter @spec2app/web preview
```

### Test Docker Build

```bash
# Build images
docker-compose build

# Run in production mode
docker-compose up
```

---

## 📊 Monitoring & Logs

### View Deployment Logs

**GitHub Actions:**
```
Repository → Actions → Select workflow run → View logs
```

**Docker Logs:**
```bash
docker logs spec2app-api
docker logs spec2app-web
```

**Vercel Logs:**
```bash
vercel logs
```

---

## 🔄 CI/CD Pipeline

The project includes automated workflows:

### `.github/workflows/ci.yml`
- Runs on every push and PR
- Executes tests
- Runs linting
- Builds all packages

### `.github/workflows/deploy-pages.yml`
- Runs on push to `main` or `develop`
- Builds web app
- Deploys to GitHub Pages

### Manual Trigger

Trigger deployment manually:

```
Repository → Actions → Deploy to GitHub Pages → Run workflow
```

---

## 🐛 Troubleshooting

### Issue: 404 on GitHub Pages

**Solution:** Check base path in `vite.config.ts`:
```typescript
base: '/your-repo-name/'
```

### Issue: API CORS Error

**Solution:** Update CORS configuration in API:
```typescript
await fastify.register(cors, {
  origin: 'https://yourusername.github.io',
  credentials: true,
});
```

### Issue: Environment Variables Not Working

**Solution:** Prefix with `VITE_` for Vite:
```env
VITE_API_URL=https://api.com  # ✅ Works
API_URL=https://api.com        # ❌ Doesn't work
```

### Issue: Large Bundle Size

**Solution:** Enable code splitting in `vite.config.ts`:
```typescript
build: {
  rollupOptions: {
    output: {
      manualChunks: {
        vendor: ['react', 'react-dom'],
      },
    },
  },
}
```

---

## 📈 Performance Optimization

### Enable Compression

**Vite:**
```bash
pnpm add -D vite-plugin-compression
```

```typescript
import compression from 'vite-plugin-compression'

export default defineConfig({
  plugins: [
    react(),
    compression({ algorithm: 'gzip' }),
    compression({ algorithm: 'brotliCompress' }),
  ],
})
```

### CDN for Static Assets

Update `vite.config.ts`:
```typescript
build: {
  assetsDir: 'assets',
  rollupOptions: {
    output: {
      assetFileNames: 'assets/[name]-[hash][extname]',
    },
  },
}
```

---

## 🔒 Security Checklist

Before deploying to production:

- [ ] Remove all console.log statements
- [ ] Use environment variables for API URLs
- [ ] Enable HTTPS
- [ ] Configure CORS properly
- [ ] Add rate limiting to API
- [ ] Enable security headers
- [ ] Use .env files (never commit them)
- [ ] Rotate API keys regularly
- [ ] Enable authentication if needed

---

## 📝 Deployment Checklist

- [ ] Update API URL in environment variables
- [ ] Test production build locally
- [ ] Run all tests
- [ ] Check bundle size
- [ ] Enable monitoring/analytics
- [ ] Configure custom domain (optional)
- [ ] Setup SSL certificate
- [ ] Test all features in production
- [ ] Monitor error logs

---

## 🌐 Custom Domain Setup

### For GitHub Pages

1. Add `CNAME` file in `apps/web/public/`:
   ```
   yourdomain.com
   ```

2. Configure DNS:
   ```
   A     @       185.199.108.153
   A     @       185.199.109.153
   A     @       185.199.110.153
   A     @       185.199.111.153
   CNAME www     yourusername.github.io
   ```

3. Enable HTTPS in repository settings

---

## 📚 Additional Resources

- [Vite Deployment Guide](https://vitejs.dev/guide/static-deploy.html)
- [GitHub Pages Documentation](https://docs.github.com/en/pages)
- [Docker Deployment Best Practices](https://docs.docker.com/develop/dev-best-practices/)
- [Vercel Deployment](https://vercel.com/docs)

---

**Happy Deploying! 🚀**

