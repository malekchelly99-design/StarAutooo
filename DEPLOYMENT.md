# Star Auto Deployment Guide

This guide provides step-by-step instructions to deploy the Star Auto application to be accessible from anywhere.

## Architecture Overview

- **Frontend**: React + Vite + Tailwind CSS (deployed to Vercel/Netlify)
- **Backend**: Node.js + Express (deployed to Render/Railway)
- **Database**: MongoDB (deployed to MongoDB Atlas)

---

## Phase 1: Deploy MongoDB to MongoDB Atlas

### Step 1.1: Create MongoDB Atlas Account
1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Click "Try Free" and create an account
3. Verify your email address

### Step 1.2: Create a New Cluster
1. Click "Create" to start a new cluster
2. Choose the free tier (M0)
3. Select a region close to your target audience
4. Click "Create Cluster" (this takes a few minutes)

### Step 1.3: Create Database User
1. Go to "Database Access" in the left sidebar
2. Click "Add New Database User"
3. Create a user with:
   - Username: `starauto_admin`
   - Password: Generate a strong password
   - Database User Privileges: `Read and write to any database`
4. Click "Add User"

### Step 1.4: Configure Network Access
1. Go to "Network Access" in the left sidebar
2. Click "Add IP Address"
3. Select "Allow Access from Anywhere" (0.0.0.0/0)
4. Click "Confirm"

### Step 1.5: Get Connection String
1. Go to "Database" in the left sidebar
2. Click "Connect" on your cluster
3. Select "Connect your application"
4. Copy the connection string:
   ```
   mongodb+srv://starauto_admin:<password>@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority
   ```
5. Replace `<password>` with your actual password

---

## Phase 2: Prepare Code for Deployment

