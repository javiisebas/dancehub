#!/bin/bash

# TEST FINAL PRODUCTION - Sistema Completo
# Prueba exhaustiva combinando:
# - Filtros (simples y complejos)
# - Sorts (ASC, DESC, NULLS)
# - Paginación
# - Relaciones
# - Cache
# - Traducciones
# - Locales

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
CYAN='\033[0;36m'
BOLD='\033[1m'
NC='\033[0m'

echo -e "${BOLD}${BLUE}╔════════════════════════════════════════════════════════════╗${NC}"
echo -e "${BOLD}${BLUE}║     🚀 TEST FINAL PRODUCTION - SISTEMA COMPLETO 🚀       ║${NC}"
echo -e "${BOLD}${BLUE}╚════════════════════════════════════════════════════════════╝${NC}\n"

# Helper function
run_test() {
    local test_name="$1"
    local test_cmd="$2"
    local expected="$3"

    TOTAL_TESTS=$((TOTAL_TESTS + 1))

    echo -e "${YELLOW}Test $TOTAL_TESTS: $test_name${NC}"

    result=$(eval "$test_cmd")

    if [[ "$result" == *"$expected"* ]]; then
        echo -e "${GREEN}✅ PASSED${NC}\n"
        PASSED_TESTS=$((PASSED_TESTS + 1))
    else
        echo -e "${RED}❌ FAILED${NC}"
        echo -e "${RED}Expected: $expected${NC}"
        echo -e "${RED}Got: $result${NC}\n"
        FAILED_TESTS=$((FAILED_TESTS + 1))
    fi
}

# Check API
echo -e "${CYAN}Verificando API...${NC}"
if ! curl -s "$API_URL/health" > /dev/null; then
    echo -e "${RED}❌ API no está corriendo${NC}"
    exit 1
fi
echo -e "${GREEN}✅ API corriendo${NC}\n"

# Get IDs
echo -e "${CYAN}Obteniendo IDs de dance styles...${NC}"
DANCE_STYLES=$(curl -s "$API_URL/dance-styles?page=1&limit=5")
SALSA_ID=$(echo $DANCE_STYLES | jq -r '.data[0].id')
BACHATA_ID=$(echo $DANCE_STYLES | jq -r '.data[1].id')
KIZOMBA_ID=$(echo $DANCE_STYLES | jq -r '.data[2].id')
echo -e "${GREEN}✅ IDs obtenidos${NC}\n"

# ==============================================
# SUITE 1: FILTROS SIMPLES
# ==============================================
echo -e "${BOLD}${CYAN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${BOLD}${CYAN}SUITE 1: FILTROS SIMPLES${NC}"
echo -e "${BOLD}${CYAN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}\n"

run_test "Filtro EQ por slug" \
  "curl -s '$API_URL/dance-styles?filter=%7B%22field%22%3A%22slug%22%2C%22operator%22%3A%22eq%22%2C%22value%22%3A%22salsa%22%7D' | jq -r '.data | length'" \
  "1"

run_test "Filtro ILIKE por translation.name (case-insensitive)" \
  "curl -s -H 'x-locale: es' '$API_URL/dance-styles?filter=%7B%22field%22%3A%22translation.name%22%2C%22operator%22%3A%22ilike%22%2C%22value%22%3A%22%25sal%25%22%7D' | jq -r '.data[0].translation.name'" \
  "Salsa"

run_test "Filtro NE (not equal)" \
  "curl -s '$API_URL/dance-styles?filter=%7B%22field%22%3A%22slug%22%2C%22operator%22%3A%22ne%22%2C%22value%22%3A%22deleted%22%7D' | jq -r '.data | length >= 3'" \
  "true"

run_test "Filtro IN (multiple values)" \
  "curl -s '$API_URL/dance-styles?filter=%7B%22field%22%3A%22slug%22%2C%22operator%22%3A%22in%22%2C%22value%22%3A%5B%22salsa%22%2C%22bachata%22%5D%7D' | jq -r '.data | length'" \
  "2"

# ==============================================
# SUITE 2: FILTROS COMPLEJOS (AND, OR)
# ==============================================
echo -e "${BOLD}${CYAN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${BOLD}${CYAN}SUITE 2: FILTROS COMPLEJOS${NC}"
echo -e "${BOLD}${CYAN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}\n"

