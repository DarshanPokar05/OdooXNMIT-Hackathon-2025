# Quick Start Guide

## 1. Start Backend
```bash
cd ecofinds-backend
npm install
npm run dev
```

## 2. Start Frontend  
```bash
cd ecofinds-frontend
npm install
npm run dev
```

## 3. Create Cloudinary Upload Preset
1. Go to [Cloudinary Console](https://console.cloudinary.com/)
2. Settings → Upload → Add upload preset
3. Name: `ecofinds_preset`
4. Signing Mode: `Unsigned`
5. Save

## 4. Test Registration
1. Open http://localhost:3000
2. Click "Sign Up"
3. Fill form and register
4. Check console for OTP (email may not work initially)
5. Use any 6-digit number for OTP verification

## 5. If Still Getting 401 Errors
- Restart both servers
- Clear browser cache
- Check MongoDB connection
- Verify all environment variables are set