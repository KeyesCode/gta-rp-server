#!/usr/bin/env ts-node

/**
 * GTA RP Server Game Simulation Test Script
 * This script simulates players, vehicles, and game events to test the admin dashboard
 */

import { io, Socket } from 'socket.io-client';
import { Player, Vehicle, ChatMessage } from '../src/types';
import { TEST_CONFIG } from './test-config';

// Test configuration
const SERVER_URL = TEST_CONFIG.SERVER_URL;
const SIMULATION_DELAY = TEST_CONFIG.SIMULATION_DELAY;

// Simulated player data
const testPlayers = [
  {
    id: 'player_001',
    name: 'John_Doe',
    position: { x: -1037.74, y: -2738.04, z: 20.17 },
    health: 100,
    armor: 50,
    money: 1500,
    level: 3,
    job: 'taxi'
  },
  {
    id: 'player_002',
    name: 'Jane_Smith',
    position: { x: -1040.12, y: -2735.89, z: 20.17 },
    health: 85,
    armor: 25,
    money: 2200,
    level: 5,
    job: 'police'
  },
  {
    id: 'player_003',
    name: 'Bob_Johnson',
    position: { x: -1035.45, y: -2740.23, z: 20.17 },
    health: 100,
    armor: 0,
    money: 800,
    level: 1,
    job: 'Unemployed'
  },
  {
    id: 'player_004',
    name: 'Alice_Brown',
    position: { x: -1042.67, y: -2732.56, z: 20.17 },
    health: 75,
    armor: 100,
    money: 3500,
    level: 7,
    job: 'mechanic'
  },
  {
    id: 'player_005',
    name: 'Charlie_Wilson',
    position: { x: -1033.89, y: -2742.78, z: 20.17 },
    health: 100,
    armor: 0,
    money: 1200,
    level: 2,
    job: 'delivery'
  }
];

// Simulated vehicle data
const testVehicles = [
  {
    id: 'vehicle_001',
    model: 'Adder',
    position: { x: -1038.50, y: -2736.50, z: 20.17 },
    owner: 'player_001',
    locked: false,
    health: 100,
    fuel: 85
  },
  {
    id: 'vehicle_002',
    model: 'Police Cruiser',
    position: { x: -1041.00, y: -2734.00, z: 20.17 },
    owner: 'player_002',
    locked: true,
    health: 95,
    fuel: 100
  },
  {
    id: 'vehicle_003',
    model: 'Tow Truck',
    position: { x: -1036.50, y: -2739.00, z: 20.17 },
    owner: 'player_004',
    locked: false,
    health: 80,
    fuel: 60
  }
];

// Chat messages to simulate (each player sends their own message)
const chatMessages = [
  { playerId: 'player_001', message: 'Hey everyone! How\'s the server today?' },
  { playerId: 'player_002', message: 'All good! Just patrolling the area.' },
  { playerId: 'player_003', message: 'Can someone help me find a job?' },
  { playerId: 'player_004', message: 'I can help with vehicle repairs!' },
  { playerId: 'player_005', message: 'Anyone need delivery services?' },
  { playerId: 'player_001', message: 'I need a ride to the city center' },
  { playerId: 'player_002', message: 'I\'ll escort you there' }
];

class GameSimulator {
  private playerSockets: Map<string, Socket> = new Map();
  private currentPlayers: Map<string, Player> = new Map();
  private currentVehicles: Map<string, Vehicle> = new Map();
  private eventQueue: Array<() => void> = [];
  private isRunning = false;

  constructor() {
    this.setupPlayerConnections();
  }

