#!/usr/bin/env bash

# Install dependencies
npm install

# Create .env file
touch .env

# Add environment variables to .env file
echo "PORT=3000" >>.env
echo "POSTGRES_DB=postgresql://moneywise:moneywise_password@localhost:5432/moneywise_db?schema=public" >>.
echo "JWT_SECRET=your_secret" >>.env

# Check if Docker Exists
if ! [ -x "$(command -v docker)" ]; then
    echo "Docker is not installed. Do You Want To Install Docker (Y/n)."
    read response
    if [ "$response" == "Y" ] || [ "$response" == "y" ]; then
        echo "Installing Docker"
        curl -fsSL https://get.docker.com -o get-docker.sh
        sudo sh get-docker.sh
        sudo usermod -aG docker $USER
        sudo systemctl start docker
        sudo systemctl enable docker
        echo "Docker Installed Successfully"
    else
        echo "Please Install Docker To Continue"
        exit 1
    fi
fi

# Run The Database
docker compose up -d

# Create database
npx prisma migrate dev
