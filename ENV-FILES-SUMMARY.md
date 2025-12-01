# 📋 Environment Files Summary

## ✅ Files Created

I've created the following `.env` files for you:

### 1. Root `.env`
**Location:** `/.env`
```env
VITE_QUESTION_SERVICE_URL=http://localhost:4000
VITE_LINERA_SERVICE_URL=http://localhost:9001
QUESTION_SERVICE_PORT=4000
NODE_ENV=production
```

### 2. Frontend `.env`
**Location:** `/quizrace/frontend/.env`
```env
VITE_QUESTION_SERVICE_URL=http://localhost:4000
VITE_LINERA_SERVICE_URL=http://localhost:9001
```

### 3. Question Service `.env`
**Location:** `/quizrace/question_service/.env`
```env
PORT=4000
NODE_ENV=production
CORS_ORIGIN=*
```

## 🎯 What Each File Does

### Root `.env`
- Used by Docker Compose (optional)
- Sets default values for all services
- Can be overridden by service-specific .env files

### Frontend `.env`
- **Most Important!** 
- Used by Vite during build
- Variables must start with `VITE_` to be accessible
- These are embedded at build time

### Question Service `.env`
- Configures the Node.js API server
- Sets port and environment
- Controls CORS settings

## 🔧 Default Values (If No .env Files)

The app works without .env files using these defaults:
- Question Service: `http://localhost:4000`
- Linera Service: `http://localhost:9001`
- Port: `4000`

## ⚙️ When to Modify

### Local Development
No changes needed - defaults work!

### Docker
No changes needed - defaults work!

### Production
Update URLs to your production domains:
```env
VITE_QUESTION_SERVICE_URL=https://api.yourdomain.com
VITE_LINERA_SERVICE_URL=https://linera.yourdomain.com/graphql
```

## 📝 Important Notes

1. **`.env` files are in `.gitignore`** - they won't be committed
2. **Frontend variables** must start with `VITE_`
3. **Docker**: Use `localhost` (browser accesses via host)
4. **Restart required**: After changing .env, restart services

## 🚀 Quick Start

**You don't need to do anything!** The .env files are already created with correct defaults.

Just run:
```bash
docker compose up --build
```

Everything will work! 🎉

---

**See [ENV-SETUP.md](ENV-SETUP.md) for detailed documentation.**


