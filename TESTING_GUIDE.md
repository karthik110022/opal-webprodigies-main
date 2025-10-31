# 🧪 Complete Testing Guide - Opal Video Platform

## 📋 Table of Contents
1. [Pre-Flight Checks](#pre-flight-checks)
2. [Starting All Services](#starting-all-services)
3. [Testing Each Component](#testing-each-component)
4. [End-to-End Testing](#end-to-end-testing)
5. [What Success Looks Like](#what-success-looks-like)
6. [Troubleshooting](#troubleshooting)

---

## 🔍 Pre-Flight Checks

### 1. Verify PostgreSQL Database

```bash
# Check if PostgreSQL is running
psql -U karthikreddy -d opal_db -c "SELECT 1"

# If not running, start PostgreSQL
brew services start postgresql@14
# OR
pg_ctl -D /usr/local/var/postgres start
```

**Expected Output:**
```
 ?column?
----------
        1
(1 row)
```

### 2. Run Database Migrations

```bash
# Navigate to main project
cd /Users/karthikreddy/Downloads/opal-webprodigies-main

# Run Prisma migrations
npx prisma migrate dev

# Generate Prisma client
npx prisma generate
```

**Expected Output:**
```
✔ Generated Prisma Client
```

### 3. Verify Environment Variables

```bash
# Check main project .env
cat .env | grep -E "DATABASE_URL|CLERK_SECRET_KEY|BUCKET_NAME|OPEN_AI_KEY"
```

**Should show:**
- ✅ DATABASE_URL configured
- ✅ CLERK_SECRET_KEY present
- ✅ BUCKET_NAME (AWS S3)
- ✅ OPEN_AI_KEY present

### 4. Install Dependencies

```bash
# Main project (if not done)
npm install --legacy-peer-deps

# Server dependencies (already installed via copy)
cd server && ls node_modules/ | wc -l
# Should show ~166 packages

# Desktop app (separate terminal later)
cd /Users/karthikreddy/Downloads/opal-desktop-app-main
npm install
```

---

## 🚀 Starting All Services

### Terminal Setup
You'll need **3 terminal windows/tabs**:

### Terminal 1: Web App + Express Backend

```bash
cd /Users/karthikreddy/Downloads/opal-webprodigies-main
npm run dev
```

**Expected Output:**
```
[0] > opal-webprodigies@0.1.0 dev:web
[0] > next dev
[0]
[1] > opal-webprodigies@0.1.0 dev:server
[1] > cd server && node server.js
[0] ▲ Next.js 14.2.14
[0] - Local:        http://localhost:3000
[1] listening to port 5002
```

**Success Indicators:**
- ✅ "[0]" shows Next.js running on port 3000
- ✅ "[1]" shows Express listening on port 5002
- ✅ No error messages about ports already in use
- ✅ Database connection successful (no Prisma errors)

### Terminal 2: Desktop App (Electron)

```bash
cd /Users/karthikreddy/Downloads/opal-desktop-app-main
npm run dev
```

**Expected Output:**
```
VITE v5.1.6  ready in XXX ms

  ➜  Local:   http://localhost:5173/
  ➜  press h + enter to show help
```

**Success Indicators:**
- ✅ Vite dev server starts on port 5173
- ✅ Electron window opens automatically
- ✅ Desktop app UI loads (floating widget)

### Terminal 3: Monitoring (Optional)

```bash
# Watch server logs
tail -f /Users/karthikreddy/Downloads/opal-webprodigies-main/server/temp_upload/*.log

# OR watch database queries
cd /Users/karthikreddy/Downloads/opal-webprodigies-main
npx prisma studio
# Opens at http://localhost:5555
```

---

## 🧪 Testing Each Component

### Phase 1: Test Web App Authentication

1. **Open browser**: http://localhost:3000

2. **Sign Up / Sign In**
   ```
   Click "Sign Up" or "Sign In"
   Use Clerk authentication interface
   ```

3. **What Success Looks Like:**
   - ✅ Redirected to `/auth/callback`
   - ✅ Then redirected to `/dashboard/[workspaceId]`
   - ✅ See your workspace dashboard
   - ✅ See sidebar with navigation

4. **Check Terminal Output:**
   ```
   [0] GET /auth/callback 200
   [0] GET /dashboard/[workspaceId] 200
   ```

### Phase 2: Test Payment Upgrade (Demo Mode)

1. **Find Payment Button** in dashboard
   - Look for "Upgrade" button

2. **Click Upgrade**

3. **What Success Looks Like:**
   - ✅ Redirected to payment success page
   - ✅ No actual payment required
   - ✅ Terminal shows: `💳 Payment API hit - DUMMY MODE`
   - ✅ User upgraded to PRO plan

4. **Verify in Database:**
   ```bash
   # In Terminal 3
   psql -U karthikreddy -d opal_db
   SELECT email, subscription FROM "User" WHERE email = 'your-email@example.com';
   ```

### Phase 3: Test Desktop App Connection

1. **In Desktop App Window:**
   - You should see a floating widget
   - Small control panel

2. **Check Socket.io Connection**
   - Terminal 1 should show:
   ```
   [1] user connected <socket-id>
   ```

3. **What Success Looks Like:**
   - ✅ Desktop app opens without errors
   - ✅ Express backend logs "user connected"
   - ✅ UI is responsive

4. **Test Studio Settings** (if available):
   - Click settings/gear icon
   - Select screen source
   - Select audio input
   - Choose quality (HD/SD)

---

## 🎬 End-to-End Testing: Video Recording

### **Important Prerequisites:**
- ✅ Upgraded to PRO plan (demo mode)
- ✅ All 3 services running
- ✅ Desktop app connected to backend

### Test Steps:

#### 1. Start Recording

**In Desktop App:**
```
1. Click "Record" or recording button
2. Select screen source (your display)
3. Select audio input (microphone)
4. Choose quality preset (HD or SD)
5. Click "Start Recording"
```

**Expected Behavior:**
- Desktop app minimizes/hides
- Small recording indicator shows
- Terminal shows video chunks being received

**Terminal Output (Express Backend):**
```bash
[1] chunk saved
[1] chunk saved
[1] chunk saved
```

#### 2. Stop Recording

**In Desktop App:**
```
Click "Stop" button
```

**Expected Processing Flow:**

**Terminal Output:**
```bash
[1] 🟢 Processing video...
[1] video uploaded to aws
[1] 🟢 Transcribed
[1] ✅ Fake session created: cs_demo_xxxxx
[0] POST /api/recording/[id]/processing 200
[0] POST /api/recording/[id]/transcribe 200
[0] POST /api/recording/[id]/complete 200
```

**What's Happening:**
1. ✅ Video chunks assembled
2. ✅ Uploaded to AWS S3
3. ✅ OpenAI Whisper transcribes audio (PRO only)
4. ✅ GPT-3.5 generates title/summary (PRO only)
5. ✅ Metadata saved to PostgreSQL
6. ✅ Temporary file deleted

#### 3. Verify in Web App

**Refresh Dashboard** (http://localhost:3000)

**What Success Looks Like:**
- ✅ New video appears in video list
- ✅ Shows title (AI-generated or "Untitled Video")
- ✅ Shows thumbnail
- ✅ Shows "Processing: false" (complete)

#### 4. View Video Details

**Click on the video**

**What Success Looks Like:**
- ✅ Video player loads
- ✅ Video streams from CloudFront
- ✅ Shows AI-generated description
- ✅ Shows transcript (if PRO)
- ✅ Can add comments

---

## ✅ What Success Looks Like - Complete Checklist

### Web App (Port 3000)
- [ ] ✅ Loads without errors
- [ ] ✅ Clerk authentication works
- [ ] ✅ Dashboard displays correctly
- [ ] ✅ Navigation works (sidebar, folders)
- [ ] ✅ Payment upgrade succeeds (demo mode)
- [ ] ✅ Videos list displays

### Express Backend (Port 5002)
- [ ] ✅ Listens on port 5002
- [ ] ✅ Accepts Socket.io connections
- [ ] ✅ Receives video chunks
- [ ] ✅ Uploads to AWS S3
- [ ] ✅ Calls OpenAI API (transcription)
- [ ] ✅ Calls Next.js API routes
- [ ] ✅ Logs show processing steps

### Desktop App (Port 5173)
- [ ] ✅ Opens Electron window
- [ ] ✅ Connects to Express backend
- [ ] ✅ Can select screen/audio sources
- [ ] ✅ Records video smoothly
- [ ] ✅ Sends chunks in real-time
- [ ] ✅ Stop recording works

### Database (PostgreSQL)
- [ ] ✅ Accepts connections
- [ ] ✅ Stores user data
- [ ] ✅ Stores video metadata
- [ ] ✅ Stores subscription info
- [ ] ✅ No connection errors

### AWS S3
- [ ] ✅ Accepts uploads
- [ ] ✅ Stores video files
- [ ] ✅ Accessible via CloudFront

### AI Features (OpenAI)
- [ ] ✅ Whisper transcribes audio
- [ ] ✅ GPT generates title/summary
- [ ] ✅ Results saved to database

---

## 🐛 Troubleshooting

### Issue: "Port 3000 already in use"

```bash
# Find process using port 3000
lsof -i :3000

# Kill the process
kill -9 <PID>

# Or use
npx kill-port 3000
```

### Issue: "Port 5002 already in use"

```bash
lsof -i :5002
kill -9 <PID>
```

### Issue: "Cannot connect to database"

```bash
# Check PostgreSQL status
brew services list | grep postgresql

# Start if stopped
brew services start postgresql@14

# Test connection
psql -U karthikreddy -d opal_db -c "SELECT 1"
```

### Issue: "Desktop app won't connect to backend"

**Check:**
1. Express backend is running (port 5002)
2. Desktop app .env has correct URL:
   ```bash
   cd /Users/karthikreddy/Downloads/opal-desktop-app-main
   cat .env | grep SOCKET_URL
   # Should show: VITE_SOCKET_URL=http://localhost:5002
   ```

### Issue: "Video upload fails"

**Check:**
1. AWS credentials in `.env`:
   ```bash
   cd /Users/karthikreddy/Downloads/opal-webprodigies-main
   cat .env | grep -E "BUCKET_NAME|ACCESS_KEY|SECRET_KEY"
   ```

2. S3 bucket exists and has proper permissions

3. Express backend logs:
   ```bash
   # Look for "video uploaded to aws" message
   ```

### Issue: "AI transcription not working"

**Requirements:**
1. User must have PRO subscription
2. Video file must be < 25MB
3. OpenAI API key must be valid

**Check:**
```bash
# Verify API key
cat .env | grep OPEN_AI_KEY

# Check user subscription
psql -U karthikreddy -d opal_db
SELECT email, trial FROM "User" WHERE email = 'your-email';
```

### Issue: "Video doesn't appear in web app"

**Debug Steps:**
1. Check Express backend completed all steps:
   ```bash
   # Look for these in Terminal 1:
   [1] video uploaded to aws ✓
   [1] 🟢 Transcribed ✓
   [0] POST /api/recording/[id]/complete 200 ✓
   ```

2. Check database:
   ```bash
   psql -U karthikreddy -d opal_db
   SELECT title, processing, source FROM "Video" ORDER BY "createdAt" DESC LIMIT 5;
   ```

3. Refresh web app dashboard

---

## 📊 Quick Status Check Commands

```bash
# Check all ports
lsof -i :3000  # Next.js
lsof -i :5002  # Express
lsof -i :5173  # Desktop app

# Check database
psql -U karthikreddy -d opal_db -c "\dt"

# Check recent videos
psql -U karthikreddy -d opal_db -c "SELECT title, processing FROM \"Video\" ORDER BY \"createdAt\" DESC LIMIT 3;"

# Check AWS S3 bucket
aws s3 ls s3://opal-videos-karthik/ --region eu-north-1 | tail -5
```

---

## 🎯 Testing Checklist Summary

### Basic Testing (No Recording)
- [ ] Start web app + backend (Terminal 1)
- [ ] Login with Clerk
- [ ] Navigate dashboard
- [ ] Test payment upgrade
- [ ] Verify PRO subscription

### Full Testing (With Recording)
- [ ] Complete basic testing
- [ ] Start desktop app (Terminal 2)
- [ ] Verify Socket.io connection
- [ ] Configure recording settings
- [ ] Record 10-second test video
- [ ] Verify upload to S3
- [ ] Check AI transcription
- [ ] View video in web app
- [ ] Test video playback

---

## 📚 Additional Resources

- **QUICK_START.md** - Fast startup instructions
- **INTEGRATION_GUIDE.md** - Architecture details
- **SETUP_GUIDE.md** - Initial environment setup
- **API_KEYS_GUIDE.md** - Environment variables reference

---

**Need Help?** Check the troubleshooting section above or review the Express backend logs in Terminal 1.

**Pro Tip:** Keep all 3 terminals visible side-by-side to see real-time logs during testing!
