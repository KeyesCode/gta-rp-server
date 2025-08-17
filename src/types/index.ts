// GTA RP Server Type Definitions
export interface Player {
  id: string;
  name: string;
  position: Vector3;
  health: number;
  armor: number;
  money: number;
  level: number;
  job: string;
  lastSeen: Date;
}

export interface Vector3 {
  x: number;
  y: number;
  z: number;
}

export interface Vehicle {
  id: string;
  model: string;
  position: Vector3;
  owner: string;
  locked: boolean;
  health: number;
  fuel: number;
}

export interface ChatMessage {
  player: string;
  message: string;
  timestamp: Date;
  type: 'chat' | 'ooc' | 'me' | 'do' | 'admin';
}

export interface Job {
  name: string;
  salary: number;
  description: string;
  requirements: string[];
  benefits: string[];
}

export interface ServerStats {
  totalPlayers: number;
  totalVehicles: number;
  uptime: number;
  maxPlayers: number;
  serverVersion: string;
}

export interface PlayerSpawnData {
  name: string;
  position: Vector3;
  health: number;
  armor: number;
  money: number;
  level: number;
  job: string;
}

export interface PlayerMoveData {
  position: Vector3;
}

export interface VehicleSpawnData {
  id: string;
  model: string;
  position: Vector3;
}

export interface JobStartData {
  job: string;
  salary: number;
}

export interface ChatMessageData {
  message: string;
}

// RageMP specific types
export interface RageMPPlayer {
  id: number;
  name: string;
  socialClubId: number;
  ip: string;
  ping: number;
  health: number;
  armour: number;
  position: Vector3;
  vehicle?: RageMPVehicle;
}

export interface RageMPVehicle {
  id: number;
  model: number;
  position: Vector3;
  rotation: Vector3;
  health: number;
  fuel: number;
  locked: boolean;
  owner?: string;
}

// Server configuration types
export interface ServerConfig {
  port: number;
  ragempPort: number;
  maxPlayers: number;
  serverName: string;
  gamemode: string;
  environment: 'development' | 'production' | 'staging';
}

// Database types
export interface DatabaseConfig {
  host: string;
  port: number;
  database: string;
  username: string;
  password: string;
}

// Redis types
export interface RedisConfig {
  host: string;
  port: number;
  password?: string | undefined;
  database: number;
}
