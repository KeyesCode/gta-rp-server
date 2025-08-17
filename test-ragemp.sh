#!/bin/bash

# RageMP Server Test Script
# This script tests the RageMP server setup

echo "🧪 Testing RageMP Server Setup..."
echo ""

# Check if we're in the right directory
if [ ! -f "docker-compose.yml" ]; then
    echo "❌ Error: Please run this script from the gta-rp-server directory"
    exit 1
fi

# Check Docker status
if ! docker info > /dev/null 2>&1; then
    echo "❌ Docker is not running. Please start Docker first."
    exit 1
fi

echo "📁 Checking RageMP server files..."

# Check for RageMP server binary
if [ -f "ragemp-server" ]; then
    echo "✅ RageMP server binary found"
    
    # Check if it's executable
    if [ -x "ragemp-server" ]; then
        echo "✅ RageMP server binary is executable"
    else
        echo "⚠️  RageMP server binary is not executable"
        echo "   Fixing permissions..."
        chmod +x ragemp-server
        echo "✅ Permissions fixed"
    fi
    
    # Check file type
    echo "📋 File information:"
    ls -la ragemp-server
    echo ""
    file ragemp-server
    
else
    echo "❌ RageMP server binary not found"
    echo ""
    echo "🔧 To get the RageMP server binary:"
    echo "1. Visit: https://rage.mp/"
    echo "2. Look for 'Download Server' or 'Get Started'"
    echo "3. Download the Linux server binary"
    echo "4. Place it in this directory"
    echo "5. Rename it to 'ragemp-server' (without extension)"
    echo "6. Make it executable: chmod +x ragemp-server"
    echo ""
    echo "💡 Alternative sources:"
    echo "   - RageMP Discord server"
    echo "   - RageMP forums"
    echo "   - Community repositories"
    echo ""
    exit 1
fi

echo ""
echo "📋 Checking RageMP configuration..."

# Check configuration file
if [ -f "ragemp-server.conf" ]; then
    echo "✅ RageMP configuration file found"
    
    # Check key configuration values
    echo "🔍 Checking configuration values..."
    
    if grep -q "port 22005" ragemp-server.conf; then
        echo "✅ Port configured correctly (22005)"
    else
        echo "⚠️  Port not configured correctly"
    fi
    
    if grep -q "bind 0.0.0.0" ragemp-server.conf; then
        echo "✅ Bind address configured correctly"
    else
        echo "⚠️  Bind address not configured correctly"
    fi
    
    if grep -q "gamemode \"gamemode\"" ragemp-server.conf; then
        echo "✅ Gamemode configured correctly"
    else
        echo "⚠️  Gamemode not configured correctly"
    fi
    
else
    echo "❌ RageMP configuration file not found"
    echo "   Creating default configuration..."
    ./setup-ragemp.sh
    exit 1
fi

echo ""
echo "🔧 Checking Docker setup..."

# Check if containers are running
if docker-compose ps | grep -q "gta-rp-server"; then
    echo "✅ Docker containers are running"
    
    # Check container status
    echo "📊 Container status:"
    docker-compose ps
    
    # Check RageMP server logs
    echo ""
    echo "📋 Recent RageMP server logs:"
    docker-compose logs --tail=20 gta-rp-server
    
else
    echo "⚠️  Docker containers are not running"
    echo "   Starting containers..."
    docker-compose up -d
    
    # Wait for startup
    echo "⏳ Waiting for containers to start..."
    sleep 10
    
    # Check status again
    docker-compose ps
fi

echo ""
echo "🎯 Testing RageMP server functionality..."

# Check if RageMP server is responding on port 22005
if command -v netstat &> /dev/null; then
    if netstat -tuln | grep -q ":22005"; then
        echo "✅ Port 22005 is listening (RageMP server active)"
    else
        echo "⚠️  Port 22005 is not listening"
        echo "   RageMP server may not be running properly"
    fi
fi

# Check if web admin panel is accessible
if curl -s http://localhost:3000 > /dev/null; then
    echo "✅ Web admin panel is accessible at http://localhost:3000"
else
    echo "⚠️  Web admin panel is not accessible"
fi

echo ""
echo "📊 Setup Summary:"

if [ -f "ragemp-server" ] && [ -x "ragemp-server" ]; then
    echo "✅ RageMP server binary: Ready"
else
    echo "❌ RageMP server binary: Missing or not executable"
fi

if [ -f "ragemp-server.conf" ]; then
    echo "✅ RageMP configuration: Ready"
else
    echo "❌ RageMP configuration: Missing"
fi

if docker-compose ps | grep -q "gta-rp-server"; then
    echo "✅ Docker containers: Running"
else
    echo "❌ Docker containers: Not running"
fi

echo ""
echo "🎮 Next Steps:"
echo "1. If all checks pass: Your RageMP server is ready!"
echo "2. Players can connect to: localhost:22005"
echo "3. Admin panel available at: http://localhost:3000"
echo "4. Monitor logs with: docker-compose logs -f gta-rp-server"
echo ""
echo "🔧 If you need to fix issues:"
echo "   - Run: ./setup-ragemp.sh"
echo "   - Check logs: docker-compose logs gta-rp-server"
echo "   - Restart: docker-compose restart gta-rp-server"