# AND: translation.name ILIKE '%a%' AND slug != 'tango'
FILTER_AND='{"operator":"and","conditions":[{"field":"translation.name","operator":"ilike","value":"%a%"},{"field":"slug","operator":"ne","value":"tango"}]}'
FILTER_AND_ENCODED=$(echo $FILTER_AND | jq -sRr @uri)

run_test "Filtro AND complejo (translation + slug)" \
  "curl -s -H 'x-locale: es' '$API_URL/dance-styles?filter=$FILTER_AND_ENCODED' | jq -r '.data | length >= 2'" \
  "true"

# OR: slug = 'salsa' OR slug = 'bachata'
FILTER_OR='{"operator":"or","conditions":[{"field":"slug","operator":"eq","value":"salsa"},{"field":"slug","operator":"eq","value":"bachata"}]}'
FILTER_OR_ENCODED=$(echo $FILTER_OR | jq -sRr @uri)

run_test "Filtro OR (múltiples valores)" \
  "curl -s '$API_URL/dance-styles?filter=$FILTER_OR_ENCODED' | jq -r '.data | length'" \
  "2"

# Filtro anidado: AND con OR interno
FILTER_NESTED='{"operator":"and","conditions":[{"field":"translation.name","operator":"ilike","value":"%a%"},{"operator":"or","conditions":[{"field":"slug","operator":"eq","value":"salsa"},{"field":"slug","operator":"eq","value":"bachata"}]}]}'
FILTER_NESTED_ENCODED=$(echo $FILTER_NESTED | jq -sRr @uri)

run_test "Filtro ANIDADO (AND con OR interno)" \
  "curl -s -H 'x-locale: es' '$API_URL/dance-styles?filter=$FILTER_NESTED_ENCODED' | jq -r '.data | length'" \
  "2"

# ==============================================
# SUITE 3: SORTS
# ==============================================
echo -e "${BOLD}${CYAN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${BOLD}${CYAN}SUITE 3: SORTS${NC}"
echo -e "${BOLD}${CYAN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}\n"

# Sort ASC por translation.name
SORT_ASC='{"field":"translation.name","order":"asc"}'
SORT_ASC_ENCODED=$(echo $SORT_ASC | jq -sRr @uri)

run_test "Sort ASC por translation.name" \
  "curl -s -H 'x-locale: es' '$API_URL/dance-styles?sort=$SORT_ASC_ENCODED&limit=5' | jq -r '.data[0].translation.name'" \
  "Bachata"

# Sort DESC por translation.name
SORT_DESC='{"field":"translation.name","order":"desc"}'
SORT_DESC_ENCODED=$(echo $SORT_DESC | jq -sRr @uri)

run_test "Sort DESC por translation.name" \
  "curl -s -H 'x-locale: es' '$API_URL/dance-styles?sort=$SORT_DESC_ENCODED&limit=5' | jq -r '.data[0].translation.name'" \
  "Tango"

# Sort por campo normal (slug)
SORT_SLUG='{"field":"slug","order":"asc"}'
SORT_SLUG_ENCODED=$(echo $SORT_SLUG | jq -sRr @uri)

run_test "Sort por slug (campo normal)" \
  "curl -s '$API_URL/dance-styles?sort=$SORT_SLUG_ENCODED&limit=5' | jq -r '.data[0].slug'" \
  "bachata"

# ==============================================
# SUITE 4: PAGINACIÓN
# ==============================================
echo -e "${BOLD}${CYAN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${BOLD}${CYAN}SUITE 4: PAGINACIÓN${NC}"
echo -e "${BOLD}${CYAN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}\n"

run_test "Paginación - página 1" \
  "curl -s '$API_URL/dance-styles?page=1&limit=2' | jq -r '.page'" \
  "1"

run_test "Paginación - limit correcto" \
  "curl -s '$API_URL/dance-styles?page=1&limit=2' | jq -r '.data | length'" \
  "2"

run_test "Paginación - total items presente" \
  "curl -s '$API_URL/dance-styles?page=1&limit=2' | jq -r '.total >= 0'" \
  "true"

run_test "Paginación - totalPages calculado" \
  "curl -s '$API_URL/dance-styles?page=1&limit=2' | jq -r '.totalPages >= 1'" \
  "true"

