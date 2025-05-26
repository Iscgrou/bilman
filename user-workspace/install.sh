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
   error "Please run: sudo curl -sSL https://raw.githubusercontent.com/Iscgrou/billi/main/scripts/quick-install.sh | sudo bash"
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

# Get domain name
read -p "Enter your domain name (e.g., vpn.example.com): " DOMAIN_NAME
if [ -z "$DOMAIN_NAME" ]; then
    error "Domain name is required"
    exit 1
fi

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
apt-get install -y curl git

# Create installation directory
log "Creating installation directory..."
mkdir -p "$INSTALL_DIR"
cd "$INSTALL_DIR"

# Clone repository
log "Cloning repository..."
git clone https://github.com/Iscgrou/billi.git .

# Make scripts executable
chmod +x scripts/*.sh

# Store credentials temporarily
cat > .env.tmp << EOL
DOMAIN=${DOMAIN_NAME}
ADMIN_USER=${ADMIN_USER}
ADMIN_PASS=${ADMIN_PASS}
EOL

# Run main installation script
log "Starting main installation..."
./scripts/install.sh

# Cleanup
rm -f .env.tmp

log "Quick installation completed!"
log "Your VPN Management System is now available at: https://${DOMAIN_NAME}"
log "Admin username: ${ADMIN_USER}"
warning "Please make sure to:"
warning "1. Configure your domain's DNS to point to this server"
warning "2. Keep your admin credentials safe"
warning "3. Regularly update your system using: sudo ${INSTALL_DIR}/scripts/update.sh"
