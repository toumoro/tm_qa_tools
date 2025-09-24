#!/usr/bin/env bash
set -euo pipefail

QA_TOOLS_DIR="vendor/toumoro/tm-qa-tools"
DEST_DIR="."

# Copy Build Folder
mkdir -p "${DEST_DIR}/build"
cp -r "${QA_TOOLS_DIR}/build" "${DEST_DIR}/build"
echo "Build folder copied to ${DEST_DIR}/build/"

# Copy .editorconfig File
cp "${QA_TOOLS_DIR}/.editorconfig" "${DEST_DIR}/.editorconfig"
echo ".editorconfig copied to ${DEST_DIR}/.editorconfig"

# Copy tm_qa_tools.yml.dist
mkdir -p "${DEST_DIR}/.github/workflows"
cp ${QA_TOOLS_DIR}/.github/workflows/tm_qa_tools.yml.dist "${DEST_DIR}/.github/workflows/tm_qa_tools.yml"
echo "Pipeline configuration copied to ${DEST_DIR}/.github/workflows/"

echo "All files checked and copied if missing."