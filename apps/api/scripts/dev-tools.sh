#!/bin/bash

# Development tools menu
show_menu() {
    clear
    cat << "EOF"
╔══════════════════════════════════════════════════════════════════════╗
║                    🛠️  DanceHub Dev Tools                           ║
╚══════════════════════════════════════════════════════════════════════╝
EOF
    echo ""
    echo "1. 🏥 Health Check - Check all services"
    echo "2. 🗄️  Database Studio - Open Drizzle Studio"
    echo "3. 🌱 Seed Database - Insert test data"
    echo "4. 🔄 Reset Database - Drop and recreate"
    echo "5. 📧 Open MailHog - View test emails"
    echo "6. 💾 Open MinIO - Storage console"
    echo "7. 🐳 Docker Logs - View container logs"
    echo "8. 🧪 Run Tests - Execute test suite"
    echo "9. 📊 Test Coverage - View coverage report"
    echo "10. 🔍 TypeCheck - Run TypeScript compiler"
    echo "11. ✨ Lint & Fix - Fix code issues"
    echo "12. 🔄 Restart Docker - Restart all containers"
    echo "0. ❌ Exit"
    echo ""
}

health_check() {
    echo "🏥 Running health check..."
    cd ../.. && cd apps/api && pnpm health
    read -p "Press Enter to continue..."
}

database_studio() {
    echo "🗄️  Opening Drizzle Studio..."
    echo "Studio will be available at: http://localhost:4983"
    cd ../.. && cd apps/api && pnpm db:studio
}

seed_database() {
    echo "🌱 Seeding database..."
    cd ../.. && cd apps/api && pnpm db:seed
    read -p "Press Enter to continue..."
}

reset_database() {
    echo "⚠️  WARNING: This will delete all data!"
    read -p "Are you sure? (yes/no): " confirm
    if [ "$confirm" = "yes" ]; then
        echo "🔄 Resetting database..."
        cd ../.. && cd apps/api && pnpm db:reset
        echo "✅ Database reset complete"
    else
        echo "❌ Cancelled"
    fi
    read -p "Press Enter to continue..."
}

open_mailhog() {
    if ! docker ps | grep -q dancehub-mailhog; then
        echo "📧 Starting MailHog..."
        cd ../.. && docker-compose --profile mail up -d
        sleep 2
    fi
    echo "📧 Opening MailHog..."
    if [[ "$OSTYPE" == "darwin"* ]]; then
        open http://localhost:8025
    else
        xdg-open http://localhost:8025 2>/dev/null || echo "Open: http://localhost:8025"
    fi
    read -p "Press Enter to continue..."
}

open_minio() {
    if ! docker ps | grep -q dancehub-minio; then
        echo "💾 Starting MinIO..."
        cd ../.. && docker-compose --profile storage up -d
        sleep 3
    fi
    echo "💾 Opening MinIO Console..."
    echo "Credentials: minioadmin / minioadmin123"
    if [[ "$OSTYPE" == "darwin"* ]]; then
        open http://localhost:9001
    else
        xdg-open http://localhost:9001 2>/dev/null || echo "Open: http://localhost:9001"
    fi
    read -p "Press Enter to continue..."
}

docker_logs() {
    echo "🐳 Docker Logs (Ctrl+C to exit)..."
    cd ../.. && docker-compose logs -f
}

run_tests() {
    echo "🧪 Running tests..."
    cd ../.. && cd apps/api && pnpm test
    read -p "Press Enter to continue..."
}

test_coverage() {
    echo "📊 Generating coverage report..."
    cd ../.. && cd apps/api && pnpm test:cov
    echo ""
    echo "📊 Opening coverage report..."
    if [[ "$OSTYPE" == "darwin"* ]]; then
        open coverage/lcov-report/index.html
    else
        xdg-open coverage/lcov-report/index.html 2>/dev/null
    fi
    read -p "Press Enter to continue..."
}

typecheck() {
    echo "🔍 Running TypeScript compiler..."
    cd ../.. && cd apps/api && pnpm typecheck
    read -p "Press Enter to continue..."
}

lint_fix() {
    echo "✨ Running linter with auto-fix..."
    cd ../.. && cd apps/api && pnpm lint:fix
    echo "✅ Linting complete"
    read -p "Press Enter to continue..."
}

restart_docker() {
    echo "🔄 Restarting Docker services..."
    cd ../.. && docker-compose restart
    echo "✅ Services restarted"
    read -p "Press Enter to continue..."
}

# Main loop
while true; do
    show_menu
    read -p "Select an option: " choice
    case $choice in
        1) health_check ;;
        2) database_studio ;;
        3) seed_database ;;
        4) reset_database ;;
        5) open_mailhog ;;
        6) open_minio ;;
        7) docker_logs ;;
        8) run_tests ;;
        9) test_coverage ;;
        10) typecheck ;;
        11) lint_fix ;;
        12) restart_docker ;;
        0) echo "👋 Goodbye!"; exit 0 ;;
        *) echo "❌ Invalid option"; sleep 1 ;;
    esac
done
