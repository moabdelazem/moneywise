# Moneywise

Moneywise is a Next.js application designed to manage and track expenses, providing an intuitive user experience for financial management. This app is built with Next.js, Prisma ORM, and PostgreSQL, with Docker Compose to manage the database.

## Features

- **Expense Tracking**: Add and categorize expenses.
- **Expense Summary**: View total expenses over specified periods.
- **Authentication**: Secure user login and registration system.

## Technologies

- **Next.js** for the frontend and backend routes.
- **Prisma ORM** for database management.
- **PostgreSQL** database, managed via Docker Compose.

## Getting Started

### Prerequisites

- **Docker** and **Docker Compose**: Make sure Docker is installed on your machine.
  - [Get Docker here](https://docs.docker.com/get-docker/)

### Installation

1. **Clone the repository**:

   ```bash
   git clone https://github.com/moabdelazem/moneywise.git
   cd moneywise
   ```

2. **Install dependencies**:

   ```bash
   npm install
   ```

3. **Set up environment variables**:  
   Create a `.env` file in the root directory and add the following variables:

   ```plaintext
   DATABASE_URL="postgresql://user:password@localhost:5432/moneywise"
   NEXTAUTH_SECRET="your_secret_key"
   ```

   Replace `user`, `password`, and `database_name` with your PostgreSQL credentials.

4. **Start the PostgreSQL Database**:
   Run the database using Docker Compose.

   ```bash
   docker-compose up -d
   ```

5. **Run database migrations**:
   Initialize the database with Prisma migrations.

   ```bash
   npx prisma migrate dev
   ```

6. **Run the development server**:

   ```bash
   npm run dev
   ```

7. Open your browser and visit [http://localhost:3000](http://localhost:3000) to see the app.

## Available Scripts

- `npm run dev`: Starts the development server.
- `docker-compose up -d`: Starts the database in detached mode.
- `npx prisma migrate dev`: Runs migrations on the database.

## Contributing

Feel free to fork this repository and submit pull requests.
