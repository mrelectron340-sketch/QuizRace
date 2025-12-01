# ⚡ Quick Environment Setup

## Do I Need .env Files?

**Short answer: NO!** The app works with defaults.

## When You DO Need .env Files

Only create `.env` files if you want to:
- Change ports
- Use different URLs
- Deploy to production
- Customize configuration

## Quick Setup (If Needed)

### 1. Frontend (Most Important)
Create: `quizrace/frontend/.env`
```env
VITE_QUESTION_SERVICE_URL=http://localhost:4000
VITE_LINERA_SERVICE_URL=http://localhost:9001
```

### 2. Question Service (Optional)
Create: `quizrace/question_service/.env`
```env
PORT=4000
NODE_ENV=production
```

### 3. Root (Optional - for Docker)
Create: `.env` (in root)
```env
VITE_QUESTION_SERVICE_URL=http://localhost:4000
VITE_LINERA_SERVICE_URL=http://localhost:9001
```

## That's It!

The app will use these values. If files don't exist, it uses defaults.

**See [ENV-SETUP.md](ENV-SETUP.md) for detailed information.**


