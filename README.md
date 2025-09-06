# EcoFinds - Sustainable Second-Hand Marketplace

A comprehensive full-stack application promoting sustainable consumption through a second-hand marketplace platform.

## 🌟 Features

### Core Features
- **User Authentication**: Secure registration with 2-way email OTP verification
- **Product Management**: Full CRUD operations for product listings
- **Advanced Search & Filtering**: Category-based filtering, keyword search, trust score filtering
- **Shopping Cart**: Add/remove items with persistent storage
- **Payment Integration**: Razorpay payment gateway integration
- **Trust Score System**: Dynamic seller reputation based on transactions and reviews
- **Review System**: Rate and review sellers after purchases
- **Purchase History**: Track all past transactions
- **Responsive Design**: Works on desktop, tablet, and mobile devices

### Technical Features
- **Real-time Data**: Live product updates and notifications
- **Image Upload**: Cloudinary integration for image management
- **Animated UI**: Smooth animations using Framer Motion
- **Mobile App**: React Native application for iOS and Android
- **RESTful API**: Well-structured backend API
- **Database**: MongoDB with Mongoose ODM

## 🛠 Technology Stack

### Backend
- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB with Mongoose
- **Authentication**: JWT (JSON Web Tokens)
- **Image Storage**: Cloudinary
- **Payment**: Razorpay
- **Email**: Nodemailer

### Frontend (Web)
- **Framework**: React with Next.js
- **Styling**: Tailwind CSS
- **Animations**: Framer Motion
- **State Management**: React Context API
- **HTTP Client**: Axios
- **Notifications**: React Hot Toast

### Mobile App
- **Framework**: React Native
- **Navigation**: React Navigation
- **Storage**: AsyncStorage
- **Icons**: React Native Vector Icons
- **Styling**: NativeWind (Tailwind for React Native)

## 📁 Project Structure

```
EcoFinds/
├── ecofinds-backend/          # Node.js Backend API
│   ├── controllers/           # Route controllers
│   ├── models/               # Database models
│   ├── routes/               # API routes
│   ├── middleware/           # Custom middleware
│   ├── utils/                # Utility functions
│   └── server.js             # Main server file
├── ecofinds-frontend/        # React Web Application
│   ├── src/
│   │   ├── components/       # Reusable components
│   │   ├── pages/           # Next.js pages
│   │   ├── context/         # React contexts
│   │   ├── utils/           # Utility functions
│   │   └── styles/          # CSS styles
└── ecofinds-mobile/          # React Native Mobile App
    ├── src/
    │   ├── screens/         # Mobile screens
    │   ├── components/      # Mobile components
    │   ├── context/        # React contexts
    │   └── navigation/     # Navigation setup
```

## 🚀 Setup Instructions

### Prerequisites
- Node.js (v16 or higher)
- MongoDB (local or cloud)
- Git
- Android Studio (for mobile development)
- Xcode (for iOS development - macOS only)

### Backend Setup

1. **Navigate to backend directory**
   ```bash
   cd ecofinds-backend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Configuration**
   Create a `.env` file with the following variables:
   ```env
   PORT=5000
   MONGODB_URI=mongodb://localhost:27017/ecofinds
   JWT_SECRET=your_jwt_secret_key_here
   EMAIL_USER=your_email@gmail.com
   EMAIL_PASS=your_app_password
   CLOUDINARY_CLOUD_NAME=your_cloudinary_name
   CLOUDINARY_API_KEY=your_cloudinary_api_key
   CLOUDINARY_API_SECRET=your_cloudinary_api_secret
   RAZORPAY_KEY_ID=your_razorpay_key_id
   RAZORPAY_KEY_SECRET=your_razorpay_key_secret
   ```

4. **Start the server**
   ```bash
   npm run dev
   ```

### Frontend Setup

1. **Navigate to frontend directory**
   ```bash
   cd ecofinds-frontend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start development server**
   ```bash
   npm run dev
   ```

4. **Access the application**
   Open [http://localhost:3000](http://localhost:3000) in your browser

### Mobile App Setup

1. **Navigate to mobile directory**
   ```bash
   cd ecofinds-mobile
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Install iOS dependencies (macOS only)**
   ```bash
   cd ios && pod install && cd ..
   ```

4. **Start Metro bundler**
   ```bash
   npm start
   ```

5. **Run on Android**
   ```bash
   npm run android
   ```

6. **Run on iOS (macOS only)**
   ```bash
   npm run ios
   ```

## 🔧 Configuration

### Cloudinary Setup
1. Create account at [Cloudinary](https://cloudinary.com/)
2. Get your cloud name, API key, and API secret
3. Create an upload preset named `ecofinds_preset`
4. Update the Cloudinary configuration in the frontend

### Razorpay Setup
1. Create account at [Razorpay](https://razorpay.com/)
2. Get your Key ID and Key Secret from the dashboard
3. Add them to your environment variables
4. Configure webhook URLs for payment verification

### Email Setup
1. Enable 2-factor authentication on your Gmail account
2. Generate an app-specific password
3. Use your Gmail and app password in environment variables

## 📱 Mobile App Features

- **Cross-platform**: Works on both iOS and Android
- **Native Performance**: Built with React Native for optimal performance
- **Offline Support**: Basic offline functionality with AsyncStorage
- **Push Notifications**: Ready for push notification integration
- **Camera Integration**: Take photos directly for product listings

## 🔒 Security Features

- **JWT Authentication**: Secure token-based authentication
- **Password Hashing**: bcrypt for secure password storage
- **Input Validation**: Server-side validation for all inputs
- **CORS Protection**: Configured CORS for secure API access
- **Rate Limiting**: Protection against API abuse
- **SQL Injection Prevention**: MongoDB and Mongoose protection

## 🎨 UI/UX Features

- **Responsive Design**: Works on all device sizes
- **Dark Mode Ready**: Easy to implement dark mode
- **Accessibility**: ARIA labels and keyboard navigation
- **Loading States**: Smooth loading animations
- **Error Handling**: User-friendly error messages
- **Toast Notifications**: Real-time feedback for user actions

## 📊 Trust Score Algorithm

The trust score is calculated based on:
- **Base Score**: 50 points (starting point)
- **Successful Transactions**: +5 points per transaction
- **Average Rating**: +(Average Rating - 3) × 2 points
- **Account Age**: +1 point per 30 days
- **Range**: 0-100 points

## 🚀 Deployment

### Backend Deployment (Heroku/Railway)
1. Create new app on your platform
2. Set environment variables
3. Deploy from Git repository
4. Configure MongoDB Atlas for production

### Frontend Deployment (Vercel/Netlify)
1. Connect your Git repository
2. Set build command: `npm run build`
3. Set output directory: `out` or `.next`
4. Configure environment variables

### Mobile App Deployment
1. **Android**: Generate signed APK or AAB
2. **iOS**: Archive and upload to App Store Connect
3. Follow platform-specific guidelines for store submission

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🆘 Support

For support and questions:
- Create an issue on GitHub
- Email: support@ecofinds.com
- Documentation: [Wiki](https://github.com/your-repo/wiki)

## 🎯 Future Enhancements

- [ ] Real-time chat between buyers and sellers
- [ ] Advanced recommendation system
- [ ] Social media integration
- [ ] Wishlist functionality
- [ ] Location-based search
- [ ] Multi-language support
- [ ] Admin dashboard
- [ ] Analytics and reporting
- [ ] Bulk upload for sellers
- [ ] Auction functionality

---

**EcoFinds** - Promoting sustainable consumption, one transaction at a time! 🌱