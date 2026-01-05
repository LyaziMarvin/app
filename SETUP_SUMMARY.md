# Deployment Strategy Summary

## ✅ What I've Set Up For You

Based on your existing deployment workflow, here's what's ready:

### 📁 Files Created

1. **scripts/deploy_app.sh** - Automated deployment script (like your `deploy_sledss.sh`)
   - Pulls latest code from git
   - Installs dependencies for all 4 apps
   - Builds 3 React frontends
   - Manages PM2 processes
   - Restarts Nginx

2. **Environment Files**
   - `backend/.env` - Backend configuration
   - `frontend/.env.production` - Worker Portal
   - `frontend 1/.env.production` - Patient Portal  
   - `frontend 2/.env.production` - Admin Portal

3. **nginx/app.conf** - Nginx configuration
   - Routes `/api` → Backend (port 5003)
   - Routes `/worker` → Worker Portal (port 3007)
   - Routes `/patient` → Patient Portal (port 3008)
   - Routes `/admin` → Admin Portal (port 3009)

4. **Documentation**
   - `DEPLOYMENT.md` - Full deployment guide
   - `QUICKSTART.md` - Quick reference commands

### 🔧 Code Updates Made

1. **backend/server.js**
   - ✅ Now uses environment variables (dotenv)
   - ✅ Configurable PORT, JWT_SECRET, Neo4j credentials
   - ✅ CORS configuration from env

2. **backend/package.json**
   - ✅ Added `"start": "node server.js"` script
   - ✅ Added `dotenv` dependency

## 🚀 Deployment Process (Same as Your Workflow)

### On Server (First Time)

```bash
# 1. Clone repo
cd /var/www
sudo git clone https://github.com/LyaziMarvin/app.git
sudo chown -R $USER:$USER /var/www/app

# 2. Edit environment files (replace yourdomain.com with your IP/domain)
cd /var/www/app
nano backend/.env                    # Set JWT_SECRET and CORS_ORIGINS
nano frontend/.env.production
nano "frontend 1/.env.production"
nano "frontend 2/.env.production"

# 3. Setup nginx
sudo cp nginx/app.conf /etc/nginx/sites-available/app
sudo nano /etc/nginx/sites-available/app  # Replace 'yourdomain.com'
sudo ln -s /etc/nginx/sites-available/app /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx

# 4. Make script executable
chmod +x scripts/deploy_app.sh

# 5. Deploy!
./scripts/deploy_app.sh
```

### Updates (Just Like Your sledss Deployment)

```bash
cd /var/www/app
./scripts/deploy_app.sh
```

## 📊 Services & Ports

| Service | Port | PM2 Name | Access URL |
|---------|------|----------|------------|
| Backend API | 5003 | healthcare-backend | <http://domain.com:5003> or /api |
| Worker Portal | 3007 | worker-portal | <http://domain.com:3007> or /worker |
| Patient Portal | 3008 | patient-portal | <http://domain.com:3008> or /patient |
| Admin Portal | 3009 | admin-portal | <http://domain.com:3009> or /admin |

## 🔐 Security Notes

**BEFORE deploying:**

1. Generate a strong JWT secret:

   ```bash
   node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
   ```

   Put this in `backend/.env` as `JWT_SECRET`

2. Update `backend/.env`:

   ```bash
   CORS_ORIGINS=http://184.168.29.119:3007,http://184.168.29.119:3008,http://184.168.29.119:3009
   ```

3. Update all `.env.production` files:
   - Replace `yourdomain.com` with your server IP (e.g., `184.168.29.119`)

## 🎯 Key Differences from Your sledss Project

| sledss | This App |
|--------|----------|
| 1 frontend + 1 backend | 3 frontends + 1 backend |
| 1 PM2 process for frontend | 3 PM2 processes (one per frontend) |
| Uses `http-server` ✅ | Same! Uses `http-server` ✅ |
| git pull → build → PM2 restart ✅ | Same workflow! ✅ |
| Single port (3000) | Multiple ports (3007, 3008, 3009) |

## 📝 Next Steps

1. **Commit these files to your repo:**

   ```bash
   git add .
   git commit -m "Add deployment configuration"
   git push origin master
   ```

2. **On your server (184.168.29.119), run:**

   ```bash
   cd /var/www
   sudo git clone https://github.com/LyaziMarvin/app.git
   sudo chown -R ooglobe:ooglobe /var/www/app  # Use your username
   cd /var/www/app
   
   # Edit environment files
   nano backend/.env
   nano frontend/.env.production
   nano "frontend 1/.env.production"  
   nano "frontend 2/.env.production"
   
   # Setup nginx
   sudo cp nginx/app.conf /etc/nginx/sites-available/app
   sudo nano /etc/nginx/sites-available/app
   sudo ln -s /etc/nginx/sites-available/app /etc/nginx/sites-enabled/
   sudo nginx -t
   sudo systemctl reload nginx
   
   # Deploy
   chmod +x scripts/deploy_app.sh
   ./scripts/deploy_app.sh
   ```

3. **Access your apps:**
   - Worker: <http://184.168.29.119:3007>
   - Patient: <http://184.168.29.119:3008>
   - Admin: <http://184.168.29.119:3009>

That's it! Same process you're already familiar with, just scaled for multiple frontends. 🎉
