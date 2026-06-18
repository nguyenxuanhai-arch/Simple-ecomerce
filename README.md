# Kubernetes Simple E-commerce Cloud Project Docs

This folder contains documentation for the Cloud Computing course topic:

**Triển khai hệ thống thương mại điện tử đơn giản có khả năng cân bằng tải và tự động mở rộng trên nền tảng Kubernetes**

## 1. Main Focus

The project focuses on Kubernetes cloud-native mechanisms:

- Docker containerization
- Kubernetes Deployment
- Kubernetes Service load balancing
- Horizontal Pod Autoscaler
- Self-healing
- Rolling update

## 2. Supported Kubernetes Environments

This documentation supports two local Kubernetes environments:

- Docker Desktop Kubernetes
- Minikube

Recommended for this project:

```txt
Docker Desktop Kubernetes
```

Reason:

- Easier for students using Windows.
- Docker images built locally can usually be used directly by Kubernetes.
- NodePort services can be accessed through `localhost`.
- No need to run `minikube image load`.

Minikube is still supported as an alternative.

## 3. Documents

```txt
AGENTS.md
README.md
docs/01-project-scope.md
docs/02-system-architecture.md
docs/03-api-design.md
docs/04-database-design.md
docs/05-kubernetes-deployment.md
docs/06-demo-checklist.md
docs/07-task-checklist.md
docs/08-docker-desktop-kubernetes.md
```

## 4. Quick Start for Docker Desktop Kubernetes

Enable Kubernetes in Docker Desktop, then run:

```bash
kubectl config use-context docker-desktop
kubectl get nodes
```

Build local images:

```bash
docker build -t ecommerce-backend:v1 ./backend
docker build -t ecommerce-frontend:v1 ./frontend
```

Apply Kubernetes manifests:

```bash
kubectl apply -f k8s/
```

Access services:

```txt
Backend:  http://localhost:30080
Frontend: http://localhost:30081
```

## 5. Important Note About Cloud Computing

Docker Desktop Kubernetes is a local single-node Kubernetes environment. It is not a public cloud platform, but it is suitable for demonstrating cloud-native mechanisms such as container orchestration, load balancing, auto scaling, self-healing, and rolling update.

The same architecture can be deployed to managed Kubernetes services such as Google Kubernetes Engine, Amazon EKS, or Azure Kubernetes Service.
