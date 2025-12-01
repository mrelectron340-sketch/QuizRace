# Quick Fix for Docker Image Error
Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "   Fixing Docker Image Error" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Step 1: Check Docker
Write-Host "Step 1: Checking Docker..." -ForegroundColor Yellow
try {
    $null = docker info 2>$null
    Write-Host "✓ Docker is running" -ForegroundColor Green
} catch {
    Write-Host "✗ Docker is not running!" -ForegroundColor Red
    Write-Host ""
    Write-Host "Please:" -ForegroundColor Yellow
    Write-Host "1. Start Docker Desktop" -ForegroundColor White
    Write-Host "2. Wait until it's fully started" -ForegroundColor White
    Write-Host "3. Run this script again" -ForegroundColor White
    exit 1
}

# Step 2: Stop containers
Write-Host ""
Write-Host "Step 2: Stopping containers..." -ForegroundColor Yellow
docker compose down 2>$null
Write-Host "✓ Stopped" -ForegroundColor Green

# Step 3: Remove corrupted images
Write-Host ""
Write-Host "Step 3: Removing corrupted images..." -ForegroundColor Yellow
docker rmi quizeing-frontend quizeing-question-service quizrace-linera 2>$null
Write-Host "✓ Removed" -ForegroundColor Green

# Step 4: Clean cache
Write-Host ""
Write-Host "Step 4: Cleaning build cache..." -ForegroundColor Yellow
docker builder prune -f 2>$null
Write-Host "✓ Cleaned" -ForegroundColor Green

# Step 5: Rebuild
Write-Host ""
Write-Host "Step 5: Rebuilding images..." -ForegroundColor Yellow
Write-Host "This will take 5-10 minutes..." -ForegroundColor Cyan
docker compose build --no-cache

if ($LASTEXITCODE -eq 0) {
    Write-Host ""
    Write-Host "========================================" -ForegroundColor Cyan
    Write-Host "   ✓ Fixed! Starting services..." -ForegroundColor Green
    Write-Host "========================================" -ForegroundColor Cyan
    Write-Host ""
    docker compose up
} else {
    Write-Host ""
    Write-Host "========================================" -ForegroundColor Red
    Write-Host "   Build failed!" -ForegroundColor Red
    Write-Host "========================================" -ForegroundColor Red
    Write-Host ""
    Write-Host "Try:" -ForegroundColor Yellow
    Write-Host "1. Restart Docker Desktop" -ForegroundColor White
    Write-Host "2. Run: wsl --shutdown" -ForegroundColor White
    Write-Host "3. Start Docker Desktop again" -ForegroundColor White
    Write-Host "4. Run this script again" -ForegroundColor White
}

