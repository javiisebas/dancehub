#!/bin/bash

set -e

cat << "EOF"
╔══════════════════════════════════════════════════════════════════════╗
║                                                                      ║
║   ██████╗  █████╗ ███╗   ██╗ ██████╗███████╗██╗  ██╗██╗   ██╗██████╗ ║
║   ██╔══██╗██╔══██╗████╗  ██║██╔════╝██╔════╝██║  ██║██║   ██║██╔══██╗║
║   ██║  ██║███████║██╔██╗ ██║██║     █████╗  ███████║██║   ██║██████╔╝║
║   ██║  ██║██╔══██║██║╚██╗██║██║     ██╔══╝  ██╔══██║██║   ██║██╔══██╗║
║   ██████╔╝██║  ██║██║ ╚████║╚██████╗███████╗██║  ██║╚██████╔╝██████╔╝║
║   ╚═════╝ ╚═╝  ╚═╝╚═╝  ╚═══╝ ╚═════╝╚══════╝╚═╝  ╚═╝ ╚═════╝ ╚═════╝ ║
║                                                                      ║
║                    🚀 Quick Start Setup Script                      ║
║                                                                      ║
╚══════════════════════════════════════════════════════════════════════╝
EOF

echo ""
echo "This script will set up your DanceHub development environment."
echo ""
echo "Prerequisites:"
echo "  ✅ Docker Desktop installed and running"
echo "  ✅ Node.js 18+ installed"
echo "  ✅ pnpm installed (npm install -g pnpm)"
echo ""
read -p "Press Enter to continue or Ctrl+C to cancel..."

# Colors
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo ""
echo -e "${BLUE}📦 Step 1/5: Installing dependencies...${NC}"
pnpm install

echo ""
echo -e "${BLUE}🐳 Step 2/5: Starting Docker services...${NC}"
docker-compose up -d

echo ""
echo -e "${BLUE}⏳ Step 3/5: Waiting for services to be ready...${NC}"
sleep 5

# Check if services are healthy
echo "  Checking PostgreSQL..."
until docker exec dancehub-postgres pg_isready -U dancehub > /dev/null 2>&1; do
    echo "    Waiting..."
    sleep 2
done
echo "  ✅ PostgreSQL ready"

echo "  Checking Redis..."
until docker exec dancehub-redis redis-cli ping > /dev/null 2>&1; do
    echo "    Waiting..."
    sleep 2
done
echo "  ✅ Redis ready"

echo ""
echo -e "${BLUE}📝 Step 4/5: Setting up environment files...${NC}"
if [ ! -f apps/api/.env ]; then
    cp apps/api/.env.example apps/api/.env
    echo "  ✅ Created apps/api/.env"
else
    echo "  ⚠️  apps/api/.env already exists (skipping)"
fi

if [ ! -f apps/web/.env.local ]; then
    echo "NEXT_PUBLIC_API_URL=http://localhost:4000" > apps/web/.env.local
    echo "  ✅ Created apps/web/.env.local"
else
    echo "  ⚠️  apps/web/.env.local already exists (skipping)"
fi

echo ""
echo -e "${BLUE}🗄️  Step 5/5: Setting up database...${NC}"
cd apps/api && pnpm db:push
cd ../..

echo ""
echo -e "${GREEN}╔════════════════════════════════════════════════════════════════╗${NC}"
echo -e "${GREEN}║                                                                ║${NC}"
echo -e "${GREEN}║                  ✅ Setup Complete!                            ║${NC}"
echo -e "${GREEN}║                                                                ║${NC}"
echo -e "${GREEN}╚════════════════════════════════════════════════════════════════╝${NC}"
echo ""
echo -e "${BLUE}🎯 Next Steps:${NC}"
echo ""
echo "  1. Start development:"
echo -e "     ${YELLOW}pnpm dev${NC}"
echo ""
echo "  2. Or start services individually:"
echo -e "     ${YELLOW}cd apps/api && pnpm dev${NC}  (API)"
echo -e "     ${YELLOW}cd apps/web && pnpm dev${NC}  (Web)"
echo ""
echo -e "${BLUE}📚 Useful Commands:${NC}"
echo ""
echo -e "  ${YELLOW}make help${NC}           - Show all available commands"
echo -e "  ${YELLOW}make health${NC}         - Check service health"
echo -e "  ${YELLOW}make db-studio${NC}      - Open database UI"
echo -e "  ${YELLOW}pnpm test${NC}           - Run tests"
echo ""
echo -e "${BLUE}🌐 Services:${NC}"
echo ""
echo "  • API:       http://localhost:4000"
echo "  • Swagger:   http://localhost:4000/docs"
echo "  • Web:       http://localhost:3000"
echo "  • MailHog:   http://localhost:8025  (docker-compose --profile mail up -d)"
echo "  • MinIO:     http://localhost:9001  (docker-compose --profile storage up -d)"
echo ""
echo -e "${GREEN}Happy coding! 🚀${NC}"
echo ""
