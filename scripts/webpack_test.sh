#!/bin/bash

# Global variables to store PIDs
SERVER_PID=""

# Get the input argument
ENV=$1

# Function to run dev environment
run_dev() {
    echo "dev (cd packages/e2e-tests/webpack && yarn install --immutable && yarn start) &"
    (cd packages/e2e-tests/webpack && pwd && yarn install --immutable && exec yarn start) &
    SERVER_PID=$!
}

# Function to run prod environment
run_prod() {
    echo "yarn install --immutable && yarn build && yarn serve (in packages/e2e-tests/webpack)"
    (cd packages/e2e-tests/webpack && yarn install --immutable && yarn build && exec yarn serve) &
    SERVER_PID=$!
}

# Check the input and run the appropriate command
if [ "$ENV" = "dev" ]; then
    run_dev
elif [ "$ENV" = "prod" ]; then
    run_prod
else
    echo "Invalid argument. Please use 'dev' or 'prod'."
    exit 1
fi

# Function to check if the server is up
echo "curl -s -o /dev/null -w "%{http_code}" http://localhost:3000 | grep -q "200""
check_server() {
    for i in {1..30}; do
        sleep 5
        if curl -s -o /dev/null -w "%{http_code}" http://localhost:3000 | grep -q "200"; then
            return 0
        fi
    done
    return 1
}

# Wait for the server to start (with timeout)
if check_server; then
    echo "Test pass!"
    # Kill the server process
    kill $SERVER_PID 2>/dev/null
    ( sleep 10; kill -9 $SERVER_PID 2>/dev/null ) &
    WATCHDOG=$!
    wait $SERVER_PID 2>/dev/null
    kill $WATCHDOG 2>/dev/null
    wait $WATCHDOG 2>/dev/null
    echo "Server process terminated."
    exit 0
else
    echo "Error: Command failed with exit code 1."
    # Kill the server process
    kill $SERVER_PID 2>/dev/null
    ( sleep 10; kill -9 $SERVER_PID 2>/dev/null ) &
    WATCHDOG=$!
    wait $SERVER_PID 2>/dev/null
    kill $WATCHDOG 2>/dev/null
    wait $WATCHDOG 2>/dev/null
    echo "Server process terminated."
    exit 1
fi
