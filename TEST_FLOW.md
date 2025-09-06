# Test Authentication Flow

## Step 1: Register
1. Go to http://localhost:3000/register
2. Fill form with any details
3. Click "Create account"

## Step 2: Verify OTP
1. Enter any 6-digit number (e.g., 123456)
2. Click "Verify Email"
3. Should redirect to login

## Step 3: Login
1. Use same email/password from registration
2. Click "Sign In"
3. Should redirect to home page

## Step 4: Add Product
1. Click "+ Sell" in navigation
2. Fill product form
3. Upload image (create Cloudinary preset first)
4. Click "List Product"

## If Still Getting 401:
1. Check browser console for errors
2. Verify JWT token is stored in localStorage
3. Check if user object exists in AuthContext
4. Restart both servers