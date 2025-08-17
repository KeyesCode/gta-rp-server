const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const path = require('path');
require('dotenv').config();

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
});

// Middleware
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// Store connected players
const players = new Map();
const vehicles = new Map();

// RageMP event handlers
io.on('connection', (socket) => {
  console.log(`Player connected: ${socket.id}`);

  // Player spawn event
  socket.on('playerSpawn', (data) => {
    const player = {
      id: socket.id,
      name: data.name || 'Unknown',
      position: data.position || { x: 0, y: 0, z: 0 },
      health: data.health || 100,
      armor: data.armor || 0,
      money: data.money || 1000,
      level: data.level || 1,
      job: data.job || 'Unemployed'
    };
    
    players.set(socket.id, player);
    io.emit('playerListUpdate', Array.from(players.values()));
    
    console.log(`Player ${player.name} spawned at ${JSON.stringify(player.position)}`);
  });

  // Player movement
  socket.on('playerMove', (data) => {
    const player = players.get(socket.id);
    if (player) {
      player.position = data.position;
      socket.broadcast.emit('playerMoved', {
        id: socket.id,
        position: data.position
      });
    }
  });

  // Chat message
  socket.on('chatMessage', (data) => {
    const player = players.get(socket.id);
    if (player) {
      const message = {
        player: player.name,
        message: data.message,
        timestamp: new Date().toISOString()
      };
      
      io.emit('chatMessage', message);
      console.log(`[CHAT] ${player.name}: ${data.message}`);
    }
  });

  // Vehicle spawn
  socket.on('vehicleSpawn', (data) => {
    const vehicle = {
      id: data.id,
      model: data.model,
      position: data.position,
      owner: socket.id,
      locked: false
    };
    
    vehicles.set(data.id, vehicle);
    io.emit('vehicleListUpdate', Array.from(vehicles.values()));
  });

  // Job system
  socket.on('startJob', (data) => {
    const player = players.get(socket.id);
    if (player) {
      player.job = data.job;
      player.money += data.salary || 100;
      
      io.emit('playerListUpdate', Array.from(players.values()));
      socket.emit('jobStarted', { job: data.job, salary: data.salary });
      
      console.log(`Player ${player.name} started job: ${data.job}`);
    }
  });

  // Disconnect handler
  socket.on('disconnect', () => {
    const player = players.get(socket.id);
    if (player) {
      console.log(`Player ${player.name} disconnected`);
      players.delete(socket.id);
      io.emit('playerListUpdate', Array.from(players.values()));
    }
  });
});

// REST API endpoints
app.get('/api/players', (req, res) => {
  res.json(Array.from(players.values()));
});

app.get('/api/vehicles', (req, res) => {
  res.json(Array.from(vehicles.values()));
});

app.get('/api/stats', (req, res) => {
  res.json({
    totalPlayers: players.size,
    totalVehicles: vehicles.size,
    uptime: process.uptime()
  });
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// Serve the main page
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

const PORT = process.env.PORT || 3000;
const RAGEMP_PORT = process.env.RAGEMP_PORT || 22005;

server.listen(PORT, () => {
  console.log(`🚀 GTA RP Server running on port ${PORT}`);
  console.log(`🎮 RageMP server configured for port ${RAGEMP_PORT}`);
  console.log(`📊 Server stats: http://localhost:${PORT}/api/stats`);
  console.log(`👥 Connected players: ${players.size}`);
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM received, shutting down gracefully');
  server.close(() => {
    console.log('Server closed');
    process.exit(0);
  });
});

process.on('SIGINT', () => {
  console.log('SIGINT received, shutting down gracefully');
  server.close(() => {
    console.log('Server closed');
    process.exit(0);
  });
});
