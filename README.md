# GTA RP Server - RageMP Local Development Setup

A complete GTA RP (Roleplay) server setup using RageMP with Node.js backend and modern web admin panel.

## 🎮 Features

- **RageMP Server**: Multiplayer GTA V server with roleplay features (requires manual setup)
- **Node.js Backend**: Real-time server management with Socket.IO
- **Web Admin Panel**: Beautiful, responsive dashboard for server administration
- **Roleplay Systems**: Jobs, economy, vehicles, and player management
- **Docker Support**: Easy deployment and development environment
- **Real-time Updates**: Live player tracking, chat, and statistics

## 🚀 Quick Start

### Prerequisites

- Docker and Docker Compose
- Node.js 18+ (for local development)
- Linux/macOS/Windows with Docker support

### 1. Clone and Setup

```bash
git clone <your-repo-url>
cd gta-rp-server
chmod +x start-web-dev.sh
```

### 2. Start Web Development Environment

```bash
./start-web-dev.sh
```

This will:
- Install Node.js dependencies
- Build and start Docker containers (web server + database)
- Set up the web development environment

### 3. Access Services

- **Web Admin Panel**: http://localhost:3000
- **MySQL Database**: localhost:3306
- **Redis Cache**: localhost:6379

## 🔧 RageMP Server Setup

The RageMP server requires manual setup due to licensing restrictions:

1. **Download RageMP Server**:
   - Visit https://rage.mp/
   - Download the server binary for your platform
   - Place it in the project root directory

2. **Make it Executable**:
   ```bash
   chmod +x ragemp-server
   ```

3. **Restart Services**:
   ```bash
   docker-compose restart gta-rp-server
   ```

4. **Connect to RageMP Server**: localhost:22005

## 🏗️ Architecture

```
gta-rp-server/
├── Dockerfile              # Main server container
├── docker-compose.yml      # Multi-service orchestration
├── package.json            # Node.js dependencies
├── index.js               # Main server application
├── gamemode.js            # RageMP gamemode logic
├── ragemp-server.conf     # RageMP server configuration
├── public/                # Web admin panel
│   └── index.html        # Admin dashboard
├── start-web-dev.sh       # Web development startup script
├── start-dev.sh           # Full development startup script
└── README.md              # This file
```

## 🎯 Core Systems

### Player Management
- Player spawn and respawn
- Health and armor system
- Money and economy
- Level progression
- Job assignments

### Job System
- **Taxi Driver**: $150 salary
- **Police Officer**: $200 salary
- **Mechanic**: $175 salary
- **Delivery Driver**: $125 salary

### Vehicle System
- Vehicle spawning and tracking
- Ownership management
- Position monitoring
- Lock/unlock functionality

### Chat System
- Real-time chat
- Command system
- OOC (Out of Character) support
- Admin commands

## 🛠️ Development

### Web Development (Recommended for starting)

```bash
# Start web development environment
./start-web-dev.sh

# View logs
docker-compose logs -f gta-rp-server

# Restart web server
docker-compose restart gta-rp-server
```

### Full Development (with RageMP)

```bash
# Start all services (requires ragemp-server binary)
./start-dev.sh

# View logs
docker-compose logs -f gta-rp-server

# Restart server
docker-compose restart gta-rp-server

# Stop all services
docker-compose down
```

### Local Development (without Docker)

```bash
# Install dependencies
npm install

# Start the server
npm run dev

# Or start production mode
npm start
```

### Making Changes

1. **Gamemode Changes**: Edit `gamemode.js` and restart the server
2. **Server Changes**: Edit `index.js` and restart the container
3. **Web Panel**: Edit files in `public/` directory
4. **Configuration**: Edit `ragemp-server.conf` and restart

## 📡 API Endpoints

### REST API
- `GET /api/players` - List all online players
- `GET /api/vehicles` - List all active vehicles
- `GET /api/stats` - Server statistics
- `GET /health` - Health check

### WebSocket Events
- `playerSpawn` - Player spawn event
- `playerMove` - Player movement updates
- `chatMessage` - Chat messages
- `vehicleSpawn` - Vehicle spawn events
- `startJob` - Job assignment events

## 🎮 In-Game Commands

- `/help` - Show available commands
- `/job <jobname>` - Start a job (taxi, police, mechanic, delivery)
- `/money` - Show current money
- `/spawn` - Teleport to spawn
- `/tp <x> <y> <z>` - Teleport to coordinates

### Key Bindings
- **H** - Restore health and armor
- **J** - Add $100 to money

## 🔧 Configuration

### Environment Variables
- `PORT` - Web server port (default: 3000)
- `RAGEMP_PORT` - RageMP server port (default: 22005)
- `NODE_ENV` - Environment mode (development/production)

### RageMP Configuration
Edit `ragemp-server.conf` to customize:
- Server name and settings
- Player limits and spawn points
- Anti-cheat settings
- Performance parameters

## 🚀 Deployment

### Web Development Deployment

```bash
# Build and start web services
docker-compose up --build -d gta-rp-server mysql redis
```

### Production Deployment

```bash
# Build production image
docker build -t gta-rp-server:latest .

# Run production container
docker run -d \
  --name gta-rp-server \
  -p 3000:3000 \
  -p 22005:22005 \
  gta-rp-server:latest
```

## 📊 Monitoring

### Web Admin Panel Features
- Real-time player count
- Vehicle tracking
- Live chat monitoring
- Server statistics
- Performance metrics

### Logs
- Server logs: `docker-compose logs gta-rp-server`
- Application logs: `logs/` directory

## 🐛 Troubleshooting

### Common Issues

1. **Port Already in Use**
   ```bash
   # Check what's using the port
   sudo netstat -tulpn | grep :3000
   
   # Kill the process or change ports in docker-compose.yml
   ```

2. **Container Won't Start**
   ```bash
   # Check container logs
   docker-compose logs gta-rp-server
   
   # Rebuild container
   docker-compose up --build -d
   ```

3. **RageMP Server Not Working**
   - Ensure you have downloaded the ragemp-server binary
   - Make it executable: `chmod +x ragemp-server`
   - Check if it's in the project root directory
   - Restart the container: `docker-compose restart gta-rp-server`

### Performance Tuning

- Adjust `maxplayers` in `ragemp-server.conf`
- Modify `streamdistance` for better performance
- Tune database connection pools
- Monitor memory usage with `docker stats`

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📝 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙏 Acknowledgments

- RageMP team for the multiplayer framework
- GTA V community for inspiration
- Node.js and Socket.IO communities

## 📞 Support

- **Issues**: Create a GitHub issue
- **Discord**: Join our community server
- **Documentation**: Check the wiki for detailed guides

---

**Happy Roleplaying! 🎭**

*Remember to respect other players and follow server rules.*