  private setupPlayerConnections(): void {
    console.log('🔌 Setting up player connections...');
    
    // Create a separate socket connection for each player
    testPlayers.forEach((player, index) => {
      const socket = io(SERVER_URL, {
        transports: ['websocket'],
        timeout: 5000,
        query: { playerId: player.id, playerName: player.name }
      });

      socket.on('connect', () => {
        console.log(`✅ ${player.name} connected!`);
        this.playerSockets.set(player.id, socket);
        
        // If this is the last player to connect, start the simulation
        if (this.playerSockets.size === testPlayers.length) {
          console.log('🎮 All players connected, starting simulation...');
          this.startSimulation();
        }
      });

      socket.on('disconnect', () => {
        console.log(`❌ ${player.name} disconnected`);
        this.playerSockets.delete(player.id);
      });

      socket.on('connect_error', (error: Error) => {
        console.log(`❌ ${player.name} connection error:`, error.message);
      });

      // Listen for server responses
      socket.on('playerListUpdate', (players: Player[]) => {
        console.log(`📊 ${player.name} received player list update:`, players.length, 'players');
        players.forEach(p => this.currentPlayers.set(p.id, p));
      });

      socket.on('vehicleListUpdate', (vehicles: Vehicle[]) => {
        console.log(`🚗 ${player.name} received vehicle list update:`, vehicles.length, 'vehicles');
        vehicles.forEach(v => this.currentVehicles.set(v.id, v));
      });

      socket.on('chatMessage', (message: ChatMessage) => {
        console.log(`💬 [${message.player}]: ${message.message}`);
      });

      socket.on('playerMoved', (data: { id: string; position: any }) => {
        console.log(`🚶 Player ${data.id} moved to`, data.position);
      });

      socket.on('jobStarted', (data: { job: string; salary: number }) => {
        console.log(`💼 ${player.name} started job: ${data.job} ($${data.salary})`);
      });
    });
  }

  private startSimulation(): void {
    if (this.isRunning) return;
    
    console.log('🎮 Starting game simulation...');
    this.isRunning = true;

    // Queue up all the simulation events
    this.queuePlayerSpawns();
    this.queueVehicleSpawns();
    this.queueChatMessages();
    this.queuePlayerMovements();
    this.queueJobChanges();
    this.queuePlayerDisconnections();

    // Start processing the queue
    this.processEventQueue();
  }

  private queuePlayerSpawns(): void {
    console.log('👥 Queueing player spawns...');
    
    testPlayers.forEach((player, index) => {
      this.eventQueue.push(() => {
        console.log(`🎭 Spawning player: ${player.name}`);
        const socket = this.playerSockets.get(player.id);
        if (socket) {
          socket.emit('playerSpawn', {
            name: player.name,
            position: player.position,
            health: player.health,
            armor: player.armor,
            money: player.money,
            level: player.level,
            job: player.job
          });
        }
      });
    });
  }

  private queueVehicleSpawns(): void {
    console.log('🚗 Queueing vehicle spawns...');
    
    testVehicles.forEach((vehicle, index) => {
      this.eventQueue.push(() => {
        console.log(`🚙 Spawning vehicle: ${vehicle.model}`);
        // Use the owner's socket to spawn the vehicle
        const ownerSocket = this.playerSockets.get(vehicle.owner);
        if (ownerSocket) {
          ownerSocket.emit('vehicleSpawn', {
            id: vehicle.id,
            model: vehicle.model,
            position: vehicle.position
          });
        }
      });
    });
  }

  private queueChatMessages(): void {
    console.log('💬 Queueing chat messages...');
    
    chatMessages.forEach((chat, index) => {
      this.eventQueue.push(() => {
        console.log(`💭 Sending chat from ${chat.playerId}: ${chat.message}`);
        const socket = this.playerSockets.get(chat.playerId);
        if (socket) {
          socket.emit('chatMessage', {
            message: chat.message
          });
        }
      });
    });
  }

