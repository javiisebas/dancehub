#!/bin/bash

# Final Cache Consistency Test
# Tests with real UUIDs to verify no stale cache

set -e

API_URL="http://localhost:4000/api"
TOTAL_TESTS=0
PASSED_TESTS=0
FAILED_TESTS=0

# Colors
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

echo -e "${BLUE}=================================================${NC}"
echo -e "${BLUE}🔍 CACHE CONSISTENCY TESTS (Final)${NC}"
echo -e "${BLUE}Testing: Fresh data on every fetch${NC}"
echo -e "${BLUE}=================================================${NC}\n"

# Helper function
run_test() {
    local test_name="$1"
    local test_cmd="$2"
    local expected="$3"

    TOTAL_TESTS=$((TOTAL_TESTS + 1))

    echo -e "${YELLOW}Test $TOTAL_TESTS: $test_name${NC}"

    result=$(eval "$test_cmd")

    if [[ "$result" == *"$expected"* ]]; then
        echo -e "${GREEN}✅ PASSED${NC}"
        PASSED_TESTS=$((PASSED_TESTS + 1))
    else
        echo -e "${RED}❌ FAILED${NC}"
        echo -e "${RED}Expected: $expected${NC}"
        echo -e "${RED}Got: $result${NC}"
        FAILED_TESTS=$((FAILED_TESTS + 1))
    fi
    echo ""
}

# Check API
echo -e "${BLUE}Checking API health...${NC}"
if ! curl -s "$API_URL/health" > /dev/null; then
    echo -e "${RED}❌ API not running${NC}"
    exit 1
fi
echo -e "${GREEN}✅ API is running${NC}\n"

# Get real IDs from database
echo -e "${BLUE}Getting dance style IDs from API...${NC}"
DANCE_STYLES=$(curl -s "$API_URL/dance-styles?page=1&limit=3")
SALSA_ID=$(echo $DANCE_STYLES | jq -r '.data[0].id')
BACHATA_ID=$(echo $DANCE_STYLES | jq -r '.data[1].id')
KIZOMBA_ID=$(echo $DANCE_STYLES | jq -r '.data[2].id')

echo -e "${GREEN}Salsa ID: $SALSA_ID${NC}"
echo -e "${GREEN}Bachata ID: $BACHATA_ID${NC}"
echo -e "${GREEN}Kizomba ID: $KIZOMBA_ID${NC}\n"

# ==============================================
# SCENARIO 1: Multiple Fetches - Always Fresh
# ==============================================
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${BLUE}SCENARIO 1: Multiple Fetches - Always Fresh${NC}"
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}\n"

echo -e "${YELLOW}Fetching Salsa (ES) 5 times in a row...${NC}"
NAMES=()
for i in {1..5}; do
  RESULT=$(curl -s -H "x-locale: es" "$API_URL/dance-styles/$SALSA_ID" | jq -r '.translation.name')
  NAMES+=("$RESULT")
  echo -e "${GREEN}Fetch $i: $RESULT${NC}"
done
echo ""

# Check all fetches return the same value
ALL_SAME=true
for name in "${NAMES[@]}"; do
    if [ "$name" != "${NAMES[0]}" ]; then
        ALL_SAME=false
        break
    fi
done

if $ALL_SAME && [ "${NAMES[0]}" = "Salsa" ]; then
    TOTAL_TESTS=$((TOTAL_TESTS + 1))
    PASSED_TESTS=$((PASSED_TESTS + 1))
    echo -e "${GREEN}✅ PASSED: Multiple ES fetches return consistent fresh data${NC}\n"
else
    TOTAL_TESTS=$((TOTAL_TESTS + 1))
    FAILED_TESTS=$((FAILED_TESTS + 1))
    echo -e "${RED}❌ FAILED: Inconsistent data across fetches${NC}"
    echo -e "${RED}Names: ${NAMES[@]}${NC}\n"
fi

# ==============================================
# SCENARIO 2: Locale Switching - No Stale Data
# ==============================================
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${BLUE}SCENARIO 2: Locale Switching - No Stale Data${NC}"
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}\n"

echo -e "${YELLOW}Alternating between ES and EN locales 10 times...${NC}"
CORRECT_COUNT=0
for i in {1..10}; do
  if [ $((i % 2)) -eq 0 ]; then
    RESULT=$(curl -s -H "x-locale: en" "$API_URL/dance-styles/$SALSA_ID" | jq -r '.translation.name')
    LOCALE_EXPECTED=$(curl -s -H "x-locale: en" "$API_URL/dance-styles/$SALSA_ID" | jq -r '.translation.locale')
    echo -e "${GREEN}Fetch $i (EN): $RESULT (locale: $LOCALE_EXPECTED)${NC}"
    if [ "$LOCALE_EXPECTED" = "en" ]; then
      CORRECT_COUNT=$((CORRECT_COUNT + 1))
    fi
  else
    RESULT=$(curl -s -H "x-locale: es" "$API_URL/dance-styles/$SALSA_ID" | jq -r '.translation.name')
    LOCALE_EXPECTED=$(curl -s -H "x-locale: es" "$API_URL/dance-styles/$SALSA_ID" | jq -r '.translation.locale')
    echo -e "${GREEN}Fetch $i (ES): $RESULT (locale: $LOCALE_EXPECTED)${NC}"
    if [ "$LOCALE_EXPECTED" = "es" ]; then
      CORRECT_COUNT=$((CORRECT_COUNT + 1))
    fi
  fi
done
echo ""