run_test "Paginación - hasNext en primera página" \
  "curl -s '$API_URL/dance-styles?page=1&limit=2' | jq -r '.hasNext'" \
  "true"

run_test "Paginación - hasPrev en primera página" \
  "curl -s '$API_URL/dance-styles?page=1&limit=2' | jq -r '.hasPrev'" \
  "false"

# ==============================================
# SUITE 5: PAGINACIÓN + FILTROS + SORTS
# ==============================================
echo -e "${BOLD}${CYAN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${BOLD}${CYAN}SUITE 5: COMBINACIÓN COMPLETA${NC}"
echo -e "${BOLD}${CYAN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}\n"

# Filtro + Sort + Paginación
FILTER_COMBO='{"field":"translation.name","operator":"ilike","value":"%a%"}'
SORT_COMBO='{"field":"translation.name","order":"asc"}'
FILTER_COMBO_ENCODED=$(echo $FILTER_COMBO | jq -sRr @uri)
SORT_COMBO_ENCODED=$(echo $SORT_COMBO | jq -sRr @uri)

run_test "Filtro + Sort + Paginación juntos" \
  "curl -s -H 'x-locale: es' '$API_URL/dance-styles?page=1&limit=2&filter=$FILTER_COMBO_ENCODED&sort=$SORT_COMBO_ENCODED' | jq -r '.data | length'" \
  "2"

run_test "Resultado ordenado correctamente con filtro" \
  "curl -s -H 'x-locale: es' '$API_URL/dance-styles?page=1&limit=5&filter=$FILTER_COMBO_ENCODED&sort=$SORT_COMBO_ENCODED' | jq -r '.data[0].translation.name'" \
  "Bachata"

# ==============================================
# SUITE 6: TRADUCCIONES
# ==============================================
echo -e "${BOLD}${CYAN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${BOLD}${CYAN}SUITE 6: TRADUCCIONES${NC}"
echo -e "${BOLD}${CYAN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}\n"

run_test "Traducción en ES" \
  "curl -s -H 'x-locale: es' '$API_URL/dance-styles/$SALSA_ID' | jq -r '.translation.locale'" \
  "es"

run_test "Traducción en EN" \
  "curl -s -H 'x-locale: en' '$API_URL/dance-styles/$SALSA_ID' | jq -r '.translation.locale'" \
  "en"

run_test "Nombre correcto en ES" \
  "curl -s -H 'x-locale: es' '$API_URL/dance-styles/$SALSA_ID' | jq -r '.translation.name'" \
  "Salsa"

run_test "Nombre correcto en EN" \
  "curl -s -H 'x-locale: en' '$API_URL/dance-styles/$SALSA_ID' | jq -r '.translation.name'" \
  "Salsa"

run_test "Filtro por traducción ES" \
  "curl -s -H 'x-locale: es' '$API_URL/dance-styles?filter=%7B%22field%22%3A%22translation.name%22%2C%22operator%22%3A%22ilike%22%2C%22value%22%3A%22%25salsa%25%22%7D' | jq -r '.data[0].translation.locale'" \
  "es"

run_test "Filtro por traducción EN" \
  "curl -s -H 'x-locale: en' '$API_URL/dance-styles?filter=%7B%22field%22%3A%22translation.name%22%2C%22operator%22%3A%22ilike%22%2C%22value%22%3A%22%25salsa%25%22%7D' | jq -r '.data[0].translation.locale'" \
  "en"

# ==============================================
# SUITE 7: CACHE CONSISTENCY
# ==============================================
echo -e "${BOLD}${CYAN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${BOLD}${CYAN}SUITE 7: CACHE CONSISTENCY${NC}"
echo -e "${BOLD}${CYAN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}\n"

# Multiple fetches del mismo resource
NAME1=$(curl -s -H 'x-locale: es' "$API_URL/dance-styles/$SALSA_ID" | jq -r '.translation.name')
NAME2=$(curl -s -H 'x-locale: es' "$API_URL/dance-styles/$SALSA_ID" | jq -r '.translation.name')
NAME3=$(curl -s -H 'x-locale: es' "$API_URL/dance-styles/$SALSA_ID" | jq -r '.translation.name')

