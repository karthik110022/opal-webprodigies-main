# 🚀 Quick Start Guide

## ✅ Integration Complete!

The Express backend server has been successfully integrated into your Next.js project.

## 🎯 What Changed?

### New Folder Structure
```
opal-webprodigies-main/
├── server/              ← NEW! Express backend
│   ├── server.js        ← Video processing server
│   ├── temp_upload/     ← Temporary video storage
│   └── .env             ← Server configuration
```

### New npm Scripts
```json
{
  "dev": "concurrently \"npm run dev:web\" \"npm run dev:server\"",
  "dev:web": "next dev",
  "dev:server": "cd server && node server.js"
}
```

### Updated Environment Variables
The main `.env` file now includes:
- ✅ AWS S3 configuration (video storage)
- ✅ Express server endpoints
- ✅ Electron desktop app connection

## 🏃 How to Start

### 1. Start Both Servers
```bash
npm run dev
```

This will start:
- **Next.js Web App**: http://localhost:3000
- **Express Backend**: http://localhost:5002

### 2. Open Your Browser
```
http://localhost:3000
```

## 🎬 Testing Video Features

### Without Desktop App (Current State)
- ✅ Browse videos (if any exist in database)
- ✅ View video metadata
- ✅ Test payment upgrade (demo mode)
- ❌ **Cannot record/upload videos** (needs desktop app)

### With Desktop App
To enable video recording:
1. Navigate to `opal-desktop-app-main` folder
2. Run `npm run dev` (port 5173)
3. Use the desktop app to record videos
4. Videos will automatically sync to the web app

## 📊 System Health Check

Run these commands to verify everything is working:

```bash
# Check if both servers are running
lsof -i :3000  # Should show Next.js
lsof -i :5002  # Should show Express

# Check database connection
npm run dev:web
# Look for: "Database connected" message

# Check server logs
npm run dev:server
# Look for: "listening to port 5002"
```

## ⚠️ Important Notes

### Database Setup
Make sure PostgreSQL is running:
```bash
# Check database
psql -U karthikreddy -d opal_db -c "SELECT 1"

# Run migrations if needed
npx prisma migrate dev
```

### AWS S3 Setup
Video uploads require valid AWS credentials in `.env`:
```env
BUCKET_NAME=opal-videos-karthik
BUCKET_REGION=eu-north-1
ACCESS_KEY=<your-key>
SECRET_KEY=<your-secret>
```

### OpenAI Setup
AI features (transcription, summaries) require:
```env
OPEN_AI_KEY=<your-openai-api-key>
```

## 🐛 Common Issues

### "Port 3000 is already in use"
```bash
# Find and kill the process
lsof -i :3000
kill -9 <PID>
```

### "Port 5002 is already in use"
```bash
# Find and kill the process
lsof -i :5002
kill -9 <PID>
```

### "Cannot connect to database"
```bash
# Start PostgreSQL
brew services start postgresql@14
# Or
pg_ctl -D /usr/local/var/postgres start
```

### "concurrently not found"
```bash
npm install --legacy-peer-deps
```

## 📚 Next Steps

1. **Read INTEGRATION_GUIDE.md** for detailed architecture
2. **Read SETUP_GUIDE.md** for environment setup
3. **Test the application** at http://localhost:3000
4. **Set up the desktop app** for recording features

## 🎉 Success Indicators

You'll know everything is working when:
- ✅ `npm run dev` starts both servers without errors
- ✅ http://localhost:3000 loads the web interface
- ✅ You can log in with Clerk authentication
- ✅ Database queries work (no connection errors)
- ✅ Payment upgrade redirects to success page (demo mode)

## 📞 Need Help?

Check these files:
- **INTEGRATION_GUIDE.md** - Complete integration documentation
- **SETUP_GUIDE.md** - Initial setup instructions
- **API_KEYS_GUIDE.md** - Environment variables guide
- **README.md** - Project overview

---

**Status**: ✅ Integration Complete | Ready to Run!
