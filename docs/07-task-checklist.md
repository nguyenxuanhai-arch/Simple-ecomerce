# 07 - Task Checklist

## 1. Purpose

This checklist is used to track all tasks required to complete the project:

**Triển khai hệ thống thương mại điện tử đơn giản có khả năng cân bằng tải và tự động mở rộng trên nền tảng Kubernetes**

The checklist focuses on implementation, deployment, Kubernetes demo, report evidence, and final verification.

## 2. Phase 1 - Project Setup

- [x] Create project repository.
- [x] Create root folders: `frontend/`, `backend/`, `k8s/`, and `docs/`.
- [x] Add `AGENTS.md` to define project rules and scope.
- [x] Add `README.md` to introduce the project.
- [x] Add `.gitignore` for local build, cache, and environment files.
- [x] Confirm final project title.
- [x] Confirm final technology stack.
- [x] Confirm project scope: simple e-commerce web app used for Kubernetes demo.

Expected output:

```txt
project-root/
├── AGENTS.md
├── README.md
├── docs/
├── frontend/
├── backend/
└── k8s/
```

## 3. Phase 2 - Backend API

- [x] Initialize Spring Boot backend project.
- [x] Add required dependencies: Spring Web, Spring Data JPA, Validation, Actuator, MySQL Driver, Lombok.
- [x] Configure backend application properties.
- [x] Create product entity, DTO, repository, service, and controller.
- [x] Create cart item entity, DTO, repository, service, and controller.
- [x] Create order and order item entities, DTOs, repositories, service, and controller.
- [x] Create system controller for Kubernetes demo endpoints.
- [x] Add validation for create/update product requests.
- [x] Add validation for cart and order requests.
- [x] Compile backend with Maven.
- [x] Test all APIs using Postman or curl after MySQL database setup in Phase 3.

Required backend APIs:

```txt
GET    /api/products
GET    /api/products/{id}
POST   /api/admin/products
PUT    /api/admin/products/{id}
DELETE /api/admin/products/{id}

GET    /api/cart
POST   /api/cart/items
PUT    /api/cart/items/{itemId}
DELETE /api/cart/items/{itemId}
DELETE /api/cart

POST   /api/orders
GET    /api/orders/{id}
GET    /api/admin/orders
PUT    /api/admin/orders/{id}/status

GET    /api/system/info
GET    /api/system/health
GET    /api/system/load
GET    /api/system/version
```

Expected output:

- Backend runs locally.
- Product APIs work.
- Cart APIs work.
- Order APIs work.
- System APIs work.
- `/api/system/info` returns hostname or Pod name.
- `/api/system/load` can generate temporary CPU load.

## 4. Phase 3 - Database

- [x] Create MySQL database.
- [x] Design required tables.
- [x] Configure backend database connection.
- [x] Create initial sample products.
- [x] Verify product, cart, and order data are saved correctly.
- [x] Prepare database script or seed data for demo.

Required tables:

```txt
products
cart_items
orders
order_items
```

Optional tables:

```txt
users
roles
user_roles
```

Expected output:

- Database connection works.
- Backend can read and write data.
- Demo data is available.

## 5. Phase 4 - Frontend

- [x] Initialize React + Vite frontend project.
- [x] Configure Axios base URL.
- [x] Create product list page.
- [x] Create product detail page.
- [x] Create cart page.
- [x] Create checkout mock page.
- [x] Create admin product management page.
- [x] Create simple system info page or button to call `/api/system/info`.
- [x] Test frontend with backend running locally.

Required pages:

```txt
Home/Product List
Product Detail
Cart
Checkout Mock
Admin Product Management
System Info Demo
```

Expected output:

- User can view products.
- User can add products to cart.
- User can create mock order.
- Admin can create, update, and delete products.
- Frontend can call system info endpoint.

## 6. Phase 5 - Docker

- [x] Create backend `Dockerfile`.
- [x] Build backend Docker image.
- [x] Run backend container locally.
- [x] Create frontend `Dockerfile`.
- [x] Build frontend Docker image.
- [x] Run frontend container locally.
- [x] Create `docker-compose.yml` for local testing, optional.
- [x] Verify frontend can call backend in container environment.

Required Docker files:

```txt
backend/Dockerfile
frontend/Dockerfile
docker-compose.yml
```

Expected output:

- Backend image builds successfully.
- Frontend image builds successfully.
- Containers run successfully.
- Application works outside IDE.

## 7. Phase 6 - Kubernetes Base Deployment - Docker Desktop Kubernetes

This phase continues from the completed Docker phase. Because the project will use **Docker Desktop Kubernetes**, do not use Minikube commands in this phase.

