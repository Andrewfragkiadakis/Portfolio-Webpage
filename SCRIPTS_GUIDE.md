# Automation Scripts Guide

This repository includes several automation scripts to streamline your workflow.

## Available Scripts

### 🚀 `dev.sh` - Start Development Server
Starts the Next.js development server.

```bash
./dev.sh
```

Opens at: `http://localhost:3000`

---

### 📦 `backup.sh` - Create Backup
Creates a timestamped backup of the current deployed site.

```bash
./backup.sh
```

Backups are stored in: `../.backups/portfolio-backup-YYYYMMDD-HHMMSS/`

---

### 🛠️ `deploy.sh` - Build & Prepare Deployment
Builds the site and copies files to root (excludes metadata).

```bash
./deploy.sh
```

After running, you still need to commit and push manually.

---

### 🚢 `auto-deploy.sh` - Full Automated Deployment
Builds, deploys, and pushes to GitHub (with prompts).

```bash
./auto-deploy.sh
```

This will:
1. Ask if you want to create a backup
2. Build and deploy the site
3. Prompt for a commit message
4. Push to GitHub

---

### ⚡ `quick-deploy.sh` - Fast Deployment
Deploys immediately without prompts.

```bash
./quick-deploy.sh "Your commit message"
```

Or use the default message:

```bash
./quick-deploy.sh
```

## Recommended Workflows

### Daily Development
```bash
./dev.sh
# Make changes...
# Test locally
```

### Deploying Changes
```bash
./auto-deploy.sh
# OR for quick fixes:
./quick-deploy.sh "Fix typo"
```

### Before Major Changes
```bash
./backup.sh
# Then make changes and deploy
```

## Notes

- All scripts are executable (`chmod +x` already applied)
- Backups are stored **outside** the repository
- `.gitignore` prevents metadata files from being committed
- Scripts use `set -e` to exit on errors
