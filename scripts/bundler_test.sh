#!/bin/bash

# Global variables to store PIDs
NPM_PID=""

# Get the input argument
ENV=$1

# Function to run dev environment
run_dev() {
    echo "dev npm --prefix packages/e2e-tests/webpack install && npm --prefix packages/e2e-tests/webpack run start"
    npm --prefix packages/e2e-tests/webpack install && npm --prefix packages/e2e-tests/webpack run start &
    NPM_PID=$!
}

# Function to run prod environment
run_prod() {
    echo "npm --prefix packages/e2e-tests/webpack install && npm --prefix packages/e2e-tests/webpack run build && 
    npm --prefix packages/e2e-tests/webpack run serve"

    npm --prefix packages/e2e-tests/webpack install && 
    npm --prefix packages/e2e-tests/webpack run build && 
    npm --prefix packages/e2e-tests/webpack run serve &
    NPM_PID=$!
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
    # Kill the npm process
    kill $NPM_PID
    timeout 10s wait $NPM_PID 2>/dev/null || kill -9 $NPM_PID
    echo "Server process terminated."
    exit 0
else
    echo "Error: Command failed with exit code 1."
    # Kill the npm process
    kill $NPM_PID
    timeout 10s wait $NPM_PID 2>/dev/null || kill -9 $NPM_PID
    echo "Server process terminated."
    exit 1
fi