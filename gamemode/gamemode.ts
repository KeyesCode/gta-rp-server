// GTA RP Server Gamemode for RageMP
// TypeScript version with proper type definitions

// Define Position interface locally since RageMP types may not be available
interface Position {
  x: number;
  y: number;
  z: number;
}

// Player data interface
interface PlayerData {
  name: string;
  money: number;
  level: number;
  job: string;
  health: number;
  armor: number;
  experience: number;
  lastLogin: Date;
}

// Job interface
interface Job {
  name: string;
  salary: number;
  description: string;
  requirements: string[];
  benefits: string[];
}

// Vehicle interface
interface VehicleData {
  id: number;
  model: string;
  position: Position;
  owner: string;
  locked: boolean;
  fuel: number;
  health: number;
}

// Global variables
let playerData: PlayerData = {
  name: '',
  money: 1000,
  level: 1,
  job: 'Unemployed',
  health: 100,
  armor: 0,
  experience: 0,
  lastLogin: new Date()
};

let isLoggedIn: boolean = false;
let currentVehicle: VehicleData | null = null;

// Job definitions
const jobs: Record<string, Job> = {
  taxi: { 
    name: 'Taxi Driver', 
    salary: 150, 
    description: 'Transport passengers around the city',
    requirements: ['Valid driver license', 'Clean record'],
    benefits: ['Flexible hours', 'Tips', 'City knowledge']
  },
  police: { 
    name: 'Police Officer', 
    salary: 200, 
    description: 'Maintain law and order',
    requirements: ['Police academy training', 'Background check'],
    benefits: ['Health insurance', 'Pension', 'Authority']
  },
  mechanic: { 
    name: 'Mechanic', 
    salary: 175, 
    description: 'Repair and maintain vehicles',
    requirements: ['Mechanical certification', 'Tools'],
    benefits: ['Vehicle discounts', 'Skill development', 'Job satisfaction']
  },
  delivery: { 
    name: 'Delivery Driver', 
    salary: 125, 
    description: 'Deliver packages and goods',
    requirements: ['Valid driver license', 'Reliable vehicle'],
    benefits: ['Flexible schedule', 'Exercise', 'City exploration']
  }
};

// Initialize the gamemode when player joins
mp.events.add('playerJoin', (player: any) => {
  console.log(`Player ${player.name} joined the server`);
  
  // Set default spawn location (Los Santos)
  const spawnLocation: Position = { x: -1037.74, y: -2738.04, z: 20.17 };
  player.spawn(spawnLocation);
  
  // Set player properties
  player.setHealth(100);
  player.setArmour(0);
  
  // Initialize player data
  playerData.name = player.name;
  playerData.lastLogin = new Date();
  
  // Send player data to server
  mp.events.call('playerSpawn', {
    name: player.name,
    position: { x: spawnLocation.x, y: spawnLocation.y, z: spawnLocation.z },
    health: 100,
    armor: 0,
    money: playerData.money,
    level: playerData.level,
    job: playerData.job
  });
});

// Handle player spawn
mp.events.add('playerSpawn', (player: any) => {
  console.log(`Player ${player.name} spawned`);
  
  // Set default spawn location
  const spawnLocation: Position = { x: -1037.74, y: -2738.04, z: 20.17 };
  player.spawn(spawnLocation);
  
  // Set player properties
  player.setHealth(100);
  player.setArmour(0);
  
  // Notify server
  mp.events.call('playerSpawn', {
    name: player.name,
    position: { x: spawnLocation.x, y: spawnLocation.y, z: spawnLocation.z },
    health: 100,
    armor: 0,
    money: playerData.money,
    level: playerData.level,
    job: playerData.job
  });
});

// Handle player death
mp.events.add('playerDeath', (player: any, reason: string, killer?: any) => {
  console.log(`Player ${player.name} died. Reason: ${reason}`);
  
  if (killer) {
    console.log(`Killed by: ${killer.name}`);
  }
  
  // Respawn after 5 seconds
  setTimeout(() => {
    const spawnLocation: Position = { x: -1037.74, y: -2738.04, z: 20.17 };
    player.spawn(spawnLocation);
    player.setHealth(100);
    player.setArmour(0);
  }, 5000);
});

// Handle player disconnect
mp.events.add('playerQuit', (player: any, exitType: string, reason: string) => {
  console.log(`Player ${player.name} left the server. Reason: ${reason}`);
});

// Handle chat messages
mp.events.add('playerChat', (player: any, message: string) => {
  console.log(`[CHAT] ${player.name}: ${message}`);
  
  // Send chat message to server
  mp.events.call('chatMessage', { message: message });
  
  // Handle commands
  if (message.startsWith('/')) {
    handleCommand(player, message);
  }
});

