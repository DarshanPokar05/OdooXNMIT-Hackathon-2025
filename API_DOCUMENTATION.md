# EcoFinds API Documentation

Complete API reference for the EcoFinds backend.

## 🔗 Base URL
```
Development: http://localhost:5000/api
Production: https://your-domain.com/api
```

## 🔐 Authentication
Most endpoints require JWT authentication. Include the token in the Authorization header:
```
Authorization: Bearer <your_jwt_token>
```

## 📋 API Endpoints

### Authentication Endpoints

#### Register User
```http
POST /auth/register
```

**Request Body:**
```json
{
  "username": "john_doe",
  "email": "john@example.com",
  "password": "password123"
}
```

**Response:**
```json
{
  "message": "User registered successfully. Please verify your email with the OTP sent.",
  "userId": "64f8a1b2c3d4e5f6g7h8i9j0"
}
```

#### Verify OTP
```http
POST /auth/verify-otp
```

**Request Body:**
```json
{
  "userId": "64f8a1b2c3d4e5f6g7h8i9j0",
  "otp": "123456"
}
```

**Response:**
```json
{
  "message": "Email verified successfully",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "64f8a1b2c3d4e5f6g7h8i9j0",
    "username": "john_doe",
    "email": "john@example.com",
    "profileImage": "https://via.placeholder.com/150",
    "trustScore": 50
  }
}
```

#### Login
```http
POST /auth/login
```

**Request Body:**
```json
{
  "email": "john@example.com",
  "password": "password123"
}
```

**Response:**
```json
{
  "message": "Login successful",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "64f8a1b2c3d4e5f6g7h8i9j0",
    "username": "john_doe",
    "email": "john@example.com",
    "profileImage": "https://via.placeholder.com/150",
    "trustScore": 50
  }
}
```

### User Endpoints

#### Get User Profile
```http
GET /user/profile
Authorization: Bearer <token>
```

**Response:**
```json
{
  "_id": "64f8a1b2c3d4e5f6g7h8i9j0",
  "username": "john_doe",
  "email": "john@example.com",
  "profileImage": "https://via.placeholder.com/150",
  "isVerified": true,
  "createdAt": "2024-01-15T10:30:00.000Z",
  "trustScore": 75
}
```

#### Update User Profile
```http
PUT /user/profile
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "username": "john_updated",
  "profileImage": "https://cloudinary.com/image.jpg"
}
```

**Response:**
```json
{
  "message": "Profile updated successfully",
  "user": {
    "_id": "64f8a1b2c3d4e5f6g7h8i9j0",
    "username": "john_updated",
    "email": "john@example.com",
    "profileImage": "https://cloudinary.com/image.jpg",
    "trustScore": 75
  }
}
```

### Product Endpoints

#### Get All Products
```http
GET /products?page=1&limit=10&category=Electronics&search=laptop&minTrust=70
```

**Query Parameters:**
- `page` (optional): Page number (default: 1)
- `limit` (optional): Items per page (default: 10)
- `category` (optional): Filter by category
- `search` (optional): Search in product titles
- `minTrust` (optional): Minimum seller trust score

**Response:**
```json
{
  "products": [
    {
      "_id": "64f8a1b2c3d4e5f6g7h8i9j1",
      "title": "MacBook Pro 2021",
      "description": "Excellent condition laptop",
      "price": 85000,
      "category": "Electronics",
      "images": ["https://cloudinary.com/image1.jpg"],
      "seller": {
        "_id": "64f8a1b2c3d4e5f6g7h8i9j0",
        "username": "john_doe",
        "trustScore": 85
      },
      "status": "available",
      "createdAt": "2024-01-15T10:30:00.000Z"
    }
  ],
  "totalPages": 5,
  "currentPage": 1
}
```

#### Get Single Product
```http
GET /products/:id
```

**Response:**
```json
{
  "_id": "64f8a1b2c3d4e5f6g7h8i9j1",
  "title": "MacBook Pro 2021",
  "description": "Excellent condition laptop with original charger",
  "price": 85000,
  "category": "Electronics",
  "images": [
    "https://cloudinary.com/image1.jpg",
    "https://cloudinary.com/image2.jpg"
  ],
  "seller": {
    "_id": "64f8a1b2c3d4e5f6g7h8i9j0",
    "username": "john_doe",
    "trustScore": 85,
    "profileImage": "https://cloudinary.com/profile.jpg",
    "createdAt": "2024-01-01T00:00:00.000Z"
  },
  "status": "available",
  "createdAt": "2024-01-15T10:30:00.000Z"
}
```

#### Create Product
```http
POST /products
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "title": "iPhone 13 Pro",
  "description": "Like new condition, no scratches",
  "price": 65000,
  "category": "Electronics",
  "images": [
    "https://cloudinary.com/image1.jpg",
    "https://cloudinary.com/image2.jpg"
  ]
}
```

**Response:**
```json
{
  "message": "Product created successfully",
  "product": {
    "_id": "64f8a1b2c3d4e5f6g7h8i9j2",
    "title": "iPhone 13 Pro",
    "description": "Like new condition, no scratches",
    "price": 65000,
    "category": "Electronics",
    "images": ["https://cloudinary.com/image1.jpg"],
    "seller": {
      "_id": "64f8a1b2c3d4e5f6g7h8i9j0",
      "username": "john_doe",
      "trustScore": 85
    },
    "status": "available",
    "createdAt": "2024-01-15T10:30:00.000Z"
  }
}
```

