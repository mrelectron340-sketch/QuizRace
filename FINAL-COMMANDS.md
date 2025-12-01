# 🎯 Final Commands to Start QuizRace

## ⚡ Quick Start (Recommended)

### Windows
```powershell
.\start.ps1
```

### Linux/Mac
```bash
./start.sh
```

### Direct Docker
```bash
docker compose up --build
```

---

## 📋 What Happens

1. **Docker checks** if it's running
2. **Builds images** (first time: 10-15 min)
3. **Starts 3 services**:
   - Linera Network (port 9001)
   - Question Service (port 4000)
   - Frontend (port 5173)

---

## 🌐 Access Points

Once started:
- **Play Game**: http://localhost:5173
- **API Docs**: http://localhost:4000/questions
- **GraphQL**: http://localhost:9001/graphql

---

## 🛠️ Other Useful Commands

```bash
# View logs
docker compose logs -f

# Stop services
docker compose down

# Rebuild specific service
docker compose build frontend

# Check status
docker compose ps

# Clean everything
docker compose down -v
docker builder prune -a -f
```

## 🔧 If You Get "unable to get image" Error

This means Docker has corrupted images. Fix it:

### Quick Fix:
```powershell
.\quick-fix.ps1
```

### Or Manual:
```powershell
# 1. Restart Docker Desktop first!
# 2. Then run:
docker compose down
docker rmi quizeing-frontend quizeing-question-service quizrace-linera
docker builder prune -f
docker compose build --no-cache
docker compose up
```

**See [FIX-DOCKER-ERROR.md](FIX-DOCKER-ERROR.md) for detailed troubleshooting.**

---

## ✅ Verification

After starting, you should see:
```
✓ Docker is running
Starting services...
[+] Running 3/3
✔ Container quizrace-linera         Started
✔ Container quizrace-question-service Started  
✔ Container quizrace-frontend        Started
```

Then open http://localhost:5173 and click **"Try Demo Mode"**!

---

**For detailed information, see [README.md](README.md)**

