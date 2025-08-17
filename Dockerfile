FROM ubuntu:22.04

# Set environment variables
ENV DEBIAN_FRONTEND=noninteractive
ENV NODE_VERSION=18

# Install system dependencies
RUN apt-get update && apt-get install -y \
    wget \
    unzip \
    curl \
    software-properties-common \
    ca-certificates \
    gnupg \
    lsb-release \
    git \
    build-essential \
    && rm -rf /var/lib/apt/lists/*

# Install Node.js
RUN curl -fsSL https://deb.nodesource.com/setup_${NODE_VERSION}.x | bash - \
    && apt-get install -y nodejs

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy source code
COPY . .

# Create necessary directories
RUN mkdir -p logs dist

# Build TypeScript
RUN npm run build

# Create start script
RUN echo '#!/bin/bash\n\
echo "🎮 Starting GTA RP Server with RageMP..."\n\
echo "Node.js version: $(node --version)"\n\
echo "NPM version: $(npm --version)"\n\
echo "Starting web server on port ${PORT:-3000}"\n\
echo "RageMP server configured for port ${RAGEMP_PORT:-22005}"\n\
echo ""\n\
# Check if RageMP server binary exists\n\
if [ -f "ragemp-server" ]; then\n\
    echo "✅ RageMP server binary found!"\n\
    chmod +x ragemp-server\n\
    echo "🚀 Starting RageMP server..."\n\
    \n\
    # Start RageMP server in background\n\
    ./ragemp-server &\n\
    RAGEMP_PID=$!\n\
    echo "🎮 RageMP server started with PID: $RAGEMP_PID"\n\
    \n\
    # Wait a moment for RageMP to initialize\n\
    sleep 5\n\
    \n\
    # Check if RageMP is running\n\
    if kill -0 $RAGEMP_PID 2>/dev/null; then\n\
        echo "✅ RageMP server is running successfully"\n\
    else\n\
        echo "⚠️  RageMP server may have failed to start"\n\
    fi\n\
    \n\
    echo "🌐 Starting Node.js web server..."\n\
    npm start\n\
    \n\
    # If Node.js exits, stop RageMP\n\
    echo "🛑 Stopping RageMP server..."\n\
    kill $RAGEMP_PID 2>/dev/null\n\
    \n\
else\n\
    echo "⚠️  RageMP server binary not found."\n\
    echo "Starting Node.js web server only..."\n\
    echo "You can connect to the web admin panel at http://localhost:${PORT:-3000}"\n\
    echo ""\n\
    echo "To add RageMP server:"\n\
    echo "1. Download from https://rage.mp/"\n\
    echo "2. Place binary in this directory"\n\
    echo "3. Restart container"\n\
    echo ""\n\
    npm start\n\
fi' > /app/start.sh && chmod +x /app/start.sh

# Expose ports
EXPOSE 3000 22005

# Start command
CMD ["/app/start.sh"]