#### Update Product
```http
PUT /products/:id
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "title": "iPhone 13 Pro - Updated",
  "description": "Updated description",
  "price": 60000,
  "category": "Electronics",
  "images": ["https://cloudinary.com/new-image.jpg"]
}
```

#### Delete Product
```http
DELETE /products/:id
Authorization: Bearer <token>
```

**Response:**
```json
{
  "message": "Product deleted successfully"
}
```

#### Get My Products
```http
GET /products/my-products
Authorization: Bearer <token>
```

### Payment Endpoints

#### Create Order
```http
POST /payment/create-order
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "productId": "64f8a1b2c3d4e5f6g7h8i9j1"
}
```

**Response:**
```json
{
  "orderId": "order_MNf8a1b2c3d4e5f6",
  "amount": 8500000,
  "currency": "INR",
  "key": "rzp_test_xxxxxxxxxx"
}
```

#### Verify Payment
```http
POST /payment/verify
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "razorpay_order_id": "order_MNf8a1b2c3d4e5f6",
  "razorpay_payment_id": "pay_MNf8a1b2c3d4e5f7",
  "razorpay_signature": "signature_hash"
}
```

**Response:**
```json
{
  "message": "Payment verified successfully",
  "order": {
    "_id": "64f8a1b2c3d4e5f6g7h8i9j3",
    "buyer": "64f8a1b2c3d4e5f6g7h8i9j0",
    "product": "64f8a1b2c3d4e5f6g7h8i9j1",
    "orderAmount": 85000,
    "paymentId": "pay_MNf8a1b2c3d4e5f7",
    "status": "completed",
    "purchaseDate": "2024-01-15T10:30:00.000Z"
  }
}
```

### Order Endpoints

#### Get My Orders (Purchase History)
```http
GET /orders/my-history
Authorization: Bearer <token>
```

**Response:**
```json
[
  {
    "_id": "64f8a1b2c3d4e5f6g7h8i9j3",
    "buyer": {
      "_id": "64f8a1b2c3d4e5f6g7h8i9j0",
      "username": "john_doe"
    },
    "product": {
      "_id": "64f8a1b2c3d4e5f6g7h8i9j1",
      "title": "MacBook Pro 2021",
      "images": ["https://cloudinary.com/image1.jpg"],
      "price": 85000,
      "category": "Electronics"
    },
    "orderAmount": 85000,
    "paymentId": "pay_MNf8a1b2c3d4e5f7",
    "status": "completed",
    "purchaseDate": "2024-01-15T10:30:00.000Z"
  }
]
```

#### Get My Sales
```http
GET /orders/my-sales
Authorization: Bearer <token>
```

### Review Endpoints

#### Create Review
```http
POST /reviews
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "productId": "64f8a1b2c3d4e5f6g7h8i9j1",
  "rating": 5,
  "comment": "Great seller, fast delivery!"
}
```

**Response:**
```json
{
  "message": "Review created successfully",
  "review": {
    "_id": "64f8a1b2c3d4e5f6g7h8i9j4",
    "reviewer": "64f8a1b2c3d4e5f6g7h8i9j0",
    "reviewee": "64f8a1b2c3d4e5f6g7h8i9j5",
    "product": "64f8a1b2c3d4e5f6g7h8i9j1",
    "rating": 5,
    "comment": "Great seller, fast delivery!",
    "createdAt": "2024-01-15T10:30:00.000Z"
  }
}
```

#### Get Product Reviews
```http
GET /reviews/product/:productId
```

#### Get User Reviews
```http
GET /reviews/user/:userId
```

## 📊 Error Responses

### Common Error Codes
- `400` - Bad Request
- `401` - Unauthorized
- `403` - Forbidden
- `404` - Not Found
- `500` - Internal Server Error

### Error Response Format
```json
{
  "message": "Error description",
  "error": "Detailed error information (in development)"
}
```

## 🔄 Rate Limiting
- 100 requests per 15 minutes per IP
- Authentication endpoints: 5 requests per minute
- File upload endpoints: 10 requests per minute

## 📝 Request/Response Headers

### Required Headers
```
Content-Type: application/json
Authorization: Bearer <token> (for protected routes)
```

### Response Headers
```
Content-Type: application/json
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 99
X-RateLimit-Reset: 1642694400
```

## 🧪 Testing with Postman

### Import Collection
1. Create new collection in Postman
2. Add environment variables:
   - `baseUrl`: `http://localhost:5000/api`
   - `token`: `<your_jwt_token>`

### Sample Requests
```javascript
// Pre-request script for authenticated requests
pm.request.headers.add({
  key: 'Authorization',
  value: 'Bearer ' + pm.environment.get('token')
});
```

## 📈 API Usage Examples

### JavaScript (Axios)
```javascript
import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:5000/api',
  headers: {
    'Authorization': `Bearer ${token}`
  }
});

// Get products
const products = await api.get('/products?category=Electronics');

// Create product
const newProduct = await api.post('/products', {
  title: 'New Product',
  description: 'Product description',
  price: 1000,
  category: 'Electronics',
  images: ['image_url']
});
```

### Python (Requests)
```python
import requests

headers = {
    'Authorization': f'Bearer {token}',
    'Content-Type': 'application/json'
}

# Get products
response = requests.get('http://localhost:5000/api/products', headers=headers)
products = response.json()

# Create product
product_data = {
    'title': 'New Product',
    'description': 'Product description',
    'price': 1000,
    'category': 'Electronics',
    'images': ['image_url']
}
response = requests.post('http://localhost:5000/api/products', 
                        json=product_data, headers=headers)
```

---

**API Version**: 1.0.0  
**Last Updated**: January 2024