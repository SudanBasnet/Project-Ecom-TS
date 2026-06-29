# Project Ecom Server

TypeScript Express API for an ecommerce backend. It includes authentication, users, brands, categories, products, cart, wishlist, Cloudinary file uploads, MongoDB persistence, and login email notifications.

## Tech Stack

- Node.js
- Express 5
- TypeScript
- MongoDB with Mongoose
- JWT authentication
- Cookie-based access token storage
- Multer for local upload handling
- Cloudinary for image storage
- Nodemailer for email

## Project Structure

```text
src/
  app.ts                    Express app setup
  server.ts                 Server and database startup
  config/                   Environment, MongoDB, Cloudinary, Nodemailer config
  controllers/              Route handlers
  middlewares/              Auth, upload, not-found, and error middleware
  models/                   Mongoose schemas
  routes/                   API route definitions
  types/                    Shared TypeScript types and enums
  utils/                    Helpers for JWT, bcrypt, email, response, etc.
rest.http                   Example API requests
uploads/                    Temporary upload folder
dist/                       Compiled JavaScript output
```

## Getting Started

Install dependencies:

```bash
npm install
```

Create `.env` from `.env.example` and fill in your values:

```bash
cp .env.example .env
```

Required environment variables:

```text
PORT
NODE_ENV
DB_URI
SMTP_HOST
SMTP_SERVICE
SMTP_PORT
SMTP_USER
SMTP_PASS
CLOUDINARY_CLOUD_NAME
CLOUDINARY_API_KEY
CLOUDINARY_API_SECRET
JWT_SECRET
JWT_EXPIRY
COOKIE_EXPIRY
```

Run in development:

```bash
npm run dev
```

Build TypeScript:

```bash
npm run build
```

Run compiled server:

```bash
npm start
```

Default health check:

```text
GET /
```

Default API base path:

```text
/api/v1
```

## Main Routes

```text
POST   /api/v1/auth/register
POST   /api/v1/auth/login
PUT    /api/v1/auth/change-profile-image/:id

GET    /api/v1/users
GET    /api/v1/users/:id
DELETE /api/v1/users/:id

GET    /api/v1/brands
POST   /api/v1/brands
GET    /api/v1/brands/:id
PUT    /api/v1/brands/:id
DELETE /api/v1/brands/:id

GET    /api/v1/categories
POST   /api/v1/categories
GET    /api/v1/categories/:id
PUT    /api/v1/categories/:id
DELETE /api/v1/categories/:id

GET    /api/v1/products
GET    /api/v1/products/featured
GET    /api/v1/products/new-arrivals
GET    /api/v1/products/category/:id
GET    /api/v1/products/:id
POST   /api/v1/products
PUT    /api/v1/products/:id
DELETE /api/v1/products/:id

GET    /api/v1/cart
POST   /api/v1/cart/:productId
PUT    /api/v1/cart/:productId
DELETE /api/v1/cart/:productId
DELETE /api/v1/cart

GET    /api/v1/wishlist
POST   /api/v1/wishlist/:productId
DELETE /api/v1/wishlist/:productId
DELETE /api/v1/wishlist
```

See `rest.http` for example requests.
