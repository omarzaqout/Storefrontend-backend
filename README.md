# Storefront Backend

Simple Node/Express + Postgres API for products, users, and orders.

## Prerequisites
- Node 18+ and npm
- Postgres 14+ (local) or Docker Desktop (optional)

## Environment
Create a `.env` file in the project root:
```
PORT=3000
DB_HOST=localhost
DB_PORT=5432
DB_USER=full_stack_user
DB_PASSWORD=password123
DB_NAME=full_stack_dev
JWT_SECRET=dev_secret
```

`database.json` is already configured for `dev` with the same values.

## Install
```
npm install
```

## Database setup
1) Create the database and user in Postgres (if not created):
```sql
CREATE USER full_stack_user WITH PASSWORD 'password123';
CREATE DATABASE full_stack_dev OWNER full_stack_user;
GRANT ALL PRIVILEGES ON DATABASE full_stack_dev TO full_stack_user;
```
2) Run migrations:
```
npx db-migrate up -e dev
```

## Build and run
```
npm run build
npm start
```
Server will start on `http://localhost:${PORT}` (defaults to 3000).

## Tests
```
npm test
```

## API Endpoints
- Users
  - POST `/api/users/signUp` → create user, returns `{ user, token }`
  - POST `/api/users/login` → login, returns `{ token }`
  - GET `/api/users` [Bearer token] → list users

- Products
  - GET `/api/products` → list products
  - GET `/api/products/:id` → get product by id
  - POST `/api/products` [Bearer token] → create product
  - GET `/api/products/top/popular` → top 5 products (optional)
  - GET `/api/products/category/:category` → by category (optional)

- Orders
  - POST `/api/orders` [Bearer token] body: `{ userId, status }`
  - POST `/api/orders/addProduct` [Bearer token] body: `{ orderId, productId, quantity }`
  - GET `/api/orders/current` [Bearer token] → current order products
  - GET `/api/orders/completed` [Bearer token] → completed orders (optional)
  - PUT `/api/orders/updateStatus` [Bearer token] body: `{ orderId, status }`

Notes:
- Auth header format: `Authorization: Bearer <token>`
- Passwords are hashed with bcrypt.

## Docker (optional)
If Docker Desktop is installed, you can run Postgres and the app via compose:
```
docker compose up -d --build
```
If Docker is not installed, run Postgres locally and follow the steps above.
