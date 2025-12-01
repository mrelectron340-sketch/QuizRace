# 🔧 Fix: "unable to get image: unexpected end of JSON input"

This error means Docker has corrupted images or Docker Desktop needs to be restarted.

## ⚡ Quick Fix (Try This First)

### Step 1: Restart Docker Desktop
1. **Right-click** Docker Desktop icon in system tray
2. Click **"Quit Docker Desktop"**
3. **Wait 10 seconds**
4. **Start Docker Desktop** again
5. **Wait** until whale icon stops animating (fully started)

### Step 2: Clean and Rebuild
```powershell
# Stop everything
docker compose down

# Remove corrupted images
docker rmi quizeing-frontend quizeing-question-service quizrace-linera 2>$null

# Clean build cache
docker builder prune -f

# Rebuild everything
docker compose build --no-cache

# Start services
docker compose up
```

## 🔄 If Still Not Working

### Option 1: Use the Fix Script
```powershell
.\fix-docker.ps1
```

### Option 2: Restart WSL
```powershell
# Close Docker Desktop first, then:
wsl --shutdown

# Wait 10 seconds, then start Docker Desktop again
```

### Option 3: Complete Clean
```powershell
# Stop Docker Desktop first!

# Clean everything
docker system prune -a --volumes -f

# Restart Docker Desktop
# Then rebuild:
docker compose build --no-cache
docker compose up
```

## ✅ Verification

After fixing, verify Docker is working:
```powershell
docker --version
docker compose version
docker info
```

If all commands work, try building again:
```powershell
docker compose up --build
```

## 🆘 Still Having Issues?

1. **Restart your computer** - Sometimes WSL needs a full restart
2. **Update Docker Desktop** - Make sure you have the latest version
3. **Check WSL2** - Ensure WSL2 is properly installed
4. **Check Windows updates** - Make sure Windows is up to date

---

**Most common fix**: Just restart Docker Desktop (Step 1) and try again!

