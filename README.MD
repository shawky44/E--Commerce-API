# 🛒 E-Commerce REST API

A full-featured e-commerce backend built with Node.js, Express, and MongoDB,
featuring authentication, product management, cart, orders, Stripe payment
integration, and full Docker support.

---

## 🚀 Tech Stack

| Layer | Technology |
|---|---|
| Runtime | Node.js (ES Modules) |
| Framework | Express.js v5 |
| Database | MongoDB + Mongoose |
| Authentication | JWT (JSON Web Tokens) |
| Payment | Stripe |
| Email | Nodemailer |
| Validation | Zod + Joi |
| Security | Helmet, CORS, express-rate-limit |
| File Upload | Multer |
| Password Hashing | bcryptjs |
| Containerization | Docker + Docker Compose |

---

## 🐳 Docker Setup

This project is fully containerized using Docker and Docker Compose.
Running it locally requires only **Docker Desktop** — no Node.js or npm needed.

### Services

| Service | Description | Port |
|---|---|---|
| `api` | Node.js Backend | 5000 |
| `web` | React Frontend (Nginx) | 3000 |

### Run with Docker

```bash
# Clone the repo
git clone https://github.com/shawky44/E--Commerce-API.git
cd E--Commerce-API

# Create your .env file
cp server/.env.example server/.env
# Fill in your values in server/.env

# Build and start all containers
docker-compose up -d --build
```

### Access the App

```
Frontend  →  http://localhost:3000
Backend   →  http://localhost:5000
```

### Useful Docker Commands

```bash
# View running containers
docker-compose ps

# View backend logs
docker-compose logs api

# Stop all containers
docker-compose down

# Rebuild after code changes
docker-compose up -d --build
```

---

## 📁 Project Structure

```
E-Commerce/
├── client/                    # React Frontend
│   └── Dockerfile             # Multi-stage build (React → Nginx)
├── server/                    # Node.js Backend
│   ├── config/
│   │   └── db.js              # MongoDB connection
│   ├── controllers/
│   │   ├── authController.js
│   │   ├── productController.js
│   │   ├── userController.js
│   │   ├── cartController.js
│   │   ├── orderController.js
│   │   └── paymentController.js
│   ├── middlewares/
│   │   ├── authMiddleware.js
│   │   ├── error.middleware.js
│   │   ├── sendMail.js
│   │   └── uploadMiddleware.js
│   ├── models/
│   │   ├── User.js
│   │   ├── Product.js
│   │   ├── Cart.js
│   │   └── Order.js
│   ├── routes/
│   ├── utils/
│   ├── validation/
│   ├── uploads/
│   ├── .env.example
│   ├── Dockerfile
│   └── index.js
└── docker-compose.yml
```

---

## ✅ Features

### 🔐 Authentication System
- Register with email verification (OTP)
- Login with JWT token
- Resend verification code with cooldown
- Forgot password with OTP reset
- Change password for authenticated users
- Password hashing with bcryptjs

### 👤 User Management
- Get all users (admin only)
- Get user by ID (admin only)
- Delete user (admin only)

### 📦 Product System
- Create / Update / Delete products (admin only)
- Get all products with search, filter, and pagination
- Get single product by ID
- Image upload via Multer
- Categories: electronics, clothing, food, other
- Slug generation for SEO-friendly URLs

### 🛒 Cart System
- Add product to cart (auto-merges quantity if exists)
- Get cart with populated product details and total price
- Update item quantity (with stock validation)
- Remove single item or clear entire cart

### 📋 Order System
- Create order from cart (snapshot prices at purchase time)
- Stock automatically decreased on order creation
- Cancel order (pending only — restores stock)
- Get my orders with pagination
- Admin: Update order status with enforced flow:

```
pending → paid → shipped → delivered
    ↓
cancelled (from pending only)
```

### 💳 Payment System (Stripe)
- Create Stripe Checkout Session from an order
- Webhook handler verifies Stripe signature
- Marks order as paid automatically

### 🛡️ Security
- JWT-based protected routes
- Admin role authorization middleware
- `helmet` for HTTP headers security
- `express-rate-limit` — 100 requests / 15 min
- CORS configured per environment
- Raw body preserved for Stripe webhook verification

---

## 📡 API Endpoints

### Auth `/api/auth`

| Method | Endpoint | Description | Auth |
|---|---|---|---|
| POST | /register | Register new user | Public |
| POST | /login | Login and get JWT | Public |
| POST | /verify-email | Verify email with OTP | Protected |
| POST | /resend-code | Resend verification OTP | Protected |
| POST | /forgot-password | Reset password with OTP | Public |
| PATCH | /change-password | Change current password | Protected |

### Products `/api/products`

| Method | Endpoint | Description | Auth |
|---|---|---|---|
| GET | / | Get all products | Public |
| GET | /:id | Get product by ID | Public |
| POST | / | Create product | Admin |
| PUT | /:id | Update product | Admin |
| DELETE | /:id | Delete product | Admin |

### Cart `/api/cart`

| Method | Endpoint | Description | Auth |
|---|---|---|---|
| GET | / | Get my cart | Protected |
| POST | / | Add item to cart | Protected |
| PUT | /:itemId | Update item quantity | Protected |
| DELETE | / | Clear cart | Protected |
| DELETE | /:itemId | Remove item | Protected |

### Orders `/api/orders`

| Method | Endpoint | Description | Auth |
|---|---|---|---|
| POST | / | Create order from cart | Protected |
| GET | /my-orders | Get my orders | Protected |
| GET | /:id | Get order details | Protected |
| PUT | /:id/cancel | Cancel order | Protected |
| GET | / | Get all orders | Admin |
| PUT | /:id/status | Update order status | Admin |

### Payment `/api/payment`

| Method | Endpoint | Description | Auth |
|---|---|---|---|
| POST | /create-checkout-session | Create Stripe session | Protected |
| POST | /webhook | Stripe webhook handler | Public (Stripe) |

### Upload `/api/upload`

| Method | Endpoint | Description | Auth |
|---|---|---|---|
| POST | / | Upload product image | Admin |

---

## ⚙️ Environment Variables

Create a `.env` file inside the `server/` directory based on `.env.example`:

```env
PORT=5000
MONGO_URL=mongodb+srv://...
TOKEN_SECRET=your_jwt_secret
HMAC_VERIFICATION_CODE_SECRET=your_hmac_secret
SENDING_EMAIL_ADDRESS=your_email
SENDING_EMAIL_PASSWORD=your_email_password
ADMIN_INVITE_TOKEN=your_admin_token
NODE_ENV=production
CLIENT_URL=http://localhost:3000
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...
```

---

## 🏃 Getting Started (Without Docker)

```bash
cd server
npm install
npm start
```

### Testing Stripe Webhook Locally

```bash
stripe login
stripe listen --forward-to localhost:5000/api/payment/webhook
```

Copy the `whsec_...` secret into your `.env` as `STRIPE_WEBHOOK_SECRET`, then restart the server.