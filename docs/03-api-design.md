# 03. API Design

## 1. API Overview

The backend provides REST APIs for a simple e-commerce system and system APIs for Kubernetes demonstration.

Base URL:

```txt
/api
```

Main API groups:

- Product APIs
- Cart APIs
- Order APIs
- Admin APIs
- System APIs

## 2. Product APIs

### 2.1. Get product list

```http
GET /api/products
```

Description:

Returns the list of products.

Example response:

```json
[
  {
    "id": 1,
    "name": "Mechanical Keyboard K8",
    "description": "Basic mechanical keyboard",
    "price": 890000,
    "imageUrl": "https://example.com/keyboard.jpg",
    "stock": 20
  }
]
```

### 2.2. Get product detail

```http
GET /api/products/{id}
```

Description:

Returns detail of one product.

Example response:

```json
{
  "id": 1,
  "name": "Mechanical Keyboard K8",
  "description": "Basic mechanical keyboard",
  "price": 890000,
  "imageUrl": "https://example.com/keyboard.jpg",
  "stock": 20
}
```

## 3. Admin Product APIs

### 3.1. Create product

```http
POST /api/admin/products
```

Example request:

```json
{
  "name": "Logitech G102 Mouse",
  "description": "Basic gaming mouse",
  "price": 390000,
  "imageUrl": "https://example.com/mouse.jpg",
  "stock": 50
}
```

### 3.2. Update product

```http
PUT /api/admin/products/{id}
```

Example request:

```json
{
  "name": "Logitech G102 Mouse",
  "description": "Updated gaming mouse",
  "price": 420000,
  "imageUrl": "https://example.com/mouse.jpg",
  "stock": 45
}
```

### 3.3. Delete product

```http
DELETE /api/admin/products/{id}
```

Description:

Deletes a product by id.

## 4. Cart APIs

The cart can be identified by a simple `sessionId`.

### 4.1. Get cart

```http
GET /api/cart?sessionId={sessionId}
```

### 4.2. Add item to cart

```http
POST /api/cart/items
```

Example request:

```json
{
  "sessionId": "demo-session-001",
  "productId": 1,
  "quantity": 2
}
```

### 4.3. Update cart item quantity

```http
PUT /api/cart/items/{itemId}
```

Example request:

```json
{
  "quantity": 3
}
```

### 4.4. Remove cart item

```http
DELETE /api/cart/items/{itemId}
```

### 4.5. Clear cart

```http
DELETE /api/cart?sessionId={sessionId}
```

## 5. Order APIs

### 5.1. Create mock order

```http
POST /api/orders
```

Example request:

```json
{
  "sessionId": "demo-session-001",
  "customerName": "Nguyen Van A",
  "phone": "0900000000",
  "address": "TP.HCM"
}
```

Example response:

```json
{
  "orderId": 1001,
  "status": "PENDING",
  "totalAmount": 1280000
}
```

### 5.2. Get order detail

```http
GET /api/orders/{id}
```

## 6. Admin Order APIs

### 6.1. Get order list

```http
GET /api/admin/orders
```

### 6.2. Update order status

```http
PUT /api/admin/orders/{id}/status
```

Example request:

```json
{
  "status": "CONFIRMED"
}
```

Allowed order statuses:

```txt
PENDING
CONFIRMED
SHIPPING
COMPLETED
CANCELLED
```

## 7. System APIs for Kubernetes Demo

These APIs are required for demonstrating Kubernetes mechanisms.

### 7.1. Get system information

```http
GET /api/system/info
```

Description:

Returns application name, version, hostname or Pod name, and current time.

Example response:

```json
{
  "app": "simple-ecommerce-api",
  "version": "v1",
  "hostname": "ecommerce-backend-7d9d8c9f7b-xk29a",
  "time": "2026-06-16T10:30:00"
}
```

Purpose:

This endpoint is used to demonstrate load balancing. When multiple backend Pods are running, repeated requests can return different hostnames.

### 7.2. Health check

```http
GET /api/system/health
```

Example response:

```json
{
  "status": "UP"
}
```

Purpose:

This endpoint is used for Kubernetes readiness and liveness checks.

### 7.3. Generate CPU load

```http
GET /api/system/load
```

Example response:

```json
{
  "message": "CPU load generated",
  "durationMs": 3000
}
```

Purpose:

This endpoint creates temporary CPU load to test Horizontal Pod Autoscaler.

### 7.4. Get version

```http
GET /api/system/version
```

Example response:

```json
{
  "version": "v1"
}
```

Purpose:

This endpoint is used to demonstrate rolling update from version v1 to version v2.

