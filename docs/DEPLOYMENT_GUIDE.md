# 🚀 Deployment Guide

## Overview

This guide covers various deployment options for the Radar API, from local development to production environments.

## Prerequisites

- Node.js 18+
- Docker & Docker Compose
- npm or yarn
- Git

## Local Development

### Quick Start

```bash
# Clone repository
git clone <repository-url>
cd radar-api

# Install dependencies
npm install

# Start with Docker (Recommended)
sudo docker-compose up --build -d

# Or start locally
npm run start:dev
```

### Development Commands

```bash
# Start development server
npm run start:dev

# Start in debug mode
npm run start:debug

# Run tests
npm test

# Run E2E tests
npm run test:e2e

# Build for production
npm run build
```

## Docker Deployment

### Docker Compose (Recommended)

#### Development Environment

```yaml
# docker-compose.yml
version: '3.3'

services:
  radar-api:
    build: .
    ports:
      - "8888:3000"
    volumes:
      - .:/app
      - /app/node_modules
    environment:
      - NODE_ENV=development
    command: npm run start:dev
    stdin_open: true
    tty: true
```

#### Production Environment

```yaml
# docker-compose.prod.yml
version: '3.3'

services:
  radar-api:
    build: .
    ports:
      - "8888:3000"
    environment:
      - NODE_ENV=production
    command: npm run start:prod
    restart: unless-stopped
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost:3000/radar/protocols"]
      interval: 30s
      timeout: 10s
      retries: 3
```

### Docker Commands

```bash
# Start development environment
sudo docker-compose up --build -d

# Start production environment
sudo docker-compose -f docker-compose.prod.yml up --build -d

# View logs
sudo docker-compose logs -f

# Stop services
sudo docker-compose down

# Rebuild and restart
sudo docker-compose up --build --force-recreate -d
```

### Manual Docker Build

```bash
# Build image
sudo docker build -t radar-api .

# Run container
sudo docker run -p 8888:3000 radar-api

# Run with environment variables
sudo docker run -p 8888:3000 -e NODE_ENV=production radar-api
```

## Production Deployment

### Environment Setup

#### Required Environment Variables

```bash
# .env.production
NODE_ENV=production
PORT=3000
LOG_LEVEL=info
```

#### Optional Environment Variables

```bash
# .env.production
NODE_ENV=production
PORT=3000
LOG_LEVEL=info
CORS_ORIGIN=https://yourdomain.com
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
```

### Production Build

```bash
# Install dependencies
npm ci --only=production

# Build application
npm run build

# Start production server
npm run start:prod
```

### Process Management

#### PM2 (Recommended)

```bash
# Install PM2
npm install -g pm2

# Start application
pm2 start dist/main.js --name radar-api

# Monitor application
pm2 monit

# View logs
pm2 logs radar-api

# Restart application
pm2 restart radar-api

# Stop application
pm2 stop radar-api
```

#### PM2 Configuration

```json
// ecosystem.config.js
module.exports = {
  apps: [{
    name: 'radar-api',
    script: 'dist/main.js',
    instances: 'max',
    exec_mode: 'cluster',
    env: {
      NODE_ENV: 'development',
      PORT: 3000
    },
    env_production: {
      NODE_ENV: 'production',
      PORT: 3000
    }
  }]
}
```

#### Systemd Service

```ini
# /etc/systemd/system/radar-api.service
[Unit]
Description=Radar API
After=network.target

[Service]
Type=simple
User=node
WorkingDirectory=/opt/radar-api
ExecStart=/usr/bin/node dist/main.js
Restart=on-failure
RestartSec=5
Environment=NODE_ENV=production
Environment=PORT=3000

[Install]
WantedBy=multi-user.target
```

```bash
# Enable and start service
sudo systemctl enable radar-api
sudo systemctl start radar-api
sudo systemctl status radar-api
```

## Cloud Deployment

### AWS Deployment

#### EC2 Instance

```bash
# Update system
sudo yum update -y

# Install Node.js
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash
nvm install 18
nvm use 18

# Install Docker
sudo yum install -y docker
sudo systemctl start docker
sudo systemctl enable docker

# Clone and deploy
git clone <repository-url>
cd radar-api
sudo docker-compose up --build -d
```

#### ECS (Elastic Container Service)

```json
// task-definition.json
{
  "family": "radar-api",
  "networkMode": "awsvpc",
  "requiresCompatibilities": ["FARGATE"],
  "cpu": "256",
  "memory": "512",
  "executionRoleArn": "arn:aws:iam::account:role/ecsTaskExecutionRole",
  "containerDefinitions": [
    {
      "name": "radar-api",
      "image": "your-account.dkr.ecr.region.amazonaws.com/radar-api:latest",
      "portMappings": [
        {
          "containerPort": 3000,
          "protocol": "tcp"
        }
      ],
      "environment": [
        {
          "name": "NODE_ENV",
          "value": "production"
        }
      ],
      "logConfiguration": {
        "logDriver": "awslogs",
        "options": {
          "awslogs-group": "/ecs/radar-api",
          "awslogs-region": "us-east-1",
          "awslogs-stream-prefix": "ecs"
        }
      }
    }
  ]
}
```

### Google Cloud Platform

#### Cloud Run

