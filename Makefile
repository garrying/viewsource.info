PORT := 8080
PROOFER_BINARY := htmlproofer

GREEN := \033[0;32m
RESET := \033[0m

# Check if the binary exists
PROOFER_BINARY_EXISTS := $(shell command -v $(PROOFER_BINARY) 2> /dev/null)

all: start

start:
	@echo "Starting server..."
	@python3 -m http.server $(PORT)

check:
ifdef PROOFER_BINARY_EXISTS
	@$(PROOFER_BINARY) .
else
	@echo "Binary $(GREEN)$(PROOFER_BINARY)$(RESET) not found. Skipping HTML proofing."
	@echo "🔗 Visit $(GREEN)https://github.com/gjtorikian/html-proofer$(RESET)"
	@exit 1
endif

help:
	@echo "Available commands:"
	@echo "  make start     - Run the server"
	@echo "  make help      - Display this help message"
	@echo "  make check     - Check links and possible HTML issues"

.PHONY: all start help lint fix check
