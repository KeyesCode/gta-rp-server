# Test Scripts for GTA RP Server

This directory contains test scripts to verify the functionality of your GTA RP server and test the admin dashboard.

## 🧪 Available Tests

### 1. **Quick Test** (`quick-test.ts`)
- **Purpose**: Basic functionality verification
- **Duration**: ~5 seconds
- **Tests**: Health check, API endpoints, Socket.IO connection, basic events
- **Use Case**: Quick verification that server is working

### 2. **Full Game Simulation** (`test-game-simulation.ts`)
- **Purpose**: Comprehensive game event simulation
- **Duration**: ~2 minutes
- **Tests**: Player spawns, vehicle spawns, chat messages, movements, job changes
- **Use Case**: Testing admin dashboard with realistic game data

### 3. **Test Runner** (`run-tests.sh`)
- **Purpose**: Orchestrates all tests
- **Duration**: Variable (user choice)
- **Tests**: Runs quick test, then optionally full simulation
- **Use Case**: Complete testing workflow

## 🚀 How to Use

### **Prerequisites**
1. Server must be running (`npm run dev`)
2. Dependencies installed (`npm install`)

### **Quick Test**
```bash
npm run test:quick
```

### **Full Simulation**
```bash
npm run test:simulation
```

### **All Tests (Interactive)**
```bash
npm run test:all
```

### **Manual Execution**
```bash
# Quick test
npx ts-node test-scripts/quick-test.ts

# Full simulation
npx ts-node test-scripts/test-game-simulation.ts

# Test runner
./test-scripts/run-tests.sh
```

## 📊 What Gets Tested

### **API Endpoints**
- `/health` - Server health check
- `/api/players` - Player list
- `/api/vehicles` - Vehicle list
- `/api/stats` - Server statistics

### **Socket.IO Events**
- `playerSpawn` - Player joining the server
- `playerMove` - Player movement
- `chatMessage` - Chat messages
- `vehicleSpawn` - Vehicle spawning
- `startJob` - Job changes

### **Real-time Updates**
- Player list updates
- Vehicle list updates
- Chat message broadcasting
- Position tracking

## 🎮 Simulation Data

### **Test Players**
- **John_Doe** - Taxi Driver (Level 3, $1500)
- **Jane_Smith** - Police Officer (Level 5, $2200)
- **Bob_Johnson** - Unemployed (Level 1, $800)
- **Alice_Brown** - Mechanic (Level 7, $3500)
- **Charlie_Wilson** - Delivery Driver (Level 2, $1200)

### **Test Vehicles**
- **Adder** - Sports car owned by John_Doe
- **Police Cruiser** - Police vehicle owned by Jane_Smith
- **Tow Truck** - Service vehicle owned by Alice_Brown

### **Chat Messages**
- Realistic conversation between players
- Job-related discussions
- Service requests

## 🔍 Monitoring the Tests

### **Console Output**
- Real-time test progress
- Event confirmations
- Error reporting
- Status updates

### **Admin Dashboard**
- Open http://localhost:3000 in your browser
- Watch real-time updates
- See player and vehicle lists
- Monitor chat messages
- View server statistics

## 🛠️ Customization

### **Modify Test Data**
Edit the test scripts to:
- Change player names and attributes
- Modify vehicle types and positions
- Customize chat messages
- Adjust timing between events

### **Add New Tests**
Create new test scripts for:
- Specific game mechanics
- Performance testing
- Load testing
- Edge case scenarios

## 🐛 Troubleshooting

### **Common Issues**

#### **Server Not Running**
```bash
Error: Server is not running on port 3000
```
**Solution**: Start the server with `npm run dev`

#### **Connection Errors**
```bash
❌ Socket.IO connection failed
```
**Solution**: Check if server is accessible and firewall settings

#### **TypeScript Errors**
```bash
Error: Cannot find module
```
**Solution**: Run `npm install` to install dependencies

### **Debug Mode**
Add more logging by modifying the test scripts:
```typescript
// Enable debug logging
socket.on('connect', () => {
  console.log('🔍 Debug: Socket connected with ID:', socket.id);
});
```

## 📈 Performance Testing

### **Load Testing**
The simulation can be modified for load testing:
- Increase number of players
- Reduce delays between events
- Add concurrent connections
- Monitor server performance

### **Metrics to Watch**
- Response times
- Memory usage
- CPU utilization
- Network throughput

## 🎯 Best Practices

1. **Run tests after server changes** to verify functionality
2. **Use quick test** for development feedback
3. **Run full simulation** before deployment
4. **Monitor admin dashboard** during tests
5. **Check console output** for errors
6. **Customize test data** for your specific needs

## 🔄 Continuous Testing

### **Development Workflow**
1. Make code changes
2. Run quick test: `npm run test:quick`
3. Verify functionality
4. Run full simulation if needed: `npm run test:simulation`

### **Automation**
Consider integrating tests into your CI/CD pipeline:
- Run tests on every commit
- Automated deployment verification
- Performance regression testing

---

**🎮 Happy Testing! Your GTA RP server is ready for action!**
