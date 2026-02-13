# Deployment Guide

## Option 1: Railway (Recommended - Easiest)

1. **Create a GitHub repository:**
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git branch -M main
   git remote add origin YOUR_GITHUB_REPO_URL
   git push -u origin main
   ```

2. **Deploy to Railway:**
   - Go to https://railway.app
   - Sign up/login with GitHub
   - Click "New Project" → "Deploy from GitHub repo"
   - Select your repository
   - Railway will auto-detect Node.js and deploy

3. **Set environment variable:**
   - In Railway dashboard, go to your project
   - Click "Variables" tab
   - Add: `ADMIN_PASSWORD` = your_secure_password
   - Click "Deploy"

4. **Get your URL:**
   - Click "Settings" → "Generate Domain"
   - Your site will be live at: yourapp.railway.app

---

## Option 2: Render

1. **Push to GitHub** (same as above)

2. **Deploy to Render:**
   - Go to https://render.com
   - Sign up/login
   - Click "New +" → "Web Service"
   - Connect your GitHub repository
   - Settings:
     - Name: valentine-photo-blog
     - Environment: Node
     - Build Command: `npm install`
     - Start Command: `npm start`
   - Add Environment Variable:
     - Key: `ADMIN_PASSWORD`
     - Value: your_secure_password
   - Click "Create Web Service"

3. **Your site will be live at:** yourapp.onrender.com

---

## Option 3: Vercel

1. **Push to GitHub** (same as above)

2. **Deploy to Vercel:**
   - Go to https://vercel.com
   - Sign up/login with GitHub
   - Click "Add New" → "Project"
   - Import your repository
   - Add Environment Variable:
     - Name: `ADMIN_PASSWORD`
     - Value: your_secure_password
   - Click "Deploy"

3. **Your site will be live at:** yourapp.vercel.app

**Note:** Vercel has limitations with file uploads. Railway or Render are better for this project.

---

## Quick Start (Railway - Fastest)

If you don't have Git installed:

1. Install Git: https://git-scm.com/download/win
2. Run these commands in your project folder:
   ```bash
   git init
   git add .
   git commit -m "Valentine photo blog"
   ```
3. Create a new repository on GitHub.com
4. Follow the commands GitHub shows you to push
5. Deploy on Railway as described above

---

## Important Notes

- Change `ADMIN_PASSWORD` to something secure
- Free tiers have limitations (Railway: $5 credit/month, Render: slower after inactivity)
- Photos are stored on the server - they'll persist on Railway/Render
- Share your live URL with others to view photos
