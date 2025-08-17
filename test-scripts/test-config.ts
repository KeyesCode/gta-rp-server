/**
 * Test Configuration for GTA RP Server
 * Customize these settings to modify test behavior
 */

export const TEST_CONFIG = {
  // Server settings
  SERVER_URL: 'http://localhost:3000',
  
  // Timing settings
  SIMULATION_DELAY: 2000,        // Delay between events (ms)
  STATUS_UPDATE_INTERVAL: 10000, // Status update frequency (ms)
  
  // Test data
  PLAYER_COUNT: 5,
  VEHICLE_COUNT: 3,
  CHAT_MESSAGE_COUNT: 7,
  
  // Player spawn positions (Los Santos area)
  SPAWN_POSITIONS: [
    { x: -1037.74, y: -2738.04, z: 20.17 }, // Default spawn
    { x: -1040.12, y: -2735.89, z: 20.17 }, // Nearby
    { x: -1035.45, y: -2740.23, z: 20.17 }, // Nearby
    { x: -1042.67, y: -2732.56, z: 20.17 }, // Nearby
    { x: -1033.89, y: -2742.78, z: 20.17 }  // Nearby
  ],
  
  // Movement test positions
  MOVEMENT_POSITIONS: [
    { x: -1045.00, y: -2730.00, z: 20.17 },
    { x: -1030.00, y: -2745.00, z: 20.17 },
    { x: -1048.00, y: -2728.00, z: 20.17 },
    { x: -1028.00, y: -2747.00, z: 20.17 }
  ],
  
  // Available jobs for testing
  AVAILABLE_JOBS: [
    { name: 'taxi', salary: 150, description: 'Taxi Driver' },
    { name: 'police', salary: 200, description: 'Police Officer' },
    { name: 'mechanic', salary: 175, description: 'Mechanic' },
    { name: 'delivery', salary: 125, description: 'Delivery Driver' }
  ],
  
  // Vehicle models for testing
  VEHICLE_MODELS: [
    'Adder',
    'Police Cruiser', 
    'Tow Truck',
    'Taxi',
    'Delivery Van'
  ],
  
  // Test player names
  PLAYER_NAMES: [
    'John_Doe',
    'Jane_Smith', 
    'Bob_Johnson',
    'Alice_Brown',
    'Charlie_Wilson'
  ],
  
  // Debug settings
  DEBUG: {
    LOG_CONNECTIONS: true,
    LOG_EVENTS: true,
    LOG_RESPONSES: true,
    SHOW_TIMESTAMPS: true
  }
};

// Export individual config sections for easy access
export const { SERVER_URL, SIMULATION_DELAY, PLAYER_COUNT, VEHICLE_COUNT } = TEST_CONFIG;
export const { SPAWN_POSITIONS, MOVEMENT_POSITIONS, AVAILABLE_JOBS, VEHICLE_MODELS } = TEST_CONFIG;
export const { PLAYER_NAMES, DEBUG } = TEST_CONFIG;
