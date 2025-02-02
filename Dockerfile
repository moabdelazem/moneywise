# Base stage - Sets up the foundation for all other stages
FROM node:22-slim AS base

# Install OpenSSL
RUN apt-get update && \
    apt-get install -y openssl && \
    apt-get clean && \
    rm -rf /var/lib/apt/lists/*

# Define default port that can be overridden during build
ARG PORT=3000
# Disable Next.js telemetry for privacy
ENV NEXT_TELEMETRY_DISABLED=1
# Set working directory for all stages
WORKDIR /app

# Dependencies stage - Install production dependencies
FROM base AS dependencies
COPY package.json package-lock.json ./
RUN npm ci

# Build stage - Compile the Next.js application
FROM base AS build
# Copy node_modules from dependencies stage
COPY --from=dependencies /app/node_modules ./node_modules
# Copy all source files
COPY . .

# Generate Prisma Client
RUN npx prisma generate

# Configure build environment variables
ENV NEXT_LINT=false    

# Build the application
RUN npm run build

# Production stage - Create minimal production image
FROM base AS run
# Set production environment and port
ENV NODE_ENV=production
ENV PORT=$PORT

# Create non-root user for security
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs
# Create and set permissions for Next.js directory
RUN mkdir .next
RUN chown nextjs:nodejs .next

# Copy migration script
COPY --chmod=755 docker/init.sh .
COPY --from=build /app/prisma ./prisma

# Copy built assets from build stage
COPY --from=build /app/public ./public
COPY --from=build --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=build --chown=nextjs:nodejs /app/.next/static ./.next/static

# Switch to non-root user
USER nextjs

# Expose the application port
EXPOSE $PORT

# Configure container startup
ENV HOSTNAME="0.0.0.0"
CMD ["./init.sh", "node", "server.js"]
