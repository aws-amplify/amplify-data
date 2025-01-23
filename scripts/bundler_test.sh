#!/bin/bash

# Run the npm commands
npm --prefix packages/e2e-tests/webpack install && npm --prefix packages/e2e-tests/webpack run start &

# Store the PID of the npm process
NPM_PID=$!

# Function to check if the server is up
check_server() {
    for i in {1..30}; do
        sleep 2
        if curl -s -o /dev/null -w "%{http_code}" http://localhost:3000 | grep -q "200"; then
            return 0
        fi
    done
    return 1
}

# Wait for the server to start (with timeout)
if check_server; then
    echo "Server is up and running!"
    # Kill the npm process
    kill $NPM_PID
    exit 0
else
    echo "Server failed to start or return 200 status code within the timeout period."
    # Kill the npm process
    kill $NPM_PID
    exit 1
fi