# Sandry

Kitchen management system for Sandry — orders, chef workflow, owner analytics.

Built with **Next.js**, **Prisma**, **PostgreSQL**, and **NextAuth.js**.

---

## Requirements

- Node.js 18+
- PostgreSQL 14+
- npm

---

## Setup

### 1. Install Node.js

```bash
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt-get install -y nodejs
```

### 2. Install PostgreSQL

```bash
sudo apt-get install -y postgresql postgresql-contrib
sudo systemctl start postgresql
sudo systemctl enable postgresql
```

### 3. Create the database

```bash
sudo -u postgres psql
```

Inside psql:

```sql
CREATE USER sandry_user WITH PASSWORD 'your_password';
CREATE DATABASE sandry OWNER sandry_user;
GRANT ALL PRIVILEGES ON DATABASE sandry TO sandry_user;
\q
```

### 4. Clone the repository

```bash
git clone <your-repo-url>
cd sandry
```

### 5. Install dependencies

```bash
npm install
```

### 6. Configure environment variables

```bash
cp .env.example .env
```

Edit `.env` and fill in your values:

```env
DATABASE_URL="postgresql://sandry_user:your_password@localhost:5432/sandry"
NEXTAUTH_SECRET="your-secret-key"
NEXTAUTH_URL="http://localhost:3000"

# Owner account created by the seed script
OWNER_USERNAME="your-owner-username"
OWNER_EMAIL="owner@yourdomain.com"
OWNER_PASSWORD="your-strong-password"
```

To generate a secure `NEXTAUTH_SECRET`:

```bash
openssl rand -base64 32
```

### 7. Run database migrations

```bash
npx prisma migrate deploy
```

### 8. Seed the database

Creates the owner account and initial menu items:

```bash
npm run db:seed
```

---

## Running the app

### Development

```bash
npm run dev
```

The app will be available at [http://localhost:3000](http://localhost:3000).

### Production

```bash
npm run build
npm run start
```

---

## Available scripts

| Command | Description |
|---|---|
| `npm run dev` | Start development server |
| `npm run build` | Build for production |
| `npm run start` | Start production server |
| `npm run db:migrate` | Create and apply a new migration |
| `npm run db:seed` | Seed the database (owner + menu items) |
| `npm run db:studio` | Open Prisma Studio (database GUI) |

---

## User roles

| Role | Access |
|---|---|
| **Owner** | Executive overview, user management, purchases view |
| **Chef** | Orders, menu management, purchases, analytics |
| **Client** | Browse menu, place orders, order history |

The owner account is created by `npm run db:seed` using the credentials in your `.env` file.
Chefs and clients are created by the owner from the User Management page.
