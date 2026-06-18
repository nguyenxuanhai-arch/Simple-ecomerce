# 06 - Demo Checklist

## 1. Demo Goal

The demo must prove that the system can run as a cloud-native application on Kubernetes.

The demo focuses on:

- Application deployment
- Load balancing
- Auto scaling
- Self-healing
- Rolling update

## 2. Preparation Checklist

Before demo, make sure the following items are ready:

- [ ] Docker Desktop is installed.
- [ ] Kubernetes is enabled in Docker Desktop.
- [ ] kubectl is installed.
- [ ] kubectl context is set to `docker-desktop`.
- [ ] Metrics Server is installed.
- [ ] Backend Docker image is built.
- [ ] Frontend Docker image is built.
- [ ] Kubernetes YAML files are prepared.
- [ ] Load testing tool is installed.
- [ ] API testing tool or browser is ready.

Check Docker Desktop Kubernetes:

```bash
kubectl config use-context docker-desktop
kubectl get nodes
```

## 3. Build Images

Build backend image:

```bash
docker build -t ecommerce-backend:v1 ./backend
```

Build frontend image:

```bash
docker build -t ecommerce-frontend:v1 ./frontend
```

For Docker Desktop Kubernetes, do not use:

```bash
minikube image load ecommerce-backend:v1
minikube image load ecommerce-frontend:v1
```

Those commands are only for Minikube.

## 4. Install Metrics Server

HPA requires Metrics Server.

Install:

```bash
kubectl apply -f https://github.com/kubernetes-sigs/metrics-server/releases/latest/download/components.yaml
```

Patch for Docker Desktop Kubernetes if needed:

```bash
kubectl patch deployment metrics-server -n kube-system --type='json' -p='[
  {
    "op": "add",
    "path": "/spec/template/spec/containers/0/args/-",
    "value": "--kubelet-insecure-tls"
  }
]'
```

Check:

```bash
kubectl top nodes
kubectl top pods
```

## 5. Deploy Application

Apply YAML files:

```bash
kubectl apply -f k8s/
```

Check Pods:

```bash
kubectl get pods
```

Expected result:

- Frontend Pod is running.
- Backend Pods are running.
- MySQL Pod is running if database is deployed inside Kubernetes.

## 6. Access Application

For Docker Desktop Kubernetes with NodePort:

```txt
Frontend: http://localhost:30081
Backend:  http://localhost:30080
```

Check backend:

```bash
curl http://localhost:30080/api/system/info
```

## 7. Demo Product Flow

Demo flow:

1. View product list.
2. View product detail.
3. Add product to cart.
4. View cart.
5. Create mock order.
6. View order result.

This proves the application runs successfully.

## 8. Demo Load Balancing

Call system info endpoint multiple times:

```bash
curl http://localhost:30080/api/system/info
curl http://localhost:30080/api/system/info
curl http://localhost:30080/api/system/info
```

Expected result:

The response may show different hostnames or Pod names.

This proves that Kubernetes Service distributes requests to multiple backend Pods.

## 9. Demo Auto Scaling

Check current HPA:

```bash
kubectl get hpa
```

Generate load:

```bash
hey -z 2m -c 100 http://localhost:30080/api/system/load
```

Watch HPA:

```bash
kubectl get hpa -w
```

Watch Pods:

```bash
kubectl get pods -w
```

Expected result:

Backend Pods scale from 2 Pods to more Pods when CPU usage increases.

Example:

```txt
2 Pods -> 4 Pods -> 6 Pods
```

## 10. Demo Self-healing

List backend Pods:

```bash
kubectl get pods
```

Delete one backend Pod:

```bash
kubectl delete pod <backend-pod-name>
```

Watch Pods:

```bash
kubectl get pods -w
```

Expected result:

Kubernetes creates a new backend Pod automatically.

This proves self-healing.

## 11. Demo Rolling Update

Build backend version v2:

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
```

Check version endpoint:

```bash
curl http://localhost:30080/api/system/version
```

Expected result:

The application version changes from `v1` to `v2`.

## 12. Evidence to Capture

Prepare screenshots or terminal logs for:

- `kubectl get nodes`
- `kubectl get pods`
- `kubectl get services`
- `kubectl get hpa`
- Product page running on browser
- System info endpoint response
- HPA scaling result
- Pod self-healing result
- Rolling update result

## 13. Final Evaluation Points

The project is successful if:

- The web application works.
- Backend runs with multiple replicas.
- Service balances traffic to backend Pods.
- HPA scales backend Pods when CPU load increases.
- Kubernetes recreates deleted Pods.
- Rolling update changes application version successfully.
