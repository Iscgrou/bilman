# VPN Management System

A complete VPN sales and management system with representative management, invoicing, and payment tracking.

## Quick Installation

To install the complete system on a fresh Ubuntu 22.04 server, run:

```bash
curl -sSL https://raw.githubusercontent.com/Iscgrou/billi/master/install.sh | sudo bash
```

This will:
- Update your system
- Install all dependencies
- Set up SSL certificates
- Configure the system
- Create admin user

## Manual Installation

### Production Installation

If you prefer to install in production manually, follow these steps:

1. Clone the repository:
```bash
git clone https://github.com/Iscgrou/billi.git /opt/vpn-manager
cd /opt/vpn-manager
```

2. Run the installation script:
```bash
sudo ./scripts/install.sh
```

### Development Setup

For local development:

1. Clone the repository:
```bash
git clone https://github.com/Iscgrou/billi.git
cd billi
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. Open your browser and navigate to:
```
http://localhost:3000
```

#### Development Login Credentials

For testing purposes, you can use these credentials:

- Admin User:
  - Username: admin
  - Password: admin123

- Operator User:
  - Username: operator
  - Password: operator123

## System Updates

To update the system:
```bash
sudo /opt/vpn-manager/scripts/update.sh
```

## Backups

To create a backup:
```bash
sudo /opt/vpn-manager/scripts/backup.sh
```

Backups are stored in `/opt/vpn-manager/backups` and are automatically created daily at 2 AM.

## Features

- Representative management
- Invoice generation and tracking
- Payment processing
- Telegram bot integration
- Multi-language support (Persian/English)
- Automated backups
- SSL encryption
- Docker containerization

## Requirements

- Ubuntu 22.04 LTS
- Domain name pointing to your server
- Open ports: 22 (SSH), 80 (HTTP), 443 (HTTPS)

## Security

- All traffic is encrypted with SSL
- Regular security updates
- Automated backups
- Role-based access control
- Secure password storage

## Support

For issues and feature requests, please create an issue in the repository.
