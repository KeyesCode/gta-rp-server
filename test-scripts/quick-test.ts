#!/usr/bin/env ts-node

/**
 * Quick Test Script for GTA RP Server
 * Simple tests for basic functionality
 */

import { io } from 'socket.io-client';
import { Player, Vehicle, ChatMessage } from '../src/types';

const SERVER_URL = 'http://localhost:3000';

async function quickTest() {
  console.log('🧪 Quick Test - GTA RP Server');
  console.log('==============================');
  
  // Test 1: Server Health Check
  console.log('\n1️⃣ Testing server health...');
  try {
    const response = await fetch(`${SERVER_URL}/health`);
    const health = await response.json();
    console.log('✅ Health check passed:', health);
  } catch (error) {
    console.log('❌ Health check failed:', error);
    return;
  }

  // Test 2: API Endpoints
  console.log('\n2️⃣ Testing API endpoints...');
  
  try {
    const [players, vehicles, stats] = await Promise.all([
      fetch(`${SERVER_URL}/api/players`).then(r => r.json()),
      fetch(`${SERVER_URL}/api/vehicles`).then(r => r.json()),
      fetch(`${SERVER_URL}/api/stats`).then(r => r.json())
    ]);
    
    console.log('✅ Players API:', (players as Player[]).length, 'players');
    console.log('✅ Vehicles API:', (vehicles as Vehicle[]).length, 'vehicles');
    console.log('✅ Stats API:', stats);
  } catch (error) {
    console.log('❌ API test failed:', error);
  }

  // Test 3: Socket.IO Connection
  console.log('\n3️⃣ Testing Socket.IO connection...');
  
  const socket = io(SERVER_URL, {
    transports: ['websocket'],
    timeout: 5000
  });

  return new Promise<void>((resolve) => {
    socket.on('connect', () => {
      console.log('✅ Socket.IO connected!');
      
      // Test player spawn
      console.log('\n4️⃣ Testing player spawn...');
      socket.emit('playerSpawn', {
        name: 'TestPlayer',
        position: { x: -1037.74, y: -2738.04, z: 20.17 },
        health: 100,
        armor: 50,
        money: 1000,
        level: 1,
        job: 'Unemployed'
      });
      
      // Test chat message
      console.log('\n5️⃣ Testing chat message...');
      socket.emit('chatMessage', {
        message: 'Hello from test script!'
      });
      
      // Test vehicle spawn
      console.log('\n6️⃣ Testing vehicle spawn...');
      socket.emit('vehicleSpawn', {
        id: 'test_vehicle_001',
        model: 'Test Car',
        position: { x: -1038.50, y: -2736.50, z: 20.17 }
      });
      
      // Wait a bit then disconnect
      setTimeout(() => {
        console.log('\n✅ All tests completed!');
        socket.disconnect();
        resolve();
      }, 3000);
    });

    socket.on('connect_error', (error: Error) => {
      console.log('❌ Socket.IO connection failed:', error.message);
      resolve();
    });

    socket.on('disconnect', () => {
      console.log('📡 Socket.IO disconnected');
    });

    // Listen for responses
    socket.on('playerListUpdate', (players: Player[]) => {
      console.log('📊 Player list updated:', players.length, 'players');
    });

    socket.on('vehicleListUpdate', (vehicles: Vehicle[]) => {
      console.log('🚗 Vehicle list updated:', vehicles.length, 'vehicles');
    });

    socket.on('chatMessage', (message: ChatMessage) => {
      console.log('💬 Chat received:', message);
    });
  });
}

// Run the test
if (require.main === module) {
  quickTest()
    .then(() => {
      console.log('\n🎉 Quick test completed!');
      process.exit(0);
    })
    .catch((error) => {
      console.error('\n💥 Test failed:', error);
      process.exit(1);
    });
}
