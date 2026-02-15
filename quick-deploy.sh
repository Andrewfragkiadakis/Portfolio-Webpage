#!/bin/bash

# Quick deployment script (no prompts)
# For when you want to deploy immediately

set -e

COMMIT_MSG="${1:-Deploy: Update site}"

echo "🚀 Quick deploying with message: $COMMIT_MSG"
echo ""

./deploy.sh

git add -A
git commit -m "$COMMIT_MSG"
git push

echo ""
echo "✅ Deployed!"
echo "🌐 Live at: https://andreas.technology"
