#!/bin/bash

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Log function
log() {
    echo -e "${GREEN}[$(date +'%Y-%m-%d %H:%M:%S')] $1${NC}"
}

error() {
    echo -e "${RED}[$(date +'%Y-%m-%d %H:%M:%S')] ERROR: $1${NC}"
}

warning() {
    echo -e "${YELLOW}[$(date +'%Y-%m-%d %H:%M:%S')] WARNING: $1${NC}"
}

# Check if running as root
if [[ $EUID -ne 0 ]]; then
   error "This script must be run as root"
   error "Please run: sudo curl -sSL https://raw.githubusercontent.com/Iscgrou/billi/main/install.sh | sudo bash -s your-domain.com"
   exit 1
fi

# Get domain name from command line argument
DOMAIN_NAME=$1
if [ -z "$DOMAIN_NAME" ]; then
    error "Domain name is required"
    error "Usage: sudo bash install.sh your-domain.com"
    exit 1
fi

# Get installation directory
INSTALL_DIR="/opt/vpn-manager"

# Welcome message
clear
echo "================================================"
echo "   VPN Management System - Quick Installation"
echo "================================================"
echo

# Get admin credentials
read -p "Enter admin username: " ADMIN_USER
read -s -p "Enter admin password: " ADMIN_PASS
echo
read -s -p "Confirm admin password: " ADMIN_PASS_CONFIRM
echo

if [ "$ADMIN_PASS" != "$ADMIN_PASS_CONFIRM" ]; then
    error "Passwords do not match"
    exit 1
fi

# Initial system update
log "Updating system packages..."
apt-get update && apt-get upgrade -y

# Install basic requirements
log "Installing basic requirements..."
apt-get install -y curl git apt-transport-https ca-certificates gnupg lsb-release nginx certbot python3-certbot-nginx ufw

# Install Node.js
log "Installing Node.js..."
curl -fsSL https://deb.nodesource.com/setup_18.x | bash -
apt-get install -y nodejs

# Install Docker
log "Installing Docker..."
curl -fsSL https://get.docker.com -o get-docker.sh && sh get-docker.sh && rm get-docker.sh
curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
chmod +x /usr/local/bin/docker-compose

# Configure firewall
log "Configuring firewall..."
ufw allow 22 && ufw allow 80 && ufw allow 443 && ufw --force enable

# Create installation directory
log "Creating installation directory..."
mkdir -p "$INSTALL_DIR"
cd "$INSTALL_DIR"

# Clone repository
log "Cloning repository..."
git clone https://github.com/Iscgrou/billi.git .
chmod +x scripts/*.sh

# Store credentials
log "Configuring environment..."
cat > .env << EOL
DOMAIN=${DOMAIN_NAME}
ADMIN_USER=${ADMIN_USER}
ADMIN_PASS=$(echo -n ${ADMIN_PASS} | sha256sum | cut -d' ' -f1)
NODE_ENV=production
EOL

# Install dependencies
log "Installing dependencies..."
npm install

# Build application
log "Building application..."
npm run build

# Start Docker containers
log "Starting Docker containers..."
docker-compose up -d

# Configure Nginx
log "Configuring Nginx..."
cat > /etc/nginx/sites-available/${DOMAIN_NAME} << EOL
server {
    listen 80;
    server_name ${DOMAIN_NAME};
    
    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade \$http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host \$host;
        proxy_cache_bypass \$http_upgrade;
    }
}
EOL

ln -s /etc/nginx/sites-available/${DOMAIN_NAME} /etc/nginx/sites-enabled/
rm -f /etc/nginx/sites-enabled/default
nginx -t && systemctl restart nginx

# Setup SSL
log "Setting up SSL..."
certbot --nginx -d ${DOMAIN_NAME} --non-interactive --agree-tos --email admin@${DOMAIN_NAME} --redirect

# Create systemd service
log "Creating systemd service..."
cat > /etc/systemd/system/vpn-manager.service << EOL
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

systemctl daemon-reload
systemctl enable vpn-manager
systemctl start vpn-manager

# Setup daily backups
log "Setting up daily backups..."
(crontab -l 2>/dev/null; echo "0 2 * * * /opt/vpn-manager/scripts/backup.sh") | crontab -

log "Installation completed!"
log "Your VPN Management System is now available at: https://${DOMAIN_NAME}"
log "Admin username: ${ADMIN_USER}"
warning "Please make sure to:"
warning "1. Configure your domain's DNS to point to this server"
warning "2. Keep your admin credentials safe"
warning "3. Regularly update using: sudo ${INSTALL_DIR}/scripts/update.sh"
