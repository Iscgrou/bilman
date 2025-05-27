# Complete Manual Installation Guide

## Prerequisites
- Ubuntu/Debian server
- Domain name pointing to your server
- Root access
- Basic Linux knowledge

## Installation Steps

### 1. Initial Setup

```bash
# Create installation directory and clone repository
sudo rm -rf /opt/vpn-manager
sudo git clone https://github.com/Iscgrou/bilman.git /opt/vpn-manager
cd /opt/vpn-manager
```

### 2. System Requirements

```bash
# Update system packages
sudo apt-get update && sudo apt-get upgrade -y

# Install required packages
sudo apt-get install -y curl git apt-transport-https ca-certificates gnupg lsb-release nginx certbot python3-certbot-nginx ufw

# Install Node.js 18
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo bash -
sudo apt-get install -y nodejs

# Install Docker and Docker Compose
curl -fsSL https://get.docker.com -o get-docker.sh && sudo sh get-docker.sh && rm get-docker.sh
sudo curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose
```

### 3. Configure Firewall

```bash
# Allow necessary ports
sudo ufw allow 22
sudo ufw allow 80
sudo ufw allow 443
sudo ufw allow 3000
sudo ufw --force enable
sudo ufw reload
```

### 4. Application Setup

```bash
# Set proper permissions
cd /opt/vpn-manager
sudo chown -R root:root .

# Create environment file
sudo tee .env << EOL
DOMAIN=shire.marfanet.com
NODE_ENV=production
PORT=3000
EOL

# Clean installation
sudo rm -rf .next node_modules package-lock.json

# Install dependencies with legacy peer deps to avoid conflicts
sudo npm install --legacy-peer-deps

# Build the application
sudo npm run build
```

### 5. Docker Setup

```bash
# Create Docker Compose file
sudo tee docker-compose.yml << EOL
services:
  app:
    build: .
    ports:
      - "3000:3000"
    environment:
      - NODE_ENV=production
      - PORT=3000
    volumes:
      - .:/app
    restart: always
EOL

# Create Dockerfile
sudo tee Dockerfile << EOL
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install --legacy-peer-deps

COPY . .
RUN npm run build

EXPOSE 3000

CMD ["npm", "start"]
EOL

# Stop any existing containers
sudo docker-compose down

# Build and start Docker containers
sudo docker-compose build --no-cache
sudo docker-compose up -d

# Verify containers are running
sudo docker ps
```

### 6. Configure Nginx

```bash
# Create Nginx configuration
sudo tee /etc/nginx/sites-available/shire.marfanet.com << EOL
server {
    listen 80;
    server_name shire.marfanet.com;
    
    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade \$http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_cache_bypass \$http_upgrade;
    }
}
EOL

# Enable site configuration
sudo ln -sf /etc/nginx/sites-available/shire.marfanet.com /etc/nginx/sites-enabled/
sudo rm -f /etc/nginx/sites-enabled/default
sudo nginx -t && sudo systemctl restart nginx
```

### 7. SSL Configuration

```bash
# Setup SSL with Certbot
sudo certbot --nginx -d shire.marfanet.com --non-interactive --agree-tos --email admin@shire.marfanet.com --redirect
```

### 8. Service Configuration

```bash
# Create systemd service
sudo tee /etc/systemd/system/vpn-manager.service << EOL
[Unit]
Description=VPN Manager
After=network.target

[Service]
Type=simple
User=root
WorkingDirectory=/opt/vpn-manager
ExecStart=/usr/bin/npm start
Restart=always
Environment=NODE_ENV=production
Environment=PORT=3000

[Install]
WantedBy=multi-user.target
EOL

# Enable and start service
sudo systemctl daemon-reload
sudo systemctl enable vpn-manager
sudo systemctl start vpn-manager
```

### 9. Verify Installation

```bash
# Check all services
sudo systemctl status vpn-manager
sudo systemctl status nginx
sudo docker ps
sudo netstat -tulpn | grep '3000\|80\|443'

# View logs
sudo journalctl -u vpn-manager -f
sudo docker-compose logs -f
sudo tail -f /var/log/nginx/error.log
```

## Troubleshooting

### 1. Next.js Build Issues
If you encounter Next.js build errors:
```bash
# Clean installation and node_modules
cd /opt/vpn-manager
sudo rm -rf .next node_modules package-lock.json
sudo npm install --legacy-peer-deps
sudo npm run build
```

### 2. Docker Issues
If Docker containers fail to start:
```bash
# Check Docker logs
sudo docker-compose logs -f

# Rebuild containers
sudo docker-compose down
sudo docker system prune -af
sudo docker-compose build --no-cache
sudo docker-compose up -d
```

### 3. Nginx Issues
If Nginx shows configuration errors:
```bash
# Test configuration
sudo nginx -t

# Check logs
sudo tail -f /var/log/nginx/error.log
```

### 4. Port Issues
If ports are already in use:
```bash
# Check ports
sudo netstat -tulpn | grep '3000\|80\|443'

# Kill process using port (replace PORT with actual port number)
sudo kill -9 $(sudo lsof -t -i:PORT)
```

### 5. Clean Reinstall
If you need to start fresh:
```bash
# Stop all services
sudo systemctl stop vpn-manager
sudo docker-compose down
sudo systemctl stop nginx

# Remove existing files
sudo rm -rf /opt/vpn-manager

# Start fresh installation from step 1
```

## Important Notes
- Ensure your domain DNS (shire.marfanet.com) points to your server's IP address
- Keep your credentials and environment variables secure
- The application runs on port 3000 by default
- Nginx proxies requests from port 80/443 to the application
- Docker containers should be running alongside the Node.js application
- Always use --legacy-peer-deps when installing npm packages to avoid dependency conflicts
- The application uses Next.js 13 App Router (not pages)

After completing all steps, your VPN Management System will be accessible at https://shire.marfanet.com
