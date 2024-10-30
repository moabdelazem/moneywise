# Use the official Next.js image for optimized builds
FROM node:18-alpine AS builder

# Set working directory
WORKDIR /app

# Copy package.json and package-lock.json
COPY package.json package-lock.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application code
COPY . .

# Generate Prisma Client
RUN npx prisma generate

# Build the Next.js app
RUN npm run build

# Use a lightweight image for the runtime
FROM node:18-alpine AS runner

# Set working directory
WORKDIR /app

# Copy .env file
COPY .env .env

# Copy package.json for runtime dependencies
COPY package.json ./

# Install only production dependencies
RUN npm install --only=production

# Copy the Next.js build and Prisma client
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/node_modules/.prisma node_modules/.prisma

# Expose the port the app will run on
EXPOSE 3000

# Set the command to start the app
CMD ["npm", "run", "start"]
