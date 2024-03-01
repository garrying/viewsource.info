PORT := 8080

all: start

start:
	@echo "Starting server..."
	@python3 -m http.server $(PORT)

help:
	@echo "Available commands:"
	@echo "  make start     - Run the server"
	@echo "  make help      - Display this help message"

.PHONY: all start help
