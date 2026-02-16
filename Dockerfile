# Multi-stage build for optimized image size

# Stage 1: Build stage
FROM node:18-alpine AS builder

LABEL maintainer="devops-team@example.com"
LABEL description="ToDo API Application - DevOps Project"

WORKDIR /app

# Copy package files
COPY app/package*.json ./

# Install dependencies
RUN npm ci --only=production

# Stage 2: Production stage
FROM node:18-alpine

WORKDIR /app

# Create non-root user for security
RUN addgroup -g 1001 -S nodejs && \
    adduser -S nodejs -u 1001

# Copy dependencies from builder
COPY --from=builder /app/node_modules ./node_modules

# Copy application code
COPY app/package*.json ./
COPY app/server.js ./

# Change ownership to non-root user
RUN chown -R nodejs:nodejs /app

# Switch to non-root user
RUN apk add --no-cache wget
USER nodejs

# Expose port
EXPOSE 3000

# Health check
HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
  CMD wget --spider -q http://localhost:3000/health || exit 1

# Start application
CMD ["node", "server.js"]
