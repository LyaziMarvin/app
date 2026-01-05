# Quick Reference Deployment Commands

## First-Time Setup on Server

```bash
cd /var/www
sudo git clone https://github.com/LyaziMarvin/app.git
sudo chown -R $USER:$USER /var/www/app
cd /var/www/app
chmod +x scripts/deploy_app.sh

# Edit environment files
nano backend/.env
nano frontend/.env.production
nano "frontend 1/.env.production"
nano "frontend 2/.env.production"

# Setup nginx
sudo cp nginx/app.conf /etc/nginx/sites-available/app
sudo nano /etc/nginx/sites-available/app  # Replace yourdomain.com
sudo ln -s /etc/nginx/sites-available/app /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx

# Initial deployment
./scripts/deploy_app.sh
```

## Deploy Updates

```bash
cd /var/www/app
./scripts/deploy_app.sh
```

## PM2 Commands

```bash
pm2 list                    # View all processes
pm2 logs                    # View all logs
pm2 logs healthcare-backend # View backend logs
pm2 restart all             # Restart all processes
pm2 save                    # Save current process list
```

## Service URLs

- Worker Portal: <http://yourdomain.com:3007> or /worker
- Patient Portal: <http://yourdomain.com:3008> or /patient
- Admin Portal: <http://yourdomain.com:3010> or /admin
- Backend API: <http://yourdomain.com:5003>

## Troubleshooting

```bash
# Check process status
pm2 status

# Check ports
sudo netstat -tulpn | grep -E '3007|3008|3010|5003'

# Check nginx logs
sudo tail -f /var/log/nginx/error.log

# Restart nginx
sudo systemctl restart nginx

# Rebuild specific frontend
cd /var/www/app/frontend
npm run build
pm2 restart worker-portal
```
