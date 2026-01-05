# Healthcare App Deployment Guide

## Architecture Overview

This application consists of:

- **Backend API** (Node.js/Express) - Port 5003
- **Worker Portal** (React) - Port 3007
- **Patient Portal** (React) - Port 3008  
- **Admin Portal** (React) - Port 3009

## Pre-Deployment Setup (One-time)

### 1. Server Requirements

- Ubuntu/Debian server
- Node.js 16+ and npm
- Nginx
- PM2
- Git

### 2. Install Dependencies on Server

```bash
# Update system
sudo apt update && sudo apt upgrade -y

# Install Node.js (if not already installed)
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt install -y nodejs

# Install PM2 and http-server globally
sudo npm install -g pm2 http-server

# Install Nginx
sudo apt install -y nginx

# Clone repository
cd /var/www
sudo git clone https://github.com/LyaziMarvin/app.git
sudo chown -R $USER:$USER /var/www/app
```

### 3. Configure Environment Variables

Edit the `.env` files and replace placeholders:

**backend/.env:**

- Set a strong `JWT_SECRET` (generate with: `node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"`)
- Update `NEO4J_*` credentials if needed
- Update `CORS_ORIGINS` with your domain

**frontend/.env.production:**
**frontend 1/.env.production:**
**frontend 2/.env.production:**

- Replace `yourdomain.com` with your actual domain or server IP

### 4. Configure Nginx

```bash
# Copy nginx config
sudo cp /var/www/app/nginx/app.conf /etc/nginx/sites-available/app

# Edit the config and replace 'yourdomain.com' with your domain
sudo nano /etc/nginx/sites-available/app

# Enable the site
sudo ln -s /etc/nginx/sites-available/app /etc/nginx/sites-enabled/

# Test nginx configuration
sudo nginx -t

# If test passes, reload nginx
sudo systemctl reload nginx
```

### 5. Configure Firewall

```bash
# Allow HTTP, HTTPS, and application ports
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp
sudo ufw allow 5003/tcp
sudo ufw allow 3007/tcp
sudo ufw allow 3008/tcp
sudo ufw allow 3009/tcp

# Enable firewall (if not already enabled)
sudo ufw enable
```

### 6. Make Deployment Script Executable

```bash
cd /var/www/app
chmod +x scripts/deploy_app.sh
```

## Deployment

### Initial Deployment

```bash
cd /var/www/app
./scripts/deploy_app.sh
```

This script will:

1. Pull latest code from GitHub
2. Install dependencies for all apps
3. Build all 3 React frontends
4. Start/restart all PM2 processes
5. Restart Nginx

### Subsequent Deployments

Simply run the deployment script again:

```bash
cd /var/www/app
./scripts/deploy_app.sh
```

## PM2 Process Management

### View All Processes

```bash
pm2 list
```

### View Logs

```bash
# All processes
pm2 logs

# Specific process
pm2 logs healthcare-backend
pm2 logs worker-portal
pm2 logs patient-portal
pm2 logs admin-portal
```

### Restart Individual Services

```bash
pm2 restart healthcare-backend
pm2 restart worker-portal
pm2 restart patient-portal
pm2 restart admin-portal
```

### Stop Services

```bash
pm2 stop healthcare-backend
pm2 stop worker-portal
pm2 stop patient-portal
pm2 stop admin-portal
```

### Enable PM2 Startup on Reboot

```bash
pm2 startup
pm2 save
```

## Access URLs

After deployment, access the application:

- **Worker Portal**: <http://yourdomain.com/worker> or <http://yourdomain.com:3007>
- **Patient Portal**: <http://yourdomain.com/patient> or <http://yourdomain.com:3008>
- **Admin Portal**: <http://yourdomain.com/admin> or <http://yourdomain.com:3009>
- **API**: <http://yourdomain.com/api> or <http://yourdomain.com:5003>

## SSL Certificate (Recommended for Production)

Install Let's Encrypt SSL certificate:

```bash
# Install certbot
sudo apt install -y certbot python3-certbot-nginx

# Obtain certificate
sudo certbot --nginx -d yourdomain.com

# Auto-renewal is set up automatically
# Test renewal
sudo certbot renew --dry-run
```

After obtaining SSL, uncomment the SSL section in `/etc/nginx/sites-available/app` and reload nginx.

## Troubleshooting

### Check Service Status

```bash
pm2 status
sudo systemctl status nginx
```

### Check Port Usage

```bash
sudo netstat -tulpn | grep -E '3007|3008|3009|5003'
```

### View Nginx Logs

```bash
sudo tail -f /var/log/nginx/error.log
sudo tail -f /var/log/nginx/access.log
```

### Rebuild Individual Frontend

```bash
cd /var/www/app/frontend  # or "frontend 1" or "frontend 2"
npm run build
pm2 restart worker-portal  # or patient-portal or admin-portal
```

### Backend Issues

Check if Neo4j database is accessible:

```bash
# From backend directory
cd /var/www/app/backend
node -e "const neo4j = require('neo4j-driver'); const driver = neo4j.driver('neo4j://184.168.29.119:7687', neo4j.auth.basic('neo4j', 'ooglobeneo4j')); driver.verifyConnectivity().then(() => console.log('✅ Connected')).catch(e => console.log('❌ Error:', e.message)); setTimeout(() => process.exit(), 2000);"
```

## Monitoring

### Setup PM2 Monitoring Dashboard

```bash
pm2 install pm2-server-monit
```

### View Real-time Monitoring

```bash
pm2 monit
```

## Backup Strategy

Regular backups recommended for:

1. Neo4j database
2. Environment files
3. User-uploaded content (if any)

## Security Checklist

- [ ] Changed default `JWT_SECRET` in backend/.env
- [ ] Configured proper `CORS_ORIGINS`
- [ ] Enabled SSL/HTTPS
- [ ] Firewall configured
- [ ] Neo4j database secured (not publicly exposed)
- [ ] Regular security updates: `sudo apt update && sudo apt upgrade`

## Update Application Code

```bash
# Make changes locally, commit and push to GitHub
git add .
git commit -m "Your changes"
git push origin master

# On server, run deployment script
cd /var/www/app
./scripts/deploy_app.sh
```
