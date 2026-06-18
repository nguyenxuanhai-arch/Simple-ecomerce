# 04. Database Design

## 1. Database Overview

The database is designed for a simple e-commerce system.

The database should be simple enough for course implementation but complete enough to support product listing, cart, and order creation.

Recommended database:

```txt
MySQL 8
```

## 2. Main Tables

The minimum tables are:

- products
- cart_items
- orders
- order_items

Optional tables:

- users
- roles
- user_roles

For this project, authentication is optional. Therefore, the minimum version does not require user tables.

## 3. products Table

Purpose:

Stores product information.

Columns:

```txt
id BIGINT PRIMARY KEY AUTO_INCREMENT
name VARCHAR(255) NOT NULL
description TEXT
price DECIMAL(12,2) NOT NULL
image_url VARCHAR(1000)
stock INT NOT NULL
created_at DATETIME NOT NULL
updated_at DATETIME NOT NULL
```

## 4. cart_items Table

Purpose:

Stores products added to cart. A simple `session_id` is used instead of user login.

Columns:

```txt
id BIGINT PRIMARY KEY AUTO_INCREMENT
session_id VARCHAR(100) NOT NULL
product_id BIGINT NOT NULL
quantity INT NOT NULL
created_at DATETIME NOT NULL
updated_at DATETIME NOT NULL
```

Relationship:

```txt
cart_items.product_id -> products.id
```

## 5. orders Table

Purpose:

Stores mock order information.

Columns:

```txt
id BIGINT PRIMARY KEY AUTO_INCREMENT
customer_name VARCHAR(255) NOT NULL
phone VARCHAR(50) NOT NULL
address VARCHAR(500) NOT NULL
status VARCHAR(50) NOT NULL
total_amount DECIMAL(12,2) NOT NULL
created_at DATETIME NOT NULL
updated_at DATETIME NOT NULL
```

Allowed status values:

```txt
PENDING
CONFIRMED
SHIPPING
COMPLETED
CANCELLED
```

## 6. order_items Table

Purpose:

Stores products inside an order.

Columns:

```txt
id BIGINT PRIMARY KEY AUTO_INCREMENT
order_id BIGINT NOT NULL
product_id BIGINT NOT NULL
product_name VARCHAR(255) NOT NULL
price DECIMAL(12,2) NOT NULL
quantity INT NOT NULL
subtotal DECIMAL(12,2) NOT NULL
```

Relationships:

```txt
order_items.order_id -> orders.id
order_items.product_id -> products.id
```

The table stores `product_name` and `price` at the time of ordering so that old orders are not affected when product information changes later.

## 7. Simple ERD

```txt
products 1 --- * cart_items
products 1 --- * order_items
orders   1 --- * order_items
```

## 8. SQL DDL Draft

```sql
CREATE TABLE products (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    price DECIMAL(12,2) NOT NULL,
    image_url VARCHAR(1000),
    stock INT NOT NULL,
    created_at DATETIME NOT NULL,
    updated_at DATETIME NOT NULL
);

CREATE TABLE cart_items (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    session_id VARCHAR(100) NOT NULL,
    product_id BIGINT NOT NULL,
    quantity INT NOT NULL,
    created_at DATETIME NOT NULL,
    updated_at DATETIME NOT NULL,
    CONSTRAINT fk_cart_items_product
        FOREIGN KEY (product_id) REFERENCES products(id)
);

CREATE TABLE orders (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    customer_name VARCHAR(255) NOT NULL,
    phone VARCHAR(50) NOT NULL,
    address VARCHAR(500) NOT NULL,
    status VARCHAR(50) NOT NULL,
    total_amount DECIMAL(12,2) NOT NULL,
    created_at DATETIME NOT NULL,
    updated_at DATETIME NOT NULL
);

CREATE TABLE order_items (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    order_id BIGINT NOT NULL,
    product_id BIGINT NOT NULL,
    product_name VARCHAR(255) NOT NULL,
    price DECIMAL(12,2) NOT NULL,
    quantity INT NOT NULL,
    subtotal DECIMAL(12,2) NOT NULL,
    CONSTRAINT fk_order_items_order
        FOREIGN KEY (order_id) REFERENCES orders(id),
    CONSTRAINT fk_order_items_product
        FOREIGN KEY (product_id) REFERENCES products(id)
);
```

## 9. Migration and Seed Data

The backend stores executable database scripts in:

```txt
backend/src/main/resources/db/migration/
```

Migration files:

```txt
V1__init_schema.sql
V2__seed_products.sql
```

`V1__init_schema.sql` creates the required tables:

```txt
products
cart_items
orders
order_items
```

`V2__seed_products.sql` inserts sample products for the demo product list, cart, and mock order flow.

Flyway runs these scripts automatically when the Spring Boot backend starts and connects to MySQL.

## 10. Database Deployment Options

There are two options for database deployment.

### Option 1. MySQL inside Kubernetes

Use MySQL Deployment, Service, and PersistentVolumeClaim.

Advantages:

- Everything runs inside Kubernetes.
- Easy to demonstrate full containerized deployment.

Disadvantages:

- More YAML configuration.
- Need to handle persistent storage.

### Option 2. MySQL outside Kubernetes

Run MySQL locally, with Docker Compose, or with a cloud database service.

Advantages:

- Easier to debug.
- Reduces Kubernetes complexity.

Disadvantages:

- Less complete as a Kubernetes deployment demo.

Recommended option for this project:

Use MySQL inside Kubernetes if the team has enough time. Otherwise, run MySQL outside Kubernetes and focus the demo on backend load balancing and HPA.
