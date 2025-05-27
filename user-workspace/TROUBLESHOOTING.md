## Troubleshooting 502 Bad Gateway

If you encounter a 502 Bad Gateway error, follow these steps:

1. Check if Node.js application is running:
```bash
# Check the status of the vpn-manager service
sudo systemctl status vpn-manager

# Check the logs
sudo journalctl -u vpn-manager -f
```

2. Verify Nginx configuration:
```bash
# Test Nginx configuration
sudo nginx -t

# Check Nginx logs
sudo tail -f /var/log/nginx/error.log
sudo tail -f /var/log/nginx/access.log
```

3. Check if port 3000 is in use:
```bash
# Check if the application is listening on port 3000
sudo netstat -tulpn | grep 3000

# Check if Docker containers are running
sudo docker ps
```

4. Restart services:
```bash
# Restart Node.js application
sudo systemctl restart vpn-manager

# Restart Nginx
sudo systemctl restart nginx
```

5. Check Docker logs:
```bash
# View Docker container logs
sudo docker-compose logs
```

Common solutions:
1. Make sure the Node.js application is running and listening on port 3000
2. Verify that Docker containers are running properly
3. Check if the firewall allows traffic on required ports
4. Ensure the domain DNS is properly configured
5. Verify that all environment variables are set correctly in .env file
