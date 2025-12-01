#!/bin/bash

echo ""
echo "========================================"
echo "   QuizRace - Starting Services"
echo "========================================"
echo ""

# Check if Docker is running
if ! docker info > /dev/null 2>&1; then
    echo "✗ Docker is not running!"
    echo "Please start Docker and try again."
    exit 1
fi

echo "✓ Docker is running"
echo ""
echo "Starting services..."
echo "This may take a few minutes on first run..."
echo ""

# Start services
docker compose up --build

echo ""
echo "========================================"
echo "   Services Started!"
echo "========================================"
echo ""
echo "Access the application:"
echo "  Frontend: http://localhost:5173"
echo "  API: http://localhost:4000"
echo "  GraphQL: http://localhost:9001/graphql"
echo ""

