#!/bin/bash

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}🚀 DanceHub Storage Module Setup${NC}\n"

# Check if running on macOS, Linux, or Windows
OS="$(uname -s)"
case "${OS}" in
    Linux*)     PLATFORM=Linux;;
    Darwin*)    PLATFORM=Mac;;
    CYGWIN*|MINGW*|MSYS*)    PLATFORM=Windows;;
    *)          PLATFORM="UNKNOWN"
esac

echo -e "${YELLOW}Detected platform: ${PLATFORM}${NC}\n"

# Function to check if command exists
command_exists() {
    command -v "$1" >/dev/null 2>&1
}

# Check Node.js
echo -e "${BLUE}Checking Node.js...${NC}"
if command_exists node; then
    NODE_VERSION=$(node -v)
    echo -e "${GREEN}✓ Node.js installed: ${NODE_VERSION}${NC}"
else
    echo -e "${RED}✗ Node.js not found. Please install Node.js 20+${NC}"
    exit 1
fi

# Check pnpm
echo -e "${BLUE}Checking pnpm...${NC}"
if command_exists pnpm; then
    PNPM_VERSION=$(pnpm -v)
    echo -e "${GREEN}✓ pnpm installed: ${PNPM_VERSION}${NC}"
else
    echo -e "${YELLOW}⚠ pnpm not found. Installing...${NC}"
    npm install -g pnpm
fi

# Check FFmpeg
echo -e "\n${BLUE}Checking FFmpeg (required for video processing)...${NC}"
if command_exists ffmpeg; then
    FFMPEG_VERSION=$(ffmpeg -version | head -n1)
    echo -e "${GREEN}✓ FFmpeg installed${NC}"
    echo -e "  ${FFMPEG_VERSION}"
else
    echo -e "${RED}✗ FFmpeg not found${NC}"
    echo -e "${YELLOW}Installing FFmpeg...${NC}"

    case "${PLATFORM}" in
        Mac)
            if command_exists brew; then
                brew install ffmpeg
            else
                echo -e "${RED}Please install Homebrew first: https://brew.sh${NC}"
                exit 1
            fi
            ;;
        Linux)
            if command_exists apt-get; then
                sudo apt-get update && sudo apt-get install -y ffmpeg
            elif command_exists yum; then
                sudo yum install -y ffmpeg
            else
                echo -e "${RED}Please install FFmpeg manually${NC}"
                exit 1
            fi
            ;;
        Windows)
            echo -e "${YELLOW}Please install FFmpeg manually from: https://ffmpeg.org/download.html${NC}"
            echo -e "${YELLOW}Or use Chocolatey: choco install ffmpeg${NC}"
            ;;
    esac
fi

# Check Sharp dependencies (for image processing)
echo -e "\n${BLUE}Checking Sharp dependencies...${NC}"
case "${PLATFORM}" in
    Mac)
        echo -e "${GREEN}✓ macOS has built-in support for Sharp${NC}"
        ;;
    Linux)
        echo -e "${YELLOW}Installing Sharp dependencies...${NC}"
        if command_exists apt-get; then
            sudo apt-get install -y python3 make g++ libcairo2-dev libjpeg-dev libpango1.0-dev libgif-dev
        fi
        ;;
esac

# Check environment variables
echo -e "\n${BLUE}Checking environment variables...${NC}"
if [ -f ".env" ]; then
    echo -e "${GREEN}✓ .env file exists${NC}"

    # Check required storage variables
    if grep -q "STORAGE_R2_ACCOUNT_ID" .env && \
       grep -q "STORAGE_R2_ACCESS_KEY_ID" .env && \
       grep -q "STORAGE_R2_SECRET_ACCESS_KEY" .env && \
       grep -q "STORAGE_R2_BUCKET" .env; then
        echo -e "${GREEN}✓ Storage environment variables configured${NC}"
    else
        echo -e "${YELLOW}⚠ Storage environment variables missing${NC}"
        echo -e "${YELLOW}Please add to .env:${NC}"
        echo -e "  STORAGE_R2_ACCOUNT_ID=your_account_id"
        echo -e "  STORAGE_R2_ACCESS_KEY_ID=your_access_key"
        echo -e "  STORAGE_R2_SECRET_ACCESS_KEY=your_secret_key"
        echo -e "  STORAGE_R2_BUCKET=your_bucket_name"
    fi
else
    echo -e "${YELLOW}⚠ .env file not found${NC}"
    if [ -f ".env.example" ]; then
        echo -e "${YELLOW}Creating .env from .env.example...${NC}"
        cp .env.example .env
        echo -e "${GREEN}✓ .env created. Please configure your values.${NC}"
    fi
fi

# Install dependencies
echo -e "\n${BLUE}Installing dependencies...${NC}"
pnpm install

# Generate database migration
echo -e "\n${BLUE}Checking database migrations...${NC}"
echo -e "${YELLOW}Would you like to generate/push database migrations? (y/n)${NC}"
read -r response
if [[ "$response" =~ ^([yY][eE][sS]|[yY])$ ]]; then
    pnpm db:generate
    echo -e "${YELLOW}Push to database? (y/n)${NC}"
    read -r push_response
    if [[ "$push_response" =~ ^([yY][eE][sS]|[yY])$ ]]; then
        pnpm db:push
    fi
fi

# Summary
echo -e "\n${GREEN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${GREEN}✓ Setup Complete!${NC}"
echo -e "${GREEN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}\n"

echo -e "${BLUE}Next Steps:${NC}"
echo -e "  1. Configure your .env file with R2 credentials"
echo -e "  2. Run ${YELLOW}pnpm dev${NC} to start the development server"
echo -e "  3. Test storage with ${YELLOW}pnpm storage:verify${NC}"
echo -e "\n${BLUE}Useful Commands:${NC}"
echo -e "  ${YELLOW}pnpm dev${NC}                 - Start development server"
echo -e "  ${YELLOW}pnpm storage:verify${NC}      - Verify storage setup"
echo -e "  ${YELLOW}pnpm db:studio${NC}           - Open database studio"
echo -e "  ${YELLOW}pnpm db:generate${NC}         - Generate migrations"
echo -e "\n${BLUE}Documentation:${NC}"
echo -e "  See ${YELLOW}src/modules/core/storage/STORAGE_MODULE.md${NC}\n"
