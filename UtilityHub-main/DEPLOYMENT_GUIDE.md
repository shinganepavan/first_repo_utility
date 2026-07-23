# Render Deployment Guide

This guide will help you deploy your Anti-Gravity Tools project on Render using the newer Render Blueprint system.

## Prerequisites

- GitHub account with your project pushed to a repository
- Render account (free tier available)
- Project structure ready with `render.yaml` file

## Step-by-Step Deployment

### 1. Push Your Code to GitHub

Make sure your project is pushed to a GitHub repository:

```bash
git init
git add .
git commit -m "Initial commit for Render deployment"
git branch -M main
git remote add origin https://github.com/yourusername/your-repo.git
git push -u origin main
```

### 2. Create Render Account

1. Go to [render.com](https://render.com)
2. Sign up/login with your GitHub account
3. Verify your email if required

### 3. Deploy Using render.yaml (Blueprint)

Render's newer Blueprint system automatically deploys your services based on the `render.yaml` file:

1. In your Render dashboard, click **"New +"** button
2. Select **"Blueprint"** from the options
3. Connect your GitHub repository
4. Render will automatically detect your `render.yaml` file
5. Review the configuration and click **"Apply Blueprint"**

### 4. What Gets Deployed

The `render.yaml` file will create:

- **PostgreSQL Database**: `anti-gravity-db` (Free tier)
- **Backend Service**: `anti-gravity-backend` (FastAPI on Python)
- **Frontend Service**: `anti-gravity-frontend` (React on Node.js)

### 5. Environment Variables

Render automatically sets up these environment variables:

**Backend:**
- `DATABASE_URL` - Automatically connected to PostgreSQL database
- `SECRET_KEY` - Auto-generated for security
- `PYTHON_VERSION` - Set to 3.11.0

**Frontend:**
- `VITE_API_URL` - Automatically set to backend URL with `/api/v1` suffix

### 6. Monitor Deployment

1. Watch the deployment logs in Render dashboard
2. Wait for all services to show "Live" status
3. Your frontend will be available at: `https://anti-gravity-frontend.onrender.com`
4. Your backend API will be available at: `https://anti-gravity-backend.onrender.com`

### 7. Update CORS (Important)

After deployment, you need to add your frontend URL to the backend CORS:

1. Go to your backend service in Render dashboard
2. Navigate to **Environment** tab
3. Add environment variable: `BACKEND_CORS_ORIGINS`
4. Set value to: `["https://anti-gravity-frontend.onrender.com"]`
5. Click **"Save Changes"** and wait for redeploy

### 8. Test Your Deployment

1. Visit your frontend URL
2. Try registering a new user
3. Test the authentication flow
4. Verify all features work correctly

## Troubleshooting

### Backend fails to start

- Check the deployment logs in Render dashboard
- Ensure `requirements.txt` is in the `backend/` folder
- Verify Python version compatibility

### Frontend can't connect to backend

- Verify CORS is configured correctly
- Check that `VITE_API_URL` is set correctly
- Ensure backend service is running

### Database connection issues

- Verify PostgreSQL database is created
- Check `DATABASE_URL` environment variable
- Ensure the database URL format is correct

### Build failures

- Check that all dependencies are in `requirements.txt` and `package.json`
- Verify build commands in `render.yaml`
- Review build logs for specific errors

## Manual Deployment (Alternative)

If Blueprint deployment fails, you can deploy manually:

### Backend (FastAPI)

1. **New Web Service**
   - Runtime: Python
   - Build Command: `cd backend && pip install -r requirements.txt`
   - Start Command: `cd backend && uvicorn app.main:app --host 0.0.0.0 --port $PORT`

2. **Add Environment Variables**
   - `DATABASE_URL`: From your PostgreSQL database
   - `SECRET_KEY`: Generate a secure random key

### Frontend (React)

1. **New Web Service**
   - Runtime: Node
   - Build Command: `cd frontend && npm install && npm run build`
   - Start Command: `cd frontend && npm run preview -- --host 0.0.0.0 --port $PORT`

2. **Add Environment Variable**
   - `VITE_API_URL`: Your backend URL + `/api/v1`

### PostgreSQL Database

1. **New PostgreSQL Database**
   - Name: `anti-gravity-db`
   - Database: `utilityhub`
   - User: `utilityhub_user`

## Cost

- Free tier includes:
  - 1 PostgreSQL database (512MB)
  - 2 web services (512MB RAM each)
  - 750 hours/month runtime
- No credit card required for free tier

## Next Steps

After successful deployment:
- Set up custom domain (optional)
- Configure SSL certificates (automatic on Render)
- Set up monitoring and alerts
- Configure backup strategies for database

## Support

If you encounter issues:
- Check Render documentation: [docs.render.com](https://docs.render.com)
- Review deployment logs in Render dashboard
- Ensure all files are committed to GitHub
