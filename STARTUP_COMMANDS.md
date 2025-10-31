# 🚀 Startup Commands - Quick Reference

## Copy-Paste Commands to Start Everything

### 📋 Prerequisites (Run Once)

```bash
# 1. Start PostgreSQL database
brew services start postgresql@14

# 2. Navigate to project
cd /Users/karthikreddy/Downloads/opal-webprodigies-main

# 3. Run database migrations
npx prisma migrate dev
npx prisma generate

# 4. Verify database connection
psql -U karthikreddy -d opal_db -c "SELECT 1"
```

---

## 🎬 Start All Services (Copy & Paste)

### Method 1: All-in-One (Recommended)

Open **3 terminal tabs/windows** and run these commands:

#### Terminal 1: Web App + Express Backend
```bash
cd /Users/karthikreddy/Downloads/opal-webprodigies-main && npm run dev
```

#### Terminal 2: Desktop App
```bash
cd /Users/karthikreddy/Downloads/opal-desktop-app-main && npm run dev
```

#### Terminal 3: Database Viewer (Optional)
```bash
cd /Users/karthikreddy/Downloads/opal-webprodigies-main && npx prisma studio
```

---

### Method 2: Step-by-Step

#### Step 1: Start Web App + Backend

```bash
cd /Users/karthikreddy/Downloads/opal-webprodigies-main
npm run dev
```

**Wait for:**
```
[0] ▲ Next.js 14.2.14
[0] - Local:        http://localhost:3000
[1] listening to port 5002
```

#### Step 2: Start Desktop App (New Terminal)

```bash
cd /Users/karthikreddy/Downloads/opal-desktop-app-main
npm run dev
```

**Wait for:**
```
VITE v5.1.6  ready in XXX ms
➜  Local:   http://localhost:5173/
```

Desktop app window should open automatically.

---

## 🌐 Access Points

Once everything is running:

| Service | URL | What It Does |
|---------|-----|--------------|
| **Web App** | http://localhost:3000 | Main application interface |
| **Express Backend** | http://localhost:5002 | Video processing API |
| **Desktop App** | http://localhost:5173 | Recording interface |
| **Prisma Studio** | http://localhost:5555 | Database viewer (optional) |

---

## ✅ Verify Everything is Running

Run this one-liner:

```bash
lsof -i :3000 && echo "✅ Web app running" || echo "❌ Web app not running"; \
lsof -i :5002 && echo "✅ Express backend running" || echo "❌ Express backend not running"; \
lsof -i :5173 && echo "✅ Desktop app running" || echo "❌ Desktop app not running"
```

**Expected Output:**
```
✅ Web app running
✅ Express backend running
✅ Desktop app running
```

---

## 🛑 Stop All Services

### Stop Individual Services

```bash
# Stop with Ctrl+C in each terminal

# Or find and kill processes
lsof -i :3000 | grep LISTEN | awk '{print $2}' | xargs kill -9  # Next.js
lsof -i :5002 | grep LISTEN | awk '{print $2}' | xargs kill -9  # Express
lsof -i :5173 | grep LISTEN | awk '{print $2}' | xargs kill -9  # Desktop
```

### Stop All at Once

```bash
npx kill-port 3000 5002 5173
```

### Stop PostgreSQL (Optional)

```bash
brew services stop postgresql@14
```

---

## 🐛 Common Issues & Quick Fixes

### "Port already in use"

```bash
# Kill all Opal services
npx kill-port 3000 5002 5173

# Then restart
cd /Users/karthikreddy/Downloads/opal-webprodigies-main && npm run dev
```

### "Cannot connect to database"

```bash
# Start PostgreSQL
brew services start postgresql@14

# Wait 5 seconds, then test
sleep 5 && psql -U karthikreddy -d opal_db -c "SELECT 1"
```

### "Module not found" or "Cannot find package"

```bash
# Reinstall dependencies
cd /Users/karthikreddy/Downloads/opal-webprodigies-main
npm install --legacy-peer-deps

# Desktop app
cd /Users/karthikreddy/Downloads/opal-desktop-app-main
npm install
```

### "Prisma Client not generated"

```bash
cd /Users/karthikreddy/Downloads/opal-webprodigies-main
npx prisma generate
```

---

## 🔄 Restart Everything (Clean Slate)

```bash
# 1. Kill all services
npx kill-port 3000 5002 5173

# 2. Start PostgreSQL if stopped
brew services start postgresql@14

# 3. Wait a moment
sleep 3

# 4. Start web app + backend
cd /Users/karthikreddy/Downloads/opal-webprodigies-main && npm run dev
```

**Then in a new terminal:**

```bash
# 5. Start desktop app
cd /Users/karthikreddy/Downloads/opal-desktop-app-main && npm run dev
```

---

## 📊 Quick Health Check

```bash
# Check all services at once
curl -s http://localhost:3000 > /dev/null && echo "✅ Web app: OK" || echo "❌ Web app: DOWN"
curl -s http://localhost:5002 > /dev/null && echo "✅ Backend: OK" || echo "❌ Backend: DOWN"
curl -s http://localhost:5173 > /dev/null && echo "✅ Desktop: OK" || echo "❌ Desktop: DOWN"
psql -U karthikreddy -d opal_db -c "SELECT 1" > /dev/null 2>&1 && echo "✅ Database: OK" || echo "❌ Database: DOWN"
```

---

## 🎯 First Time Setup (Complete Flow)

```bash
# 1. Start database
brew services start postgresql@14

# 2. Setup main project
cd /Users/karthikreddy/Downloads/opal-webprodigies-main
npm install --legacy-peer-deps
npx prisma generate
npx prisma migrate dev

# 3. Setup desktop app
cd /Users/karthikreddy/Downloads/opal-desktop-app-main
npm install

# 4. Start everything (Terminal 1)
cd /Users/karthikreddy/Downloads/opal-webprodigies-main
npm run dev
```

**In new terminal (Terminal 2):**
```bash
cd /Users/karthikreddy/Downloads/opal-desktop-app-main
npm run dev
```

**Open browser:**
```
http://localhost:3000
```

---

## 📚 Related Documentation

- **TESTING_GUIDE.md** - Complete testing instructions
- **QUICK_START.md** - Quick start guide
- **INTEGRATION_GUIDE.md** - Architecture overview
- **TROUBLESHOOTING.md** - Detailed problem solving

---

## 💡 Pro Tips

1. **Use tmux or iTerm2 split panes** to see all terminals at once
2. **Save these commands as shell aliases** for quick access:
   ```bash
   # Add to ~/.zshrc or ~/.bashrc
   alias opal-start="cd /Users/karthikreddy/Downloads/opal-webprodigies-main && npm run dev"
   alias opal-desktop="cd /Users/karthikreddy/Downloads/opal-desktop-app-main && npm run dev"
   alias opal-stop="npx kill-port 3000 5002 5173"
   ```

3. **Check logs in real-time:**
   ```bash
   # Web app logs
   tail -f /Users/karthikreddy/Downloads/opal-webprodigies-main/.next/trace

   # Express backend logs (in Terminal 1)
   # Look for [1] prefix
   ```

4. **Auto-restart on file changes:**
   - Next.js and Vite already have hot-reload
   - Express backend restarts automatically (nodemon not configured, but can be added)

---

**Quick Start Summary:**
1. Terminal 1: `cd opal-webprodigies-main && npm run dev`
2. Terminal 2: `cd opal-desktop-app-main && npm run dev`
3. Browser: http://localhost:3000
4. Done! 🎉
