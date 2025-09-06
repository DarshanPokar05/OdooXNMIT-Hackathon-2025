# EcoFinds - Complete Setup Guide

This guide will walk you through setting up the complete EcoFinds application stack.

## 🎯 Quick Start (5 Minutes)

### 1. Clone and Setup Backend
```bash
cd ecofinds-backend
npm install
```

Create `.env` file:
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/ecofinds
JWT_SECRET=ecofinds_jwt_secret_2024
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_app_password
CLOUDINARY_CLOUD_NAME=demo_cloud
CLOUDINARY_API_KEY=demo_key
CLOUDINARY_API_SECRET=demo_secret
RAZORPAY_KEY_ID=demo_key_id
RAZORPAY_KEY_SECRET=demo_key_secret
```

Start backend:
```bash
npm run dev
```

### 2. Setup Frontend
```bash
cd ../ecofinds-frontend
npm install
npm run dev
```

### 3. Setup Mobile (Optional)
```bash
cd ../ecofinds-mobile
npm install
npm start
```

## 📋 Detailed Setup Instructions

### Prerequisites Installation

#### 1. Node.js
- Download from [nodejs.org](https://nodejs.org/)
- Install LTS version (v18 or higher)
- Verify: `node --version`

#### 2. MongoDB
**Option A: Local Installation**
- Download from [mongodb.com](https://www.mongodb.com/try/download/community)
- Install and start MongoDB service
- Default connection: `mongodb://localhost:27017`

**Option B: MongoDB Atlas (Cloud)**
- Create account at [mongodb.com/atlas](https://www.mongodb.com/atlas)
- Create free cluster
- Get connection string
- Update `MONGODB_URI` in `.env`

#### 3. Git
- Download from [git-scm.com](https://git-scm.com/)
- Configure: `git config --global user.name "Your Name"`

### Service Configuration

#### 1. Email Service (Gmail)
1. Enable 2-Factor Authentication on Gmail
2. Generate App Password:
   - Google Account → Security → 2-Step Verification → App passwords
   - Select "Mail" and generate password
3. Update `.env`:
   ```env
   EMAIL_USER=your_email@gmail.com
   EMAIL_PASS=generated_app_password
   ```

#### 2. Cloudinary (Image Storage)
1. Create account at [cloudinary.com](https://cloudinary.com/)
2. Get credentials from Dashboard
3. Create upload preset:
   - Settings → Upload → Add upload preset
   - Name: `ecofinds_preset`
   - Mode: Unsigned
4. Update `.env` and frontend config

#### 3. Razorpay (Payments)
1. Create account at [razorpay.com](https://razorpay.com/)
2. Get API keys from Dashboard
3. Update `.env`:
   ```env
   RAZORPAY_KEY_ID=rzp_test_xxxxxxxxxx
   RAZORPAY_KEY_SECRET=your_secret_key
   ```

### Database Setup

#### 1. Start MongoDB
```bash
# Windows
net start MongoDB

# macOS/Linux
sudo systemctl start mongod
```

#### 2. Create Database
MongoDB will automatically create the database when first accessed.

### Backend Configuration

#### 1. Install Dependencies
```bash
cd ecofinds-backend
npm install
```

#### 2. Environment Variables
Create `.env` file with all required variables (see above).

#### 3. Start Development Server
```bash
npm run dev
```

Server will start on `http://localhost:5000`

### Frontend Configuration

#### 1. Install Dependencies
```bash
cd ecofinds-frontend
npm install
```

#### 2. Update API URLs
In `src/utils/api.js`, ensure the base URL points to your backend:
```javascript
const API_BASE_URL = 'http://localhost:5000/api';
```

#### 3. Update Cloudinary Config
In `src/utils/cloudinary.js`, update with your Cloudinary details:
```javascript
formData.append('cloud_name', 'your_cloud_name');
```

#### 4. Start Development Server
```bash
npm run dev
```

Frontend will start on `http://localhost:3000`

### Mobile App Configuration

#### 1. React Native Environment
Follow [React Native Environment Setup](https://reactnative.dev/docs/environment-setup)

#### 2. Install Dependencies
```bash
cd ecofinds-mobile
npm install
```

#### 3. iOS Setup (macOS only)
```bash
cd ios
pod install
cd ..
```

#### 4. Update API URLs
In mobile app files, update API base URL to your computer's IP:
```javascript
// For Android emulator
const API_BASE_URL = 'http://10.0.2.2:5000/api';

// For physical device (replace with your IP)
const API_BASE_URL = 'http://192.168.1.100:5000/api';
```

#### 5. Start Metro and Run App
```bash
npm start
npm run android  # or npm run ios
```

## 🔧 Troubleshooting

### Common Issues

#### 1. MongoDB Connection Error
```
Error: connect ECONNREFUSED 127.0.0.1:27017
```
**Solution**: Start MongoDB service
```bash
# Windows
net start MongoDB

# macOS/Linux
sudo systemctl start mongod
```

#### 2. Port Already in Use
```
Error: listen EADDRINUSE: address already in use :::5000
```
**Solution**: Kill process or change port
```bash
# Kill process on port 5000
npx kill-port 5000

# Or change PORT in .env file
PORT=5001
```

#### 3. CORS Error in Frontend
```
Access to XMLHttpRequest blocked by CORS policy
```
**Solution**: Ensure backend CORS is configured correctly (already done in code)

#### 4. Mobile App Network Error
```
Network request failed
```
**Solution**: 
- Use correct IP address for API calls
- Ensure backend is running
- Check firewall settings

#### 5. Image Upload Fails
```
Cloudinary upload error
```
**Solution**:
- Verify Cloudinary credentials
- Check upload preset exists
- Ensure preset is "unsigned"

### Performance Tips

#### 1. Backend Optimization
- Use MongoDB indexes for better query performance
- Implement caching for frequently accessed data
- Use compression middleware

#### 2. Frontend Optimization
- Implement lazy loading for images
- Use React.memo for expensive components
- Optimize bundle size with code splitting

#### 3. Mobile Optimization
- Use FlatList for large lists
- Implement image caching
- Optimize navigation performance

## 🚀 Production Deployment

### Backend (Railway/Heroku)
1. Create account and new project
2. Connect GitHub repository
3. Set environment variables
4. Deploy

### Frontend (Vercel/Netlify)
1. Connect GitHub repository
2. Set build command: `npm run build`
3. Set environment variables
4. Deploy

### Mobile App
1. **Android**: Generate signed APK
2. **iOS**: Archive and submit to App Store

## 📱 Testing

### Backend Testing
```bash
cd ecofinds-backend
npm test
```

### Frontend Testing
```bash
cd ecofinds-frontend
npm test
```

### API Testing
Use Postman or similar tool to test API endpoints:
- Import the provided Postman collection
- Test all CRUD operations
- Verify authentication flows

## 🔐 Security Checklist

- [ ] Environment variables are not committed to Git
- [ ] JWT secret is strong and unique
- [ ] Database is secured (authentication enabled)
- [ ] API rate limiting is configured
- [ ] Input validation is implemented
- [ ] HTTPS is enabled in production
- [ ] CORS is properly configured

## 📞 Support

If you encounter issues:
1. Check this troubleshooting guide
2. Search existing GitHub issues
3. Create new issue with detailed description
4. Include error logs and environment details

---

**Happy Coding! 🚀**