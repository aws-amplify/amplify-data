#!/bin/bash

ENV=$1
FRAMEWORK=${E2E_FRAMEWORK:-webpack}

if [ "$FRAMEWORK" = "webpack" ]; then
    ./scripts/bundler_test.sh $ENV
elif [ "$FRAMEWORK" = "vite" ]; then
    ./scripts/vite_test.sh $ENV
else
    echo "Unknown framework: $FRAMEWORK"
    exit 1
fi