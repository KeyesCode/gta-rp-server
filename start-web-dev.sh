#!/bin/bash

# GTA RP Server Web Development Startup Script
# This script starts just the web development environment

echo "🚀 Starting GTA RP Server Web Development Environment..."

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

# Install Node.js dependencies locally for development
echo "📦 Installing Node.js dependencies..."
npm install

# Start just the web server and database services
echo "🔨 Starting web development services..."
docker-compose up --build -d gta-rp-server mysql redis

# Wait for services to be ready
echo "⏳ Waiting for services to be ready..."
sleep 10

# Check service status
echo "📊 Checking service status..."
docker-compose ps

# Show logs
echo "📋 Recent logs:"
docker-compose logs --tail=20 gta-rp-server

echo ""
echo "✅ GTA RP Web Server is starting up!"
echo ""
echo "🌐 Web Admin Panel: http://localhost:3000"
echo "🗄️  MySQL Database: localhost:3306"
echo "🔴 Redis Cache: localhost:6379"
echo ""
echo "📖 Useful commands:"
echo "  View logs: docker-compose logs -f gta-rp-server"
echo "  Stop server: docker-compose down"
echo "  Restart server: docker-compose restart gta-rp-server"
echo "  Rebuild: docker-compose up --build -d"
echo ""
echo "🎯 Web development mode is active."
echo "💡 You can now develop and test the web admin panel."
echo ""
echo "🔧 To add RageMP server later:"
echo "  1. Download RageMP server from https://rage.mp/"
echo "  2. Place the ragemp-server binary in this directory"
echo "  3. Make it executable: chmod +x ragemp-server"
echo "  4. Restart: docker-compose restart gta-rp-server"
