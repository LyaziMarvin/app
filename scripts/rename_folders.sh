#!/bin/bash
# One-time script to rename frontend folders without spaces
# Run this ONCE on the server before deploying

echo "📁 Renaming frontend folders to remove spaces..."

cd /var/www/app

# Rename folders
if [ -d "frontend" ]; then
    mv "frontend" "worker-frontend"
    echo "✅ Renamed: frontend → worker-frontend"
fi

if [ -d "frontend 1" ]; then
    mv "frontend 1" "patient-frontend"
    echo "✅ Renamed: frontend 1 → patient-frontend"
fi

if [ -d "frontend 2" ]; then
    mv "frontend 2" "admin-frontend"
    echo "✅ Renamed: frontend 2 → admin-frontend"
fi

echo ""
echo "📋 Current folder structure:"
ls -1d *-frontend 2>/dev/null || echo "No frontend folders found"

echo ""
echo "✅ Folder renaming complete!"
echo "Next steps:"
echo "  1. git add ."
echo "  2. git commit -m 'Rename folders to remove spaces'"
echo "  3. git push origin master"
echo "  4. ./scripts/deploy_app.sh"
