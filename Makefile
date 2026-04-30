SHELL := /bin/bash
ENV_FILE := ./_common/.env
PNPM_CMD := env -u PNPM_STORE_DIR -u npm_config_store_dir pnpm

.PHONY: help install backend-install frontend-install \
        backend api frontend web \
        fullstack-web  \
        docker-build docker-up docker-down docker-restart \
        kill-backend-ports kill-frontend-ports  kill-all-ports

help:
	@echo ""
	@echo "Setup:"
	@echo "  make install              - Install all dependencies"
	@echo "  make backend-install      - Install backend dependencies"
	@echo "  make frontend-install     - Install frontend workspace dependencies"
	@echo ""
	@echo "Local dev:"
	@echo "  make backend app        - Run backend api (:4000)"
	@echo "  make web / frontend       - Run web app (:3000)"
	@echo "  make fullstack-web        - Run backend + web"
	@echo ""
	@echo "Docker:"
	@echo "  make docker-build         - Build all service images"
	@echo "  make docker-up            - Build and start all services"
	@echo "  make docker-down          - Stop all services"
	@echo "  make docker-restart       - Stop, rebuild, and start all services"
	@echo ""
	@echo "Ports:"
	@echo "  make kill-backend-ports   - Kill port 4000"
	@echo "  make kill-frontend-ports  - Kill ports 3000 and 8100"
	@echo "  make kill-all-ports       - Kill ports 3000, 4000"
	@echo ""

# ─── Install ──────────────────────────────────────────────────────────────────

install: backend-install frontend-install

backend-install:
	$(PNPM_CMD) --dir backend/app install

frontend-install:
	$(PNPM_CMD) --dir frontend install

# ─── Local dev ────────────────────────────────────────────────────────────────

backend: kill-backend-ports
	@set -a; source $(ENV_FILE); set +a; \
	  $(PNPM_CMD) --dir backend/app dev

web: kill-frontend-ports
	$(PNPM_CMD) --dir frontend dev:web


fullstack-web: kill-all-ports
	@set -a; source $(ENV_FILE); set +a; \
	  $(PNPM_CMD) --dir backend/app dev & \
	  $(PNPM_CMD) --dir frontend dev:web & \
	  wait

# ─── Docker ───────────────────────────────────────────────────────────────────

docker-build:
	docker compose build

docker-up:
	docker compose up --build

docker-down:
	docker compose down

docker-restart: docker-down docker-up

# ─── Ports ────────────────────────────────────────────────────────────────────

define kill_port
	@process_id=$$(lsof -ti tcp:$(1)); \
	if [ -n "$$process_id" ]; then \
		echo "Killing port $(1) (PID $$process_id)"; \
		kill -9 $$process_id; \
	else \
		echo "Port $(1) is free"; \
	fi
endef

kill-backend-ports:
	$(call kill_port,4000)


kill-frontend-ports:
	$(call kill_port,3000)

kill-all-ports:
	$(call kill_port,3000)
	$(call kill_port,4000)
