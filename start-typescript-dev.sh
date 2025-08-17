#!/bin/bash

# TypeScript Development Startup Script for GTA RP Server
# This script starts the development environment with TypeScript support

echo "🚀 Starting GTA RP Server in TypeScript Development Mode..."
echo ""

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    echo "❌ Error: Please run this script from the gta-rp-server directory"
    exit 1
fi

# Check if TypeScript is installed
if ! npm list typescript > /dev/null 2>&1; then
    echo "📦 Installing TypeScript dependencies..."
    npm install
fi

# Check if dist directory exists, if not build
if [ ! -d "dist" ]; then
    echo "🔨 Building TypeScript project..."
    npm run build
fi

echo "📋 Available commands:"
echo "  npm run dev          - Start development server with hot reload"
echo "  npm run dev:watch    - Start development server with file watching"
echo "  npm run build        - Build TypeScript to JavaScript"
echo "  npm run build:watch  - Build TypeScript with file watching"
echo "  npm run start        - Start production server"
echo "  npm run clean        - Clean build directory"
echo "  npm run rebuild      - Clean and rebuild"
echo "  npm run lint         - Type check TypeScript"
echo ""

echo "🎯 Starting development server..."
echo "💡 The server will automatically reload when you make changes to TypeScript files"
echo "🌐 Web Admin Panel: http://localhost:3000"
echo "🎮 RageMP Server: localhost:22005 (if binary is present)"
echo ""

# Start the development server
npm run dev
