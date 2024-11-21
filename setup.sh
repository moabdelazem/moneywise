#!/usr/bin/env bash

# Install dependencies
npm install

# Create .env file
touch .env

# Add environment variables to .env file
echo "PORT=3000" >>.env
echo "POSTGRES_DB=postgresql://moneywise:moneywise_password@localhost:5432/moneywise_db?schema=public" >>.
echo "JWT_SECRET=your_secret" >>.env

# Run The Database
docker compose up -d

# Create database
npx prisma migrate dev
