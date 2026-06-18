# AGENTS.md

## 1. Project Overview

This project is a simple e-commerce web application used as a case study for the Cloud Computing course.

The main goal is not to build a complex e-commerce system, but to demonstrate cloud-native deployment concepts using Docker and Kubernetes.

The system must show the following cloud computing mechanisms:

- Containerization with Docker
- Deployment on Kubernetes
- Load balancing between multiple application Pods
- Horizontal auto scaling with HPA
- Self-healing when a Pod fails
- Rolling update between application versions
- Basic health check and system information endpoints

## 2. Project Name

Vietnamese title:

**Triển khai hệ thống thương mại điện tử đơn giản có khả năng cân bằng tải và tự động mở rộng trên nền tảng Kubernetes**

English title:

**Deploying a Simple E-commerce Web Application with Load Balancing and Auto Scaling on Kubernetes**

## 3. Supported Deployment Environments

The project can be deployed on:

- Docker Desktop Kubernetes
- Minikube
- Managed Kubernetes services such as GKE, EKS, or AKS, optional

Recommended environment for local implementation:

```txt
Docker Desktop Kubernetes
```

Reason:

- It is easier to use on Windows.
- It uses the local Docker image store.
- NodePort services can be accessed directly through localhost.
- It is enough to demonstrate Kubernetes concepts for the course.

## 4. Scope Rules

The project must stay simple and focused on cloud computing.

Allowed features:

- Product listing
- Product detail
- Cart management
- Mock order creation
- Simple admin product CRUD
- System endpoints for Kubernetes demo
- Docker deployment
- Kubernetes Deployment, Service, HPA
- Load testing for auto scaling

Not required in this project:

- Real online payment
- Shipping integration
- Voucher system
- Review/comment system
- Chat system
- Complex role-based authorization
- Microservices architecture
- Production-grade database clustering
- CI/CD pipeline, unless added as an optional extension

## 5. Recommended Technology Stack

Frontend:

- React
- Vite
- Axios
- Tailwind CSS or Bootstrap

Backend:

- Java 17 or Java 21
- Spring Boot 3
- Spring Web
- Spring Data JPA
- Spring Validation
- Spring Boot Actuator
- Lombok
- MySQL Driver

Database:

- MySQL 8

Cloud-native / DevOps:

- Docker
- Docker Desktop Kubernetes or Minikube
- kubectl
- Metrics Server
- Horizontal Pod Autoscaler
- k6, hey, or ApacheBench for load testing

## 6. Repository Structure

Recommended structure:

```txt
project-root/
├── AGENTS.md
├── README.md
├── docs/
│   ├── 01-project-scope.md
│   ├── 02-system-architecture.md
│   ├── 03-api-design.md
│   ├── 04-database-design.md
│   ├── 05-kubernetes-deployment.md
│   ├── 06-demo-checklist.md
│   ├── 07-task-checklist.md
│   └── 08-docker-desktop-kubernetes.md
├── frontend/
│   ├── Dockerfile
│   └── src/
├── backend/
│   ├── Dockerfile
│   ├── pom.xml
│   └── src/
└── k8s/
    ├── backend-deployment.yaml
    ├── backend-service.yaml
    ├── backend-hpa.yaml
    ├── frontend-deployment.yaml
    ├── frontend-service.yaml
    ├── mysql-deployment.yaml
    ├── mysql-service.yaml
    ├── mysql-pvc.yaml
    ├── configmap.yaml
    └── secret.yaml
```

## 7. Backend Development Rules

The backend should be built as a simple monolithic REST API.

Rules:

- Controllers only handle HTTP request/response mapping.
- Services contain business logic.
- Repositories handle database access.
- Entities must not be returned directly if DTOs are available.
- Validate request body using Spring Validation.
- Use clear HTTP status codes.
- Keep business logic simple.
- Avoid adding unrelated features.

## 8. Required System APIs

System APIs are important because they prove the cloud computing part:

```txt
GET /api/system/info
GET /api/system/health
GET /api/system/load
GET /api/system/version
```

Requirements:

- `/api/system/info` must return hostname or Pod name.
- `/api/system/health` must return application health status.
- `/api/system/load` must generate temporary CPU load for HPA testing.
- `/api/system/version` must return the current application version for rolling update demo.

## 9. Kubernetes Rules

Backend must be deployed using Kubernetes Deployment and Service.

Required Kubernetes objects:

- Backend Deployment
- Backend Service
- Backend HPA
- Frontend Deployment
- Frontend Service
- MySQL Deployment, Service, and PVC if database is deployed inside Kubernetes
- ConfigMap for normal environment variables
- Secret for sensitive values

Backend Deployment must define CPU request and limit because HPA depends on CPU metrics.

Example:

```yaml
resources:
  requests:
    cpu: "100m"
  limits:
    cpu: "500m"
```

For Docker Desktop Kubernetes:

- Use `kubectl config use-context docker-desktop`.
- Use `NodePort` services.
- Access backend using `http://localhost:30080`.
- Access frontend using `http://localhost:30081`.
- Do not use `minikube image load`.
- Install Metrics Server manually if HPA target shows `<unknown>`.

## 10. Demo Requirements

The final demo must include:

1. Run the web application.
2. Show multiple backend Pods.
3. Call system info endpoint multiple times to show load balancing.
4. Delete one Pod and show Kubernetes self-healing.
5. Generate CPU load and show HPA scaling Pods.
6. Perform a rolling update from version v1 to version v2.

## 11. Definition of Done

The project is considered complete when:

- The backend API runs successfully.
- The frontend can call backend APIs.
- The application is containerized with Docker.
- The backend runs on Kubernetes with at least 2 replicas.
- Kubernetes Service distributes requests to backend Pods.
- HPA can scale backend Pods when CPU load increases.
- Kubernetes recreates a deleted Pod automatically.
- Rolling update can update the application version.
- Documentation is complete.
- `docs/07-task-checklist.md` is updated with completed tasks.
- Demo screenshots or terminal logs are prepared for the report.
