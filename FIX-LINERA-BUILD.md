# 🔧 Fix: Linera Build Error

The error `could not compile linera-service` is a linker/compilation issue. Here are solutions:

## ⚡ Quick Fix: Use Simplified Version (Recommended)

If Linera keeps failing, use the simplified version without Linera:

```powershell
docker compose -f docker-compose.simple.yml up --build
```

This runs **frontend + question-service** only (perfect for demo/testing).

## 🔧 Fix Linera Build

### Option 1: Increase Docker Resources

1. **Docker Desktop Settings** → **Resources**
2. Increase **Memory** to **4GB+**
3. Increase **CPU** to **4+ cores**
4. **Apply & Restart**

Then rebuild:
```powershell
docker compose build --no-cache linera-net
docker compose up
```

### Option 2: Build Linera Separately

```powershell
# Build just frontend and question-service first
docker compose build frontend question-service
docker compose up frontend question-service

# Then in another terminal, build Linera with more resources
docker compose build linera-net
```

### Option 3: Skip Linera for Now

The app works without Linera! Use:

```powershell
docker compose -f docker-compose.simple.yml up --build
```

Then access: http://localhost:5173

## ✅ What Works Without Linera

- ✅ Frontend (React app)
- ✅ Question Service (API)
- ✅ All question types
- ✅ Demo mode
- ⚠️ On-chain features (needs Linera)

## 🎯 For Judges

**You can demonstrate the app without Linera!**

1. Run: `docker compose -f docker-compose.simple.yml up --build`
2. Open: http://localhost:5173
3. Click "Try Demo Mode"
4. Show all interactive question types

The app is **fully functional** for demo purposes without Linera. Linera is only needed for full on-chain integration.

---

**The simplified version is perfect for showing the UI and features!**


