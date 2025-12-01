# Environment Variables Setup Guide

## 📁 Required .env Files

QuizRace uses environment variables for configuration. Here are the files you need:

### 1. Root `.env` (Optional - for Docker Compose)
**Location:** `/.env`

Used by Docker Compose to set environment variables for all services.

**Contents:**
```env
VITE_QUESTION_SERVICE_URL=http://localhost:4000
VITE_LINERA_SERVICE_URL=http://localhost:9001
QUESTION_SERVICE_PORT=4000
NODE_ENV=production
```

### 2. Frontend `.env` (Recommended)
**Location:** `/quizrace/frontend/.env`

Used by Vite to inject variables into the frontend build.

**Contents:**
```env
VITE_QUESTION_SERVICE_URL=http://localhost:4000
VITE_LINERA_SERVICE_URL=http://localhost:9001
```

**Important:** 
- Variables must start with `VITE_` to be accessible in the frontend
- These are embedded at build time
- For Docker, use `http://localhost:4000` (browser accesses via host)

### 3. Question Service `.env` (Optional)
**Location:** `/quizrace/question_service/.env`

Used by the Node.js question service.

**Contents:**
```env
PORT=4000
NODE_ENV=production
CORS_ORIGIN=*
```

## 🚀 Quick Setup

### Option 1: Use Defaults (Easiest)
**No .env files needed!** The app uses sensible defaults:
- Question Service: `http://localhost:4000`
- Linera Service: `http://localhost:9001`
- Port: `4000`

### Option 2: Create .env Files
Copy the example files:

```bash
# Root
cp .env.example .env

# Frontend
cp quizrace/frontend/.env.example quizrace/frontend/.env

# Question Service (optional)
cp quizrace/question_service/.env.example quizrace/question_service/.env
```

## 🔧 Configuration Values

### For Local Development

**Frontend `.env`:**
```env
VITE_QUESTION_SERVICE_URL=http://localhost:4000
VITE_LINERA_SERVICE_URL=http://localhost:9001
```

**Question Service `.env`:**
```env
PORT=4000
NODE_ENV=development
CORS_ORIGIN=*
```

### For Docker

**Frontend `.env`:**
```env
# Use localhost - browser accesses via host machine
VITE_QUESTION_SERVICE_URL=http://localhost:4000
VITE_LINERA_SERVICE_URL=http://localhost:9001
```

**Note:** Even in Docker, use `localhost` because the browser runs on your host machine, not inside the container.

### For Production

**Frontend `.env`:**
```env
VITE_QUESTION_SERVICE_URL=https://api.yourdomain.com
VITE_LINERA_SERVICE_URL=https://linera.yourdomain.com/graphql
```

**Question Service `.env`:**
```env
PORT=4000
NODE_ENV=production
CORS_ORIGIN=https://yourdomain.com
```

## 📝 Environment Variables Reference

### Frontend (Vite)

| Variable | Default | Description |
|----------|---------|-------------|
| `VITE_QUESTION_SERVICE_URL` | `http://localhost:4000` | Question API endpoint |
| `VITE_LINERA_SERVICE_URL` | `http://localhost:9001` | Linera GraphQL endpoint |

### Question Service

| Variable | Default | Description |
|----------|---------|-------------|
| `PORT` | `4000` | Server port |
| `NODE_ENV` | `production` | Node environment |
| `CORS_ORIGIN` | `*` | Allowed CORS origins |

### Docker Compose

| Variable | Default | Description |
|----------|---------|-------------|
| `VITE_QUESTION_SERVICE_URL` | `http://localhost:4000` | Frontend env var |
| `VITE_LINERA_SERVICE_URL` | `http://localhost:9001` | Frontend env var |
| `PORT` | `4000` | Question service port |
| `NODE_ENV` | `production` | Node environment |

## ⚠️ Important Notes

1. **Vite Variables**: Only variables starting with `VITE_` are exposed to the frontend
2. **Build Time**: Vite env vars are embedded at build time, not runtime
3. **Docker**: Use `localhost` in env vars because browser accesses via host
4. **Security**: Never commit `.env` files to git (already in `.gitignore`)

## 🔍 Troubleshooting

### Frontend can't connect to API
- Check `VITE_QUESTION_SERVICE_URL` is correct
- Ensure question service is running on that port
- Check CORS settings in question service

### Docker networking issues
- Use `localhost` not service names in frontend env vars
- Browser runs on host, not in container
- Check ports are properly exposed in docker-compose.yml

### Variables not working
- Restart dev server after changing `.env` files
- Rebuild Docker images if using Docker
- Check variable names start with `VITE_` for frontend

---

**For most users, the defaults work fine - no .env files needed!**