### Step 2.1: Configure Backend Environment Variables
1. Open `backend/.env` (or create it if it doesn't exist)
2. Update with the following content:

```env
# Server Configuration
PORT=5000
NODE_ENV=production

# MongoDB Connection (use your Atlas connection string)
MONGODB_URI=mongodb+srv://starauto_admin:your_password@cluster0.xxxxx.mongodb.net/star-auto?retryWrites=true&w=majority

# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key-at-least-32-characters
JWT_EXPIRE=7d

# Frontend URL (update after deploying frontend)
FRONTEND_URL=https://your-frontend.vercel.app
```

### Step 2.2: Build the Frontend
1. Run the build command:
   ```bash
   cd frontend
   npm run build
   ```
2. The built files will be in `frontend/dist`

### Step 2.3: Verify Backend Start Script
Ensure `backend/package.json` has the correct start script:
```json
"scripts": {
  "start": "node server.js",
  "dev": "nodemon server.js"
}
```

---

## Phase 3: Deploy Backend to Render/Railway

### Option A: Deploy to Render (Recommended)

#### Step 3A.1: Create Render Account
1. Go to [Render](https://render.com)
2. Click "Sign Up" and create a free account
3. Connect your GitHub account

#### Step 3A.2: Create a Web Service
1. Click "New +" and select "Web Service"
2. Connect your GitHub repository
3. Configure the service:
   - **Name**: `star-auto-backend`
   - **Root Directory**: `backend`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
   - **Plan**: Free

#### Step 3A.3: Set Environment Variables
1. Scroll to the "Environment Variables" section
2. Add the following variables:
   ```
   MONGODB_URI=your-mongodb-atlas-connection-string
   JWT_SECRET=your-super-secret-jwt-key
   JWT_EXPIRE=7d
   NODE_ENV=production
   PORT=5000
   FRONTEND_URL=https://your-frontend.vercel.app
   ```

#### Step 3A.4: Deploy
1. Click "Create Web Service"
2. Wait for the build to complete (5-10 minutes)
3. Once deployed, you'll get a URL like: `https://star-auto-backend.onrender.com`

### Option B: Deploy to Railway

#### Step 3B.1: Create Railway Account
1. Go to [Railway](https://railway.app)
2. Sign up with GitHub
3. Verify your email

#### Step 3B.2: Create New Project
1. Click "New Project"
2. Select "Deploy from GitHub repo"
3. Choose your repository
4. Select the backend directory

#### Step 3B.3: Configure Service
1. Under "Settings", set:
   - **Root Directory**: `backend`
   - **Start Command**: `npm start`

#### Step 3B.4: Set Environment Variables
1. Go to "Variables" tab
2. Add all required environment variables (same as Render)

#### Step 3B.5: Deploy
1. Click "Deploy"
2. Wait for deployment to complete
3. Get your backend URL from the Railway dashboard

---

## Phase 4: Deploy Frontend to Vercel

### Step 4.1: Create Vercel Account
1. Go to [Vercel](https://vercel.com)
2. Sign up with GitHub
3. Grant repository access

### Step 4.2: Import Project
1. Click "Add New..." → "Project"
2. Select your GitHub repository
3. Configure the project:
   - **Framework Preset**: Vite
   - **Root Directory**: `frontend`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`

### Step 4.3: Set Environment Variables
1. Go to "Environment Variables" section
2. Add:
   ```
   VITE_API_URL=https://your-backend-url.onrender.com/api
   ```

### Step 4.4: Deploy
1. Click "Deploy"
2. Wait for the build to complete (2-5 minutes)
3. Get your frontend URL: `https://your-project.vercel.app`

### Step 4.5: Configure Domain (Optional)
1. Go to "Settings" → "Domains"
2. Add your custom domain
3. Update DNS records as instructed

---

## Phase 5: Update Backend with Frontend URL

### Step 5.1: Update Backend Environment Variable
1. Go to your backend hosting service (Render/Railway)
2. Update `FRONTEND_URL` with your actual frontend URL:
   ```
   FRONTEND_URL=https://your-project.vercel.app
   ```
3. Redeploy if necessary

---

## Phase 6: Seed Database (Optional)

### Step 6.1: Run Seed Script on Backend
1. Connect to your backend server via SSH or use a terminal
2. Run the seed command:
   ```bash
   npm run seed
   ```
   Or manually add seed data through the application.

---

## Verification Checklist

After deployment, verify:

- [ ] Backend health check: `https://your-backend-url.onrender.com/api/health`
- [ ] Frontend loads without errors
- [ ] User registration/login works
- [ ] Car listings are displayed
- [ ] Admin panel is accessible
- [ ] CORS errors are resolved

---

## Troubleshooting

### CORS Errors
- Ensure `FRONTEND_URL` is correctly set in backend environment variables
- Restart the backend service after updating CORS settings

### MongoDB Connection Issues
- Verify the connection string is correct
- Ensure network access is configured (0.0.0.0/0 for Atlas)
- Check that the database user has correct permissions

### Frontend API Calls Failing
- Verify `VITE_API_URL` is set correctly in Vercel
- Ensure the backend URL is accessible publicly
- Check that the backend is running and responding

### Images Not Loading
- Ensure the backend serves static files correctly
- Check file upload paths in the deployed environment

---

## Environment Variables Summary

### Backend (.env)
| Variable | Description |
|----------|-------------|
| `PORT` | Server port (default: 5000) |
| `NODE_ENV` | Environment (production/development) |
| `MONGODB_URI` | MongoDB Atlas connection string |
| `JWT_SECRET` | Secret key for JWT tokens |
| `JWT_EXPIRE` | Token expiration time |
| `FRONTEND_URL` | URL of the deployed frontend |

### Frontend (.env)
| Variable | Description |
|----------|-------------|
| `VITE_API_URL` | Backend API URL (e.g., https://backend.onrender.com/api) |

---

## Quick Reference: Deployment URLs

After deployment, your URLs will be:
- **Frontend**: `https://star-auto-frontend.vercel.app`
- **Backend API**: `https://star-auto-backend.onrender.com`
- **MongoDB**: Atlas cluster connection string

---

## Security Recommendations

1. **Use strong JWT_SECRET** (at least 32 characters)
2. **Keep environment variables secure** - never commit `.env` files
3. **Enable HTTPS** on both frontend and backend
4. **Regularly update dependencies** to patch security vulnerabilities
5. **Use MongoDB Atlas security features** (IP whitelist, encryption)

---

## Updating the Application

### Frontend Updates
1. Push changes to GitHub
2. Vercel auto-deploys on push

### Backend Updates
1. Push changes to GitHub
2. Render/Railway auto-deploys on push
3. Or manually trigger a redeploy from the dashboard

---

## Support

For issues:
1. Check server logs in the hosting dashboard
2. Verify all environment variables are set
3. Test API endpoints individually using Postman or curl
4. Ensure MongoDB Atlas cluster is running
