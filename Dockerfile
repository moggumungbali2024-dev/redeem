# Use Node.js LTS
FROM node:22-alpine AS builder

WORKDIR /app

# Accept build arguments for Supabase
ARG VITE_SUPABASE_URL
ARG VITE_SUPABASE_ANON_KEY

# Set as environment variables for Vite build process
ENV VITE_SUPABASE_URL=$VITE_SUPABASE_URL
ENV VITE_SUPABASE_ANON_KEY=$VITE_SUPABASE_ANON_KEY

# Copy package files
COPY package.json package-lock.json* bun.lock* ./

# Install dependencies (fallback to npm if others fail)
RUN if [ -f package-lock.json ]; then npm install; \
    elif [ -f bun.lock ]; then npm install -g bun && bun install; \
    else npm install; \
    fi

# Copy all source files (including public/ which has favicon.png)
COPY . .

# Build the application (Vite copies public/ to dist/ automatically)
RUN npm run build

# Verify favicon.png is in dist
RUN ls -la dist/ && test -f dist/favicon.png && echo "favicon.png OK" || echo "WARNING: favicon.png not found in dist"

# Runner stage
FROM node:22-alpine AS runner

WORKDIR /app

# Accept build arguments for Supabase in runner
ARG VITE_SUPABASE_URL
ARG VITE_SUPABASE_ANON_KEY

ENV VITE_SUPABASE_URL=$VITE_SUPABASE_URL
ENV VITE_SUPABASE_ANON_KEY=$VITE_SUPABASE_ANON_KEY

# Copy built assets from builder (dist/ already contains public/ files from Vite build)
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./
COPY --from=builder /app/.env* ./

# Create /data directory for persistent storage (mount a volume here in production)
# data_db.json will be stored at /data/data_db.json to survive container restarts/redeploys
RUN mkdir -p /data

# Set environment variables
ENV NODE_ENV=production
ENV PORT=3000
# Tell the server to use /data as the persistent data directory
ENV DATA_DIR=/data

# Expose port
EXPOSE 3000

# Declare /data as a volume so orchestrators can mount persistent storage here
VOLUME ["/data"]

# Start the server
CMD ["npm", "run", "start"]
