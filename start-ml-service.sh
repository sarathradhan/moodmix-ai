#!/bin/bash
# Start ML Service - macOS/Linux

cd "$(dirname "$0")/ml-service"
echo "🤖 ML Service starting on port 8000..."
source venv/bin/activate
uvicorn app.main:app --reload --port 8000