// Command handler
function handleCommand(player: any, command: string): void {
  const args: string[] = command.split(' ');
  const cmd: string = args[0].toLowerCase();
  
  switch (cmd) {
    case '/help':
      player.outputChatBox('Available commands: /help, /job, /money, /spawn, /tp, /stats');
      break;
      
    case '/job':
      if (args.length > 1) {
        const jobName: string = args.slice(1).join(' ');
        startJob(player, jobName);
      } else {
        player.outputChatBox(`Current job: ${playerData.job}`);
        player.outputChatBox(`Available jobs: ${Object.keys(jobs).join(', ')}`);
      }
      break;
      
    case '/money':
      player.outputChatBox(`Money: $${playerData.money}`);
      break;
      
    case '/spawn':
      const spawnLocation: Position = { x: -1037.74, y: -2738.04, z: 20.17 };
      player.spawn(spawnLocation);
      player.outputChatBox('Teleported to spawn!');
      break;
      
    case '/tp':
      if (args.length >= 4) {
        const x: number = parseFloat(args[1]);
        const y: number = parseFloat(args[2]);
        const z: number = parseFloat(args[3]);
        const teleportLocation: Position = { x, y, z };
        player.position = teleportLocation;
        player.outputChatBox(`Teleported to ${x}, ${y}, ${z}`);
      } else {
        player.outputChatBox('Usage: /tp <x> <y> <z>');
      }
      break;
      
    case '/stats':
      player.outputChatBox(`=== Player Stats ===`);
      player.outputChatBox(`Name: ${playerData.name}`);
      player.outputChatBox(`Level: ${playerData.level}`);
      player.outputChatBox(`Job: ${playerData.job}`);
      player.outputChatBox(`Money: $${playerData.money}`);
      player.outputChatBox(`Experience: ${playerData.experience}`);
      break;
      
    default:
      player.outputChatBox(`Unknown command: ${cmd}. Type /help for available commands.`);
  }
}

// Job system
function startJob(player: any, jobName: string): void {
  const job: Job | undefined = jobs[jobName];
  
  if (job) {
    playerData.job = jobName;
    playerData.money += job.salary;
    playerData.experience += 10;
    
    player.outputChatBox(`You are now working as a ${job.description}!`);
    player.outputChatBox(`Salary: $${job.salary}`);
    player.outputChatBox(`Requirements: ${job.requirements.join(', ')}`);
    player.outputChatBox(`Benefits: ${job.benefits.join(', ')}`);
    
    // Check for level up
    if (playerData.experience >= playerData.level * 100) {
      playerData.level++;
      playerData.experience = 0;
      player.outputChatBox(`🎉 Level up! You are now level ${playerData.level}!`);
    }
    
    // Notify server
    mp.events.call('startJob', {
      job: jobName,
      salary: job.salary
    });
  } else {
    player.outputChatBox(`Unknown job: ${jobName}`);
    player.outputChatBox(`Available jobs: ${Object.keys(jobs).join(', ')}`);
  }
}

// Vehicle system
mp.events.add('playerEnterVehicle', (player: any, vehicle: any, seat: number) => {
  console.log(`Player ${player.name} entered vehicle ${vehicle.id}`);
  
  currentVehicle = {
    id: vehicle.id,
    model: vehicle.model.toString(),
    position: vehicle.position,
    owner: player.name,
    locked: false,
    fuel: 100,
    health: vehicle.health
  };
  
  // Notify server
  mp.events.call('vehicleSpawn', {
    id: vehicle.id.toString(),
    model: vehicle.model.toString(),
    position: {
      x: vehicle.position.x,
      y: vehicle.position.y,
      z: vehicle.position.z
    }
  });
});

mp.events.add('playerExitVehicle', (player: any, vehicle: any) => {
  console.log(`Player ${player.name} exited vehicle ${vehicle.id}`);
  currentVehicle = null;
});

// Key bindings
mp.keys.bind(0x48, false, () => { // H key
  if (mp.players.local) {
    const player = mp.players.local;
    player.setHealth(100);
    player.setArmour(100);
    player.outputChatBox('Health and armor restored!');
  }
});

mp.keys.bind(0x4A, false, () => { // J key
  if (mp.players.local) {
    const player = mp.players.local;
    playerData.money += 100;
    player.outputChatBox(`Money added! New balance: $${playerData.money}`);
  }
});

// Update player position every second
setInterval(() => {
  if (mp.players.local && isLoggedIn) {
    const player = mp.players.local;
    const pos = player.position;
    
    // Update player data
    playerData.health = player.health;
    playerData.armor = player.armour;
    
    // Send position update to server
    mp.events.call('playerMove', {
      position: {
        x: pos.x,
        y: pos.y,
        z: pos.z
      }
    });
  }
}, 1000);

// Welcome message
mp.events.add('render', () => {
  if (!isLoggedIn) {
    mp.gui.chat.show(true);
    mp.gui.chat.push('Welcome to the GTA RP Server!');
    mp.gui.chat.push('Type /help for available commands.');
    mp.gui.chat.push('Press H to restore health, J to add money.');
    mp.gui.chat.push('Use /stats to view your player information.');
    isLoggedIn = true;
  }
});

console.log('GTA RP TypeScript Gamemode loaded successfully!');
