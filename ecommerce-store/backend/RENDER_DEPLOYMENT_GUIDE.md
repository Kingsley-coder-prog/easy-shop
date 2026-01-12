# Render Deployment Guide & Swagger Setup

## Step 1: Prepare Your Repository

### 1.1 Push code to GitHub
```bash
git init
git add .
git commit -m "Initial commit"
git remote add origin https://github.com/YOUR_USERNAME/ecommerce-store.git
git push -u origin main
```

Make sure the following files are committed:
- `package.json` ✅ (updated with production scripts)
- `server.js` ✅ (configured with Swagger)
- `swagger.json` ✅ (API documentation)
- `render.yaml` ✅ (Render configuration)
- `.env.example` (create this - see Step 1.2)
- `.gitignore` (should have `.env`, `node_modules`, etc.)

### 1.2 Create `.env.example` file
Create `backend/.env.example` with placeholder values:
```env
NODE_ENV=production
PORT=5000
JWT_SECRET=your_jwt_secret_here
JWT_EXPIRY=7d
GOOGLE_SHEET_ID=your_google_sheet_id
PAYSTACK_SECRET_KEY=your_paystack_secret
PAYSTACK_PUBLIC_KEY=your_paystack_public_key
CORS_ORIGIN=*
```

---

## Step 2: Create Render Account

