#!/bin/bash

set -e

echo "🚀 DanceHub API - Setup Development Environment"
echo ""

# Colors
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Check if .env exists
if [ ! -f .env ]; then
    echo -e "${YELLOW}📝 Creating .env from .env.example...${NC}"
    cp .env.example .env
    echo -e "${GREEN}✅ .env created${NC}"
    echo ""
else
    echo -e "${GREEN}✅ .env already exists${NC}"
    echo ""
fi

# Check if Docker is running
if ! docker info > /dev/null 2>&1; then
    echo -e "${YELLOW}⚠️  Docker is not running. Please start Docker Desktop.${NC}"
    exit 1
fi

echo -e "${BLUE}🐳 Starting Docker services...${NC}"
cd ../.. && docker-compose up -d

echo ""
echo -e "${BLUE}⏳ Waiting for services to be ready...${NC}"
sleep 5

# Check Postgres
echo -e "${BLUE}🗄️  Checking PostgreSQL...${NC}"
until docker exec dancehub-postgres pg_isready -U dancehub > /dev/null 2>&1; do
    echo "  Waiting for PostgreSQL..."
    sleep 2
done
echo -e "${GREEN}✅ PostgreSQL is ready${NC}"

# Check Redis
echo -e "${BLUE}📦 Checking Redis...${NC}"
until docker exec dancehub-redis redis-cli ping > /dev/null 2>&1; do
    echo "  Waiting for Redis..."
    sleep 2
done
echo -e "${GREEN}✅ Redis is ready${NC}"

echo ""
echo -e "${BLUE}🗄️  Pushing database schema...${NC}"
pnpm db:push

echo ""
echo -e "${GREEN}🎉 Setup completed!${NC}"
echo ""
echo -e "${BLUE}Next steps:${NC}"
echo "  1. Edit .env with your configuration"
echo "  2. Run: pnpm dev"
echo "  3. API will be available at http://localhost:4000"
echo "  4. Swagger docs at http://localhost:4000/docs"
echo ""
