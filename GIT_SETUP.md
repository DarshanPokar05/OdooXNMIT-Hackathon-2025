# 🔧 Git Setup Guide

## Quick Git Commands

### 1. Initialize Repository
```bash
git init
git add .
git commit -m "Initial commit: EcoFinds - Sustainable Second-Hand Marketplace"
```

### 2. Connect to GitHub
```bash
# Create repository on GitHub first, then:
git remote add origin https://github.com/yourusername/ecofinds-hackathon.git
git branch -M main
git push -u origin main
```

### 3. Environment Variables Security
Your `.env` files are already ignored. For deployment, set these variables:

**Backend (.env):**
```env
PORT=5000
MONGODB_URI=your_mongodb_connection
JWT_SECRET=your_jwt_secret
EMAIL_USER=your_email
EMAIL_PASS=your_app_password
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
RAZORPAY_KEY_ID=your_razorpay_key
RAZORPAY_KEY_SECRET=your_razorpay_secret
```

### 4. Repository Structure
```
EcoFinds/
├── ecofinds-backend/     # Node.js API
├── ecofinds-frontend/    # React Web App
├── ecofinds-mobile/      # React Native App
├── README.md            # Project documentation
├── .gitignore           # Git ignore rules
└── *.md files           # Setup guides
```

### 5. Commit Best Practices
```bash
# Feature commits
git add .
git commit -m "feat: add user authentication with OTP"

# Bug fixes
git commit -m "fix: resolve token authentication issue"

# Documentation
git commit -m "docs: add deployment guide"
```

## 🚀 Ready to Push!
Your `.gitignore` is configured to exclude:
- ✅ Environment variables (.env files)
- ✅ Node modules
- ✅ Build outputs
- ✅ Cache directories
- ✅ IDE files
- ✅ Mobile build files

**Safe to push to GitHub now! 🎉**