#!/bin/bash

# Check if the argument is a directory
if [[ -d "$1" ]]; then
  # Find all bench files in the directory
  find "$1" -type f -name "*.bench.ts" | while read file; do
    echo ""
    echo ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    echo Benchmarking: "$file"
    echo ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

    npx tsc "$file" --noEmit --skipLibCheck --lib ES2022 --strict true && npm run tsx "$file"
  done
else
  echo "The argument provided is not a directory."
fi
