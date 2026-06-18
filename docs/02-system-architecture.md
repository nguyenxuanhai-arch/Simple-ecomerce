# 02 - System Architecture

## 1. Architecture Overview

The system is a simple e-commerce web application deployed on Kubernetes.

The architecture includes:

- Frontend web application
- Backend REST API
- MySQL database
- Kubernetes Service for load balancing
- Kubernetes Deployment for managing Pods
- Horizontal Pod Autoscaler for auto scaling
- Metrics Server for collecting CPU metrics

## 2. Logical Architecture

```txt
User
  |
  v
Frontend Web Application
  |
  v
Backend REST API
  |
  v
MySQL Database
```

The frontend sends HTTP requests to the backend API. The backend handles product, cart, and order logic. The database stores product, cart, and order data.

## 3. Kubernetes Architecture

```txt
User
  |
  v
Frontend Service: NodePort 30081
  |
  v
Frontend Deployment
  |
  v
Backend Service: NodePort 30080
  |
  +--> Backend Pod 1
  |
  +--> Backend Pod 2
  |
  +--> Backend Pod 3
  |
  v
MySQL Service
  |
  v
MySQL Pod + Persistent Volume Claim
```

The backend is deployed with multiple replicas. Kubernetes Service distributes requests to available backend Pods.

## 4. Docker Desktop Kubernetes Architecture

When using Docker Desktop Kubernetes, the cluster runs locally on the student's computer.

Access pattern:

```txt
Browser/Postman/curl
  |
  v
localhost:30081 -> Frontend Service
localhost:30080 -> Backend Service
  |
  v
Kubernetes Pods inside Docker Desktop
```

Docker Desktop Kubernetes is a single-node local Kubernetes environment. It is not a public cloud platform, but it can demonstrate Kubernetes cloud-native mechanisms.

## 5. Backend Load Balancing

The backend Service selects backend Pods using labels.

Example label:

```yaml
app: ecommerce-backend
```

All Pods with this label become endpoints of the Service.

When the frontend or user sends a request to the backend Service, Kubernetes forwards the request to one of the available backend Pods.

This demonstrates internal load balancing in Kubernetes.

## 6. Auto Scaling Architecture

Horizontal Pod Autoscaler monitors CPU usage of backend Pods.

```txt
Metrics Server
  |
  v
Horizontal Pod Autoscaler
  |
  v
Backend Deployment
  |
  v
Scale Pods up or down
```

When CPU usage is higher than the configured threshold, HPA increases the number of backend Pods.

When CPU usage decreases, HPA can reduce the number of Pods.

## 7. Self-healing Architecture

Kubernetes Deployment maintains the desired number of Pods.

For example, if the desired replica count is 2 and one Pod is deleted, Kubernetes automatically creates a new Pod to replace it.

This demonstrates self-healing.

## 8. Rolling Update Architecture

Rolling update allows the system to update application version gradually.

During an update, Kubernetes creates new Pods with the new version and removes old Pods step by step.

This reduces downtime and keeps the application available during deployment.

## 9. Recommended Deployment Environment

Recommended local environment:

```txt
Docker Desktop Kubernetes
```

Alternative local environment:

```txt
Minikube
```

Real cloud deployment options:

- Google Kubernetes Engine
- Amazon Elastic Kubernetes Service
- Azure Kubernetes Service

In the course scope, Docker Desktop Kubernetes is acceptable as a local environment to verify Kubernetes mechanisms.
