To fix the missing files issue:

1. Remove current incomplete installation:
```bash
sudo rm -rf /opt/vpn-manager/*
```

2. Download and extract the complete project:
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

4. Install dependencies and restart:
```bash
cd /opt/vpn-manager
sudo npm install
sudo systemctl restart vpn-manager
```

5. Verify the service is running:
```bash
sudo systemctl status vpn-manager
```
