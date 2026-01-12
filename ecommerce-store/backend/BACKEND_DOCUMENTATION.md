# ShopEasy API - Backend Documentation

## Table of Contents
1. [Overview](#overview)
2. [Project Structure](#project-structure)
3. [Tech Stack](#tech-stack)
4. [Installation & Setup](#installation--setup)
5. [Configuration](#configuration)
6. [API Endpoints](#api-endpoints)
7. [Authentication](#authentication)
8. [Database & Data Models](#database--data-models)
9. [Error Handling](#error-handling)
10. [Middleware](#middleware)
11. [Services](#services)
12. [Development](#development)

---

## Overview

**ShopEasy API** is a Node.js/Express-based e-commerce backend that provides a comprehensive REST API for managing products, orders, users, and payments. The application uses **Google Sheets** as a data store and integrates with **Paystack** for payment processing.

### Key Features
- User authentication with JWT tokens
- Product management with category filtering
- Order creation and tracking
- Secure payment processing via Paystack
- Admin and user role-based access control
- Token blacklisting for logout functionality
- Webhook support for payment notifications

---

## Project Structure

```
backend/
├── controllers/          # Business logic for routes
│   ├── authController.js
│   ├── cartController.js
│   ├── orderController.js
│   ├── paymentController.js
│   ├── productController.js
│   ├── userController.js
│   └── webhookController.js
├── routes/              # API route definitions
│   ├── authRoutes.js
│   ├── orderRoutes.js
│   ├── payments.js
│   ├── productRoutes.js
│   ├── usersRoutes.js
│   └── webhookRoutes.js
├── models/              # Google Sheets data models
│   ├── ordersSheet.js
│   ├── productsSheet.js
│   ├── refreshTokensSheet.js
│   └── usersSheet.js
├── services/            # External service integrations
│   ├── googleSheets.js
│   └── paystack.js
├── middlewares/         # Express middleware
│   └── authMiddleware.js
├── errors/              # Custom error classes
│   ├── bad-request.js
│   ├── custom-api.js
│   ├── not-found.js
│   ├── unauthenticated.js
│   └── unauthorized.js
├── utils/               # Utility functions
│   ├── enum.js
│   ├── tokenBlacklist.js
│   └── uuid.js
├── test/                # Test files
│   └── test.js
├── app.js              # Express app configuration
├── server.js           # Server entry point
├── package.json        # Dependencies
├── .env                # Environment variables
└── google-service-key.json  # Google API credentials
```

---

## Tech Stack

### Core Framework
- **Express.js** (v4.17.1) - Web framework
- **Node.js** (14.x) - Runtime

### Authentication & Security
- **jsonwebtoken** (v8.5.1) - JWT token management
- **bcryptjs** (v2.4.3) - Password hashing
- **helmet** (v4.6.0) - Security headers
- **cors** (v2.8.5) - Cross-Origin Resource Sharing
- **express-rate-limit** (v5.4.1) - Rate limiting
- **xss-clean** (v0.1.1) - XSS protection
- **express-mongo-sanitize** (v2.1.0) - NoSQL injection prevention

### Data & Database
- **googleapis** (v166.0.0) - Google Sheets API client
- **mongoose** (v6.0.8) - MongoDB ODM (optional)
- **Google Sheets** - Primary data store

### Payment Processing
- **axios** (v1.13.2) - HTTP client for Paystack API

### Validation & Utilities
- **joi** (v17.4.0) - Data validation
- **validator** (v13.6.0) - String validation
- **uuid** (v13.0.0) - Unique ID generation
- **dotenv** (v10.0.0) - Environment configuration
- **morgan** (v1.10.0) - HTTP request logging
- **cookie-parser** (v1.4.5) - Cookie handling
- **http-status-codes** (v2.1.4) - HTTP status constants
- **express-async-errors** (v3.1.1) - Async error handling
- **express-fileupload** (v1.2.1) - File upload support

### Development
- **nodemon** (v2.0.9) - Auto-restart on file changes

---

## Installation & Setup

### Prerequisites
- Node.js 14.x or higher
- npm or yarn
- Google Service Account (for Google Sheets API)
- Paystack account (for payment processing)

### Step 1: Install Dependencies
```bash
cd backend
npm install
```

### Step 2: Environment Configuration
Create a `.env` file in the backend directory with the following variables:
```env
PORT=5000
NODE_ENV=development

# JWT Configuration
JWT_SECRET=your_jwt_secret_key_here
JWT_EXPIRY=7d

# Google Sheets
GOOGLE_SHEET_ID=your_google_sheet_id_here

# Paystack
PAYSTACK_SECRET_KEY=your_paystack_secret_key
PAYSTACK_BASE_URL=https://api.paystack.co
PAYSTACK_PUBLIC_KEY=your_paystack_public_key

# Database (if using MongoDB)
MONGODB_URI=mongodb://localhost:27017/shopeasy

# Other
CORS_ORIGIN=http://localhost:3000
```

### Step 3: Google Service Account Setup
1. Create a service account in Google Cloud Console
2. Download the JSON key file
3. Place it as `google-service-key.json` in the backend directory
4. Share your Google Sheet with the service account email

### Step 4: Start the Server
```bash
npm start
```

The server will run on `http://localhost:5000`

---

## Configuration

### Environment Variables
All sensitive configuration is managed through `.env` file:

| Variable | Description | Example |
|----------|-------------|---------|
| `PORT` | Server port | `5000` |
| `NODE_ENV` | Environment mode | `development` or `production` |
| `JWT_SECRET` | Secret for signing JWTs | Any strong string |
| `JWT_EXPIRY` | Token expiration time | `7d`, `24h` |
| `GOOGLE_SHEET_ID` | Google Sheets ID for data | Sheet ID from URL |
| `PAYSTACK_SECRET_KEY` | Paystack API secret | From Paystack dashboard |
| `PAYSTACK_PUBLIC_KEY` | Paystack public key | From Paystack dashboard |
| `CORS_ORIGIN` | Frontend URL for CORS | `http://localhost:3000` |

---

## API Endpoints

### Base URL
```
http://localhost:5000/api/v1
```

### Authentication Endpoints (`/auth`)
```
POST   /auth/register              - Register new user
POST   /auth/login                 - Login user
POST   /auth/register-admin        - Register admin (admin only)
POST   /auth/refresh               - Refresh JWT token
GET    /auth/logout                - Logout user (requires token)
GET    /auth/logout-all            - Logout from all devices (requires token)
```

### Product Endpoints (`/products`)
```
GET    /products                   - Get all products
POST   /products                   - Create product (admin)
GET    /products/category/:category - Get products by category
PATCH  /products/:product_id       - Update product (admin)
DELETE /products/:product_id       - Delete product (admin)
```

### Order Endpoints (`/orders`)
```
GET    /orders                     - Get all orders
POST   /orders                     - Create order
GET    /orders/status/:status      - Get orders by status
PATCH  /orders/:order_id           - Update order
DELETE /orders/:order_id           - Delete order
```

### User Endpoints (`/users`)
```
GET    /users                      - Get all users
GET    /users/:user_id             - Get user by ID
PATCH  /users/:user_id             - Update user profile
DELETE /users/:user_id             - Delete user
```

### Payment Endpoints (`/payments`)
```
POST   /payments/initialize        - Initialize Paystack payment
POST   /payments/verify            - Verify payment
```

### Webhook Endpoints (`/webhooks`)
```
POST   /webhooks/paystack          - Paystack payment webhook
```

---

## Authentication

### JWT Token Flow

1. **User Registration/Login**
   - User provides email and password
   - Backend validates credentials and hashes password with bcryptjs
   - JWT token is generated with user_id and role

2. **Token Usage**
   - Client includes token in Authorization header: `Authorization: Bearer <token>`
   - Backend middleware validates token signature and expiration
   - User information is attached to request object

3. **Token Refresh**
   - Refresh tokens are stored in Google Sheets
   - Expired tokens can be renewed via `/auth/refresh` endpoint
   - Old token is blacklisted to prevent reuse

4. **Logout**
   - Token is added to blacklist in memory/database
   - Token can no longer be used for authentication
   - `logoutAll` endpoint logs out from all devices

### Middleware: Authentication (`authMiddleware.js`)

```javascript
// Usage in routes
router.get('/protected-route', auth, controller);

// Admin only routes
router.post('/admin-route', auth, adminOnly, controller);
```

**Middleware Functions:**
- `auth` - Validates JWT token and user existence
- `adminOnly` - Checks if user has admin role

---

## Database & Data Models

### Data Storage
This application uses **Google Sheets** as the primary data store instead of a traditional database.

### Models

#### Users Model (`models/usersSheet.js`)
Stores user information in a Google Sheet:
- `user_id` - Unique identifier (UUID)
- `email` - User email address
- `password` - Hashed password
- `role` - User role (user/admin)
- `created_at` - Account creation timestamp
- `updated_at` - Last update timestamp

**Key Functions:**
- `findUserById(user_id)` - Retrieve user by ID
- `findUserByEmail(email)` - Retrieve user by email
- `createUser(userData)` - Create new user
- `updateUser(user_id, updates)` - Update user data
- `deleteUser(user_id)` - Delete user

#### Products Model (`models/productsSheet.js`)
Stores product catalog:
- `product_id` - Unique identifier
- `name` - Product name
- `description` - Product description
- `price` - Product price in kobo
- `category` - Product category
- `image_url` - Product image URL
- `stock_quantity` - Available stock
- `created_at` - Creation timestamp

**Key Functions:**
- `getProducts()` - Fetch all products
- `getProductsByCategory(category)` - Filter by category
- `createProduct(productData)` - Add new product
- `updateProduct(product_id, updates)` - Update product
- `deleteProduct(product_id)` - Remove product

#### Orders Model (`models/ordersSheet.js`)
Tracks customer orders:
- `order_id` - Unique identifier
- `user_id` - Associated user
- `total_amount` - Order total in kobo
- `status` - Order status (pending/completed/cancelled)
- `payment_reference` - Paystack reference
- `items` - Order items (JSON format)
- `created_at` - Order date

**Key Functions:**
- `getOrders()` - Fetch all orders
- `getOrdersByStatus(status)` - Filter by status
- `createOrder(orderData)` - Create new order
- `updateOrder(order_id, updates)` - Update order status
- `deleteOrder(order_id)` - Cancel order

#### Refresh Tokens Model (`models/refreshTokensSheet.js`)
Manages token refresh:
- `user_id` - Associated user
- `refresh_token` - Token value
- `expires_at` - Expiration timestamp

---

## Error Handling

### Custom Error Classes

#### BadRequest (`errors/bad-request.js`)
```javascript
throw new BadRequest('Invalid input');
// HTTP 400
```

#### Unauthenticated (`errors/unauthenticated.js`)
```javascript
throw new Unauthenticated('Missing token');
// HTTP 401
```

#### Unauthorized (`errors/unauthorized.js`)
```javascript
throw new Unauthorized('Admin only');
// HTTP 403
```

#### NotFound (`errors/not-found.js`)
```javascript
throw new NotFound('User not found');
// HTTP 404
```

#### Custom API Error (`errors/custom-api.js`)
Base class for all custom errors with custom status codes.

### Error Response Format
```json
{
  "error": "Error message",
  "statusCode": 400
}
```

### Error Handling Middleware
The application uses `express-async-errors` for catching async errors. Ensure all async functions are properly awaited.

---

## Middleware

### Built-in Middleware (`app.js`)

1. **CORS** - Enables cross-origin requests
2. **Express JSON** - Parses JSON request bodies
3. **Helmet** - Sets security HTTP headers
4. **Rate Limiting** - Protects against abuse
5. **Morgan** - HTTP request logging
6. **XSS Clean** - Prevents XSS attacks
7. **Mongo Sanitize** - Prevents NoSQL injection

### Custom Middleware

#### Authentication Middleware (`middlewares/authMiddleware.js`)

**`auth` Middleware:**
- Validates JWT token from Authorization header
- Checks token blacklist status
- Verifies user still exists
- Attaches user info to request object
- Returns 401 if invalid

**`adminOnly` Middleware:**
- Checks if authenticated user is admin
- Returns 403 if not admin
- Must be used after `auth` middleware

**Usage Example:**
```javascript
// Public route
router.get('/products', getProducts);

// Protected route
router.post('/orders', auth, createOrder);

// Admin only route
router.post('/products', auth, adminOnly, createProduct);
```

---

## Services

### Google Sheets Service (`services/googleSheets.js`)

**Purpose:** Manages authentication and access to Google Sheets API.

**Key Functions:**
```javascript
const { getSheets, SPREADSHEET_ID } = require('./googleSheets');

// Get authenticated sheets client
const sheets = await getSheets();

// Access spreadsheet
const response = await sheets.spreadsheets.values.get({
  spreadsheetId: SPREADSHEET_ID,
  range: 'Users!A:Z'
});
```

**Configuration:**
- Uses service account authentication
- Requires `google-service-key.json` file
- Scope: Google Sheets API v4

### Paystack Service (`services/paystack.js`)

**Purpose:** Handles payment initialization and verification with Paystack.

**Key Functions:**

```javascript
const { initializePayment, verifyPayment } = require('./paystack');

// Initialize payment
const payment = await initializePayment(
  email,
  amountInKobo,
  order_id
);
// Returns: { status, data: { authorization_url, access_code, reference } }

// Verify payment
const verification = await verifyPayment(reference);
// Returns: { status, data: { status: 'success'|'failed', amount, reference } }
```

**Integration:**
- Base URL: `https://api.paystack.co`
- Authentication: Bearer token via `PAYSTACK_SECRET_KEY`
- Amount is in kobo (1 naira = 100 kobo)
- Webhook handling via `/webhooks/paystack`

---

## Development

### Running the Server

**Development Mode (with auto-reload):**
```bash
npm start
```

This uses nodemon to automatically restart the server when files change.

### Testing

Run tests with:
```bash
npm test
```

Test file location: `test/test.js`

### Project Scripts

```json
{
  "start": "nodemon server.js"
}
```

### Debugging

1. **Console Logging:**
   ```javascript
   console.log('Debug info:', variable);
   ```

2. **Error Logging:**
   - All errors are logged to console
   - Check server logs for middleware errors
   - Monitor Paystack webhook responses

3. **Environment Debugging:**
   - Check `.env` file is properly configured
   - Verify Google Sheet ID and service account
   - Confirm Paystack API keys

### Common Issues & Solutions

#### Issue: Authentication Fails
**Solution:** 
- Verify `JWT_SECRET` is set in `.env`
- Check token is properly formatted: `Authorization: Bearer <token>`
- Ensure user exists in database

#### Issue: Google Sheets Connection Error
**Solution:**
- Verify `google-service-key.json` exists
- Check Google Sheet is shared with service account email
- Confirm `GOOGLE_SHEET_ID` is correct

#### Issue: Paystack Payment Not Processing
**Solution:**
- Verify `PAYSTACK_SECRET_KEY` is correct
- Check amount is in kobo format
- Ensure webhook URL is accessible

#### Issue: CORS Errors
**Solution:**
- Check `CORS_ORIGIN` in `.env` matches frontend URL
- Verify CORS middleware is configured in `app.js`

### Best Practices

1. **Always use JWT tokens for protected endpoints**
2. **Validate all user input with Joi schemas**
3. **Hash passwords with bcryptjs before storing**
4. **Log important events (auth, payments, errors)**
5. **Handle async errors properly with try-catch**
6. **Keep sensitive data in `.env` file**
7. **Use HTTPS in production**
8. **Implement rate limiting for public endpoints**
9. **Regularly update dependencies**
10. **Test payment flow with Paystack test keys**

---

## Contributing

When adding new features:
1. Create new route file in `routes/`
2. Create controller in `controllers/`
3. Add data model in `models/` if needed
4. Add error handling with custom error classes
5. Document new endpoints in this README
6. Test thoroughly before committing

---

## Support & Contact

For issues or questions:
- Author: Ifeanyi Nwankwo
- License: ISC

---

**Last Updated:** January 2026
**Version:** 1.0.0
