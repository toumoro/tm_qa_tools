#!/usr/bin/env bash
set -euo pipefail

# Define source and destination paths
QA_TOOLS_DIR="vendor/toumoro/tm-qa-tools"
DEST_DIR="."

# Copy the Build directory if it doesn't exist
if [ ! -d "${DEST_DIR}/build" ]; then
    echo "Copying Build folder..."
    cp -r "${QA_TOOLS_DIR}/build" "${DEST_DIR}/build"
else
    echo "Build folder already exists, skipping..."
fi

# Copy .githooks directory if it doesn't exist
if [ ! -d "${DEST_DIR}/.githooks" ]; then
    echo "Copying .githooks folder..."
    cp -r "${QA_TOOLS_DIR}/.githooks" "${DEST_DIR}/.githooks"
else
    echo ".githooks folder already exists, skipping..."
fi

# Copy .editorconfig file if it doesn't exist
if [ ! -f "${DEST_DIR}/.editorconfig" ]; then
    echo "Copying .editorconfig file..."
    cp "${QA_TOOLS_DIR}/Build/.editorconfig" "${DEST_DIR}/.editorconfig"
else
    echo ".editorconfig file already exists, skipping..."
fi

echo "All files checked and copied if missing."