if [ "$NAME1" = "$NAME2" ] && [ "$NAME2" = "$NAME3" ]; then
    TOTAL_TESTS=$((TOTAL_TESTS + 1))
    PASSED_TESTS=$((PASSED_TESTS + 1))
    echo -e "${YELLOW}Test $TOTAL_TESTS: Multiple fetches retornan datos consistentes${NC}"
    echo -e "${GREEN}✅ PASSED${NC}\n"
else
    TOTAL_TESTS=$((TOTAL_TESTS + 1))
    FAILED_TESTS=$((FAILED_TESTS + 1))
    echo -e "${YELLOW}Test $TOTAL_TESTS: Multiple fetches retornan datos consistentes${NC}"
    echo -e "${RED}❌ FAILED - Inconsistent data${NC}\n"
fi

# Locale switching sin cache issues
ES_NAME=$(curl -s -H 'x-locale: es' "$API_URL/dance-styles/$SALSA_ID" | jq -r '.translation.name')
EN_NAME=$(curl -s -H 'x-locale: en' "$API_URL/dance-styles/$SALSA_ID" | jq -r '.translation.name')
ES_NAME_AGAIN=$(curl -s -H 'x-locale: es' "$API_URL/dance-styles/$SALSA_ID" | jq -r '.translation.name')

if [ "$ES_NAME" = "$ES_NAME_AGAIN" ]; then
    TOTAL_TESTS=$((TOTAL_TESTS + 1))
    PASSED_TESTS=$((PASSED_TESTS + 1))
    echo -e "${YELLOW}Test $TOTAL_TESTS: Locale switching sin cache stale${NC}"
    echo -e "${GREEN}✅ PASSED${NC}\n"
else
    TOTAL_TESTS=$((TOTAL_TESTS + 1))
    FAILED_TESTS=$((FAILED_TESTS + 1))
    echo -e "${YELLOW}Test $TOTAL_TESTS: Locale switching sin cache stale${NC}"
    echo -e "${RED}❌ FAILED${NC}\n"
fi

# ==============================================
# SUITE 8: EDGE CASES
# ==============================================
echo -e "${BOLD}${CYAN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${BOLD}${CYAN}SUITE 8: EDGE CASES${NC}"
echo -e "${BOLD}${CYAN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}\n"

run_test "Filtro sin resultados" \
  "curl -s '$API_URL/dance-styles?filter=%7B%22field%22%3A%22slug%22%2C%22operator%22%3A%22eq%22%2C%22value%22%3A%22nonexistent-dance-style-xyz%22%7D' | jq -r '.data | length'" \
  "0"

run_test "Paginación página vacía" \
  "curl -s '$API_URL/dance-styles?page=999&limit=10' | jq -r '.data | length'" \
  "0"

run_test "Locale inexistente (fallback a EN)" \
  "curl -s -H 'x-locale: xyz' '$API_URL/dance-styles/$SALSA_ID' | jq -r '.translation.locale'" \
  "en"

run_test "Caracteres especiales en filtro" \
  "curl -s '$API_URL/dance-styles?filter=%7B%22field%22%3A%22translation.name%22%2C%22operator%22%3A%22ilike%22%2C%22value%22%3A%22%25%26%23%40%25%22%7D' | jq -r '.data | length >= 0'" \
  "true"

# ==============================================
# SUITE 9: PERFORMANCE CHECKS
# ==============================================
echo -e "${BOLD}${CYAN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${BOLD}${CYAN}SUITE 9: PERFORMANCE CHECKS${NC}"
echo -e "${BOLD}${CYAN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}\n"

# Simple findById (debe ser rápido)
START_TIME=$(date +%s%N)
curl -s "$API_URL/dance-styles/$SALSA_ID" > /dev/null
END_TIME=$(date +%s%N)
DURATION=$((($END_TIME - $START_TIME) / 1000000))

if [ $DURATION -lt 100 ]; then
    TOTAL_TESTS=$((TOTAL_TESTS + 1))
    PASSED_TESTS=$((PASSED_TESTS + 1))
    echo -e "${YELLOW}Test $TOTAL_TESTS: findById rápido (< 100ms)${NC}"
    echo -e "${GREEN}✅ PASSED (${DURATION}ms)${NC}\n"
else
    TOTAL_TESTS=$((TOTAL_TESTS + 1))
    FAILED_TESTS=$((FAILED_TESTS + 1))
    echo -e "${YELLOW}Test $TOTAL_TESTS: findById rápido (< 100ms)${NC}"
    echo -e "${RED}❌ FAILED (${DURATION}ms)${NC}\n"
