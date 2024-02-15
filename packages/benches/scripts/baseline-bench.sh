#!/bin/bash

baselineBench() {
  # Check if an arg is provided
  if [ "$#" -ne 1 ]; then
      echo "Function usage: $0 <filename>"
      exit 1
  fi

  # Check if the arg is a file
  if [[ -f "$1" ]]; then
    FILENAME=$1
  else
    echo "The argument provided is not a file."
    exit 1
  fi

  # Clear out cached baseline:
  # Find ".types([integer, 'instantiations'])""
  # Replace with ".types()"
  sed -i '' -E 's/\.types\(\[[0-9]+, '"'"'instantiations'"'"'\]\)/.types()/g' "$FILENAME"

  echo "Cleared bench"
  # Re-running the bench after clearing out cached baseline will write the new baseline to the file
  npm run tsx $FILENAME
  echo ""
  echo "Baselined $FILENAME"
}

# Check if the argument is a directory
if [[ -d "$1" ]]; then
  # Find all bench files in the directory
  find "$1" -type f -name "*.bench.ts" | while read file; do
    # Run for each file
    baselineBench "$file"
  done
# Check if the argument is a file
elif [[ -f "$1" ]]; then
  baselineBench "$1"
else
  echo "The argument provided is not a file or directory."
  exit 1
fi