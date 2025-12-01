# QuizRace - Start Script
# This script starts all services using Docker

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "   QuizRace - Starting Services" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Check if Docker is running
try {
    $null = docker info 2>$null
    Write-Host "✓ Docker is running" -ForegroundColor Green
} catch {
    Write-Host "✗ Docker is not running!" -ForegroundColor Red
    Write-Host "Please start Docker Desktop and try again." -ForegroundColor Yellow
    exit 1
}

Write-Host ""
Write-Host "Starting services..." -ForegroundColor Yellow
Write-Host "This may take a few minutes on first run..." -ForegroundColor Cyan
Write-Host ""

# Start services
docker compose up --build

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "   Services Started!" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "Access the application:" -ForegroundColor Yellow
Write-Host "  Frontend: http://localhost:5173" -ForegroundColor White
Write-Host "  API: http://localhost:4000" -ForegroundColor White
Write-Host "  GraphQL: http://localhost:9001/graphql" -ForegroundColor White
Write-Host ""

