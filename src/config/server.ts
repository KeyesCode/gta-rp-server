import { ServerConfig, DatabaseConfig, RedisConfig } from '../types';

// Server configuration
export const serverConfig: ServerConfig = {
  port: parseInt(process.env.PORT || '3000'),
  ragempPort: parseInt(process.env.RAGEMP_PORT || '22005'),
  maxPlayers: parseInt(process.env.MAX_PLAYERS || '50'),
  serverName: process.env.SERVER_NAME || 'GTA RP Server',
  gamemode: process.env.GAMEMODE || 'gamemode',
  environment: (process.env.NODE_ENV as 'development' | 'production' | 'staging') || 'development'
};

// Database configuration
export const databaseConfig: DatabaseConfig = {
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '3306'),
  database: process.env.DB_NAME || 'gta_rp',
  username: process.env.DB_USER || 'gta_user',
  password: process.env.DB_PASSWORD || 'gta_password'
};

// Redis configuration
export const redisConfig: RedisConfig = {
  host: process.env.REDIS_HOST || 'localhost',
  port: parseInt(process.env.REDIS_PORT || '6379'),
  password: process.env.REDIS_PASSWORD || undefined,
  database: parseInt(process.env.REDIS_DB || '0')
};

// Job configurations
export const jobConfigs = {
  taxi: { salary: 150, description: 'Taxi Driver' },
  police: { salary: 200, description: 'Police Officer' },
  mechanic: { salary: 175, description: 'Mechanic' },
  delivery: { salary: 125, description: 'Delivery Driver' }
};

// Spawn configuration
export const spawnConfig = {
  default: { x: -1037.74, y: -2738.04, z: 20.17 },
  hospital: { x: 295.83, y: -1446.94, z: 29.97 },
  police: { x: 425.13, y: -979.55, z: 30.71 },
  mechanic: { x: -347.29, y: -133.37, z: 39.01 }
};

// Economy configuration
export const economyConfig = {
  startingMoney: parseInt(process.env.STARTING_MONEY || '1000'),
  maxMoney: parseInt(process.env.MAX_MONEY || '999999999'),
  moneyPerLevel: parseInt(process.env.MONEY_PER_LEVEL || '100'),
  jobBonusMultiplier: parseFloat(process.env.JOB_BONUS_MULTIPLIER || '1.0')
};

// Performance configuration
export const performanceConfig = {
  maxVehicles: parseInt(process.env.MAX_VEHICLES || '100'),
  maxPeds: parseInt(process.env.MAX_PEDS || '50'),
  maxObjects: parseInt(process.env.MAX_OBJECTS || '1000'),
  streamDistance: parseInt(process.env.STREAM_DISTANCE || '500'),
  updateInterval: parseInt(process.env.UPDATE_INTERVAL || '1000')
};
