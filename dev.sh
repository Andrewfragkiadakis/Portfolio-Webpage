#!/bin/bash

# Development server starter
# Starts the Next.js development server

set -e

echo "🚀 Starting development server..."
echo ""

cd "$(dirname "$0")/andreas-technology-v2"

# Check if node_modules exists
if [ ! -d "node_modules" ]; then
    echo "📦 Installing dependencies first..."
    npm install
    echo ""
fi

echo "🌐 Server will be available at: http://localhost:3000"
echo "Press Ctrl+C to stop"
echo ""

npm run dev
