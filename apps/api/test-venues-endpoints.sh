#!/bin/bash

BASE_URL="http://localhost:3000"

echo "========================================="
echo "Testing Venue Endpoints with Relations"
echo "========================================="
echo ""

# Get a user ID from database (we'll need this)
echo "Step 1: Get existing user..."
USER_ID=$(curl -s -X GET "$BASE_URL/users" -H "Content-Type: application/json" | jq -r '.data[0].id // empty')

if [ -z "$USER_ID" ]; then
    echo "❌ No users found in database. Please seed users first."
    exit 1
fi

echo "✅ Found user ID: $USER_ID"
echo ""

# Get dance styles
echo "Step 2: Get existing dance styles..."
SALSA_ID=$(curl -s -X GET "$BASE_URL/dance-styles" -H "Content-Type: application/json" | jq -r '.data[] | select(.slug=="salsa") | .id // empty')
BACHATA_ID=$(curl -s -X GET "$BASE_URL/dance-styles" -H "Content-Type: application/json" | jq -r '.data[] | select(.slug=="bachata") | .id // empty')

if [ -z "$SALSA_ID" ] || [ -z "$BACHATA_ID" ]; then
    echo "❌ Dance styles not found. Please seed dance styles first."
    exit 1
fi

echo "✅ Found Salsa ID: $SALSA_ID"
echo "✅ Found Bachata ID: $BACHATA_ID"
echo ""

# Create a venue with dance style relations
echo "Step 3: Creating venue with dance style relations..."
CREATE_RESPONSE=$(curl -s -X POST "$BASE_URL/venues" \
  -H "Content-Type: application/json" \
  -d "{
    \"name\": \"El Salón Madrid\",
    \"slug\": \"el-salon-madrid-$(date +%s)\",
    \"address\": \"Calle Gran Vía 25\",
    \"city\": \"Madrid\",
    \"country\": \"Spain\",
    \"capacity\": 150,
    \"hasParking\": true,
    \"ownerId\": \"$USER_ID\",
    \"danceStyleIds\": [\"$SALSA_ID\", \"$BACHATA_ID\"]
  }")

VENUE_ID=$(echo $CREATE_RESPONSE | jq -r '.id // empty')
VENUE_SLUG=$(echo $CREATE_RESPONSE | jq -r '.slug // empty')

if [ -z "$VENUE_ID" ]; then
    echo "❌ Failed to create venue"
    echo "Response: $CREATE_RESPONSE"
    exit 1
fi

echo "✅ Created venue:"
echo "$CREATE_RESPONSE" | jq '.'
echo ""

# Get venue WITHOUT relations
echo "Step 4: Getting venue WITHOUT relations..."
VENUE_NO_RELATIONS=$(curl -s -X GET "$BASE_URL/venues/$VENUE_SLUG")
echo "✅ Venue without relations:"
echo "$VENUE_NO_RELATIONS" | jq '.'
echo ""

# Get venue WITH relations
echo "Step 5: Getting venue WITH relations..."
VENUE_WITH_RELATIONS=$(curl -s -X GET "$BASE_URL/venues/$VENUE_SLUG?includeRelations=true")
echo "✅ Venue with relations:"
echo "$VENUE_WITH_RELATIONS" | jq '.'
echo ""

# Verify relations are loaded
OWNER_EMAIL=$(echo $VENUE_WITH_RELATIONS | jq -r '.owner.email // empty')
DANCE_STYLES_COUNT=$(echo $VENUE_WITH_RELATIONS | jq '.danceStyles | length // 0')

echo "========================================="
echo "Validation Results:"
echo "========================================="
if [ -n "$OWNER_EMAIL" ]; then
    echo "✅ Owner relation loaded successfully: $OWNER_EMAIL"
else
    echo "❌ Owner relation NOT loaded"
fi

if [ "$DANCE_STYLES_COUNT" -ge 2 ]; then
    echo "✅ Dance styles relation loaded successfully: $DANCE_STYLES_COUNT styles"
    echo "   Styles: $(echo $VENUE_WITH_RELATIONS | jq -r '.danceStyles[].slug' | tr '\n' ', ' | sed 's/,$//')"
else
    echo "❌ Dance styles relation NOT loaded correctly (expected 2, got $DANCE_STYLES_COUNT)"
fi

echo ""
echo "========================================="
echo "Test Complete! ✅"
echo "========================================="