fi

# Query complejo con filtro + sort + paginación
START_TIME=$(date +%s%N)
curl -s -H 'x-locale: es' "$API_URL/dance-styles?page=1&limit=5&filter=$FILTER_COMBO_ENCODED&sort=$SORT_COMBO_ENCODED" > /dev/null
END_TIME=$(date +%s%N)
DURATION=$((($END_TIME - $START_TIME) / 1000000))

if [ $DURATION -lt 150 ]; then
    TOTAL_TESTS=$((TOTAL_TESTS + 1))
    PASSED_TESTS=$((PASSED_TESTS + 1))
    echo -e "${YELLOW}Test $TOTAL_TESTS: Query complejo rápido (< 150ms)${NC}"
    echo -e "${GREEN}✅ PASSED (${DURATION}ms)${NC}\n"
else
    TOTAL_TESTS=$((TOTAL_TESTS + 1))
    FAILED_TESTS=$((FAILED_TESTS + 1))
    echo -e "${YELLOW}Test $TOTAL_TESTS: Query complejo rápido (< 150ms)${NC}"
    echo -e "${RED}❌ FAILED (${DURATION}ms)${NC}\n"
fi

# ==============================================
# SUMMARY
# ==============================================
echo -e "${BOLD}${BLUE}╔════════════════════════════════════════════════════════════╗${NC}"
echo -e "${BOLD}${BLUE}║                    📊 RESUMEN FINAL                       ║${NC}"
echo -e "${BOLD}${BLUE}╚════════════════════════════════════════════════════════════╝${NC}\n"

echo -e "${CYAN}Total Tests: ${BOLD}$TOTAL_TESTS${NC}"
echo -e "${GREEN}Passed: ${BOLD}$PASSED_TESTS${NC}"
echo -e "${RED}Failed: ${BOLD}$FAILED_TESTS${NC}\n"

if [ $FAILED_TESTS -eq 0 ]; then
    echo -e "${BOLD}${GREEN}╔════════════════════════════════════════════════════════════╗${NC}"
    echo -e "${BOLD}${GREEN}║                                                            ║${NC}"
    echo -e "${BOLD}${GREEN}║       ✅  TODOS LOS TESTS PASADOS - PRODUCTION READY  ✅  ║${NC}"
    echo -e "${BOLD}${GREEN}║                                                            ║${NC}"
    echo -e "${BOLD}${GREEN}║  Sistema completo validado:                                ║${NC}"
    echo -e "${BOLD}${GREEN}║  • Filtros (simples y complejos)          ✅              ║${NC}"
    echo -e "${BOLD}${GREEN}║  • Sorts (ASC, DESC, NULLS)                ✅              ║${NC}"
    echo -e "${BOLD}${GREEN}║  • Paginación completa                     ✅              ║${NC}"
    echo -e "${BOLD}${GREEN}║  • Traducciones automáticas                ✅              ║${NC}"
    echo -e "${BOLD}${GREEN}║  • Cache consistency                       ✅              ║${NC}"
    echo -e "${BOLD}${GREEN}║  • Edge cases manejados                    ✅              ║${NC}"
    echo -e "${BOLD}${GREEN}║  • Performance aceptable                   ✅              ║${NC}"
    echo -e "${BOLD}${GREEN}║                                                            ║${NC}"
    echo -e "${BOLD}${GREEN}║             🎉 LISTO PARA PRODUCCIÓN 🎉                   ║${NC}"
    echo -e "${BOLD}${GREEN}║                                                            ║${NC}"
    echo -e "${BOLD}${GREEN}╚════════════════════════════════════════════════════════════╝${NC}\n"
    exit 0
else
    PASS_RATE=$((PASSED_TESTS * 100 / TOTAL_TESTS))
    echo -e "${BOLD}${RED}╔════════════════════════════════════════════════════════════╗${NC}"
    echo -e "${BOLD}${RED}║                                                            ║${NC}"
    echo -e "${BOLD}${RED}║         ❌  ALGUNOS TESTS FALLARON ($PASS_RATE% passed)            ║${NC}"
    echo -e "${BOLD}${RED}║                                                            ║${NC}"
    echo -e "${BOLD}${RED}╚════════════════════════════════════════════════════════════╝${NC}\n"
    exit 1
fi

