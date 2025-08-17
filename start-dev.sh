#!/bin/bash

# GTA RP Server Development Startup Script
# This script sets up the development environment

echo "🚀 Starting GTA RP Server Development Environment..."

# Check if Docker is running
if ! docker info > /dev/null 2>&1; then
    echo "❌ Docker is not running. Please start Docker first."
    exit 1
fi

# Check if Docker Compose is available
if ! command -v docker-compose &> /dev/null; then
    echo "❌ Docker Compose is not installed. Please install it first."
    exit 1
fi

# Create necessary directories
echo "📁 Creating necessary directories..."
mkdir -p logs
mkdir -p database
mkdir -p ssl

# Install Node.js dependencies locally for development
echo "📦 Installing Node.js dependencies..."
npm install

# Build and start the containers
echo "🔨 Building and starting containers..."
docker-compose up --build -d

# Wait for services to be ready
echo "⏳ Waiting for services to be ready..."
sleep 10

# Check service status
echo "📊 Checking service status..."
docker-compose ps

# Show logs
echo "📋 Recent logs:"
docker-compose logs --tail=20

echo ""
echo "✅ GTA RP Server is starting up!"
echo ""
echo "🌐 Web Admin Panel: http://localhost:3000"
echo "🎮 RageMP Server: localhost:22005"
echo "🗄️  MySQL Database: localhost:3306"
echo "🔴 Redis Cache: localhost:6379"
echo ""
echo "📖 Useful commands:"
echo "  View logs: docker-compose logs -f gta-rp-server"
echo "  Stop server: docker-compose down"
echo "  Restart server: docker-compose restart"
echo "  Rebuild: docker-compose up --build -d"
echo ""
echo "🎯 Development mode is active. Changes to gamemode.js will require a restart."
echo "💡 Use 'docker-compose restart gta-rp-server' to apply changes."