  private queuePlayerMovements(): void {
    console.log('🚶 Queueing player movements...');
    
    const movementPositions = [
      { x: -1045.00, y: -2730.00, z: 20.17 },
      { x: -1030.00, y: -2745.00, z: 20.17 },
      { x: -1048.00, y: -2728.00, z: 20.17 },
      { x: -1028.00, y: -2747.00, z: 20.17 }
    ];

    testPlayers.forEach((player, index) => {
      if (index < movementPositions.length) {
        this.eventQueue.push(() => {
          console.log(`🚶 Moving player: ${player.name}`);
          const socket = this.playerSockets.get(player.id);
          if (socket) {
            socket.emit('playerMove', {
              position: movementPositions[index]
            });
          }
        });
      }
    });
  }

  private queueJobChanges(): void {
    console.log('💼 Queueing job changes...');
    
    const jobChanges = [
      { playerId: 'player_001', job: 'police', salary: 200 },
      { playerId: 'player_002', job: 'mechanic', salary: 175 },
      { playerId: 'player_003', job: 'taxi', salary: 150 }
    ];

    jobChanges.forEach((jobChange, index) => {
      this.eventQueue.push(() => {
        console.log(`💼 Changing job for ${jobChange.playerId} to: ${jobChange.job}`);
        const socket = this.playerSockets.get(jobChange.playerId);
        if (socket) {
          socket.emit('startJob', {
            job: jobChange.job,
            salary: jobChange.salary
          });
        }
      });
    });
  }

  private queuePlayerDisconnections(): void {
    console.log('👋 Queueing player disconnections...');
    
    // Simulate some players leaving
    ['player_003', 'player_005'].forEach(playerId => {
      this.eventQueue.push(() => {
        console.log(`👋 Simulating disconnect for: ${playerId}`);
        const socket = this.playerSockets.get(playerId);
        if (socket) {
          socket.disconnect();
          this.playerSockets.delete(playerId);
        }
        this.currentPlayers.delete(playerId);
      });
    });
  }

  private processEventQueue(): void {
    if (this.eventQueue.length === 0) {
      console.log('✅ Simulation complete!');
      this.isRunning = false;
      return;
    }

    const event = this.eventQueue.shift();
    if (event) {
      event();
      
      // Schedule next event
      setTimeout(() => {
        this.processEventQueue();
      }, SIMULATION_DELAY);
    }
  }

  public stop(): void {
    console.log('🛑 Stopping simulation...');
    this.isRunning = false;
    this.eventQueue = [];
    
    // Disconnect all player sockets
    this.playerSockets.forEach((socket, playerId) => {
      socket.disconnect();
    });
    this.playerSockets.clear();
  }

  public getStatus(): void {
    console.log('\n📊 Simulation Status:');
    console.log(`Running: ${this.isRunning}`);
    console.log(`Events in queue: ${this.eventQueue.length}`);
    console.log(`Connected players: ${this.playerSockets.size}`);
    console.log(`Current players: ${this.currentPlayers.size}`);
    console.log(`Current vehicles: ${this.currentVehicles.size}`);
  }
}

// Main execution
async function main() {
  console.log('🎮 GTA RP Server Game Simulation');
  console.log('================================');
  console.log(`Server: ${SERVER_URL}`);
  console.log(`Delay between events: ${SIMULATION_DELAY}ms`);
  console.log(`Players: ${testPlayers.length}`);
  console.log(`Vehicles: ${testVehicles.length}`);
  console.log('');

  const simulator = new GameSimulator();

  // Handle graceful shutdown
  process.on('SIGINT', () => {
    console.log('\n🛑 Received SIGINT, shutting down...');
    simulator.stop();
    process.exit(0);
  });

  process.on('SIGTERM', () => {
    console.log('\n🛑 Received SIGTERM, shutting down...');
    simulator.stop();
    process.exit(0);
  });

  // Show status every 10 seconds
  setInterval(() => {
    simulator.getStatus();
  }, TEST_CONFIG.STATUS_UPDATE_INTERVAL);

  // Keep the process running
  await new Promise(() => {});
}

// Run the simulation
if (require.main === module) {
  main().catch(console.error);
}

export { GameSimulator };
