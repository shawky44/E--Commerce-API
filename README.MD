# 🛒 E-Commerce REST API

A full-featured e-commerce backend built with **Node.js**, **Express**, and **MongoDB**, featuring authentication, product management, cart, orders, and Stripe payment integration.

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

---

## 📁 Project Structure

```
server/
├── config/
│   └── db.js                  # MongoDB connection
├── controllers/
│   ├── authController.js       # Register, login, verify, password reset
│   ├── productController.js    # CRUD products
│   ├── userController.js       # User management
│   ├── cartController.js       # Cart operations
│   ├── orderController.js      # Order lifecycle
│   └── paymentController.js    # Stripe integration
├── middlewares/
│   ├── authMiddleware.js        # JWT protect + adminOnly
│   ├── error.middleware.js      # Global error handler
│   ├── sendMail.js              # Email utility
│   └── uploadMiddleware.js      # Multer file upload
├── models/
│   ├── User.js                  # User schema
│   ├── Product.js               # Product schema
│   ├── Cart.js                  # Cart schema
│   └── Order.js                 # Order schema
├── routes/
│   ├── authRoutes.js
│   ├── productRoutes.js
│   ├── userRoutes.js
│   ├── cartRoutes.js
│   ├── orderRoutes.js
│   ├── paymentRoutes.js
│   └── uploadRoute.js
├── utils/
│   ├── hashing.js
│   └── mail.service.js
├── validation/
│   └── validation.js            # Zod + Joi schemas
├── uploads/                     # Static image files
├── .env
└── index.js                     # Entry point
```

---

## ✅ Features

### 🔐 Authentication System
- **Register** with email verification (OTP)
- **Login** with JWT token
- **Email verification** via OTP code
- **Resend verification code** with cooldown
- **Forgot password** with OTP reset
- **Change password** for authenticated users
- Password hashing with **bcryptjs**

### 👤 User Management
- Get all users *(admin only)*
- Get user by ID *(admin only)*
- Delete user *(admin only)*

### 📦 Product System
- Create / Update / Delete products *(admin only)*
- Get all products with **search**, **filter**, and **pagination**
- Get single product by ID
- Image upload via **Multer**
- Categories: `electronics`, `clothing`, `food`, `other`
- Slug generation for SEO-friendly URLs

### 🛒 Cart System
- Add product to cart (auto-merges quantity if product exists)
- Get cart with populated product details and **total price**
- Update item quantity (with stock validation)
- Remove single item from cart
- Clear entire cart

### 📋 Order System
- Create order from cart (snapshot prices at purchase time)
- Stock is automatically decreased on order creation
- Cancel order *(pending orders only — restores stock)*
- Get my orders with pagination
- Get single order details
- Admin: Get all orders with pagination
- Admin: Update order status with enforced flow:
  ```
  pending → paid → shipped → delivered
      ↓
  cancelled (from pending only)
  ```
- Timestamps: `paidAt`, `deliveredAt`

### 💳 Payment System (Stripe)
- Create Stripe **Checkout Session** from an order
- Redirect user to hosted Stripe payment page
- **Webhook handler** verifies Stripe signature and marks order as `paid`
- Supports `success_url` and `cancel_url` redirects
- Tested locally with **Stripe CLI**

### 🛡️ Security
- JWT-based protected routes
- Admin role authorization middleware
- `helmet` for HTTP headers security
- `express-rate-limit` — 100 requests / 15 min
- CORS configured per environment
- Raw body preserved for Stripe webhook verification

### ⚙️ Architecture
- Modular MVC structure
- Global error handler middleware
- Dual validation layer: **Zod** (products, cart) + **Joi** (auth)
- Environment-based configuration via dotenvx

---

## 📡 API Endpoints

### Auth `/api/auth`
| Method | Endpoint | Description | Auth |
|---|---|---|---|
| POST | `/register` | Register new user | Public |
| POST | `/login` | Login and get JWT | Public |
| POST | `/verify-email` | Verify email with OTP | Protected |
| POST | `/resend-code` | Resend verification OTP | Protected |
| POST | `/forgot-password` | Reset password with OTP | Public |
| PATCH | `/change-password` | Change current password | Protected |

### Products `/api/products`
| Method | Endpoint | Description | Auth |
|---|---|---|---|
| GET | `/` | Get all products (search/filter/pagination) | Public |
| GET | `/:id` | Get product by ID | Public |
| POST | `/` | Create product | Admin |
| PUT | `/:id` | Update product | Admin |
| DELETE | `/:id` | Delete product | Admin |

### Cart `/api/cart`
| Method | Endpoint | Description | Auth |
|---|---|---|---|
| GET | `/` | Get my cart | Protected |
| POST | `/` | Add item to cart | Protected |
| PUT | `/:itemId` | Update item quantity | Protected |
| DELETE | `/` | Clear cart | Protected |
| DELETE | `/:itemId` | Remove item | Protected |

### Orders `/api/orders`
| Method | Endpoint | Description | Auth |
|---|---|---|---|
| POST | `/` | Create order from cart | Protected |
| GET | `/my-orders` | Get my orders | Protected |
| GET | `/:id` | Get order details | Protected |
| PUT | `/:id/cancel` | Cancel order | Protected |
| GET | `/` | Get all orders | Admin |
| PUT | `/:id/status` | Update order status | Admin |

### Payment `/api/payment`
| Method | Endpoint | Description | Auth |
|---|---|---|---|
| POST | `/create-checkout-session` | Create Stripe session | Protected |
| POST | `/webhook` | Stripe webhook handler | Public (Stripe) |

### Upload `/api/upload`
| Method | Endpoint | Description | Auth |
|---|---|---|---|
| POST | `/` | Upload product image | Admin |

---

## ⚙️ Environment Variables

```env
PORT=5000
MONGO_URL=mongodb://...
TOKEN_SECRET=your_jwt_secret
CLIENT_URL=http://localhost:3000

# Email
EMAIL_USER=your_email
EMAIL_PASS=your_password

# Stripe
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...
```

---

## 🏃 Getting Started

```bash
# Install dependencies
cd server
npm install

# Start development server
npm start
```

### Testing Stripe Webhook Locally
```bash
# Install Stripe CLI, then:
stripe login
stripe listen --forward-to localhost:5000/api/payment/webhook
```

Copy the `whsec_...` secret into your `.env` as `STRIPE_WEBHOOK_SECRET`, then restart the server.

---

## 🗺️ Roadmap

- [ ] Admin Dashboard statistics (revenue, user counts)
- [ ] Reviews & Ratings system
- [ ] Wishlist
- [ ] Categories management
- [ ] Deploy to production (Railway / Render)