# API Requirements
The company stakeholders want to create an online storefront to showcase their great product ideas. Users need to be able to browse an index of all products, see the specifics of a single product, and add products to an order that they can view in a cart page. You have been tasked with building the API that will support this application, and your coworker is building the frontend.

These are the notes from a meeting with the frontend developer that describe what endpoints the API needs to supply, as well as data shapes the frontend and backend have agreed meet the requirements of the application. 

## API Endpoints
#### Products
- Index 
- Show
- Create [token required]
- [OPTIONAL] Top 5 most popular products 
- [OPTIONAL] Products by category (args: product category)

#### Users
- Index [token required]
- Show [token required]
- Create N[token required]

#### Orders
- Current Order by user (args: user id)[token required]
- [OPTIONAL] Completed Orders by user (args: user id)[token required]

## Data Shapes
#### Product
-  id
- name
- price
- [OPTIONAL] category

#### User
- id
- firstName
- lastName
- password

#### Orders
- id
- id of each product in the order
- quantity of each product in the order
- user_id
- status of order (active or complete)

## Database Schema

The following schema maps the API data shapes to relational tables. Types are chosen to match the data sent/returned by the API and to ensure integrity with primary/foreign keys and sensible defaults.

### Table: `users`

| Column       | Type        | Constraints                                   | Notes                         |
|--------------|-------------|-----------------------------------------------|-------------------------------|
| id           | SERIAL      | PRIMARY KEY                                   | Auto-increment                |
| first_name   | VARCHAR(100)| NOT NULL                                      |                               |
| last_name    | VARCHAR(100)| NOT NULL                                      |                               |
| password     | VARCHAR(255)| NOT NULL                                      | Stores bcrypt hash            |
| created_at   | TIMESTAMP   | NOT NULL DEFAULT NOW()                        |                               |
| updated_at   | TIMESTAMP   | NOT NULL DEFAULT NOW()                        | Update with trigger or app    |

Indexes: `INDEX users_first_last_idx (first_name, last_name)` (optional for login flow)

### Table: `products`

| Column     | Type         | Constraints                    | Notes                         |
|------------|--------------|--------------------------------|-------------------------------|
| id         | SERIAL       | PRIMARY KEY                    | Auto-increment                |
| name       | VARCHAR(150) | NOT NULL                       |                               |
| price      | NUMERIC(10,2)| NOT NULL CHECK (price >= 0)    | Stored as numeric (money)     |
| category   | VARCHAR(100) |                                 | Optional                      |
| created_at | TIMESTAMP    | NOT NULL DEFAULT NOW()         |                               |
| updated_at | TIMESTAMP    | NOT NULL DEFAULT NOW()         |                               |

Index: `INDEX products_category_idx (category)` (optional)

### Table: `orders`

| Column     | Type        | Constraints                                            | Notes                         |
|------------|-------------|--------------------------------------------------------|-------------------------------|
| id         | SERIAL      | PRIMARY KEY                                            | Auto-increment                |
| user_id    | INTEGER     | NOT NULL REFERENCES users(id) ON DELETE CASCADE       | Owner of the order            |
| status     | VARCHAR(10) | NOT NULL CHECK (status IN ('active','complete'))      |                               |
| created_at | TIMESTAMP   | NOT NULL DEFAULT NOW()                                 |                               |
| updated_at | TIMESTAMP   | NOT NULL DEFAULT NOW()                                 |                               |

Index: `INDEX orders_user_id_idx (user_id)`

### Table: `order_products`

| Column     | Type        | Constraints                                                  | Notes                         |
|------------|-------------|--------------------------------------------------------------|-------------------------------|
| id         | SERIAL      | PRIMARY KEY                                                  | Auto-increment                |
| order_id   | INTEGER     | NOT NULL REFERENCES orders(id) ON DELETE CASCADE            | Line belongs to an order      |
| product_id | INTEGER     | NOT NULL REFERENCES products(id) ON DELETE RESTRICT         | Product in the order          |
| quantity   | INTEGER     | NOT NULL CHECK (quantity > 0)                               |                               |
| created_at | TIMESTAMP   | NOT NULL DEFAULT NOW()                                       |                               |
| updated_at | TIMESTAMP   | NOT NULL DEFAULT NOW()                                       |                               |

Indexes:
- `INDEX order_products_order_id_idx (order_id)`
- `INDEX order_products_product_id_idx (product_id)`
- Optional composite: `UNIQUE (order_id, product_id)` to prevent duplicate product rows per order

This schema supports all required endpoints:
- Users: create/login/list rely on `users`
- Products: index/show/create rely on `products`
- Orders: creation and status rely on `orders`; adding items and fetching current order contents rely on `order_products` joined to `orders`/`products`.

### PSQL Table Definitions (DDL)

```sql
-- users
CREATE TABLE IF NOT EXISTS users (
  id SERIAL PRIMARY KEY,
  first_name VARCHAR(100) NOT NULL,
  last_name VARCHAR(100) NOT NULL,
  password VARCHAR(255) NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS users_first_last_idx ON users(first_name, last_name);

-- products
CREATE TABLE IF NOT EXISTS products (
  id SERIAL PRIMARY KEY,
  name VARCHAR(150) NOT NULL,
  price NUMERIC(10,2) NOT NULL CHECK (price >= 0),
  category VARCHAR(100),
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS products_category_idx ON products(category);

-- orders
CREATE TABLE IF NOT EXISTS orders (
  id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  status VARCHAR(10) NOT NULL CHECK (status IN ('active','complete')),
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS orders_user_id_idx ON orders(user_id);

-- order_products (join table)
CREATE TABLE IF NOT EXISTS order_products (
  id SERIAL PRIMARY KEY,
  order_id INTEGER NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  product_id INTEGER NOT NULL REFERENCES products(id) ON DELETE RESTRICT,
  quantity INTEGER NOT NULL CHECK (quantity > 0),
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP NOT NULL DEFAULT NOW(),
  UNIQUE (order_id, product_id)
);
CREATE INDEX IF NOT EXISTS order_products_order_id_idx ON order_products(order_id);
CREATE INDEX IF NOT EXISTS order_products_product_id_idx ON order_products(product_id);
```

Notes on types and conversions:
- `products.price` is stored as `NUMERIC(10,2)` in Postgres for precision. The application converts it to a JavaScript `number` when reading (e.g., via `parseFloat`) to match API tests/consumers.
- Foreign keys ensure referential integrity across `orders`, `order_products`, `users`, and `products`.

To inspect in psql:
```
\d users
\d products
\d orders
\d order_products
```

