# EcoFinds Deployment Guide

This guide covers deploying EcoFinds to production environments.

## 🚀 Quick Deployment Checklist

### Pre-deployment
- [ ] Environment variables configured
- [ ] Database connection tested
- [ ] Third-party services configured (Cloudinary, Razorpay, Email)
- [ ] Build process tested locally
- [ ] Security configurations reviewed

### Backend Deployment (Railway/Heroku)
- [ ] Repository connected
- [ ] Environment variables set
- [ ] Database URL configured
- [ ] Build and start scripts verified

### Frontend Deployment (Vercel/Netlify)
- [ ] Build command configured
- [ ] Environment variables set
- [ ] API endpoints updated
- [ ] Domain configured

## 🔧 Backend Deployment

### Option 1: Railway
1. **Create Railway Account**
   - Visit [railway.app](https://railway.app)
   - Sign up with GitHub

2. **Deploy Backend**
   ```bash
   # Install Railway CLI
   npm install -g @railway/cli
   
   # Login
   railway login
   
   # Deploy from backend directory
   cd ecofinds-backend
   railway deploy
   ```

3. **Configure Environment Variables**
   ```env
   NODE_ENV=production
   PORT=5000
   MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/ecofinds
   JWT_SECRET=your_production_jwt_secret
   EMAIL_USER=your_email@gmail.com
   EMAIL_PASS=your_app_password
   CLOUDINARY_CLOUD_NAME=your_cloud_name
   CLOUDINARY_API_KEY=your_api_key
   CLOUDINARY_API_SECRET=your_api_secret
   RAZORPAY_KEY_ID=your_key_id
   RAZORPAY_KEY_SECRET=your_key_secret
   ```

### Option 2: Heroku
1. **Install Heroku CLI**
   ```bash
   # Install Heroku CLI
   npm install -g heroku
   
   # Login
   heroku login
   ```

2. **Create and Deploy**
   ```bash
   cd ecofinds-backend
   
   # Create Heroku app
   heroku create ecofinds-api
   
   # Set environment variables
   heroku config:set NODE_ENV=production
   heroku config:set MONGODB_URI=your_mongodb_uri
   heroku config:set JWT_SECRET=your_jwt_secret
   # ... set all other variables
   
   # Deploy
   git push heroku main
   ```

## 🌐 Frontend Deployment

### Option 1: Vercel
1. **Install Vercel CLI**
   ```bash
   npm install -g vercel
   ```

2. **Deploy**
   ```bash
   cd ecofinds-frontend
   
   # Deploy
   vercel
   
   # Follow prompts and configure
   ```

3. **Environment Variables**
   Set in Vercel dashboard:
   ```env
   NEXT_PUBLIC_API_URL=https://your-backend-url.railway.app/api
   NEXT_PUBLIC_RAZORPAY_KEY_ID=your_razorpay_key_id
   ```

### Option 2: Netlify
1. **Build Configuration**
   Create `netlify.toml`:
   ```toml
   [build]
     command = "npm run build"
     publish = "out"
   
   [build.environment]
     NEXT_PUBLIC_API_URL = "https://your-backend-url.railway.app/api"
   ```

2. **Deploy**
   - Connect GitHub repository
   - Configure build settings
   - Set environment variables
   - Deploy

## 📱 Mobile App Deployment

### Android Deployment
1. **Generate Signed APK**
   ```bash
   cd ecofinds-mobile/android
   
   # Generate keystore
   keytool -genkey -v -keystore ecofinds-release-key.keystore -alias ecofinds -keyalg RSA -keysize 2048 -validity 10000
   
   # Build release APK
   cd ..
   npx react-native build-android --mode=release
   ```

2. **Google Play Store**
   - Create developer account
   - Upload APK/AAB
   - Fill store listing
   - Submit for review

### iOS Deployment
1. **Archive Build**
   ```bash
   cd ecofinds-mobile
   npx react-native run-ios --configuration Release
   ```

2. **App Store Connect**
   - Archive in Xcode
   - Upload to App Store Connect
   - Fill app information
   - Submit for review

## 🗄️ Database Setup

### MongoDB Atlas
1. **Create Cluster**
   - Visit [mongodb.com/atlas](https://mongodb.com/atlas)
   - Create free cluster
   - Configure network access
   - Create database user

2. **Connection String**
   ```
   mongodb+srv://username:password@cluster.mongodb.net/ecofinds?retryWrites=true&w=majority
   ```

### Local MongoDB (Production)
```bash
# Install MongoDB
# Ubuntu/Debian
sudo apt-get install mongodb

# Start service
sudo systemctl start mongod
sudo systemctl enable mongod

# Secure installation
mongo
use admin
db.createUser({
  user: "admin",
  pwd: "secure_password",
  roles: ["userAdminAnyDatabase"]
})
```

## 🔐 Security Configuration

### SSL/HTTPS
1. **Backend SSL**
   - Use Railway/Heroku built-in SSL
   - Or configure Let's Encrypt

2. **Frontend SSL**
   - Vercel/Netlify provide automatic SSL
   - Configure custom domain

### Environment Security
```bash
# Generate secure JWT secret
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"

# Use strong database passwords
# Enable database authentication
# Configure CORS properly
# Set up rate limiting
```

### API Security
```javascript
// Add to server.js
const rateLimit = require('express-rate-limit');

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
});

app.use('/api/', limiter);
```

## 📊 Monitoring & Analytics

### Backend Monitoring
```javascript
// Add logging
const winston = require('winston');

const logger = winston.createLogger({
  level: 'info',
  format: winston.format.json(),
  transports: [
    new winston.transports.File({ filename: 'error.log', level: 'error' }),
    new winston.transports.File({ filename: 'combined.log' })
  ]
});
```

### Error Tracking
- Sentry for error tracking
- LogRocket for session replay
- Google Analytics for usage

## 🔄 CI/CD Pipeline

### GitHub Actions
Create `.github/workflows/deploy.yml`:
```yaml
name: Deploy to Production

on:
  push:
    branches: [ main ]

jobs:
  deploy-backend:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - name: Deploy to Railway
        run: |
          npm install -g @railway/cli
          railway deploy
        env:
          RAILWAY_TOKEN: ${{ secrets.RAILWAY_TOKEN }}

  deploy-frontend:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - name: Deploy to Vercel
        run: |
          npm install -g vercel
          vercel --prod
        env:
          VERCEL_TOKEN: ${{ secrets.VERCEL_TOKEN }}
```

## 🧪 Testing in Production

### Health Checks
```javascript
// Add to server.js
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
});
```

### Load Testing
```bash
# Install artillery
npm install -g artillery

# Create load test
artillery quick --count 10 --num 100 https://your-api-url.com/api/health
```

## 📈 Performance Optimization

### Backend Optimization
- Enable gzip compression
- Use Redis for caching
- Optimize database queries
- Use CDN for static assets

### Frontend Optimization
- Enable Next.js optimizations
- Use image optimization
- Implement lazy loading
- Minimize bundle size

### Mobile Optimization
- Enable Hermes engine
- Optimize images
- Use FlatList for large lists
- Implement proper navigation

## 🔧 Troubleshooting

### Common Issues
1. **CORS Errors**
   - Update CORS configuration
   - Check API URLs

2. **Database Connection**
   - Verify connection string
   - Check network access

3. **Build Failures**
   - Check Node.js version
   - Verify dependencies

4. **Mobile Build Issues**
   - Clean build cache
   - Update React Native CLI

### Debugging Tools
- Browser DevTools
- React Native Debugger
- Postman for API testing
- MongoDB Compass

## 📞 Support

For deployment issues:
1. Check logs in deployment platform
2. Verify environment variables
3. Test API endpoints
4. Check database connectivity

---

**Happy Deploying! 🚀**