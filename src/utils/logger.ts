import winston from 'winston';
import { serverConfig } from '../config/server';

// Custom log format
const logFormat = winston.format.combine(
  winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
  winston.format.errors({ stack: true }),
  winston.format.json()
);

// Console format for development
const consoleFormat = winston.format.combine(
  winston.format.colorize(),
  winston.format.timestamp({ format: 'HH:mm:ss' }),
  winston.format.printf(({ timestamp, level, message, ...meta }) => {
    return `${timestamp} [${level}]: ${message} ${Object.keys(meta).length ? JSON.stringify(meta, null, 2) : ''}`;
  })
);

// Create logger instance
export const logger = winston.createLogger({
  level: serverConfig.environment === 'production' ? 'info' : 'debug',
  format: logFormat,
  defaultMeta: { service: 'gta-rp-server' },
  transports: [
    // Write all logs with level 'error' and below to error.log
    new winston.transports.File({ 
      filename: 'logs/error.log', 
      level: 'error',
      maxsize: 5242880, // 5MB
      maxFiles: 5
    }),
    // Write all logs with level 'info' and below to combined.log
    new winston.transports.File({ 
      filename: 'logs/combined.log',
      maxsize: 5242880, // 5MB
      maxFiles: 5
    })
  ]
});

// Add console transport for development
if (serverConfig.environment !== 'production') {
  logger.add(new winston.transports.Console({
    format: consoleFormat
  }));
}

// Logging utility functions
export const logPlayerAction = (playerId: string, action: string, details?: any): void => {
  logger.info(`Player Action: ${action}`, { playerId, action, details });
};

export const logServerEvent = (event: string, details?: any): void => {
  logger.info(`Server Event: ${event}`, { event, details });
};

export const logError = (error: Error, context?: string): void => {
  logger.error(`Error: ${error.message}`, { 
    error: error.stack, 
    context,
    timestamp: new Date().toISOString()
  });
};

export const logRageMPEvent = (event: string, playerId?: string, details?: any): void => {
  logger.info(`RageMP Event: ${event}`, { event, playerId, details });
};

export const logChatMessage = (playerId: string, message: string, type: string): void => {
  logger.debug(`Chat Message`, { playerId, message, type, timestamp: new Date().toISOString() });
};

export const logVehicleEvent = (event: string, vehicleId: string, details?: any): void => {
  logger.info(`Vehicle Event: ${event}`, { event, vehicleId, details });
};
