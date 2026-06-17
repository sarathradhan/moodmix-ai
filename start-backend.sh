#!/bin/bash
# Start Backend - macOS/Linux

cd "$(dirname "$0")/backend"
echo "⚙️  Backend starting on port 5000..."
npm run dev
