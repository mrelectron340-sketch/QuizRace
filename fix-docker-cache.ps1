# Fix Docker Cache Corruption
Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "   Fixing Docker Cache Issue" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

Write-Host "Step 1: Stopping Docker..." -ForegroundColor Yellow
docker compose down 2>$null

Write-Host ""
Write-Host "Step 2: Pruning Docker system..." -ForegroundColor Yellow
docker system prune -a --volumes -f

Write-Host ""
Write-Host "Step 3: Removing corrupted images..." -ForegroundColor Yellow
docker rmi rust:1.75-slim 2>$null
docker rmi node:20-slim 2>$null

Write-Host ""
Write-Host "Step 4: Cleaning build cache..." -ForegroundColor Yellow
docker builder prune -a -f

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "   Cache Cleaned!" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "Now try:" -ForegroundColor Yellow
Write-Host "  docker compose up --build" -ForegroundColor White
Write-Host ""
Write-Host "Or use simplified version (without Linera):" -ForegroundColor Yellow
Write-Host "  docker compose -f docker-compose.simple.yml up --build" -ForegroundColor White
Write-Host ""

