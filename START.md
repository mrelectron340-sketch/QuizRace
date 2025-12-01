# 🚀 Quick Start Guide

## Start QuizRace with One Command

### ✅ Recommended: Simplified Version (No Linera)
```powershell
docker compose -f docker-compose.simple.yml up --build
```
**Perfect for demo - all features work!**

### Or Use Start Scripts
**Windows:**
```powershell
.\start.ps1
```

**Linux/Mac:**
```bash
chmod +x start.sh
./start.sh
```

### Full Version (With Linera)
```powershell
# If you get cache errors:
.\fix-docker-cache.ps1

# Then:
docker compose up --build
```

## That's It! 🎉

Once services start:
- **Frontend**: http://localhost:5173
- **Question API**: http://localhost:4000  
- **Linera GraphQL**: http://localhost:9001/graphql

## First Time Setup

The first build takes **10-15 minutes** because it:
- Downloads base Docker images
- Installs Rust toolchain
- Installs Linera CLI
- Builds smart contracts
- Installs Node.js dependencies

**Be patient!** Subsequent starts are much faster (30-60 seconds).

## Troubleshooting

**Docker not starting?**
1. Make sure Docker Desktop is running
2. Restart Docker Desktop
3. Run `.\fix-docker.ps1` to clean and rebuild

**Port already in use?**
```bash
docker compose down
# Then start again
```

**Need to see logs?**
```bash
docker compose logs -f
```

---

**For detailed information, see [README.md](README.md)**

