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
# Install Node.js 18.x (recommended for Next.js 13+)
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# Verify installation (should show v18.x.x)
node --version
npm --version

# Install required global packages
sudo npm install -g pm2 yarn
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

1. **Switch to postgres user**
```bash
# Switch to postgres user
sudo su - postgres

# Now you're in postgres user shell
```

2. **Create Database and User**
```bash
# Start PostgreSQL command prompt
psql

# Once you see 'postgres=#', run these commands one by one:

# Create database
CREATE DATABASE bilman;

# Create user and set password (replace with your actual password)
CREATE USER bilman_user WITH ENCRYPTED PASSWORD 'your_secure_password';

# Grant privileges
GRANT ALL PRIVILEGES ON DATABASE bilman TO bilman_user;

# Connect to the bilman database
\c bilman

# Grant schema privileges to the user
GRANT ALL ON SCHEMA public TO bilman_user;

# Verify the user and database
\du  # List users
\l   # List databases

# Exit PostgreSQL
\q

# Exit postgres user shell
exit
```

3. **Test Database Connection**
```bash
# Test connection with the new user
psql -U bilman_user -h localhost -d bilman
# Enter your password when prompted
```

## Project Installation

1. **Prepare Installation Directory**
```bash
# Create www directory if it doesn't exist
sudo mkdir -p /var/www

# Set proper permissions
sudo chown -R $USER:$USER /var/www
sudo chmod -R 755 /var/www

# Navigate to directory
cd /var/www

# Clone the repository
git clone https://github.com/Iscgrou/bilman.git

# Navigate to project directory
cd bilman

# Install dependencies (using yarn for better dependency resolution)
yarn install
```

2. **Environment Configuration**
```bash
# Create and edit .env file
nano .env
```

Add the following configuration to your `.env` file (replace the values with your actual configuration):
```env
# Database configuration
DATABASE_URL="postgresql://bilman_user:your_actual_password@localhost:5432/bilman"

# JWT configuration (generate a secure random string)
JWT_SECRET="generate-a-secure-random-string-here"

# Application configuration
NODE_ENV="production"
PORT=3000

# Optional: Additional security settings
NEXTAUTH_URL="https://your-domain.com"  # Replace with your domain
NEXTAUTH_SECRET="generate-another-secure-random-string"  # For NextAuth.js
```

To generate secure random strings for secrets:
```bash
# Generate random string for JWT_SECRET
openssl rand -base64 32

# Generate random string for NEXTAUTH_SECRET
openssl rand -base64 32
```

4. **Database Setup**
```bash
# Install TypeScript dependencies for Prisma
yarn add --dev typescript ts-node @types/node

# Generate Prisma client
npx prisma generate

# Run database migrations
npx prisma migrate deploy
```

5. **Database Seeding**
First, create the seed file:
```bash
# Create prisma directory if it doesn't exist
mkdir -p prisma

# Create seed file
cat > prisma/seed.ts << EOL
import { PrismaClient } from '@prisma/client'
import { hash } from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  // Create default admin user with hashed password
  const hashedPassword = await hash('admin123', 12)
  
  const admin = await prisma.user.upsert({
    where: { username: 'admin' },
    update: {},
    create: {
      username: 'admin',
      password: hashedPassword,
      role: 'ADMIN',
    },
  })

  console.log('Created admin user:', admin.username)
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
EOL
```

Then, update package.json to add the seed configuration:
```bash
# Backup existing package.json
cp package.json package.json.backup

# Add prisma seed configuration
sed -i '/"dependencies": {/i\  "prisma": {\n    "seed": "ts-node prisma/seed.ts"\n  },' package.json

# Install bcryptjs and its types
yarn add bcryptjs
yarn add --dev @types/bcryptjs

# Now run the seed command
npx prisma db seed
```

6. **Build Application**
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