- [x] Enable Kubernetes in Docker Desktop.
- [x] Wait until Docker Desktop shows Kubernetes is running.
- [x] Select Docker Desktop Kubernetes context.
- [x] Verify Kubernetes node is available.
- [x] Verify local Docker images exist.
- [x] Create backend Deployment YAML.
- [x] Create backend Service YAML using `NodePort`.
- [x] Create frontend Deployment YAML.
- [x] Create frontend Service YAML using `NodePort`.
- [x] Create MySQL Deployment YAML, if MySQL is deployed inside Kubernetes.
- [x] Create MySQL Service YAML, if MySQL is deployed inside Kubernetes.
- [x] Create MySQL PVC YAML, if persistent storage is needed.
- [x] Create ConfigMap for normal environment variables.
- [x] Create Secret for database password and sensitive variables.
- [x] Apply all Kubernetes manifests.
- [x] Verify all Pods are running.
- [x] Verify frontend is accessible through `localhost:30081`.
- [x] Verify backend is accessible through `localhost:30080`.

Required Kubernetes files:

```txt
k8s/backend-deployment.yaml
k8s/backend-service.yaml
k8s/backend-hpa.yaml
k8s/frontend-deployment.yaml
k8s/frontend-service.yaml
k8s/mysql-deployment.yaml
k8s/mysql-service.yaml
k8s/mysql-pvc.yaml
k8s/configmap.yaml
k8s/secret.yaml
```

Useful commands for Docker Desktop Kubernetes:

```bash
kubectl config get-contexts
kubectl config use-context docker-desktop
kubectl get nodes
kubectl get pods
kubectl get services
kubectl get deployments
```

Check local Docker images:

```bash
docker images
```

Apply Kubernetes manifests:

```bash
kubectl apply -f k8s/
```

Access services through NodePort:

```txt
Frontend: http://localhost:30081
Backend:  http://localhost:30080
```

Do not use these Minikube commands when using Docker Desktop Kubernetes:

```bash
minikube start
minikube image load ecommerce-backend:v1
minikube image load ecommerce-frontend:v1
minikube service ecommerce-backend-service
minikube service ecommerce-frontend-service
```

Expected output:

- Docker Desktop Kubernetes cluster runs successfully.
- Backend has at least 2 replicas.
- Frontend is accessible through `http://localhost:30081`.
- Backend is accessible through `http://localhost:30080`.
- Database is reachable by backend.

## 8. Phase 7 - Load Balancing Demo

- [x] Configure backend Deployment with at least 2 replicas.
- [x] Make sure `/api/system/info` returns hostname or Pod name.
- [x] Call `/api/system/info` multiple times through backend Service.
- [x] Record different Pod names from API responses.
- [x] Capture terminal screenshots or logs as evidence.

Useful commands:

```bash
kubectl get pods -l app=ecommerce-backend
curl http://localhost:30080/api/system/info
curl http://localhost:30080/api/system/info
curl http://localhost:30080/api/system/info
```

Expected output:

- Requests are distributed to different backend Pods.
- Evidence shows more than one Pod serving requests.
- Response from `/api/system/info` shows different `hostname` or `podName` values.

## 9. Phase 8 - Self-healing Demo

- [x] Show current running backend Pods.
- [x] Delete one backend Pod manually.
- [x] Watch Kubernetes create a replacement Pod.
- [x] Capture before and after screenshots.

Useful commands:

```bash
kubectl get pods
kubectl delete pod <pod-name>
kubectl get pods -w
```

Expected output:

- Deleted Pod disappears.
- New Pod is created automatically.
- Desired replica count is restored.

## 10. Phase 9 - Metrics Server and HPA Auto Scaling Demo

Docker Desktop Kubernetes does not always include Metrics Server by default. HPA needs Metrics Server to read CPU usage.

- [x] Install Metrics Server for Docker Desktop Kubernetes.
- [x] Patch Metrics Server with `--kubelet-insecure-tls` if CPU metrics are unavailable.
- [x] Verify `kubectl top nodes` works.
- [x] Verify `kubectl top pods` works.
- [x] Configure CPU request and CPU limit in backend Deployment.
- [x] Create backend HPA YAML.
- [x] Apply HPA manifest.
- [x] Verify HPA can read CPU metrics.
- [x] Generate CPU load using `/api/system/load`.
- [x] Watch HPA scale backend Pods from minimum replicas to higher replicas.
- [x] Stop load test and observe scale down, optional.
- [x] Capture HPA and Pod scaling evidence.

Install Metrics Server:

```bash
kubectl apply -f https://github.com/kubernetes-sigs/metrics-server/releases/latest/download/components.yaml
```

Patch Metrics Server if needed:

```bash
kubectl patch deployment metrics-server -n kube-system --type='json' -p='[
  {
    "op": "add",
    "path": "/spec/template/spec/containers/0/args/-",
    "value": "--kubelet-insecure-tls"
  }
]'
```

Check Metrics Server:

