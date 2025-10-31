# Opal Database Setup Guide

## ✅ Prerequisites Check

- ✅ PostgreSQL 14 is installed and running on your system
- ✅ .env file has been created with all required environment variables
- ✅ Prisma schema is configured for PostgreSQL

---

## 🗄️ Step 1: Create PostgreSQL Database

You have PostgreSQL 14 running. Now let's create the database:

### Option A: Using psql Command Line

```bash
# Connect to PostgreSQL (default user is your macOS username)
psql postgres

# Create the database
CREATE DATABASE opal_db;

# Verify the database was created
\l

# Exit psql
\q
```

### Option B: Create with specific user

If you want to create a PostgreSQL user for this project:

```bash
# Connect to PostgreSQL
psql postgres

# Create a new user with password
CREATE USER opal_user WITH PASSWORD 'your_secure_password';

# Create the database owned by this user
CREATE DATABASE opal_db OWNER opal_user;

# Grant all privileges
GRANT ALL PRIVILEGES ON DATABASE opal_db TO opal_user;

# Exit
\q
```

### Update .env file

After creating the database, update your `.env` file with the correct connection string:

**If using default user (your macOS username):**
```env
DATABASE_URL="postgresql://karthikreddy@localhost:5432/opal_db?schema=public"
```

**If you created opal_user:**
```env
DATABASE_URL="postgresql://opal_user:your_secure_password@localhost:5432/opal_db?schema=public"
```

---

## 📦 Step 2: Install Dependencies

```bash
# If you have Bun installed (recommended - faster)
bun install

# OR using npm
npm install
```

---

## 🔧 Step 3: Set Up Prisma & Initialize Database

### Generate Prisma Client

```bash
npx prisma generate
```

This creates the Prisma Client based on your schema.

### Push Schema to Database

```bash
npx prisma db push
```

This will:
- Create all 9 tables (User, Subscription, Media, WorkSpace, Folder, Video, Member, Notification, Invite, Comment)
- Set up all relationships and constraints
- Create enums (Type, PRESET, SUBSCRIPTION_PLAN)

### Verify Database Setup

```bash
# Open Prisma Studio (visual database browser)
npx prisma studio
```

This opens a web interface at `http://localhost:5555` where you can:
- View all your tables
- Check the schema structure
- Add test data manually if needed

---

## 🔑 Step 4: Get API Keys for External Services

The application requires several external services. Here's how to get each API key:

### 1. Clerk (Authentication) - **REQUIRED**

