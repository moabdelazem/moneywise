#!/bin/bash
set -e

# Configuration
APP_NAME="moneywise"
ENV=${1:-"development"}  # Default to development if no argument provided

echo "🚀 Starting deployment process for $APP_NAME in $ENV environment"

# Check for Docker and Docker Compose
if ! command -v docker &> /dev/null; then
    echo "❌ Docker not found. Please install Docker first."
    exit 1
fi

if ! command -v docker-compose &> /dev/null; then
    echo "❌ Docker Compose not found. Please install Docker Compose first."
    exit 1
fi

# Stop any existing containers
echo "🛑 Stopping existing containers..."
docker-compose down || true

# Build the new image
echo "🏗️ Building Docker image..."
docker-compose build

# Start the services
echo "🚀 Starting services..."
docker-compose up -d

# Show running containers
echo "✅ Deployment completed successfully! Running containers:"
docker-compose ps

echo "📝 Application logs can be viewed with: docker-compose logs -f app"
