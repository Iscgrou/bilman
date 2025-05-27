# Complete Step-by-Step Installation Guide

## System Requirements

1. **Operating System**
```bash
# Ubuntu 20.04 or later recommended
# Check OS version
lsb_release -a
```

2. **Node.js Installation**
```bash
# Install Node.js 16.x or later
curl -fsSL https://deb.nodesource.com/setup_16.x | sudo -E bash -
sudo apt-get install -y nodejs

# Verify installation
node --version
npm --version
```

3. **PostgreSQL Installation**
```bash
# Install PostgreSQL
sudo apt install postgresql postgresql-contrib

# Start PostgreSQL service
sudo systemctl start postgresql
sudo systemctl enable postgresql

# Verify installation
psql --version
```

## PostgreSQL Database Setup

1. **Create Database and User**
```bash
# Access PostgreSQL
sudo -u postgres psql

# Create database
CREATE DATABASE bilman;

# Create user and set password
CREATE USER bilman_user WITH ENCRYPTED PASSWORD 'your_secure_password';

# Grant privileges
GRANT ALL PRIVILEGES ON DATABASE bilman TO bilman_user;

# Exit PostgreSQL
\q
```

## Project Installation

1. **Clone Repository**
```bash
# Navigate to desired directory
cd /var/www

# Clone the repository
git clone https://github.com/Iscgrou/bilman.git

# Navigate to project directory
cd bilman
```

2. **Install Dependencies**
```bash
# Install project dependencies
npm install

# Install global dependencies
npm install -g pm2
```

3. **Environment Configuration**
```bash
# Create .env file
cp .env.example .env

# Edit .env file with your settings
nano .env
```

Add the following to your `.env` file:
```env
# Database configuration
DATABASE_URL="postgresql://bilman_user:your_secure_password@localhost:5432/bilman"

# JWT configuration
JWT_SECRET="your-secure-jwt-secret"

# Application configuration
NODE_ENV="production"
PORT=3000
```

4. **Database Migration**
```bash
# Generate Prisma client
npx prisma generate

# Run database migrations
npx prisma migrate deploy

# Seed the database (if needed)
npx prisma db seed
```

5. **Build Application**
```bash
# Build the application
npm run build

# Verify build
ls .next
```

## Production Deployment

1. **PM2 Setup**
```bash
# Create PM2 ecosystem file
cat > ecosystem.config.js << EOL
module.exports = {
  apps: [{
    name: 'bilman',
    script: 'npm',
    args: 'start',
    env: {
      NODE_ENV: 'production',
    },
  }],
};
EOL

# Start application with PM2
pm2 start ecosystem.config.js

# Save PM2 configuration
pm2 save

# Setup PM2 startup script
pm2 startup
```

2. **Nginx Configuration**
```bash
# Install Nginx
sudo apt install nginx

# Create Nginx configuration
sudo nano /etc/nginx/sites-available/bilman
```

Add the following configuration:
```nginx
server {
    listen 80;
    server_name your-domain.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

```bash
# Create symbolic link
sudo ln -s /etc/nginx/sites-available/bilman /etc/nginx/sites-enabled/

# Test Nginx configuration
sudo nginx -t

# Restart Nginx
sudo systemctl restart nginx
```

3. **SSL Configuration (Optional but Recommended)**
```bash
# Install Certbot
sudo apt install certbot python3-certbot-nginx

# Obtain SSL certificate
sudo certbot --nginx -d your-domain.com

# Verify auto-renewal
sudo certbot renew --dry-run
```

## Verification

1. **Check Application Status**
```bash
# Check PM2 status
pm2 status

# Check logs
pm2 logs bilman

# Check Nginx status
sudo systemctl status nginx
```

2. **Test Application**
- Visit `http://your-domain.com/login` (or https:// if SSL is configured)
- Default admin credentials (if seeded):
  - Username: admin
  - Password: admin123 (change immediately)

## Maintenance

1. **Updates**
```bash
# Stop application
pm2 stop bilman

# Pull latest changes
git pull origin main

# Install dependencies
npm install

# Run migrations
npx prisma migrate deploy

# Rebuild application
npm run build

# Restart application
pm2 restart bilman
```

2. **Backup**
```bash
# Backup database
pg_dump -U bilman_user bilman > backup.sql

# Backup .env and other configurations
cp .env .env.backup
```

## Troubleshooting

1. **Application Issues**
```bash
# Check logs
pm2 logs bilman

# Check Node.js processes
ps aux | grep node

# Check port usage
sudo lsof -i :3000
```

2. **Database Issues**
```bash
# Check PostgreSQL status
sudo systemctl status postgresql

# Check database connection
psql -U bilman_user -d bilman -h localhost
```

3. **Nginx Issues**
```bash
# Check error logs
sudo tail -f /var/log/nginx/error.log

# Check access logs
sudo tail -f /var/log/nginx/access.log
```

## Security Notes

1. **File Permissions**
```bash
# Set proper ownership
sudo chown -R www-data:www-data /var/www/bilman

# Set proper permissions
sudo chmod -R 755 /var/www/bilman
```

2. **Firewall Configuration**
```bash
# Allow necessary ports
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp
sudo ufw allow 22/tcp

# Enable firewall
sudo ufw enable
```

For additional support or issues:
1. Check the troubleshooting section
2. Review application logs
3. Visit: https://github.com/Iscgrou/bilman
4. Contact system administrator
