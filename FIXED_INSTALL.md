# Fixed Installation Steps

1. Create installation directory:
```bash
sudo mkdir -p /opt/vpn-manager
```

2. Download and extract the project:
```bash
# Download the project files
curl -L https://github.com/Iscgrou/bilman/archive/refs/heads/main.tar.gz -o /tmp/bilman.tar.gz

# Extract to the installation directory
sudo tar xzf /tmp/bilman.tar.gz -C /opt/vpn-manager --strip-components=1
```

3. Set proper permissions:
```bash
sudo chown -R root:root /opt/vpn-manager
```

4. Install dependencies and build:
```bash
cd /opt/vpn-manager
sudo npm install
sudo npm run build
```

5. Create and configure .env file:
```bash
sudo tee /opt/vpn-manager/.env << EOL
DOMAIN=shire.marfanet.com
NODE_ENV=production
EOL
```

6. Start Docker containers:
```bash
cd /opt/vpn-manager
sudo docker-compose up -d
```

7. Restart services:
```bash
sudo systemctl restart vpn-manager
sudo systemctl restart nginx
```

8. Verify installation:
```bash
# Check service status
sudo systemctl status vpn-manager

# Check Docker containers
sudo docker ps

# Check application logs
sudo journalctl -u vpn-manager -f
```
