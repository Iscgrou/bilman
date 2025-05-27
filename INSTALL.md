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
EOL

# Install dependencies
sudo npm install

# Build the application
sudo npm run build
```

### 5. Docker Setup

```bash
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
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
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
# Check service status
sudo systemctl status vpn-manager

# Check Docker containers
sudo docker ps

# Check application logs
sudo journalctl -u vpn-manager -f

# Check Nginx status
sudo systemctl status nginx
```

## Troubleshooting

If you encounter issues:

1. Check application logs:
```bash
sudo journalctl -u vpn-manager -f
sudo docker-compose logs -f
```

2. Verify ports are open:
```bash
sudo netstat -tulpn | grep '3000\|80\|443'
```

3. Check Nginx configuration:
```bash
sudo nginx -t
sudo tail -f /var/log/nginx/error.log
```

4. Restart services:
```bash
sudo systemctl restart vpn-manager
sudo systemctl restart nginx
sudo docker-compose restart
```

5. Clean installation:
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

After completing all steps, your VPN Management System will be accessible at https://shire.marfanet.com