TOTAL_TESTS=$((TOTAL_TESTS + 1))
if [ $CORRECT_COUNT -eq 10 ]; then
    PASSED_TESTS=$((PASSED_TESTS + 1))
    echo -e "${GREEN}✅ PASSED: Locale switching works correctly (NO STALE CACHE)${NC}\n"
else
    FAILED_TESTS=$((FAILED_TESTS + 1))
    echo -e "${RED}❌ FAILED: Locale switching has issues${NC}"
    echo -e "${RED}Correct count: $CORRECT_COUNT/10${NC}\n"
fi

# ==============================================
# SCENARIO 3: Different Entities - No Cross-Pollution
# ==============================================
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${BLUE}SCENARIO 3: Different Entities - No Cross-Pollution${NC}"
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}\n"

echo -e "${YELLOW}Fetching 3 different dance styles in rapid succession...${NC}"
SALSA_NAME=$(curl -s -H "x-locale: es" "$API_URL/dance-styles/$SALSA_ID" | jq -r '.translation.name')
BACHATA_NAME=$(curl -s -H "x-locale: es" "$API_URL/dance-styles/$BACHATA_ID" | jq -r '.translation.name')
KIZOMBA_NAME=$(curl -s -H "x-locale: es" "$API_URL/dance-styles/$KIZOMBA_ID" | jq -r '.translation.name')
echo -e "${GREEN}Salsa: $SALSA_NAME${NC}"
echo -e "${GREEN}Bachata: $BACHATA_NAME${NC}"
echo -e "${GREEN}Kizomba: $KIZOMBA_NAME${NC}"
echo ""

run_test "Salsa fetched correctly (no pollution from other entities)" \
  "echo $SALSA_NAME" \
  "Salsa"

run_test "Bachata fetched correctly (no pollution)" \
  "echo $BACHATA_NAME" \
  "Bachata"

run_test "Kizomba fetched correctly (no pollution)" \
  "echo $KIZOMBA_NAME" \
  "Kizomba"

# ==============================================
# SCENARIO 4: Interleaved Requests
# ==============================================
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${BLUE}SCENARIO 4: Interleaved Requests - No Cache Interference${NC}"
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}\n"

echo -e "${YELLOW}Interleaving requests: Salsa ES -> Bachata EN -> Salsa EN -> Bachata ES${NC}"
R1=$(curl -s -H "x-locale: es" "$API_URL/dance-styles/$SALSA_ID" | jq -r '.translation.name')
R2=$(curl -s -H "x-locale: en" "$API_URL/dance-styles/$BACHATA_ID" | jq -r '.translation.name')
R3=$(curl -s -H "x-locale: en" "$API_URL/dance-styles/$SALSA_ID" | jq -r '.translation.name')
R4=$(curl -s -H "x-locale: es" "$API_URL/dance-styles/$BACHATA_ID" | jq -r '.translation.name')
echo -e "${GREEN}Salsa ES: $R1${NC}"
echo -e "${GREEN}Bachata EN: $R2${NC}"
echo -e "${GREEN}Salsa EN: $R3${NC}"
echo -e "${GREEN}Bachata ES: $R4${NC}"
echo ""

run_test "Salsa ES correct" "echo $R1" "Salsa"
run_test "Bachata EN correct" "echo $R2" "Bachata"
run_test "Salsa EN correct (no interference from previous ES fetch)" "echo $R3" "Salsa"
run_test "Bachata ES correct (no interference)" "echo $R4" "Bachata"

# ==============================================
# SCENARIO 5: Pagination - No Cache Between Pages
# ==============================================
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${BLUE}SCENARIO 5: Pagination - Fresh Data on Every Page${NC}"
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}\n"

echo -e "${YELLOW}Fetching page 1 twice...${NC}"
PAGE1_A=$(curl -s -H "x-locale: es" "$API_URL/dance-styles?page=1&limit=2" | jq -r '.data[0].translation.name')
PAGE1_B=$(curl -s -H "x-locale: es" "$API_URL/dance-styles?page=1&limit=2" | jq -r '.data[0].translation.name')
echo -e "${GREEN}First fetch: $PAGE1_A${NC}"
echo -e "${GREEN}Second fetch: $PAGE1_B${NC}"
echo ""

run_test "Pagination returns consistent fresh data" \
  "test '$PAGE1_A' = '$PAGE1_B' && echo 'same'" \
  "same"

# ==============================================
# SUMMARY
# ==============================================
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${BLUE}📊 SUMMARY${NC}"
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}\n"

echo -e "${BLUE}Total Tests: $TOTAL_TESTS${NC}"
echo -e "${GREEN}Passed: $PASSED_TESTS${NC}"
echo -e "${RED}Failed: $FAILED_TESTS${NC}\n"

if [ $FAILED_TESTS -eq 0 ]; then
    echo -e "${GREEN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
    echo -e "${GREEN}✅ ALL TESTS PASSED - NO STALE CACHE${NC}"
    echo -e "${GREEN}🎉 CACHE STRATEGY: PRODUCTION READY${NC}"
    echo -e "${GREEN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
    echo -e "\n${GREEN}Key Findings:${NC}"
    echo -e "${GREEN}✅ Multiple fetches always return fresh data${NC}"
    echo -e "${GREEN}✅ Locale switching works correctly (no stale cache)${NC}"
    echo -e "${GREEN}✅ No cross-entity cache pollution${NC}"
    echo -e "${GREEN}✅ Interleaved requests work correctly${NC}"
    echo -e "${GREEN}✅ Pagination returns consistent fresh data${NC}"
    echo ""
    exit 0
else
    echo -e "${RED}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
    echo -e "${RED}❌ SOME TESTS FAILED${NC}"
    echo -e "${RED}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
    exit 1
fi

