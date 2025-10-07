# 🚀 GitHub Pages Setup - Quick Guide

Step-by-step guide to deploy Spec2App frontend to GitHub Pages.

---

## ⚡ Quick Setup (5 Steps)

### 1️⃣ Enable GitHub Pages

1. Go to your repository on GitHub
2. Click **Settings** → **Pages**
3. Under **Source**, select: **GitHub Actions**

### 2️⃣ Update API URL

Edit `.github/workflows/deploy-pages.yml` (line 56):

```yaml
env:
  VITE_API_URL: https://your-api-domain.com  # ⚠️ CHANGE THIS!
```

**Options for API URL:**

**Option A: Use a deployed API** (Recommended)
```yaml
VITE_API_URL: https://spec2app-api.railway.app
```

**Option B: Use localhost** (For testing only)
```yaml
VITE_API_URL: http://localhost:3000
```

**Option C: Use GitHub Secrets** (Most secure)

1. Go to **Settings → Secrets and variables → Actions**
2. Click **New repository secret**
3. Name: `API_URL`
4. Value: `https://your-api.com`
5. Update workflow:
   ```yaml
   env:
     VITE_API_URL: ${{ secrets.API_URL }}
   ```

### 3️⃣ Update Base Path (if needed)

If your repository name is **NOT** `spec2app`, update line 55:

```yaml
env:
  VITE_BASE_PATH: /your-repo-name/  # ⚠️ Use your actual repo name!
```

**Examples:**
- Repo `spec2app` → `VITE_BASE_PATH: /spec2app/`
- Repo `my-app` → `VITE_BASE_PATH: /my-app/`
- Custom domain → `VITE_BASE_PATH: /`

### 4️⃣ Push to GitHub

```bash
git add .
git commit -m "feat: Add GitHub Pages deployment"
git push origin main
```

Or push to `develop`:
```bash
git push origin develop
```

### 5️⃣ Monitor Deployment

1. Go to **Actions** tab
2. Click on **Deploy to GitHub Pages** workflow
3. Watch the build progress
4. Wait for ✅ green checkmark

---

## 🌐 Access Your Site

After successful deployment:

```
https://yourusername.github.io/spec2app/
```

**Replace:**
- `yourusername` → Your GitHub username
- `spec2app` → Your repository name

---

## 🔧 Configuration Files

### Files Created

```
.github/workflows/deploy-pages.yml  ← GitHub Actions workflow
apps/web/vite.config.ts            ← Updated with base path
apps/web/.env.production.example   ← Environment template
DEPLOYMENT.md                      ← Full deployment guide
```

### What the Workflow Does

1. ✅ Checks out code
2. ✅ Sets up Node.js 20
3. ✅ Installs pnpm
4. ✅ Caches dependencies
5. ✅ Installs packages
6. ✅ Builds web app with production config
7. ✅ Uploads build artifacts
8. ✅ Deploys to GitHub Pages

---

## ⚙️ Advanced Configuration

### Using Environment Files

Create `apps/web/.env.production`:

```env
VITE_API_URL=https://your-api.com
VITE_BASE_PATH=/spec2app/
```

**Note:** Don't commit this file! It's in `.gitignore`

### Custom Domain

1. Add `CNAME` file in `apps/web/public/`:
   ```
   yourdomain.com
   ```

2. Update workflow:
   ```yaml
   env:
     VITE_BASE_PATH: /
     VITE_API_URL: https://api.yourdomain.com
   ```

3. Configure DNS:
   ```
   A     @       185.199.108.153
   A     @       185.199.109.153
   CNAME www     yourusername.github.io
   ```

### Deploy from Multiple Branches

The workflow triggers on:
- Push to `main`
- Push to `develop`
- Manual trigger

To change branches, edit `.github/workflows/deploy-pages.yml`:
```yaml
on:
  push:
    branches:
      - main      # ← Add/remove branches
      - develop
```

---

## 🐛 Troubleshooting

### ❌ 404 Error on Page Load

**Problem:** Base path is incorrect

**Solution:** Update `VITE_BASE_PATH` in workflow:
```yaml
VITE_BASE_PATH: /your-actual-repo-name/
```

### ❌ API Offline / CORS Error

**Problem:** API URL is wrong or CORS not configured

**Solution 1:** Check API URL in workflow
```yaml
VITE_API_URL: https://correct-api-url.com
```

**Solution 2:** Configure CORS in your API:
```typescript
await fastify.register(cors, {
  origin: 'https://yourusername.github.io',
  credentials: true,
});
```

### ❌ Deployment Fails

**Problem:** Build error

**Solution:** Check logs in Actions tab, common issues:
- Missing environment variables
- Build errors (fix locally first)
- Permissions (check repository settings)

### ❌ Changes Not Showing

**Problem:** Browser cache or CDN delay

**Solution:**
```bash
# Clear browser cache (Cmd+Shift+R or Ctrl+Shift+R)
# Or wait 5-10 minutes for GitHub CDN
```

---

## 🧪 Test Before Deploying

### Local Production Build

```bash
# Build with production settings
cd apps/web
VITE_BASE_PATH=/spec2app/ VITE_API_URL=https://your-api.com pnpm build

# Preview the build
pnpm preview
```

### Test with Different Base Paths

```bash
# Test with repo name
VITE_BASE_PATH=/spec2app/ pnpm build

# Test with root path
VITE_BASE_PATH=/ pnpm build
```

---

## 📊 Monitoring

### View Deployment Status

**GitHub UI:**
```
Repository → Actions → Deploy to GitHub Pages
```

**Badge in README:**
```markdown
![Deploy](https://github.com/username/spec2app/actions/workflows/deploy-pages.yml/badge.svg)
```

### Check Site Status

```bash
# Health check
curl https://yourusername.github.io/spec2app/

# API connectivity
curl https://your-api.com/health
```

---

## 🔄 Redeployment

### Automatic (Recommended)

Simply push changes:
```bash
git push origin main
```

### Manual Trigger

1. Go to **Actions**
2. Select **Deploy to GitHub Pages**
3. Click **Run workflow**
4. Select branch
5. Click **Run workflow**

---

## 📈 Next Steps

After deployment works:

1. ✅ Deploy API to a service (Railway, Render, Vercel)
2. ✅ Update `VITE_API_URL` with real API URL
3. ✅ Configure custom domain (optional)
4. ✅ Enable HTTPS (GitHub does this automatically)
5. ✅ Add analytics (optional)
6. ✅ Setup monitoring

---

## 🔐 Security Notes

- ✅ Never commit `.env.production` (it's in `.gitignore`)
- ✅ Use GitHub Secrets for sensitive data
- ✅ API URL is public (not sensitive)
- ✅ Configure CORS to only allow your domain
- ✅ Enable HTTPS (GitHub does this automatically)

---

## 📚 References

- [GitHub Pages Docs](https://docs.github.com/en/pages)
- [Vite Deployment](https://vitejs.dev/guide/static-deploy.html)
- [GitHub Actions](https://docs.github.com/en/actions)

---

## ✅ Checklist

Before pushing:

- [ ] Updated `VITE_API_URL` in workflow
- [ ] Updated `VITE_BASE_PATH` (if repo name != spec2app)
- [ ] Tested production build locally
- [ ] Enabled GitHub Pages in repository settings
- [ ] Selected "GitHub Actions" as source

After deployment:

- [ ] Verified site loads correctly
- [ ] Tested API connectivity
- [ ] Checked all pages/routes
- [ ] Verified in different browsers

---

**You're all set! Push to GitHub and watch the magic happen! 🎉**

