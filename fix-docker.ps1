# QuizRace - Docker Fix Script
# Cleans and rebuilds all Docker containers

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "   QuizRace - Docker Fix" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Check Docker
try {
    $null = docker info 2>$null
    Write-Host "✓ Docker is running" -ForegroundColor Green
} catch {
    Write-Host "✗ Docker is not running!" -ForegroundColor Red
    Write-Host "Please start Docker Desktop first." -ForegroundColor Yellow
    exit 1
}

Write-Host ""
Write-Host "Cleaning up..." -ForegroundColor Yellow
docker compose down 2>$null
docker builder prune -f 2>$null

Write-Host ""
Write-Host "Building fresh images..." -ForegroundColor Yellow
Write-Host "This may take 10-15 minutes..." -ForegroundColor Cyan
docker compose build --no-cache

Write-Host ""
Write-Host "Starting services..." -ForegroundColor Yellow
docker compose up -d

Start-Sleep -Seconds 3
docker compose ps

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "   Ready!" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "Open: http://localhost:5173" -ForegroundColor White
Write-Host ""

