#!/bin/bash

# GTA RP Server Test Runner
# This script runs various tests to verify server functionality

echo "🧪 GTA RP Server Test Suite"
echo "============================"
echo ""

# Check if server is running
echo "🔍 Checking if server is running..."
if curl -s http://localhost:3000/health > /dev/null 2>&1; then
    echo "✅ Server is running on port 3000"
else
    echo "❌ Server is not running on port 3000"
    echo "Please start the server first with: npm run dev"
    exit 1
fi

echo ""

# Check if TypeScript is compiled
if [ ! -d "node_modules" ]; then
    echo "📦 Installing dependencies..."
    npm install
fi

# Run quick test
echo "🚀 Running quick test..."
npx ts-node test-scripts/quick-test.ts

echo ""

# Ask if user wants to run full simulation
read -p "Do you want to run the full game simulation? (y/n): " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]; then
    echo "🎮 Starting full game simulation..."
    echo "This will simulate players, vehicles, and game events."
    echo "Open http://localhost:3000 in your browser to see the admin dashboard."
    echo "Press Ctrl+C to stop the simulation."
    echo ""
    
    npx ts-node test-scripts/test-game-simulation.ts
else
    echo "✅ Quick test completed. Run 'npm run test:simulation' for full simulation."
fi

echo ""
echo "🎉 Test suite completed!"
