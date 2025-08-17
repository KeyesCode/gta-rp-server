#!/bin/bash

# RageMP Server Setup Script for GTA RP Server
# This script helps download and configure the RageMP server
# Based on official wiki: https://wiki.rage.mp/wiki/Getting_Started_with_Server

echo "🎮 Setting up RageMP Server for GTA RP..."
echo "📖 Based on official RageMP wiki instructions"
echo ""

# Check if we're in the right directory
if [ ! -f "docker-compose.yml" ]; then
    echo "❌ Error: Please run this script from the gta-rp-server directory"
    exit 1
fi

# Check if Docker is running
if ! docker info > /dev/null 2>&1; then
    echo "❌ Docker is not running. Please start Docker first."
    exit 1
fi

echo "📋 RageMP Server Setup Options:"
echo ""
echo "1. Download RageMP server from official CDN (recommended)"
echo "2. Use existing RageMP server binary"
echo "3. Setup RageMP configuration only"
echo ""

read -p "Choose an option (1-3): " choice

case $choice in
    1)
        echo ""
        echo "🌐 Downloading RageMP Server from official source..."
        echo ""
        echo "📖 Following official wiki instructions:"
        echo "   https://wiki.rage.mp/wiki/Getting_Started_with_Server"
        echo ""
        
        # Run the download script
        if [ -f "download-ragemp.sh" ]; then
            echo "🚀 Running download script..."
            ./download-ragemp.sh
            
            if [ $? -eq 0 ]; then
                echo "✅ Download completed successfully!"
            else
                echo "❌ Download failed. Please check the error messages above."
                exit 1
            fi
        else
            echo "❌ Download script not found. Please ensure download-ragemp.sh exists."
            exit 1
        fi
        ;;
    2)
        echo ""
        echo "🔍 Looking for existing RageMP server binary..."
        if [ -f "ragemp-server" ]; then
            echo "✅ Found existing ragemp-server binary"
            chmod +x ragemp-server
            echo "✅ Made ragemp-server executable"
        else
            echo "❌ No ragemp-server binary found in current directory"
            echo "Please place the ragemp-server binary in this directory and run the script again"
            exit 1
        fi
        ;;
    3)
        echo ""
        echo "⚙️ Setting up RageMP configuration only..."
        if [ ! -f "ragemp-server" ]; then
            echo "⚠️  Note: No ragemp-server binary found. You'll need to add it later."
        fi
        ;;
    *)
        echo "❌ Invalid option. Please run the script again and choose 1-3."
        exit 1
        ;;
esac

echo ""
echo "🔧 Setting up RageMP configuration..."

# Create necessary directories
mkdir -p logs
mkdir -p database

# Check if ragemp-server.conf exists and is properly configured
if [ -f "ragemp-server.conf" ]; then
    echo "✅ RageMP configuration file found"
    
    # Update configuration with current settings
    echo "📝 Updating RageMP configuration..."
    
    # Backup original config
    cp ragemp-server.conf ragemp-server.conf.backup
    
    # Update key configuration values
    sed -i 's/^port 22005/port 22005/' ragemp-server.conf
    sed -i 's/^bind 0.0.0.0/bind 0.0.0.0/' ragemp-server.conf
    sed -i 's/^maxplayers 50/maxplayers 50/' ragemp-server.conf
    sed -i 's/^gamemode "gamemode"/gamemode "gamemode"/' ragemp-server.conf
    
    echo "✅ Configuration updated"
else
    echo "❌ RageMP configuration file not found. Creating default config..."
    # Create a basic configuration if it doesn't exist
    cat > ragemp-server.conf << 'EOF'
# RageMP Server Configuration
# Based on official wiki: https://wiki.rage.mp/wiki/Getting_Started_with_Server

# Server Information
name "GTA RP Server"
maxplayers 50
gamemode "gamemode"
announce false

# Network Settings
port 22005
bind 0.0.0.0
maxping 200
maxpacketloss 5.0

# Game Settings
streamdistance 500
streamingdistance 500
voice 1
voice_sample_rate 24000
voice_channels 2

# Anti-Cheat Settings
anticheat 1
anticheat_autoban 0
anticheat_autoban_time 0

# Logging
log 1
log_chat 1
log_deaths 1
log_connections 1
log_disconnections 1

# Performance Settings
maxvehicles 100
maxpeds 50
maxobjects 1000
maxpickups 100

# Spawn Settings
spawn_x -1037.74
spawn_y -2738.04
spawn_z 20.17

# Weather Settings
weather 0
weather_cycle 1
weather_cycle_speed 30

# Time Settings
time 12
time_cycle 1
time_cycle_speed 30

# Player Settings
player_health 100
player_armor 0
player_money 1000
player_level 1
EOF
    echo "✅ Default configuration created"
fi

echo ""
echo "🚀 Starting RageMP server..."

# Stop existing containers
echo "🛑 Stopping existing containers..."
docker-compose down

# Start the full server stack
echo "🔨 Starting full server stack..."
docker-compose up --build -d

# Wait for services to be ready
echo "⏳ Waiting for services to be ready..."
sleep 15

# Check service status
echo "📊 Checking service status..."
docker-compose ps

# Show logs
echo "📋 Recent logs:"
docker-compose logs --tail=30 gta-rp-server

echo ""
echo "🎉 RageMP Server Setup Complete!"
echo ""
echo "📖 Setup based on official RageMP wiki:"
echo "   https://wiki.rage.mp/wiki/Getting_Started_with_Server"
echo ""
echo "🌐 Web Admin Panel: http://localhost:3000"
echo "🎮 RageMP Server: localhost:22005"
echo "🗄️  MySQL Database: localhost:3306"
echo "🔴 Redis Cache: localhost:6379"
echo ""
echo "📖 Useful commands:"
echo "  View logs: docker-compose logs -f gta-rp-server"
echo "  Stop server: docker-compose down"
echo "  Restart server: docker-compose restart gta-rp-server"
echo "  Rebuild: docker-compose up --build -d"
echo ""
echo "🎯 Your GTA RP server is now running with RageMP!"
echo "💡 Players can connect to localhost:22005"
echo "🔧 Use the web admin panel to monitor and manage your server"
echo ""
echo "📚 Official Documentation:"
echo "   - Wiki: https://wiki.rage.mp/"
echo "   - Getting Started: https://wiki.rage.mp/wiki/Getting_Started_with_Server"