```yaml
# cloudbuild.yaml
steps:
  - name: 'gcr.io/cloud-builders/docker'
    args: ['build', '-t', 'gcr.io/$PROJECT_ID/radar-api', '.']
  - name: 'gcr.io/cloud-builders/docker'
    args: ['push', 'gcr.io/$PROJECT_ID/radar-api']
  - name: 'gcr.io/cloud-builders/gcloud'
    args: ['run', 'deploy', 'radar-api', '--image', 'gcr.io/$PROJECT_ID/radar-api', '--region', 'us-central1', '--platform', 'managed']
```

### Azure

#### Container Instances

```bash
# Create resource group
az group create --name radar-api-rg --location eastus

# Create container instance
az container create \
  --resource-group radar-api-rg \
  --name radar-api \
  --image your-registry.azurecr.io/radar-api:latest \
  --ports 3000 \
  --environment-variables NODE_ENV=production
```

## Kubernetes Deployment

### Deployment Manifest

```yaml
# k8s-deployment.yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: radar-api
spec:
  replicas: 3
  selector:
    matchLabels:
      app: radar-api
  template:
    metadata:
      labels:
        app: radar-api
    spec:
      containers:
      - name: radar-api
        image: radar-api:latest
        ports:
        - containerPort: 3000
        env:
        - name: NODE_ENV
          value: "production"
        resources:
          requests:
            memory: "64Mi"
            cpu: "250m"
          limits:
            memory: "128Mi"
            cpu: "500m"
        livenessProbe:
          httpGet:
            path: /radar/protocols
            port: 3000
          initialDelaySeconds: 30
          periodSeconds: 10
        readinessProbe:
          httpGet:
            path: /radar/protocols
            port: 3000
          initialDelaySeconds: 5
          periodSeconds: 5
---
apiVersion: v1
kind: Service
metadata:
  name: radar-api-service
spec:
  selector:
    app: radar-api
  ports:
  - port: 80
    targetPort: 3000
  type: LoadBalancer
```

### Ingress

```yaml
# k8s-ingress.yaml
apiVersion: networking.k8s.io/v1
kind: Ingress
metadata:
  name: radar-api-ingress
  annotations:
    nginx.ingress.kubernetes.io/rewrite-target: /
spec:
  rules:
  - host: radar-api.yourdomain.com
    http:
      paths:
      - path: /
        pathType: Prefix
        backend:
          service:
            name: radar-api-service
            port:
              number: 80
```

## Monitoring and Logging

### Health Checks

```bash
# Health check endpoint
curl http://localhost:8888/radar/protocols

# Expected response: 200 OK with protocol list
```

### Logging

```typescript
// Add to main.ts
import { Logger } from '@nestjs/common';

const logger = new Logger('RadarAPI');

// Log startup
logger.log('Radar API starting...');
logger.log(`Environment: ${process.env.NODE_ENV}`);
logger.log(`Port: ${process.env.PORT || 3000}`);
```

### Metrics

```typescript
// Add metrics collection
import { Counter, Histogram, register } from 'prom-client';

const requestCounter = new Counter({
  name: 'http_requests_total',
  help: 'Total number of HTTP requests',
  labelNames: ['method', 'route', 'status_code']
});

const requestDuration = new Histogram({
  name: 'http_request_duration_seconds',
  help: 'Duration of HTTP requests in seconds',
  labelNames: ['method', 'route']
});
```

## Security Considerations

### Environment Security

```bash
# Secure environment variables
export NODE_ENV=production
export PORT=3000
# Never commit sensitive data to version control
```

### Docker Security

```dockerfile
# Use non-root user
RUN addgroup -g 1001 -S nodejs
RUN adduser -S nestjs -u 1001
USER nestjs
```

### Network Security

```yaml
# docker-compose.yml with network security
version: '3.3'
services:
  radar-api:
    # ... other config
    networks:
      - radar-network
    security_opt:
      - no-new-privileges:true

networks:
  radar-network:
    driver: bridge
```

## Troubleshooting

### Common Issues

1. **Port Already in Use**
   ```bash
   # Find process using port
   lsof -i :8888
   # Kill process
   kill -9 <PID>
   ```

2. **Docker Permission Issues**
   ```bash
   # Add user to docker group
   sudo usermod -aG docker $USER
   # Logout and login again
   ```

3. **Memory Issues**
   ```bash
   # Increase Node.js memory limit
   node --max-old-space-size=4096 dist/main.js
   ```

4. **Build Failures**
   ```bash
   # Clear npm cache
   npm cache clean --force
   # Remove node_modules and reinstall
   rm -rf node_modules package-lock.json
   npm install
   ```

### Debug Commands

```bash
# Check application status
curl http://localhost:8888/radar/protocols

# Check Docker status
sudo docker ps
sudo docker logs <container-id>

# Check system resources
top
htop
df -h
free -h
```

## Backup and Recovery

### Database Backup (if applicable)

```bash
# Backup data
tar -czf radar-api-backup-$(date +%Y%m%d).tar.gz /opt/radar-api

# Restore data
tar -xzf radar-api-backup-20231201.tar.gz -C /
```

### Configuration Backup

```bash
# Backup configuration
cp -r /opt/radar-api/config /backup/radar-api-config-$(date +%Y%m%d)
```

## Maintenance

### Regular Updates

```bash
# Update dependencies
npm update

# Security audit
npm audit
npm audit fix

# Rebuild and redeploy
sudo docker-compose up --build -d
```

### Log Rotation

```bash
# Configure logrotate
sudo vim /etc/logrotate.d/radar-api

# Logrotate configuration
/opt/radar-api/logs/*.log {
    daily
    missingok
    rotate 7
    compress
    delaycompress
    notifempty
    create 644 node node
}
```