```bash
kubectl get pods -n kube-system
kubectl top nodes
kubectl top pods
```

Apply HPA:

```bash
kubectl apply -f k8s/backend-hpa.yaml
kubectl get hpa
kubectl get hpa -w
```

Load test examples:

```bash
hey -z 2m -c 100 http://localhost:30080/api/system/load
```

or:

```bash
ab -n 10000 -c 100 http://localhost:30080/api/system/load
```

Expected output:

- HPA target CPU increases during load test.
- Backend replicas increase automatically.
- New Pods are created by Kubernetes.
- `kubectl get hpa` does not show `<unknown>/50%` after Metrics Server works.

## 11. Phase 10 - Rolling Update Demo

- [ ] Set backend version to `v1`.
- [ ] Build backend image `v1`.
- [ ] Deploy backend `v1`.
- [ ] Verify `/api/system/version` returns `v1`.
- [ ] Change backend version to `v2`.
- [ ] Build backend image `v2`.
- [ ] Update backend Deployment image.
- [ ] Watch rolling update process.
- [ ] Verify `/api/system/version` returns `v2`.
- [ ] Test rollback command, optional.

Build version `v2` image:

```bash
docker build -t ecommerce-backend:v2 ./backend
```

Update backend image:

```bash
kubectl set image deployment/ecommerce-backend ecommerce-backend=ecommerce-backend:v2
```

Watch rollout:

```bash
kubectl rollout status deployment/ecommerce-backend
kubectl rollout history deployment/ecommerce-backend
```

Check version:

```bash
curl http://localhost:30080/api/system/version
```

Rollback if needed:

```bash
kubectl rollout undo deployment/ecommerce-backend
```

Expected output:

- Application updates from `v1` to `v2`.
- Pods are replaced gradually.
- Application remains available during update.

## 12. Phase 11 - Report Evidence

- [ ] Capture screenshot of project running in browser.
- [ ] Capture screenshot of product list page.
- [ ] Capture screenshot of cart or checkout page.
- [ ] Capture screenshot of admin product management page.
- [ ] Capture screenshot of `kubectl get nodes` with `docker-desktop` context.
- [ ] Capture screenshot of `kubectl get pods`.
- [ ] Capture screenshot of `kubectl get services`.
- [ ] Capture screenshot of `kubectl get deployments`.
- [ ] Capture screenshot of `kubectl top pods`, if HPA demo is included.
- [ ] Capture screenshot of `kubectl get hpa` before load test.
- [ ] Capture screenshot of HPA scaling during load test.
- [ ] Capture screenshot of self-healing demo.
- [ ] Capture screenshot of rolling update demo.
- [ ] Save API responses from `/api/system/info` showing different Pod names.

Expected output:

- Evidence folder contains screenshots and terminal logs.
- Evidence is ready to insert into final report or presentation.
- Evidence clearly shows the project runs on Docker Desktop Kubernetes.

## 13. Phase 12 - Final Documentation

- [ ] Complete project scope document.
- [ ] Complete system architecture document.
- [ ] Complete API design document.
- [ ] Complete database design document.
- [ ] Complete Kubernetes deployment document.
- [ ] Complete Docker Desktop Kubernetes deployment notes.
- [ ] Complete demo checklist document.
- [ ] Complete task checklist document.
- [ ] Update README with Docker Desktop Kubernetes setup and demo instructions.
- [ ] Verify all documents use the same project name and technology stack.
- [ ] Verify docs no longer require Minikube when the selected environment is Docker Desktop Kubernetes.

Expected output:

- All documents are complete.
- Documentation is consistent.
- Project can be understood by another student or instructor.

## 14. Phase 13 - Final Verification

- [ ] Clone project into a clean folder or another machine, optional.
- [ ] Run backend locally.
- [ ] Run frontend locally.
- [ ] Build Docker images.
- [ ] Enable Docker Desktop Kubernetes.
- [ ] Select `docker-desktop` Kubernetes context.
- [ ] Deploy Kubernetes manifests.
- [ ] Access frontend through `http://localhost:30081`.
- [ ] Access backend through `http://localhost:30080`.
- [ ] Confirm load balancing works.
- [ ] Confirm self-healing works.
- [ ] Confirm HPA works.
- [ ] Confirm rolling update works.
- [ ] Prepare final demo script.

Final completion criteria:

- [ ] Simple e-commerce web app works.
- [ ] Docker images build successfully.
- [ ] Docker Desktop Kubernetes deployment works.
- [ ] Backend runs with multiple replicas.
- [ ] Service distributes traffic between Pods.
- [ ] HPA scales Pods under load.
- [ ] Kubernetes recreates deleted Pods.
- [ ] Rolling update works from `v1` to `v2`.
- [ ] Report evidence is prepared.
- [ ] Documentation is complete.
