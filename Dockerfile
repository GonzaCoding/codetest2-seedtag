# Use Node.js 20 Alpine as base image
FROM node:20-alpine

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci

# Copy source code
COPY . .

# Expose port 3000 (internal)
EXPOSE 3000

# Start the application in development mode with hot reload
CMD ["npm", "run", "start:dev"]