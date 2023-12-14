PORT := 8080

all: start

start:
	@echo "Starting server..."
	@python3 -m http.server $(PORT)

lint:
	@standard

fix:
	@standard --fix

check:
	@htmlproofer .

help:
	@echo "Available commands:"
	@echo "  make start     - Run the server"
	@echo "  make help      - Display this help message"
	@echo "  make lint      - Run linting commands"
	@echo "  make fix       - Try fixing linting issues"
	@echo "  make check     - Check links and possible HTML issues"

.PHONY: all start help lint fix check
