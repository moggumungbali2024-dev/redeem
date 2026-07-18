# Use Node.js LTS
FROM node:22-alpine AS builder

WORKDIR /app

# Copy package files
COPY package.json package-lock.json* bun.lock* ./

# Install dependencies (fallback to npm if others fail)
RUN if [ -f package-lock.json ]; then npm install; \
    elif [ -f bun.lock ]; then npm install -g bun && bun install; \
    else npm install; \
    fi

# Copy all source files
COPY . .

# Build the application
RUN npm run build

# Runner stage
FROM node:22-alpine AS runner

WORKDIR /app

# Copy built assets from builder
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./

# Set environment variables
ENV NODE_ENV=production
ENV PORT=3000

# Expose port
EXPOSE 3000

# Start the server
CMD ["npm", "run", "start"]
