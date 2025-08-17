import express, { Application, Request, Response, NextFunction } from 'express';
import { createServer, Server as HTTPServer } from 'http';
import { Server as SocketIOServer, Socket } from 'socket.io';
import path from 'path';
import dotenv from 'dotenv';

import { serverConfig } from './config/server';
import { logger, logServerEvent, logError, logPlayerAction, logRageMPEvent, logChatMessage, logVehicleEvent } from './utils/logger';
import { 
  Player, 
  Vehicle, 
  ChatMessage, 
  ServerStats,
  PlayerSpawnData,
  PlayerMoveData,
  VehicleSpawnData,
  JobStartData,
  ChatMessageData
} from './types';

// Load environment variables
dotenv.config();

class GTARPServer {
  private app: Application;
  private server: HTTPServer;
  private io: SocketIOServer;
  private players: Map<string, Player> = new Map();
  private vehicles: Map<string, Vehicle> = new Map();
  private startTime: Date = new Date();

  constructor() {
    this.app = express();
    this.server = createServer(this.app);
    this.io = new SocketIOServer(this.server, {
      cors: {
        origin: "*",
        methods: ["GET", "POST"]
      }
    });

    this.setupMiddleware();
    this.setupRoutes();
    this.setupSocketHandlers();
    this.setupErrorHandling();
  }

  private setupMiddleware(): void {
    this.app.use(express.json());
    this.app.use(express.static(path.join(__dirname, '../public')));
    
    // Request logging middleware
    this.app.use((req: Request, res: Response, next: NextFunction) => {
      logger.info(`${req.method} ${req.path}`, { 
        method: req.method, 
        path: req.path, 
        ip: req.ip,
        userAgent: req.get('User-Agent')
      });
      next();
    });
  }

  private setupRoutes(): void {
    // Health check endpoint
    this.app.get('/health', (req: Request, res: Response) => {
      res.json({ 
        status: 'OK', 
        timestamp: new Date().toISOString(),
        uptime: this.getUptime()
      });
    });

    // API endpoints
    this.app.get('/api/players', (req: Request, res: Response) => {
      res.json(Array.from(this.players.values()));
    });

    this.app.get('/api/vehicles', (req: Request, res: Response) => {
      res.json(Array.from(this.vehicles.values()));
    });

    this.app.get('/api/stats', (req: Request, res: Response) => {
      res.json(this.getServerStats());
    });

    // Serve the main page
    this.app.get('/', (req: Request, res: Response) => {
      res.sendFile(path.join(__dirname, '../public/index.html'));
    });
  }

  private setupSocketHandlers(): void {
    this.io.on('connection', (socket: Socket) => {
      logger.info(`Player connected: ${socket.id}`);
      logRageMPEvent('playerConnected', socket.id);

      // Player spawn event
      socket.on('playerSpawn', (data: PlayerSpawnData) => {
        this.handlePlayerSpawn(socket, data);
      });

      // Player movement
      socket.on('playerMove', (data: PlayerMoveData) => {
        this.handlePlayerMove(socket, data);
      });

      // Chat message
      socket.on('chatMessage', (data: ChatMessageData) => {
        this.handleChatMessage(socket, data);
      });

      // Vehicle spawn
      socket.on('vehicleSpawn', (data: VehicleSpawnData) => {
        this.handleVehicleSpawn(socket, data);
      });

      // Job system
      socket.on('startJob', (data: JobStartData) => {
        this.handleJobStart(socket, data);
      });

      // Disconnect handler
      socket.on('disconnect', () => {
        this.handlePlayerDisconnect(socket);
      });
    });
  }

  private handlePlayerSpawn(socket: Socket, data: PlayerSpawnData): void {
    const player: Player = {
      id: socket.id,
      name: data.name,
      position: data.position,
      health: data.health,
      armor: data.armor,
      money: data.money,
      level: data.level,
      job: data.job,
      lastSeen: new Date()
    };

    this.players.set(socket.id, player);
    this.io.emit('playerListUpdate', Array.from(this.players.values()));
    
    logPlayerAction(socket.id, 'spawn', data);
    logger.info(`Player ${player.name} spawned at ${JSON.stringify(player.position)}`);
  }