1. Go to [https://clerk.com/](https://clerk.com/)
2. Sign up and create a new application
3. Choose authentication methods (Email, Google, etc.)
4. Go to **API Keys** section
5. Copy:
   - `Publishable Key` → `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`
   - `Secret Key` → `CLERK_SECRET_KEY`

### 2. Stripe (Payments) - **REQUIRED for PRO features**

1. Go to [https://stripe.com/](https://stripe.com/)
2. Sign up for an account
3. Go to **Developers > API Keys**
4. Copy:
   - `Publishable Key` → `NEXT_PUBLIC_STRIPE_PUBLISH_KEY`
   - `Secret Key` → `STRIPE_CLIENT_SECRET`
5. Create a subscription product:
   - Go to **Products > Add Product**
   - Create a recurring subscription
   - Copy the **Price ID** → `STRIPE_SUBSCRIPTION_PRICE_ID`

### 3. OpenAI (AI Features) - **REQUIRED for transcription**

1. Go to [https://platform.openai.com/](https://platform.openai.com/)
2. Sign up and add billing information
3. Go to **API Keys**
4. Create new secret key → `OPEN_AI_KEY`

### 4. Voiceflow (AI Chatbot) - **OPTIONAL**

1. Go to [https://www.voiceflow.com/](https://www.voiceflow.com/)
2. Create an account and new project
3. Go to project settings > API Keys
4. Copy keys → `NEXT_PUBLIC_VOICE_FLOW_KEY` and `VOICEFLOW_API_KEY`

### 5. AWS CloudFront (Video Streaming) - **REQUIRED for video playback**

1. Go to [https://aws.amazon.com/](https://aws.amazon.com/)
2. Create an AWS account
3. Set up:
   - **S3 Bucket** for video storage
   - **CloudFront Distribution** pointing to your S3 bucket
4. Copy CloudFront URL → `NEXT_PUBLIC_CLOUD_FRONT_STREAM_URL`

### 6. Gmail (Email Notifications) - **OPTIONAL**

1. Enable 2-Factor Authentication on Gmail
2. Go to [https://myaccount.google.com/apppasswords](https://myaccount.google.com/apppasswords)
3. Generate an App Password for "Mail"
4. Update:
   - `MAILER_EMAIL` → your Gmail address
   - `MAILER_PASSWORD` → the 16-character app password (remove spaces)

---

## 🚀 Step 5: Start the Development Server

Once you have at least Clerk and database set up:

```bash
# Using Bun
bun dev

# OR using npm
npm run dev
```

The application will be available at: **http://localhost:3000**

---

## 🧪 Step 6: Test the Setup

1. **Open the app**: Go to http://localhost:3000
2. **Sign up**: Create a new account using Clerk authentication
3. **Check database**: Open Prisma Studio (`npx prisma studio`) to verify user was created
4. **Test features**:
   - Create a workspace
   - Upload a test video (requires CloudFront setup)
   - Create folders

---

## 📊 Database Schema Overview

Your database includes these tables:

| Table | Purpose |
|-------|---------|
| **User** | User accounts (linked to Clerk) |
| **Subscription** | User subscription plans (FREE/PRO) |
| **Media** | Recording device preferences |
| **WorkSpace** | User workspaces (PERSONAL/PUBLIC) |
| **Folder** | Video organization folders |
| **Video** | Video metadata and content |
| **Member** | Workspace team members |
| **Notification** | User notifications |
| **Invite** | Workspace invitations |
| **Comment** | Video comments with replies |

---

## 🛠️ Useful Commands

### Prisma Commands

```bash
# Generate Prisma Client (after schema changes)
npx prisma generate

# Push schema to database (development)
npx prisma db push

# Create a migration (production-ready)
npx prisma migrate dev --name migration_name

# Apply migrations in production
npx prisma migrate deploy

# Open Prisma Studio (database GUI)
npx prisma studio

# Reset database (⚠️ deletes all data!)
npx prisma migrate reset

# Validate schema file
npx prisma validate

# Format schema file
npx prisma format
```

### PostgreSQL Commands

```bash
# Connect to database
psql opal_db

# List all tables
\dt

# Describe a table
\d "User"

# Show database size
\l+

# Exit psql
\q
```

### Application Commands

```bash
# Development server
npm run dev

# Build for production
npm run build

# Start production server
npm run start

# Run linter
npm run lint
```

---

## 🐛 Troubleshooting

### Database Connection Issues

**Error: Can't reach database server**
- Check if PostgreSQL is running: `brew services list | grep postgres`
- Start if needed: `brew services start postgresql@14`

**Error: Password authentication failed**
- Verify your `DATABASE_URL` credentials in `.env`
- Check PostgreSQL user exists: `psql postgres -c "\du"`

### Prisma Issues

**Error: Prisma Client not generated**
- Run: `npx prisma generate`

**Error: Database out of sync**
- Run: `npx prisma db push`

### Missing Environment Variables

**Error: Invalid environment variables**
- Check all required variables are set in `.env`
- Minimum required: `DATABASE_URL`, `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`, `CLERK_SECRET_KEY`

---

## 🎯 What Works Without External Services

| Feature | Required Services |
|---------|------------------|
| User Authentication | ✅ Clerk |
| Basic Workspace Creation | ✅ Database only |
| Folder Organization | ✅ Database only |
| Video Upload | ⚠️ Requires CloudFront |
| Video Transcription | ⚠️ Requires OpenAI |
| Payments/Subscriptions | ⚠️ Requires Stripe |
| AI Chatbot | ⚠️ Requires Voiceflow |
| Email Notifications | ⚠️ Requires Gmail setup |

**Minimum for testing**: Database + Clerk authentication

---

## 📝 Next Steps

1. ✅ Database is created and configured
2. ✅ Dependencies installed
3. ✅ Prisma client generated
4. ✅ Tables created in database
5. ⏳ Get Clerk API keys (authentication)
6. ⏳ Get Stripe API keys (if testing payments)
7. ⏳ Get OpenAI API key (if testing AI features)
8. ⏳ Set up CloudFront (if testing video features)
9. ⏳ Start development server and test

---

## 📚 Additional Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [Prisma Documentation](https://www.prisma.io/docs)
- [Clerk Documentation](https://clerk.com/docs)
- [Stripe Documentation](https://stripe.com/docs)
- [PostgreSQL Documentation](https://www.postgresql.org/docs/)

---

## ⚖️ License Notice

This project is for **educational use only**. Check the license file for commercial usage restrictions.

---

**Need Help?** Check the troubleshooting section or review the error messages carefully. Most issues are related to missing API keys or database connection problems.
