#!/bin/bash
# Production Server Deployment Script
# Deploys 1 backend + 3 frontends (Worker, Patient, Admin portals)

echo "🔄 Starting deployment process..."

cd /var/www/app

# ── FORCE-CLEAN ANY LOCAL MODS ──────────────────────────────────
git reset --hard HEAD
git clean -fd

echo "📂 Pulling latest code from master branch..."
git fetch origin
git checkout master
git reset --hard origin/master
git clean -fd

echo "✅ Pulled latest code from master branch."
git status

# ===== Backend Deployment =====
echo "🚀 Deploying Backend..."
cd backend
echo "🧹 Cleaning and reinstalling backend dependencies..."
rm -rf node_modules package-lock.json
npm install

echo "🔁 Restarting backend PM2 service..."
pm2 stop healthcare-backend || true
pm2 restart healthcare-backend || pm2 start server.js --name healthcare-backend
pm2 save

# ===== Frontend (Worker Portal) Deployment =====
echo "🚀 Deploying Worker Portal (Frontend)..."
cd /var/www/app/frontend
echo "🧹 Cleaning and reinstalling frontend dependencies..."
rm -rf node_modules package-lock.json
npm install

echo "🏗️ Building Worker Portal for production..."
npm run build

echo "🔁 Restarting Worker Portal service via PM2..."
pm2 stop worker-portal || true
pm2 delete worker-portal || true

# Ensure 'http-server' is available
if ! command -v http-server &> /dev/null; then
    echo "🔧 Installing 'http-server' globally..."
    npm install -g http-server
fi

if [ -d "build" ]; then
    pm2 start http-server --name worker-portal -- build -p 3007 -a 0.0.0.0
else
    echo "❌ Error: Worker Portal build directory not found!"
    exit 1
fi

# ===== Frontend 1 (Patient Portal) Deployment =====
echo "🚀 Deploying Patient Portal (Frontend 1)..."
cd "/var/www/app/frontend 1"
echo "🧹 Cleaning and reinstalling frontend dependencies..."
rm -rf node_modules package-lock.json
npm install

echo "🏗️ Building Patient Portal for production..."
npm run build

echo "🔁 Restarting Patient Portal service via PM2..."
pm2 stop patient-portal || true
pm2 delete patient-portal || true

if [ -d "build" ]; then
    pm2 start http-server --name patient-portal -- build -p 3008 -a 0.0.0.0
else
    echo "❌ Error: Patient Portal build directory not found!"
    exit 1
fi

# ===== Frontend 2 (Admin Portal) Deployment =====
echo "🚀 Deploying Admin Portal (Frontend 2)..."
cd "/var/www/app/frontend 2"
echo "🧹 Cleaning and reinstalling frontend dependencies..."
rm -rf node_modules package-lock.json
npm install

echo "🏗️ Building Admin Portal for production..."
npm run build

echo "🔁 Restarting Admin Portal service via PM2..."
pm2 stop admin-portal || true
pm2 delete admin-portal || true

if [ -d "build" ]; then
    pm2 start http-server --name admin-portal -- build -p 3010 -a 0.0.0.0
else
    echo "❌ Error: Admin Portal build directory not found!"
    exit 1
fi

# ===== Finalize =====
pm2 save
pm2 list

# Restart nginx
echo "🔁 Restarting Nginx..."
sudo systemctl restart nginx
echo "✅ Nginx restarted successfully"

echo "✅ Deployment completed successfully!"
echo ""
echo "📊 Services running:"
echo "  - Backend API: Port 5003"
echo "  - Worker Portal: Port 3007"
echo "  - Patient Portal: Port 3008"
echo "  - Admin Portal: Port 3010"
