.PHONY: help setup start stop restart clean test build logs db-push db-migrate db-studio

help:
	@echo "🚀 DanceHub - Comandos Disponibles"
	@echo ""
	@echo "📦 Setup & Instalación:"
	@echo "  make setup          - Setup completo del proyecto (primera vez)"
	@echo "  make install        - Instalar dependencias"
	@echo ""
	@echo "🏃 Desarrollo:"
	@echo "  make start          - Iniciar todos los servicios"
	@echo "  make stop           - Detener todos los servicios"
	@echo "  make restart        - Reiniciar todos los servicios"
	@echo "  make dev            - Modo desarrollo (API + Web)"
	@echo "  make dev-api        - Solo API en modo desarrollo"
	@echo "  make dev-web        - Solo Web en modo desarrollo"
	@echo ""
	@echo "🗄️  Base de Datos:"
	@echo "  make db-push        - Push schema a la BD"
	@echo "  make db-migrate     - Generar migraciones"
	@echo "  make db-studio      - Abrir Drizzle Studio"
	@echo "  make db-seed        - Seed datos de prueba"
	@echo ""
	@echo "🧪 Testing:"
	@echo "  make test           - Ejecutar todos los tests"
	@echo "  make test-watch     - Tests en modo watch"
	@echo "  make test-cov       - Tests con coverage"
	@echo "  make test-e2e       - Tests E2E"
	@echo ""
	@echo "🏗️  Build & Deploy:"
	@echo "  make build          - Build producción"
	@echo "  make build-api      - Build solo API"
	@echo "  make build-web      - Build solo Web"
	@echo ""
	@echo "🛠️  Utilidades:"
	@echo "  make lint           - Ejecutar linter"
	@echo "  make format         - Formatear código"
	@echo "  make typecheck      - Verificar tipos TypeScript"
	@echo "  make logs           - Ver logs de servicios"
	@echo "  make clean          - Limpiar proyecto"
	@echo ""

setup:
	@echo "🚀 Configurando DanceHub..."
	@echo ""
	@echo "📦 1. Instalando dependencias..."
	pnpm install
	@echo ""
	@echo "🐳 2. Levantando servicios Docker..."
	docker-compose up -d
	@echo ""
	@echo "⏳ 3. Esperando servicios..."
	@sleep 5
	@echo ""
	@echo "🗄️  4. Configurando base de datos..."
	cd apps/api && pnpm db:push
	@echo ""
	@echo "✅ Setup completado!"
	@echo ""
	@echo "🎉 Siguiente paso: make dev"

install:
	@echo "📦 Instalando dependencias..."
	pnpm install

start:
	@echo "🐳 Iniciando servicios Docker..."
	docker-compose up -d
	@echo "✅ Servicios iniciados"
	@echo "  - Postgres: localhost:5432"
	@echo "  - Redis: localhost:6380"

stop:
	@echo "🛑 Deteniendo servicios..."
	docker-compose down
	@echo "✅ Servicios detenidos"

restart:
	@echo "🔄 Reiniciando servicios..."
	docker-compose restart
	@echo "✅ Servicios reiniciados"

dev:
	@echo "🏃 Iniciando modo desarrollo..."
	pnpm dev

dev-api:
	@echo "🏃 Iniciando API en modo desarrollo..."
	cd apps/api && pnpm dev

dev-web:
	@echo "🏃 Iniciando Web en modo desarrollo..."
	cd apps/web && pnpm dev

db-push:
	@echo "🗄️  Pusheando schema a la base de datos..."
	cd apps/api && pnpm db:push

db-migrate:
	@echo "🗄️  Generando migración..."
	cd apps/api && pnpm db:generate

db-studio:
	@echo "🎨 Abriendo Drizzle Studio..."
	cd apps/api && pnpm db:studio

db-seed:
	@echo "🌱 Seeding base de datos..."
	cd apps/api && pnpm tsx scripts/seed.ts

test:
	@echo "🧪 Ejecutando tests..."
	cd apps/api && pnpm test

test-watch:
	@echo "🧪 Tests en modo watch..."
	cd apps/api && pnpm test:watch

test-cov:
	@echo "🧪 Tests con coverage..."
	cd apps/api && pnpm test:cov

test-e2e:
	@echo "🧪 Tests E2E..."
	cd apps/api && pnpm test:e2e

build:
	@echo "🏗️  Building proyecto..."
	pnpm build

build-api:
	@echo "🏗️  Building API..."
	cd apps/api && pnpm build

build-web:
	@echo "🏗️  Building Web..."
	cd apps/web && pnpm build

lint:
	@echo "🔍 Ejecutando linter..."
	pnpm lint

format:
	@echo "✨ Formateando código..."
	pnpm format

typecheck:
	@echo "🔍 Verificando tipos TypeScript..."
	cd apps/api && pnpm typecheck

logs:
	@echo "📋 Logs de servicios Docker..."
	docker-compose logs -f

clean:
	@echo "🧹 Limpiando proyecto..."
	@echo "  - Eliminando node_modules..."
	find . -name "node_modules" -type d -prune -exec rm -rf {} \;
	@echo "  - Eliminando build..."
	find . -name "dist" -type d -prune -exec rm -rf {} \;
	@echo "  - Deteniendo Docker..."
	docker-compose down -v
	@echo "✅ Proyecto limpio"

docker-reset:
	@echo "🔄 Reseteando Docker completamente..."
	docker-compose down -v
	docker-compose up -d
	@sleep 5
	cd apps/api && pnpm db:push
	@echo "✅ Docker reseteado"
