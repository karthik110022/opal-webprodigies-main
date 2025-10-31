# Opal Integration Guide

## 🎯 Overview

This project now includes both the **Next.js web application** and the **Express backend server** for video processing, all in one unified codebase.

## 📁 Project Structure

```
opal-webprodigies-main/
├── src/                    # Next.js frontend application
│   ├── app/               # Next.js pages and API routes
│   ├── components/        # React components
│   ├── actions/           # Server actions
│   └── ...
├── server/                # Express backend server (NEW)
│   ├── server.js          # Main Express server file
│   ├── temp_upload/       # Temporary storage for video chunks
│   ├── package.json       # Server dependencies
│   └── .env               # Server environment variables
├── package.json           # Main project dependencies
└── .env                   # Unified environment variables
```

## 🏗️ Architecture

The application consists of **3 interconnected services**:

```
┌─────────────────────────────────────────────────────────────┐
│                    OPAL ECOSYSTEM                            │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  1. Desktop App (Electron)          Port: 5173             │
│     - Screen/video recording                                │
│     - Sends chunks via Socket.io ──────┐                    │
│                                         ↓                    │
│  2. Express Backend Server           Port: 5002             │
│     - Receives video chunks                                  │
│     - Uploads to AWS S3                                      │
│     - AI transcription (Whisper)                             │
│     - AI titles (GPT-3.5)                                    │
│     - Calls Next.js API ──────────────┐                      │
│                                         ↓                    │
│  3. Next.js Web App                  Port: 3000             │
│     - Video management interface                             │
│     - API routes for metadata                                │
│     - PostgreSQL database                                    │
│     - User views videos here                                 │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

## 🚀 How to Run

### Option 1: Run Everything Together (Recommended)

```bash
npm run dev
```

This starts:
- ✅ Next.js web app on `http://localhost:3000`
- ✅ Express backend server on `http://localhost:5002`

### Option 2: Run Services Separately

```bash
# Terminal 1: Run Next.js only
npm run dev:web

# Terminal 2: Run Express backend only
npm run dev:server
```

## 🔑 Environment Variables

All environment variables are now unified in the main `.env` file:

### Required for Video Upload/Recording:
```env
# AWS S3 Configuration
BUCKET_NAME=opal-videos-karthik
BUCKET_REGION=eu-north-1
ACCESS_KEY=<your-aws-access-key>
SECRET_KEY=<your-aws-secret-key>

# OpenAI (for transcription and AI features)
OPEN_AI_KEY=<your-openai-api-key>

# Server Communication
NEXT_API_HOST=http://localhost:3000/api/
ELECTRON_HOST=http://localhost:5173
```

## 🎬 Video Recording Workflow

1. **User Records Video** (Desktop App)
   - Electron app captures screen/camera
   - Sends video chunks via Socket.io to Express server

2. **Video Processing** (Express Backend)
   - Receives and temporarily stores video chunks
   - Uploads complete video to AWS S3
   - For PRO users: Transcribes audio with OpenAI Whisper
   - For PRO users: Generates title/summary with GPT-3.5
   - Calls Next.js API endpoints to save metadata

3. **Video Storage** (Next.js + PostgreSQL)
   - Saves video metadata to PostgreSQL database
   - Updates processing status
   - Makes video available for viewing

4. **Video Viewing** (Web App)
   - Users view videos through CloudFront CDN
   - Comments, sharing, and analytics tracked

## 📡 API Integration

The Express server communicates with Next.js through these endpoints:

| Endpoint | Method | Purpose |
|----------|--------|---------|
| `/api/recording/[id]/processing` | POST | Start video processing |
| `/api/recording/[id]/transcribe` | POST | Save AI transcription |
| `/api/recording/[id]/complete` | POST | Mark processing complete |

## 🛠️ Troubleshooting

### Server won't start?
```bash
# Check if ports are available
lsof -i :3000  # Next.js
lsof -i :5002  # Express

# Kill processes if needed
kill -9 <PID>
```

### Video upload not working?
1. ✅ Check AWS credentials in `.env`
2. ✅ Verify S3 bucket exists and has correct permissions
3. ✅ Ensure Express server is running on port 5002
4. ✅ Check `server/temp_upload/` folder has write permissions

### Transcription not working?
1. ✅ Check OpenAI API key is valid
2. ✅ Verify user has PRO subscription in database
3. ✅ Check video file size < 25MB (Whisper limit)

## 🔒 Security Notes

- ⚠️ Never commit `.env` files to version control
- ⚠️ AWS credentials should be stored securely
- ⚠️ Use IAM roles with minimum required permissions
- ⚠️ OpenAI API keys should be rotated regularly

## 📦 Dependencies

### Main Project (Next.js)
- `concurrently` - Run multiple servers simultaneously
- All existing Next.js dependencies

### Express Backend (`/server`)
- `express` - Web server framework
- `socket.io` - Real-time video chunk streaming
- `@aws-sdk/client-s3` - AWS S3 uploads
- `openai` - AI transcription and title generation
- `cors` - Cross-origin requests
- `dotenv` - Environment variables

## 🎯 Next Steps

1. ✅ Run `npm run dev` to start both servers
2. ✅ Open `http://localhost:3000` in your browser
3. ✅ Test the payment upgrade (demo mode - no Stripe needed)
4. ⚠️ Video recording requires the **Electron desktop app** (separate project)
5. ⚠️ Without the desktop app, video upload will not work

## 📝 Notes

- **Payment System**: Currently in demo mode (no real Stripe integration)
- **Video Recording**: Requires the Electron desktop app to be running
- **Database**: PostgreSQL must be running and configured
- **Cloud Storage**: AWS S3 is required for video storage
- **AI Features**: Only available for PRO subscription users

## 🤝 Related Projects

This is part of the **Opal ecosystem**:
1. **opal-webprodigies-main** (This project) - Web application + Backend
2. **opal-desktop-app-main** - Electron app for recording
3. ~~**opal-express-main**~~ - ✅ Now integrated into this project!

---

**Need help?** Check the main `README.md` or `SETUP_GUIDE.md` for initial setup instructions.
