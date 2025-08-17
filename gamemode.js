// GTA RP Server Gamemode for RageMP
// This file contains the client-side gamemode logic

// Global variables
let playerData = {
    name: '',
    money: 1000,
    level: 1,
    job: 'Unemployed',
    health: 100,
    armor: 0
};

let isLoggedIn = false;
let currentVehicle = null;

// Initialize the gamemode when player joins
mp.events.add('playerJoin', (player) => {
    console.log(`Player ${player.name} joined the server`);
    
    // Set default spawn location (Los Santos)
    player.spawn(new mp.Vector3(-1037.74, -2738.04, 20.17));
    
    // Set player properties
    player.setHealth(100);
    player.setArmour(0);
    
    // Initialize player data
    playerData.name = player.name;
    
    // Send player data to server
    mp.events.call('playerSpawn', {
        name: player.name,
        position: { x: -1037.74, y: -2738.04, z: 20.17 },
        health: 100,
        armor: 0,
        money: playerData.money,
        level: playerData.level,
        job: playerData.job
    });
});

// Handle player spawn
mp.events.add('playerSpawn', (player) => {
    console.log(`Player ${player.name} spawned`);
    
    // Set default spawn location
    player.spawn(new mp.Vector3(-1037.74, -2738.04, 20.17));
    
    // Set player properties
    player.setHealth(100);
    player.setArmour(0);
    
    // Notify server
    mp.events.call('playerSpawn', {
        name: player.name,
        position: { x: -1037.74, y: -2738.04, z: 20.17 },
        health: 100,
        armor: 0,
        money: playerData.money,
        level: playerData.level,
        job: playerData.job
    });
});

// Handle player death
mp.events.add('playerDeath', (player, reason, killer) => {
    console.log(`Player ${player.name} died. Reason: ${reason}`);
    
    if (killer) {
        console.log(`Killed by: ${killer.name}`);
    }
    
    // Respawn after 5 seconds
    setTimeout(() => {
        player.spawn(new mp.Vector3(-1037.74, -2738.04, 20.17));
        player.setHealth(100);
        player.setArmour(0);
    }, 5000);
});

// Handle player disconnect
mp.events.add('playerQuit', (player, exitType, reason) => {
    console.log(`Player ${player.name} left the server. Reason: ${reason}`);
});

// Handle chat messages
mp.events.add('playerChat', (player, message) => {
    console.log(`[CHAT] ${player.name}: ${message}`);
    
    // Send chat message to server
    mp.events.call('chatMessage', { message: message });
    
    // Handle commands
    if (message.startsWith('/')) {
        handleCommand(player, message);
    }
});

// Command handler
function handleCommand(player, command) {
    const args = command.split(' ');
    const cmd = args[0].toLowerCase();
    
    switch (cmd) {
        case '/help':
            player.outputChatBox('Available commands: /help, /job, /money, /spawn, /tp');
            break;
            
        case '/job':
            if (args.length > 1) {
                const jobName = args.slice(1).join(' ');
                startJob(player, jobName);
            } else {
                player.outputChatBox(`Current job: ${playerData.job}`);
            }
            break;
            
        case '/money':
            player.outputChatBox(`Money: $${playerData.money}`);
            break;
            
        case '/spawn':
            player.spawn(new mp.Vector3(-1037.74, -2738.04, 20.17));
            player.outputChatBox('Teleported to spawn!');
            break;
            
        case '/tp':
            if (args.length >= 4) {
                const x = parseFloat(args[1]);
                const y = parseFloat(args[2]);
                const z = parseFloat(args[3]);
                player.position = new mp.Vector3(x, y, z);
                player.outputChatBox(`Teleported to ${x}, ${y}, ${z}`);
            } else {
                player.outputChatBox('Usage: /tp <x> <y> <z>');
            }
            break;
            
        default:
            player.outputChatBox(`Unknown command: ${cmd}. Type /help for available commands.`);
    }
}

// Job system
function startJob(player, jobName) {
    const jobs = {
        'taxi': { salary: 150, description: 'Taxi Driver' },
        'police': { salary: 200, description: 'Police Officer' },
        'mechanic': { salary: 175, description: 'Mechanic' },
        'delivery': { salary: 125, description: 'Delivery Driver' }
    };
    
    if (jobs[jobName]) {
        playerData.job = jobName;
        playerData.money += jobs[jobName].salary;
        
        player.outputChatBox(`You are now working as a ${jobs[jobName].description}!`);
        player.outputChatBox(`Salary: $${jobs[jobName].salary}`);
        
        // Notify server
        mp.events.call('startJob', {
            job: jobName,
            salary: jobs[jobName].salary
        });
    } else {
        player.outputChatBox(`Unknown job: ${jobName}`);
        player.outputChatBox('Available jobs: taxi, police, mechanic, delivery');
    }
}

// Vehicle system
mp.events.add('playerEnterVehicle', (player, vehicle, seat) => {
    console.log(`Player ${player.name} entered vehicle ${vehicle.id}`);
    currentVehicle = vehicle;
    
    // Notify server
    mp.events.call('vehicleSpawn', {
        id: vehicle.id,
        model: vehicle.model,
        position: {
            x: vehicle.position.x,
            y: vehicle.position.y,
            z: vehicle.position.z
        }
    });
});

mp.events.add('playerExitVehicle', (player, vehicle) => {
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
        isLoggedIn = true;
    }
});

console.log('GTA RP Gamemode loaded successfully!');
