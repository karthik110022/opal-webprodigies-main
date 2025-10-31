# API Keys Setup Guide for Opal

This guide will walk you through getting all the required API keys to run the Opal application.

---

## 🔴 REQUIRED Services (App won't work without these)

### 1. Clerk - User Authentication

**Why you need it:** Users must be able to sign up and log in

**Steps:**
1. Go to [https://clerk.com/](https://clerk.com/)
2. Click "Start building for free"
3. Sign up with your email or GitHub
4. Create a new application:
   - Click "Add application"
   - Name it: "Opal" (or any name)
   - Choose authentication methods:
     - ✅ Email
     - ✅ Google (recommended)
     - ✅ GitHub (optional)
5. After creating, you'll see the API Keys page
6. Copy the keys:
   ```
   NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...
   CLERK_SECRET_KEY=sk_test_...
   ```
7. Paste them into your `.env` file

**Cost:** FREE (up to 10,000 monthly active users)

---

### 2. Stripe - Payment Processing

**Why you need it:** For PRO subscriptions and billing

**Steps:**
1. Go to [https://stripe.com/](https://stripe.com/)
2. Click "Start now" and sign up
3. Complete account setup (you can skip business verification for testing)
4. Go to [Developers > API Keys](https://dashboard.stripe.com/apikeys)
5. Copy your keys (use Test Mode):
   ```
   NEXT_PUBLIC_STRIPE_PUBLISH_KEY=pk_test_...
   STRIPE_CLIENT_SECRET=sk_test_...
   ```
6. Create a subscription product:
   - Go to [Products](https://dashboard.stripe.com/products)
   - Click "+ Add Product"
   - Product name: "Opal PRO"
   - Pricing model: "Recurring"
   - Price: $19.99/month (or your choice)
   - Click "Add product"
   - Copy the **Price ID** (starts with `price_...`)
   ```
   STRIPE_SUBSCRIPTION_PRICE_ID=price_...
   ```
7. Paste all three values into your `.env` file

**Cost:** FREE to test (Stripe takes 2.9% + $0.30 per transaction in production)

---

## 🟡 IMPORTANT Services (Major features won't work)

### 3. OpenAI - AI Transcription & Summaries

**Why you need it:** For automatic video transcription and AI-generated summaries

**Steps:**
1. Go to [https://platform.openai.com/](https://platform.openai.com/)
2. Sign up or log in
3. Go to [API Keys](https://platform.openai.com/api-keys)
4. Click "Create new secret key"
5. Name it: "Opal"
6. Copy the key (starts with `sk-...`)
   ```
   OPEN_AI_KEY=sk-...
   ```
7. Paste into your `.env` file
8. **Add billing:** You need to add a payment method
   - Go to [Billing](https://platform.openai.com/settings/organization/billing/overview)
   - Add payment method
   - Start with $5-10 credit

**Cost:**
- Pay as you go
- Whisper (transcription): ~$0.006/minute of audio
- GPT-4o-mini (summaries): ~$0.15/1M input tokens
- Example: 100 hours of video transcription ≈ $36

---

### 4. AWS CloudFront + S3 - Video Storage & Streaming

**Why you need it:** To store and stream videos

**Steps:**

#### Part 1: Create S3 Bucket
1. Go to [AWS Console](https://console.aws.amazon.com/)
2. Sign up for AWS account (requires credit card, but won't charge for small usage)
3. Go to **S3** service
4. Click "Create bucket"
   - Bucket name: "opal-videos-[your-name]" (must be unique)
   - Region: Choose closest to you
   - **Uncheck** "Block all public access" (we'll use CloudFront)
   - Create bucket

#### Part 2: Create CloudFront Distribution
1. Go to **CloudFront** service
2. Click "Create distribution"
3. Settings:
   - Origin domain: Select your S3 bucket
   - Origin access: "Origin access control settings (recommended)"
   - Click "Create new OAC" if needed
   - Viewer protocol policy: "Redirect HTTP to HTTPS"
   - Allowed HTTP methods: "GET, HEAD, OPTIONS, PUT, POST, PATCH, DELETE"
   - Cache policy: "CachingDisabled" (for development)
4. Click "Create distribution"
5. **Update S3 bucket policy:**
   - CloudFront will show you a bucket policy
   - Copy it
   - Go back to S3 > Your bucket > Permissions > Bucket policy
   - Paste and save
6. Copy your CloudFront domain (e.g., `d111111abcdef8.cloudfront.net`)
   ```
   NEXT_PUBLIC_CLOUD_FRONT_STREAM_URL=https://d111111abcdef8.cloudfront.net
   ```
7. Paste into your `.env` file

**Cost:**
- S3: ~$0.023/GB/month storage + ~$0.09/GB transfer
- CloudFront: First 1TB/month free, then ~$0.085/GB
- Example: 100GB videos + 1TB streaming ≈ $2-3/month

**Alternative (Easier but Limited):**
- Use [Cloudinary](https://cloudinary.com/) (FREE tier: 25GB storage, 25GB bandwidth/month)
- Or [Vercel Blob](https://vercel.com/docs/storage/vercel-blob) (simpler but costs more)

---

## 🟢 OPTIONAL Services (Nice to have)

### 5. Voiceflow - AI Chatbot

**Why you need it:** For AI-powered customer support chatbot

**Steps:**
1. Go to [https://www.voiceflow.com/](https://www.voiceflow.com/)
2. Sign up for free account
3. Create a new project:
   - Choose "Chat Assistant"
   - Name it "Opal Support"
4. Build your chatbot (or skip for now)
5. Go to Project Settings > API Keys
6. Copy your keys:
   ```
   NEXT_PUBLIC_VOICE_FLOW_KEY=VF....
   VOICEFLOW_API_KEY=VF....
   ```
7. Paste into your `.env` file

**Cost:** FREE tier available (unlimited development, 100 interactions/month in production)

**Can skip:** The app works without this, you just won't have the AI chatbot

---

### 6. Gmail - Email Notifications

**Why you need it:** To send email notifications (e.g., "Your video got its first view!")

**Steps:**
1. Enable 2-Factor Authentication on your Gmail account:
   - Go to [Google Account Security](https://myaccount.google.com/security)
   - Turn on "2-Step Verification"
2. Create App Password:
   - Go to [App Passwords](https://myaccount.google.com/apppasswords)
   - Select "Mail" and "Other (Custom name)"
   - Name it: "Opal"
   - Click "Generate"
   - Copy the 16-character password (no spaces)
3. Update `.env`:
   ```
   MAILER_EMAIL=your-email@gmail.com
   MAILER_PASSWORD=abcd efgh ijkl mnop (remove spaces when pasting)
   ```

**Cost:** FREE

**Can skip:** The app works without this, you just won't send email notifications

---

### 7. Wix Integration

**Why you need it:** Only if you want Wix content management integration

**Steps:**
1. Go to [https://manage.wix.com/](https://manage.wix.com/)
2. Create account and site (if needed)
3. Get OAuth key from Wix developer settings

**Can skip:** Most users don't need this

---

## 📋 Priority Order for Setup

### Start Here (Minimum Viable Product):
1. ✅ **Database** (Already done!)
2. 🔴 **Clerk** - Required to log in
3. 🔴 **Stripe** - Required for subscriptions

**With just these 3, you can:**
- Sign up / log in
- Create workspaces and folders
- Manage subscriptions
- Test the UI and navigation

### Add Next (Core Features):
4. 🟡 **OpenAI** - For AI transcription
5. 🟡 **CloudFront/S3** - For video upload/streaming

**With these added, you can:**
- Upload videos
- Get AI transcriptions and summaries
- Full video management

### Add Later (Enhancement):
6. 🟢 **Voiceflow** - AI chatbot
7. 🟢 **Gmail** - Email notifications
8. 🟢 **Wix** - Content management

---

## 🧪 Testing Without Full Setup

You can test the application with minimal setup:

### Phase 1: UI Testing (Clerk + Database only)
- ✅ User authentication
- ✅ Workspace creation
- ✅ Folder management
- ✅ Navigation and layout
- ❌ Video upload (will fail)
- ❌ AI features (will fail)

### Phase 2: Full Testing (All keys)
- ✅ Everything works!

---

## 💰 Cost Summary

| Service | Monthly Cost | Free Tier |
|---------|-------------|-----------|
| PostgreSQL (Local) | $0 | ∞ |
| Clerk | $0 | 10K users |
| Stripe | $0* | ∞ transactions |
| OpenAI | ~$5-20 | $5 credit once |
| AWS S3 + CloudFront | ~$2-10 | 12 months free |
| Voiceflow | $0 | 100 interactions |
| Gmail | $0 | ∞ |

**Total to run production app: $7-30/month depending on usage**

**Total for development/testing: $0-5/month**

*Stripe takes 2.9% + $0.30 per transaction

---

## 🚀 Quick Start Commands

After adding API keys to `.env`:

```bash
# 1. Start Prisma Studio (view database)
npx prisma studio

# 2. Start development server (in a new terminal)
npm run dev

# 3. Open application
# http://localhost:3000
```

---

## ✅ Verification Checklist

Before running the app, verify you have:

**Required:**
- [x] Database created (`opal_db`)
- [ ] `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` in `.env`
- [ ] `CLERK_SECRET_KEY` in `.env`
- [ ] `NEXT_PUBLIC_STRIPE_PUBLISH_KEY` in `.env`
- [ ] `STRIPE_CLIENT_SECRET` in `.env`
- [ ] `STRIPE_SUBSCRIPTION_PRICE_ID` in `.env`

**Recommended:**
- [ ] `OPEN_AI_KEY` in `.env`
- [ ] `NEXT_PUBLIC_CLOUD_FRONT_STREAM_URL` in `.env`

**Optional:**
- [ ] Email credentials in `.env`
- [ ] Voiceflow keys in `.env`

---

## 🐛 Common Issues

### "Invalid Clerk API key"
- Double-check you copied the full key
- Make sure you're using the **Publishable Key** for `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`
- Make sure you're using the **Secret Key** for `CLERK_SECRET_KEY`

### "Stripe is not configured"
- Verify all 3 Stripe variables are set
- Make sure the Price ID starts with `price_`
- Check you're in Test Mode when getting keys

### "OpenAI API error"
- Verify you added billing info to OpenAI account
- Check you have credits available
- API key should start with `sk-`

### Videos not loading
- Check CloudFront URL is correct (should include `https://`)
- Verify S3 bucket policy allows CloudFront access
- Check video files are actually uploaded to S3

---

## 📚 Official Documentation Links

- [Clerk Docs](https://clerk.com/docs)
- [Stripe Docs](https://stripe.com/docs)
- [OpenAI Docs](https://platform.openai.com/docs)
- [AWS S3 Docs](https://docs.aws.amazon.com/s3/)
- [AWS CloudFront Docs](https://docs.aws.amazon.com/cloudfront/)
- [Voiceflow Docs](https://www.voiceflow.com/docs)

---

**Need Help?** If you get stuck on any service, check their documentation or look for YouTube tutorials on setting up that specific service.
