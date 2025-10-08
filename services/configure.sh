#!/usr/bin/env bash

set -euo pipefail

QA_TOOLS_DIR="vendor/toumoro/tm-qa-tools"
DEST_DIR="."

# Copy Build Folder
if [ ! -d "${DEST_DIR}/build" ]; then
    mkdir -p "${DEST_DIR}/build"
    cp -a "${QA_TOOLS_DIR}/Build/." "${DEST_DIR}/build"
    echo "Build folder copied to ${DEST_DIR}/build/"
fi

# Copy .editorconfig File
cp "${QA_TOOLS_DIR}/.editorconfig" "${DEST_DIR}/.editorconfig"
echo ".editorconfig copied to ${DEST_DIR}/.editorconfig"

# Copy tm-qa-tools.yml.dist
mkdir -p "${DEST_DIR}/.github/workflows"
cp ${QA_TOOLS_DIR}/.github/workflows/tm-qa-tools.yml.dist "${DEST_DIR}/.github/workflows/tm-qa-tools.yml"
echo "Pipeline configuration copied to ${DEST_DIR}/.github/workflows/"

# Copy pre-commit.dist
mkdir -p "${DEST_DIR}/.githooks"
cp ${QA_TOOLS_DIR}/.githooks/pre-commit.dist "${DEST_DIR}/.githooks/pre-commit"
echo "Pre-commit script copied to ${DEST_DIR}/.githooks/"

echo "All files checked and copied if missing."