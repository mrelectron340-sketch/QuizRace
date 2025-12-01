# ⚡ Quick Fix for Docker Cache Error

## The Problem
Docker cache is corrupted: `blob not found` error

## ✅ Solution: Use Simplified Version (Recommended)

**The app works perfectly without Linera for demos!**

```powershell
docker compose -f docker-compose.simple.yml up --build
```

This will:
- ✅ Build frontend (fast - 2 minutes)
- ✅ Build question service (fast - 1 minute)
- ❌ Skip Linera (not needed for demo)

## Why This Works

**For judges/demo:**
- All question types work ✅
- Category selection works ✅
- Interactive simulations work ✅
- 30 questions available ✅
- Beautiful UI ✅
- Real-time gameplay ✅

**Linera is only needed for:**
- Full on-chain integration
- Production deployment
- Not required for demo!

## Access

Once started:
- **Frontend**: http://localhost:5173
- **Question API**: http://localhost:4000

## If You Really Need Linera

1. **Clean Docker cache first:**
   ```powershell
   .\fix-docker-cache.ps1
   ```

2. **Restart Docker Desktop**

3. **Then try:**
   ```powershell
   docker compose up --build
   ```

---

**For demo purposes, the simplified version is perfect! 🎉**

