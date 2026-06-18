# 01. Project Scope

## 1. Project Title

**Triển khai hệ thống thương mại điện tử đơn giản có khả năng cân bằng tải và tự động mở rộng trên nền tảng Kubernetes**

English title:

**Deploying a Simple E-commerce Web Application with Load Balancing and Auto Scaling on Kubernetes**

## 2. Project Context

This project is built for the Cloud Computing course.

The system uses a simple e-commerce web application as a sample workload to demonstrate cloud-native deployment on Kubernetes.

The focus of the project is not advanced e-commerce business logic. The focus is on how Kubernetes supports deployment, load balancing, auto scaling, self-healing, and rolling update.

## 3. Main Objectives

The project aims to achieve the following objectives:

1. Build a simple e-commerce web application.
2. Containerize the frontend and backend using Docker.
3. Deploy the application on Kubernetes.
4. Run multiple backend replicas.
5. Use Kubernetes Service to balance traffic between backend Pods.
6. Use Horizontal Pod Autoscaler to scale backend Pods based on CPU usage.
7. Demonstrate self-healing by deleting a Pod and observing automatic replacement.
8. Demonstrate rolling update by upgrading the backend version.
9. Prepare documentation and demo evidence for the course report.

## 4. Functional Scope

The e-commerce web application includes only basic functions.

### 4.1. Customer functions

- View product list
- View product detail
- Add product to cart
- View cart
- Update cart quantity
- Remove product from cart
- Create mock order
- View order detail

### 4.2. Admin functions

- Create product
- Update product
- Delete product
- View order list
- Update order status

### 4.3. System functions for Kubernetes demo

- View system information
- View application version
- Check application health
- Generate temporary CPU load for auto scaling test

## 5. Non-functional Scope

The system should demonstrate the following non-functional characteristics:

- Scalability
- Availability
- Fault tolerance
- Container portability
- Basic observability through logs and Kubernetes commands
- Simple deployment automation using Kubernetes YAML files

## 6. Out of Scope

The following features are not required:

- Real payment gateway
- Real shipping integration
- Voucher or promotion system
- Product review and comment system
- Chat system
- Complex authentication and authorization
- Microservices architecture
- Database replication
- Production-grade security hardening
- CI/CD pipeline

## 7. Final Deliverables

The final deliverables include:

- Source code for frontend
- Source code for backend
- Dockerfiles
- Kubernetes YAML files
- API documentation
- Database design document
- Deployment guide
- Demo checklist
- Report screenshots or terminal output

