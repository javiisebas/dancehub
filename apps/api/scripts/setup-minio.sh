#!/bin/bash

set -e

echo "🗄️  Setting up MinIO for local development..."

# Check if MinIO container is running
if ! docker ps | grep -q dancehub-minio; then
    echo "⚠️  MinIO container is not running"
    echo "Starting MinIO with: docker-compose --profile storage up -d"
    cd ../.. && docker-compose --profile storage up -d
    cd apps/api
    echo "⏳ Waiting for MinIO to be ready..."
    sleep 5
fi

# Install MinIO client if not present
if ! command -v mc &> /dev/null; then
    echo "📦 Installing MinIO client..."
    if [[ "$OSTYPE" == "darwin"* ]]; then
        brew install minio/stable/mc
    elif [[ "$OSTYPE" == "linux-gnu"* ]]; then
        wget https://dl.min.io/client/mc/release/linux-amd64/mc
        chmod +x mc
        sudo mv mc /usr/local/bin/
    else
        echo "Please install MinIO client manually: https://min.io/docs/minio/linux/reference/minio-mc.html"
        exit 1
    fi
fi

# Configure MinIO client
echo "🔧 Configuring MinIO client..."
mc alias set local http://localhost:9000 minioadmin minioadmin123

# Create bucket if it doesn't exist
echo "📦 Creating bucket 'dancehub'..."
mc mb local/dancehub --ignore-existing

# Set public read policy for public files
echo "🔓 Setting public read policy..."
mc anonymous set download local/dancehub/public

echo ""
echo "✅ MinIO setup complete!"
echo ""
echo "🎉 Access MinIO Console at: http://localhost:9001"
echo "   Username: minioadmin"
echo "   Password: minioadmin123"
echo ""