1. Go to [render.com](https://render.com)
2. Sign up with GitHub (recommended for easy integration)
3. Authorize Render to access your GitHub repositories

---

## Step 3: Deploy to Render

### 3.1 Create New Web Service
1. Click **"New +"** button → select **"Web Service"**
2. Connect your GitHub repository
3. Select the repository: `ecommerce-store`
4. Configure:
   - **Name:** `shopeasy-api`
   - **Root Directory:** `backend` (IMPORTANT!)
   - **Runtime:** `Node`
   - **Build Command:** `npm install`
   - **Start Command:** `npm start`
   - **Plan:** Free (or Starter for better uptime)

### 3.2 Add Environment Variables
In Render dashboard, go to **Environment** section and add:

```
JWT_SECRET=your_super_secret_key_here
JWT_EXPIRY=7d
GOOGLE_SHEET_ID=your_google_sheet_id
PAYSTACK_SECRET_KEY=sk_live_xxxx... (or test key)
PAYSTACK_PUBLIC_KEY=pk_live_xxxx...
CORS_ORIGIN=*
NODE_ENV=production
```

> **⚠️ IMPORTANT:** Never commit sensitive keys to GitHub. Only add them in Render dashboard.

### 3.3 Deploy
1. Click **"Create Web Service"**
2. Render will automatically build and deploy
3. Wait for deployment to complete (2-5 minutes)
4. Your API URL will be: `https://easy-shop-yvwm.onrender.com`

---

## Step 4: Access Swagger Documentation

### 4.1 Swagger UI URL
Once deployed, access Swagger documentation at:
```
https://easy-shop-yvwm.onrender.com/api-docs
```

### 4.2 Test API Endpoints
1. Open Swagger UI
2. Click on any endpoint
3. Click **"Try it out"** button
4. Enter request parameters
5. Click **"Execute"** to test

### 4.3 Authentication in Swagger
For protected endpoints:
1. Get a JWT token from `/auth/login` endpoint
2. Click the **"Authorize"** button at the top of Swagger UI
3. Enter: `Bearer <your_token_here>`
4. Now you can test protected endpoints

---

## Step 5: Verify Deployment

### 5.1 Health Check
```bash
curl https://easy-shop-yvwm.onrender.com/api/v1/products
```

### 5.2 Check Logs
In Render dashboard:
- Go to your service
- Click **"Logs"** tab
- View real-time server logs
- Troubleshoot any errors

### 5.3 Common Deployment Issues

#### Issue: "Cannot find module"
**Solution:** Check `package.json` has all dependencies. Render runs `npm install` automatically.

#### Issue: "Environment variable not found"
**Solution:** Verify all env vars are set in Render dashboard. Restart the service after adding them.

#### Issue: Google Sheets connection fails
**Solution:** 
- Verify `google-service-key.json` is in backend folder
- Check service account has access to your Google Sheet
- Share the sheet with service account email

#### Issue: Swagger shows localhost:5000
**Solution:** Already fixed in updated `swagger.json`. The servers section now uses variables for dynamic host detection.

---

## Step 6: Production Best Practices

### 6.1 Update CORS for Frontend
Replace `CORS_ORIGIN=*` with your actual frontend URL:
```env
CORS_ORIGIN=https://your-frontend-domain.com
```

### 6.2 Enable HTTPS
Render automatically provides HTTPS. All connections are secure.

### 6.3 Monitor Performance
- Check Render dashboard for CPU/memory usage
- View logs for errors and warnings
- Set up notifications for failures

### 6.4 Database Backup
Since you're using Google Sheets:
- Regularly backup your Google Sheet
- Download as CSV periodically
- Ensure service account has editor access

### 6.5 Security Headers
Already configured in `app.js` via Helmet middleware:
- X-Content-Type-Options
- X-Frame-Options
- X-XSS-Protection
- Strict-Transport-Security

---

## Step 7: Custom Domain (Optional)

### 7.1 Add Custom Domain to Render
1. In Render dashboard, go to **Settings**
2. Click **"Add Custom Domain"**
3. Enter your domain (e.g., `api.shopeasy.com`)
4. Follow DNS configuration instructions
5. Render provides free SSL certificate

### 7.2 Update Swagger with Custom Domain
Edit `swagger.json`:
```json
"servers": [
  {
    "url": "https://api.shopeasy.com/api/v1",
    "description": "Production Server"
  }
]
```

---

## Step 8: Continuous Deployment

### 8.1 Auto-Deploy on Push
Render automatically deploys when you push to GitHub:
1. Push changes to `main` branch
2. Render detects the push
3. Automatically builds and deploys
4. View deployment status in dashboard

### 8.2 Disable Auto-Deploy (Optional)
If you want manual deploys:
1. Go to **Settings**
2. Toggle **"Auto-Deploy"** off
3. Click **"Manual Deploy"** when ready

---

## Accessing Your Deployed API

### Development URLs
- **API Base:** `http://localhost:5000/api/v1` (local)
- **Swagger Docs:** `http://localhost:5000/api-docs` (local)

### Production URLs (After Render Deployment)
- **API Base:** `https://easy-shop-yvwm.onrender.com/api/v1`
- **Swagger Docs:** `https://easy-shop-yvwm.onrender.com/api-docs`

### Example Requests

```bash
# Get all products
curl https://easy-shop-yvwm.onrender.com/api/v1/products

# Register user
curl -X POST https://easy-shop-yvwm.onrender.com/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"user@example.com","password":"password123"}'

# Access Swagger UI
https://easy-shop-yvwm.onrender.com/api-docs
```

---

## Swagger Features

Your Swagger documentation includes:

✅ **Interactive Testing** - "Try it out" button for each endpoint
✅ **Authentication** - Bearer token support for protected endpoints
✅ **Request/Response Examples** - See expected data formats
✅ **Schema Definitions** - User, Product, Order schemas
✅ **Security Schemes** - JWT authentication documented
✅ **Server Selection** - Switch between local and production
✅ **HTTP Methods** - GET, POST, PATCH, DELETE clearly labeled
✅ **Status Codes** - Expected responses documented

---

## Troubleshooting Swagger

### Swagger not loading?
1. Clear browser cache (Ctrl+Shift+Delete)
2. Check `/api-docs` returns valid JSON
3. Verify swagger-ui-express is installed:
   ```bash
   npm list swagger-ui-express
   ```

### Can't authenticate in Swagger?
1. First, use `/auth/login` to get a token
2. Copy the entire response token
3. Click **"Authorize"** button
4. Paste: `Bearer <token_here>` (include "Bearer " prefix)

### Endpoints not showing?
1. Check `swagger.json` syntax (use JSON validator)
2. Verify endpoint is properly defined in schema
3. Restart server: `npm run dev`

---

## File Structure for Deployment

```
ecommerce-store/
├── backend/
│   ├── server.js                    ✅ Includes Swagger setup
│   ├── package.json                 ✅ Production ready
│   ├── swagger.json                 ✅ API documentation
│   ├── render.yaml                  ✅ Render config (optional)
│   ├── .env                         ⚠️ Never commit
│   ├── .env.example                 ✅ Commit this
│   ├── .gitignore                   ✅ Exclude .env
│   ├── google-service-key.json      ⚠️ Never commit
│   ├── controllers/
│   ├── routes/
│   ├── models/
│   ├── services/
│   ├── middlewares/
│   ├── errors/
│   ├── utils/
│   └── ...
└── frontend/
```

---

## Summary Checklist

- [ ] Update `package.json` with production scripts ✅
- [ ] Update `swagger.json` with Render URL ✅
- [ ] Create `render.yaml` configuration ✅
- [ ] Create `.env.example` file
- [ ] Push code to GitHub
- [ ] Create Render account
- [ ] Create Web Service on Render
- [ ] Add environment variables in Render dashboard
- [ ] Deploy and test
- [ ] Access Swagger at `/api-docs`
- [ ] Test endpoints in Swagger UI
- [ ] Update frontend API base URL
- [ ] Monitor logs and performance

---

**You're all set!** Your backend is now ready for production deployment on Render with full Swagger documentation. 🚀
