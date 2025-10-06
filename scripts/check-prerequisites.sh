#!/bin/bash

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo ""
echo -e "${BLUE}🔍 Checking Prerequisites...${NC}"
echo ""

all_good=true

# Check Node.js
if command -v node &> /dev/null; then
    node_version=$(node -v)
    echo -e "${GREEN}✅ Node.js:${NC} $node_version"

    # Extract major version
    major_version=$(echo $node_version | sed 's/v\([0-9]*\).*/\1/')
    if [ "$major_version" -lt 20 ]; then
        echo -e "${RED}   ⚠️  Warning: Node.js 20+ is recommended${NC}"
        all_good=false
    fi
else
    echo -e "${RED}❌ Node.js: Not installed${NC}"
    echo -e "   Install from: https://nodejs.org/"
    all_good=false
fi

# Check pnpm
if command -v pnpm &> /dev/null; then
    pnpm_version=$(pnpm -v)
    echo -e "${GREEN}✅ pnpm:${NC} v$pnpm_version"
else
    echo -e "${RED}❌ pnpm: Not installed${NC}"
    echo -e "   Install: ${YELLOW}npm install -g pnpm${NC}"
    all_good=false
fi

# Check Docker
if command -v docker &> /dev/null; then
    docker_version=$(docker -v | awk '{print $3}' | sed 's/,//')
    echo -e "${GREEN}✅ Docker:${NC} $docker_version"

    # Check if Docker is running
    if docker info &> /dev/null; then
        echo -e "${GREEN}   ✅ Docker is running${NC}"
    else
        echo -e "${RED}   ❌ Docker is not running${NC}"
        echo -e "   Please start Docker Desktop"
        all_good=false
    fi
else
    echo -e "${RED}❌ Docker: Not installed${NC}"
    echo -e "   Install from: https://www.docker.com/products/docker-desktop"
    all_good=false
fi

# Check docker-compose
if command -v docker-compose &> /dev/null; then
    compose_version=$(docker-compose -v | awk '{print $3}' | sed 's/,//')
    echo -e "${GREEN}✅ docker-compose:${NC} $compose_version"
else
    echo -e "${YELLOW}⚠️  docker-compose: Not found (trying docker compose)${NC}"
    if docker compose version &> /dev/null; then
        compose_version=$(docker compose version | awk '{print $3}')
        echo -e "${GREEN}   ✅ docker compose:${NC} $compose_version"
    else
        echo -e "${RED}   ❌ Neither docker-compose nor docker compose found${NC}"
        all_good=false
    fi
fi

# Check Git
if command -v git &> /dev/null; then
    git_version=$(git --version | awk '{print $3}')
    echo -e "${GREEN}✅ Git:${NC} $git_version"
else
    echo -e "${RED}❌ Git: Not installed${NC}"
    all_good=false
fi

# Check if .env exists
if [ -f "apps/api/.env" ]; then
    echo -e "${GREEN}✅ .env file:${NC} exists"
else
    echo -e "${YELLOW}⚠️  .env file:${NC} not found"
    echo -e "   Run: ${YELLOW}cp apps/api/.env.example apps/api/.env${NC}"
    all_good=false
fi

# Check available ports
check_port() {
    local port=$1
    local service=$2

    if lsof -Pi :$port -sTCP:LISTEN -t >/dev/null 2>&1 ; then
        echo -e "${YELLOW}⚠️  Port $port ($service):${NC} already in use"
        return 1
    else
        echo -e "${GREEN}✅ Port $port ($service):${NC} available"
        return 0
    fi
}

echo ""
echo -e "${BLUE}🔌 Checking Ports...${NC}"
check_port 4000 "API"
check_port 5432 "PostgreSQL"
check_port 6380 "Redis"

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

if [ "$all_good" = true ]; then
    echo ""
    echo -e "${GREEN}✅ All prerequisites met! You're ready to go!${NC}"
    echo ""
    echo -e "${BLUE}Next steps:${NC}"
    echo -e "  1. ${YELLOW}./scripts/quickstart.sh${NC}     (first time setup)"
    echo -e "  2. ${YELLOW}make dev${NC}            (start development)"
    echo ""
    exit 0
else
    echo ""
    echo -e "${RED}❌ Some prerequisites are missing or incorrect${NC}"
    echo -e "   Please install the missing tools and try again"
    echo ""
    exit 1
fi
