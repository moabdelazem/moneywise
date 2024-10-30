# Use the official Next.js image for optimized builds
FROM node:18-alpine AS builder

# Set working directory
WORKDIR /app

# Copy package files
COPY package.json package-lock.json ./

# Install all dependencies, including dev dependencies
RUN npm install

# Copy the Prisma schema
COPY prisma ./prisma

# Generate Prisma Client
RUN npx prisma generate

# Copy the rest of the application code
COPY . .

# Build the Next.js app
RUN npm run build

# Use a lightweight image for the runtime
FROM node:18-alpine AS runner

# Set working directory
WORKDIR /app

# Copy .env file
COPY .env .env

# Copy package.json and install only production dependencies
COPY package.json ./
RUN npm install --only=production

# Copy the build output and Prisma client files from the builder stage
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/node_modules/.prisma node_modules/.prisma
COPY --from=builder /app/prisma ./prisma

# Expose the port the app will run on
EXPOSE 3000

# Start the Next.js app
CMD ["npm", "run", "start"]
