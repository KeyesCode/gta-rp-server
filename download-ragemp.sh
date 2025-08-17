#!/bin/bash

# RageMP Server Download Helper Script
# This script downloads the RageMP server using the official wiki instructions

echo "🌐 Downloading RageMP Server from official source..."
echo "📖 Based on: https://wiki.rage.mp/wiki/Getting_Started_with_Server"
echo ""

# Check if wget is available
if ! command -v wget &> /dev/null; then
    echo "❌ wget is not installed. Please install it first:"
    echo "   sudo apt-get install wget"
    exit 1
fi

# Create a temporary directory for downloads
mkdir -p temp_downloads
cd temp_downloads

echo "📥 Downloading RageMP server from official CDN..."

# Official download URL from RageMP wiki
DOWNLOAD_URL="https://cdn.rage.mp/updater/prerelease/server-files/linux_x64.tar.gz"
FILENAME="linux_x64.tar.gz"

echo "🔗 Download URL: $DOWNLOAD_URL"
echo "📁 Filename: $FILENAME"
echo ""

# Check if URL is accessible
if wget --spider "$DOWNLOAD_URL" 2>/dev/null; then
    echo "✅ URL accessible, downloading..."
    
    # Download the file
    if wget -O "$FILENAME" "$DOWNLOAD_URL"; then
        echo "✅ Download successful!"
        echo "📊 File size: $(du -h "$FILENAME" | cut -f1)"
    else
        echo "❌ Download failed"
        cd ..
        rm -rf temp_downloads
        exit 1
    fi
else
    echo "❌ URL not accessible: $DOWNLOAD_URL"
    echo ""
    echo "🔧 This might indicate:"
    echo "   - The download link has changed"
    echo "   - Server is temporarily unavailable"
    echo "   - You need to check the latest wiki for updates"
    echo ""
    echo "💡 Please check: https://wiki.rage.mp/wiki/Getting_Started_with_Server"
    cd ..
    rm -rf temp_downloads
    exit 1
fi

echo ""
echo "📦 Extracting server files..."

# Extract the downloaded file
if [[ -f "$FILENAME" ]]; then
    if tar -xzf "$FILENAME"; then
        echo "✅ Extraction successful!"
        
        # Check what was extracted
        echo "📁 Extracted contents:"
        ls -la
        
        # Look for the ragemp-srv directory
        if [ -d "ragemp-srv" ]; then
            echo "✅ Found ragemp-srv directory!"
            
            # Check contents of ragemp-srv
            echo "📁 Contents of ragemp-srv:"
            ls -la ragemp-srv/
            
            # Look for the ragemp-server binary
            if [ -f "ragemp-srv/ragemp-server" ]; then
                echo "✅ Found ragemp-server binary!"
                
                # Move the binary to the main directory
                mv ragemp-srv/ragemp-server ../
                cd ..
                
                # Make it executable
                chmod +x ragemp-server
                echo "✅ RageMP server binary moved to project directory and made executable!"
                
                # Clean up
                rm -rf temp_downloads
                
                echo ""
                echo "🎉 RageMP server download complete!"
                echo "📋 File information:"
                ls -la ragemp-server
                echo ""
                echo "💡 You can now run: ./setup-ragemp.sh"
                
            else
                echo "❌ Could not locate the ragemp-server binary in ragemp-srv/"
                echo "📁 Contents of ragemp-srv:"
                ls -la ragemp-srv/
                cd ..
                rm -rf temp_downloads
                exit 1
            fi
            
        else
            echo "❌ ragemp-srv directory not found after extraction"
            echo "📁 Extracted contents:"
            ls -la
            cd ..
            rm -rf temp_downloads
            exit 1
        fi
        
    else
        echo "❌ Extraction failed"
        cd ..
        rm -rf temp_downloads
        exit 1
    fi
else
    echo "❌ Downloaded file not found"
    cd ..
    rm -rf temp_downloads
    exit 1
fi