  private handlePlayerMove(socket: Socket, data: PlayerMoveData): void {
    const player = this.players.get(socket.id);
    if (player) {
      player.position = data.position;
      player.lastSeen = new Date();
      
      socket.broadcast.emit('playerMoved', {
        id: socket.id,
        position: data.position
      });
    }
  }

  private handleChatMessage(socket: Socket, data: ChatMessageData): void {
    const player = this.players.get(socket.id);
    if (player) {
      const message: ChatMessage = {
        player: player.name,
        message: data.message,
        timestamp: new Date(),
        type: 'chat'
      };

      this.io.emit('chatMessage', message);
      logChatMessage(socket.id, data.message, 'chat');
      logger.info(`[CHAT] ${player.name}: ${data.message}`);
    }
  }

  private handleVehicleSpawn(socket: Socket, data: VehicleSpawnData): void {
    const vehicle: Vehicle = {
      id: data.id,
      model: data.model,
      position: data.position,
      owner: socket.id,
      locked: false,
      health: 100,
      fuel: 100
    };

    this.vehicles.set(data.id, vehicle);
    this.io.emit('vehicleListUpdate', Array.from(this.vehicles.values()));
    
    logVehicleEvent('spawn', data.id, data);
  }

  private handleJobStart(socket: Socket, data: JobStartData): void {
    const player = this.players.get(socket.id);
    if (player) {
      player.job = data.job;
      player.money += data.salary;
      player.lastSeen = new Date();

      this.io.emit('playerListUpdate', Array.from(this.players.values()));
      socket.emit('jobStarted', { job: data.job, salary: data.salary });
      
      logPlayerAction(socket.id, 'jobStart', data);
      logger.info(`Player ${player.name} started job: ${data.job}`);
    }
  }

  private handlePlayerDisconnect(socket: Socket): void {
    const player = this.players.get(socket.id);
    if (player) {
      logger.info(`Player ${player.name} disconnected`);
      logRageMPEvent('playerDisconnected', socket.id);
      
      this.players.delete(socket.id);
      this.io.emit('playerListUpdate', Array.from(this.players.values()));
    }
  }

  private setupErrorHandling(): void {
    // Global error handler
    this.app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
      logError(err, 'Express Error Handler');
      res.status(500).json({ error: 'Internal Server Error' });
    });

    // 404 handler
    this.app.use('*', (req: Request, res: Response) => {
      res.status(404).json({ error: 'Route not found' });
    });
  }

  private getUptime(): number {
    return Math.floor((Date.now() - this.startTime.getTime()) / 1000);
  }

  private getServerStats(): ServerStats {
    return {
      totalPlayers: this.players.size,
      totalVehicles: this.vehicles.size,
      uptime: this.getUptime(),
      maxPlayers: serverConfig.maxPlayers,
      serverVersion: '1.0.0'
    };
  }

  public start(): void {
    this.server.listen(serverConfig.port, () => {
      logServerEvent('serverStarted', { port: serverConfig.port });
      logger.info(`🚀 GTA RP Server running on port ${serverConfig.port}`);
      logger.info(`🎮 RageMP server configured for port ${serverConfig.ragempPort}`);
      logger.info(`📊 Server stats: http://localhost:${serverConfig.port}/api/stats`);
      logger.info(`👥 Connected players: ${this.players.size}`);
    });
  }

  public stop(): void {
    this.server.close(() => {
      logger.info('Server stopped');
      process.exit(0);
    });
  }
}

// Graceful shutdown handling
process.on('SIGTERM', () => {
  logger.info('SIGTERM received, shutting down gracefully');
  process.exit(0);
});

process.on('SIGINT', () => {
  logger.info('SIGINT received, shutting down gracefully');
  process.exit(0);
});

// Start the server
const server = new GTARPServer();
server.start();
