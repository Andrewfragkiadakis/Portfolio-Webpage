#!/bin/bash

# Full deployment automation script
# Builds, deploys, and pushes to GitHub

set -e

echo "🚀 Starting automated deployment..."
echo ""

# Optional: Create backup before deploying
read -p "Create backup before deploying? (y/n) " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]; then
    ./backup.sh
    echo ""
fi

# Run the deployment script
./deploy.sh

echo ""
echo "📤 Pushing to GitHub..."

# Get commit message from user
read -p "Enter commit message: " COMMIT_MSG

# Default message if none provided
if [ -z "$COMMIT_MSG" ]; then
    COMMIT_MSG="Deploy: Update site"
fi

# Commit and push
git add -A
git commit -m "$COMMIT_MSG"
git push

echo ""
echo "✅ Deployment complete!"
echo "🌐 Your site will be live at https://andreas.technology in a few minutes"
