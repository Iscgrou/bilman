# Manual Installation Steps

## Prerequisites
- Domain name pointing to your server
- Root access to the server
- Basic Linux knowledge

## Installation Steps

1. Clone the repository:
```bash
git clone https://github.com/Iscgrou/bilman.git /opt/vpn-manager
cd /opt/vpn-manager
```

2. System Requirements Installation:
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

3. Configure Firewall:
```bash
sudo ufw allow 22
sudo ufw allow 80
sudo ufw allow 443
sudo ufw --force enable
```

4. Configure Environment:
```bash
# Create .env file
cat > .env << EOL
DOMAIN=shire.marfanet.com
NODE_ENV=production
EOL
```

5. Install Dependencies and Build:
```bash
npm install
npm run build
```

6. Start Docker Containers:
```bash
sudo docker-compose up -d
```

7. Configure Nginx:
```bash
# Create Nginx configuration
sudo tee /etc/nginx/sites-available/shire.marfanet.com > /dev/null << EOL
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
    }
}
EOL

# Enable site configuration
sudo ln -s /etc/nginx/sites-available/shire.marfanet.com /etc/nginx/sites-enabled/
sudo rm -f /etc/nginx/sites-enabled/default
sudo nginx -t && sudo systemctl restart nginx
```

8. Setup SSL with Certbot:
```bash
sudo certbot --nginx -d shire.marfanet.com --non-interactive --agree-tos --email admin@shire.marfanet.com --redirect
```

9. Create and Enable Systemd Service:
```bash
sudo tee /etc/systemd/system/vpn-manager.service > /dev/null << EOL
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

[Install]
WantedBy=multi-user.target
EOL

sudo systemctl daemon-reload
sudo systemctl enable vpn-manager
sudo systemctl start vpn-manager
```

10. Setup Daily Backups:
```bash
(sudo crontab -l 2>/dev/null; echo "0 2 * * * /opt/vpn-manager/scripts/backup.sh") | sudo crontab -
```

## Important Notes
- Ensure your domain DNS (shire.marfanet.com) points to your server's IP address
- Make sure ports 22, 80, and 443 are open on your server
- Keep your credentials and environment variables secure
- Regularly update the system using the update script: `sudo /opt/vpn-manager/scripts/update.sh`

After installation, your VPN Management System will be accessible at https://shire.marfanet.com
