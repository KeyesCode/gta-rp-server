# RageMP Server Setup Guide

This guide will help you set up the RageMP server component of your GTA RP server.

## 🎮 What is RageMP?

RageMP is a multiplayer modification framework for Grand Theft Auto V that allows you to create custom multiplayer servers with advanced features like:
- Custom gamemodes and scripts
- Player management systems
- Vehicle and object spawning
- Voice chat support
- Anti-cheat systems
- Custom UI and HUD elements

## 🚀 Quick Setup Options

### Option 1: Automatic Setup (Recommended)
```bash
# Run the comprehensive setup script
./setup-ragemp.sh
```

### Option 2: Automatic Download + Setup
```bash
# First, try to download RageMP automatically
./download-ragemp.sh

# Then run the setup
./setup-ragemp.sh
```

### Option 3: Manual Setup
Follow the manual steps below if the automatic methods don't work.

## 🔧 Manual Setup Steps

### Step 1: Download RageMP Server

**Official Download Method** (from [RageMP Wiki](https://wiki.rage.mp/wiki/Getting_Started_with_Server)):

```bash
# Download the server files
wget https://cdn.rage.mp/updater/prerelease/server-files/linux_x64.tar.gz

# Extract the server files
tar -xzf linux_x64.tar.gz

# Access the directory
cd ragemp-srv

# Set executable permission
chmod +x ragemp-server

# Copy to your project directory
cp ragemp-server /path/to/your/gta-rp-server/
cd /path/to/your/gta-rp-server/

# Make it executable
chmod +x ragemp-server
```

**Alternative Sources** (if official link doesn't work):
- RageMP Discord server
- RageMP forums
- Community repositories

### Step 2: Verify Setup

```bash
# Check if the binary is executable
ls -la ragemp-server

# Should show something like:
# -rwxr-xr-x 1 user user 12345678 Aug 17 17:00 ragemp-server

# Check file type
file ragemp-server
```

### Step 3: Start the Server

```bash
# Stop existing containers
docker-compose down

# Start with RageMP
docker-compose up --build -d

# Check logs
docker-compose logs -f gta-rp-server
```

## 📁 File Structure After Setup

```
gta-rp-server/
├── ragemp-server           # RageMP server binary (executable)
├── ragemp-server.conf      # RageMP configuration
├── gamemode.js            # Your custom gamemode
├── index.js               # Node.js web server
├── public/                # Web admin panel
├── docker-compose.yml     # Docker services
└── Dockerfile             # Container definition
```

## ⚙️ Configuration

### RageMP Server Configuration (`ragemp-server.conf`)

Key settings you can modify:

```ini
# Server Information
name "GTA RP Server"        # Server name
maxplayers 50               # Maximum players
gamemode "gamemode"         # Gamemode file

# Network Settings
port 22005                  # Server port
bind 0.0.0.0               # Bind address

# Performance Settings
streamdistance 500          # Streaming distance
maxvehicles 100             # Maximum vehicles
maxpeds 50                  # Maximum NPCs
maxobjects 1000             # Maximum objects

# Spawn Settings
spawn_x -1037.74            # Default spawn X
spawn_y -2738.04            # Default spawn Y
spawn_z 20.17               # Default spawn Z
```

### Environment Variables

You can customize these in your `.env` file:

```bash
# Server Configuration
NODE_ENV=development
PORT=3000
RAGEMP_PORT=22005

# RageMP Settings
SERVER_NAME="GTA RP Server"
MAX_PLAYERS=50
SPAWN_X=-1037.74
SPAWN_Y=-2738.04
SPAWN_Z=20.17
```

## 🎯 Testing Your Setup

### 1. Check Server Status
```bash
# View running containers
docker-compose ps

# Check RageMP logs
docker-compose logs -f gta-rp-server
```

### 2. Test Web Admin Panel
- Open http://localhost:3000
- Check if RageMP server status is shown
- Monitor player connections

### 3. Test RageMP Connection
- Use a GTA V client with RageMP
- Connect to `localhost:22005`
- Verify you can join the server

## 🐛 Troubleshooting

### Common Issues

#### 1. RageMP Binary Not Found
```bash
# Check if file exists
ls -la ragemp-server

# Make sure it's executable
chmod +x ragemp-server

# Check file type
file ragemp-server
```

#### 2. Permission Denied
```bash
# Fix permissions
chmod +x ragemp-server

# Check ownership
ls -la ragemp-server
```

#### 3. Port Already in Use
```bash
# Check what's using port 22005
sudo netstat -tulpn | grep :22005

# Kill the process or change port in ragemp-server.conf
```

#### 4. RageMP Server Won't Start
```bash
# Check logs
docker-compose logs gta-rp-server

# Verify binary is Linux compatible
file ragemp-server

# Check configuration syntax
./ragemp-server --help
```

### Performance Issues

#### High CPU Usage
- Reduce `streamdistance` in configuration
- Lower `maxvehicles` and `maxpeds`
- Optimize your gamemode scripts

#### Memory Issues
- Reduce `maxobjects` and `maxpickups`
- Monitor with `docker stats`
- Restart server periodically

## 🔄 Updating RageMP

### 1. Backup Current Setup
```bash
cp ragemp-server ragemp-server.backup
cp ragemp-server.conf ragemp-server.conf.backup
```

### 2. Download New Version
- Follow the official wiki instructions
- Replace the old binary

### 3. Restart Services
```bash
docker-compose restart gta-rp-server
```

## 📚 Additional Resources

- **Official Wiki**: https://wiki.rage.mp/
- **Getting Started Guide**: https://wiki.rage.mp/wiki/Getting_Started_with_Server
- **Community Discord**: Check RageMP website for Discord link
- **Forums**: https://rage.mp/forums/

## 🎉 Next Steps

Once your RageMP server is running:

1. **Customize your gamemode** (`gamemode.js`)
2. **Add custom scripts** and features
3. **Configure anti-cheat** settings
4. **Set up player management** systems
5. **Add custom vehicles** and objects
6. **Implement economy** and job systems

## 🆘 Need Help?

If you encounter issues:

1. Check the logs: `docker-compose logs gta-rp-server`
2. Verify file permissions and ownership
3. Check the [official RageMP wiki](https://wiki.rage.mp/)
4. Ensure your binary is compatible with your system
5. Verify network and firewall settings

---

**Happy Roleplaying! 🎭**
