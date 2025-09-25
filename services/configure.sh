#!/usr/bin/env bash
set -euo pipefail

QA_TOOLS_DIR="vendor/toumoro/tm-qa-tools"
DEST_DIR="."

# Copy Build Folder
mkdir -p "${DEST_DIR}/build"
if [ ! -d "${DEST_DIR}/.githooks" ]; then
    cp -r "${QA_TOOLS_DIR}/Build" "${DEST_DIR}/build"
    echo "Build folder copied to ${DEST_DIR}/build/"
fi

# Copy .editorconfig File
if [ ! -d "${DEST_DIR}/.githooks" ]; then
    cp "${QA_TOOLS_DIR}/.editorconfig" "${DEST_DIR}/.editorconfig"
    echo ".editorconfig copied to ${DEST_DIR}/.editorconfig"
fi

# Copy tm_qa_tools.yml.dist
mkdir -p "${DEST_DIR}/.github/workflows"
if [ ! -d "${DEST_DIR}/.githooks" ]; then
    cp ${QA_TOOLS_DIR}/.github/workflows/tm_qa_tools.yml.dist "${DEST_DIR}/.github/workflows/tm_qa_tools.yml"
    echo "Pipeline configuration copied to ${DEST_DIR}/.github/workflows/"
fi

echo "All files checked and copied if missing."