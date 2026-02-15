#!/bin/bash

# Backup script for portfolio site
# Creates a timestamped backup of the current deployment

set -e

BACKUP_DIR="../backups"
TIMESTAMP=$(date +"%Y%m%d-%H%M%S")
BACKUP_NAME="portfolio-backup-$TIMESTAMP"
BACKUP_PATH="$BACKUP_DIR/$BACKUP_NAME"

echo "📦 Creating backup..."

# Create backups directory if it doesn't exist
mkdir -p "$BACKUP_DIR"

# Create backup directory
mkdir -p "$BACKUP_PATH"

echo "📋 Copying deployed files..."
# Copy only the deployed files (not source code)
cp -r _next "$BACKUP_PATH/" 2>/dev/null || true
cp -r images "$BACKUP_PATH/" 2>/dev/null || true
cp -r favicons "$BACKUP_PATH/" 2>/dev/null || true
cp *.html "$BACKUP_PATH/" 2>/dev/null || true
cp CNAME "$BACKUP_PATH/" 2>/dev/null || true
cp README.md "$BACKUP_PATH/" 2>/dev/null || true

echo "✅ Backup created at: $BACKUP_PATH"
echo ""
echo "To restore this backup:"
echo "  cp -r $BACKUP_PATH/* ."
