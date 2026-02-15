#!/bin/bash

# Smart deployment script for GitHub Pages
# This script builds the site and deploys only necessary files

set -e  # Exit on error

echo "🚀 Starting deployment..."

# Navigate to project directory
cd "$(dirname "$0")/andreas-technology-v3"

echo "📦 Building production site..."
npm run build

echo "🧹 Cleaning old deployment files from root..."
cd ..
# Remove old build files but keep source code and important files
find . -maxdepth 1 -name "*.html" -not -name "thesis-presentation.html" -delete
rm -rf _next

echo "📋 Copying new build files (excluding metadata)..."
# Copy everything except the metadata txt files and redundant files
rsync -av --exclude='__next.*' --exclude='*.txt' --exclude='_not-found.html' --exclude='_not-found/' andreas-technology-v3/out/ ./

echo "✅ Deployment files ready!"
echo ""
echo "To push to GitHub, run:"
echo "  git add -A"
echo "  git commit -m 'Deploy: <your message>'"
echo "  git push"
