#!/bin/bash

set -e

RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${BLUE}🔧 R2 CORS Configuration Setup${NC}"
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}\n"

ENV_FILE=""
if [ -f "apps/api/.env" ]; then
    ENV_FILE="apps/api/.env"
elif [ -f ".env" ]; then
    ENV_FILE=".env"
else
    echo -e "${RED}❌ .env file not found${NC}"
    exit 1
fi

echo -e "${BLUE}📁 Using env file: ${ENV_FILE}${NC}\n"
source "$ENV_FILE"

if [ -z "$STORAGE_R2_ACCOUNT_ID" ] || [ -z "$STORAGE_R2_ACCESS_KEY_ID" ] || [ -z "$STORAGE_R2_SECRET_ACCESS_KEY" ] || [ -z "$STORAGE_R2_BUCKET" ]; then
    echo -e "${RED}❌ Missing required environment variables:${NC}"
    echo -e "   STORAGE_R2_ACCOUNT_ID"
    echo -e "   STORAGE_R2_ACCESS_KEY_ID"
    echo -e "   STORAGE_R2_SECRET_ACCESS_KEY"
    echo -e "   STORAGE_R2_BUCKET"
    exit 1
fi

if ! command -v aws &> /dev/null; then
    echo -e "${YELLOW}⚠️  AWS CLI not found${NC}"
    echo -e "${BLUE}Installing AWS CLI...${NC}\n"

    if [[ "$OSTYPE" == "darwin"* ]]; then
        if command -v brew &> /dev/null; then
            brew install awscli
        else
            echo -e "${RED}Please install Homebrew first: https://brew.sh${NC}"
            exit 1
        fi
    elif [[ "$OSTYPE" == "linux-gnu"* ]]; then
        curl "https://awscli.amazonaws.com/awscli-exe-linux-x86_64.zip" -o "awscliv2.zip"
        unzip awscliv2.zip
        sudo ./aws/install
        rm -rf awscliv2.zip aws
    else
        echo -e "${RED}Please install AWS CLI manually: https://aws.amazon.com/cli/${NC}"
        exit 1
    fi
fi

echo -e "${GREEN}✓ AWS CLI found${NC}\n"

CORS_FILE=$(mktemp)
cat > "$CORS_FILE" << 'EOF'
{
  "CORSRules": [
    {
      "AllowedOrigins": [
        "http://localhost:3000",
        "http://localhost:3001",
        "https://*.vercel.app",
        "https://dancehub.com",
        "https://www.dancehub.com"
      ],
      "AllowedMethods": ["GET", "HEAD", "PUT", "POST", "DELETE"],
      "AllowedHeaders": [
        "*",
        "Authorization",
        "Content-Type",
        "Content-Length",
        "Content-Range",
        "Range",
        "x-amz-*"
      ],
      "ExposeHeaders": [
        "ETag",
        "Content-Length",
        "Content-Type",
        "Content-Range",
        "Accept-Ranges",
        "x-amz-request-id"
      ],
      "MaxAgeSeconds": 3600
    }
  ]
}
EOF

echo -e "${BLUE}📝 CORS Configuration:${NC}"
cat "$CORS_FILE"
echo ""

echo -e "${BLUE}🔄 Configuring AWS CLI for R2...${NC}"
export AWS_ACCESS_KEY_ID="$STORAGE_R2_ACCESS_KEY_ID"
export AWS_SECRET_ACCESS_KEY="$STORAGE_R2_SECRET_ACCESS_KEY"
export AWS_DEFAULT_REGION="auto"

R2_ENDPOINT="https://${STORAGE_R2_ACCOUNT_ID}.r2.cloudflarestorage.com"

echo -e "${BLUE}🚀 Applying CORS configuration to bucket: ${STORAGE_R2_BUCKET}${NC}\n"

if aws s3api put-bucket-cors \
    --bucket "$STORAGE_R2_BUCKET" \
    --cors-configuration "file://$CORS_FILE" \
    --endpoint-url "$R2_ENDPOINT" 2>&1; then

    echo -e "\n${GREEN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
    echo -e "${GREEN}✓ CORS configuration applied successfully!${NC}"
    echo -e "${GREEN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}\n"

    echo -e "${BLUE}📋 Verifying configuration...${NC}"
    aws s3api get-bucket-cors \
        --bucket "$STORAGE_R2_BUCKET" \
        --endpoint-url "$R2_ENDPOINT" 2>&1 || true

    echo -e "\n${GREEN}✓ Setup complete!${NC}"
    echo -e "${YELLOW}Note: It may take a few minutes for CORS changes to propagate.${NC}\n"
else
    echo -e "\n${RED}❌ Failed to apply CORS configuration${NC}"
    echo -e "${YELLOW}Please verify:${NC}"
    echo -e "  1. Your R2 credentials are correct"
    echo -e "  2. You have permission to modify bucket CORS settings"
    echo -e "  3. The bucket name is correct: ${STORAGE_R2_BUCKET}${NC}\n"
    rm -f "$CORS_FILE"
    exit 1
fi

rm -f "$CORS_FILE"

echo -e "${BLUE}💡 Additional Setup (Optional):${NC}"
echo -e "  To allow public access from your production domain,"
echo -e "  add it to the AllowedOrigins list in this script.\n"

