# Use Node.js 20 LTS (matching your package.json engines)
FROM node:20.18.3-alpine

# Install necessary build tools for native dependencies
RUN apk add --no-cache \
  python3 \
  make \
  g++ \
  postgresql-client

# Set working directory
WORKDIR /usr/src/app

# Copy package files
COPY package*.json ./
COPY babel.config.json ./

# Install dependencies
RUN npm ci --only=production

# Copy application source
COPY . .

# Build the application
RUN npm run build

# Create non-root user
RUN addgroup -g 1001 -S nodejs && \
  adduser -S nodejs -u 1001

# Change ownership
RUN chown -R nodejs:nodejs /usr/src/app

# Switch to non-root user
USER nodejs

# Expose port (Cloud Run will set PORT env variable)
EXPOSE 8080

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=40s \
  CMD node -e "require('http').get('http://localhost:' + (process.env.PORT || 3000) + '/health', (r) => {process.exit(r.statusCode === 200 ? 0 : 1)})"

# Start the application
CMD ["npm", "start"]