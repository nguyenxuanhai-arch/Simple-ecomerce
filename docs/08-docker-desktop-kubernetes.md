# 08 - Docker Desktop Kubernetes Guide

## 1. Purpose

This document explains how to run the project using Kubernetes inside Docker Desktop.

Docker Desktop Kubernetes is suitable for local demo because it can demonstrate:

- Kubernetes Deployment
- Kubernetes Service
- Load balancing between Pods
- Horizontal Pod Autoscaler
- Self-healing
- Rolling update

## 2. Enable Kubernetes in Docker Desktop

Open Docker Desktop:

```txt
Settings -> Kubernetes -> Enable Kubernetes -> Apply & Restart
```

Wait until Docker Desktop shows Kubernetes is running.

## 3. Select Docker Desktop Context

Run:

```bash
kubectl config use-context docker-desktop
kubectl get nodes
```

Expected result:

```txt
NAME             STATUS   ROLES           AGE   VERSION
docker-desktop   Ready    control-plane   ...   ...
```

## 4. Build Local Images

Build backend:

```bash
docker build -t ecommerce-backend:v1 ./backend
```

Build frontend:

```bash
docker build -t ecommerce-frontend:v1 ./frontend
```

Docker Desktop Kubernetes can usually use local Docker images directly.

Do not use:

```bash
minikube image load ecommerce-backend:v1
```

That command is only for Minikube.

## 5. Image Pull Policy

Use this in YAML:

```yaml
imagePullPolicy: IfNotPresent
```

If Kubernetes still tries to pull the image from Docker Hub, use:

```yaml
imagePullPolicy: Never
```

## 6. Service Access

Use NodePort services.

Backend Service:

```yaml
nodePort: 30080
```

Frontend Service:

```yaml
nodePort: 30081
```

Access URLs:

```txt
Backend:  http://localhost:30080
Frontend: http://localhost:30081
```

Test backend:

```bash
curl http://localhost:30080/api/system/info
```

## 7. Install Metrics Server

HPA needs Metrics Server.

Install:

```bash
kubectl apply -f https://github.com/kubernetes-sigs/metrics-server/releases/latest/download/components.yaml
```

Patch if needed:

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
kubectl get pods -n kube-system
kubectl top nodes
kubectl top pods
```

If `kubectl top pods` works, HPA can work.

## 8. Apply Kubernetes Manifests

Run:

```bash
kubectl apply -f k8s/
```

Check:

```bash
kubectl get pods
kubectl get services
kubectl get deployments
kubectl get hpa
```

## 9. Test Load Balancing

Run multiple times:

```bash
curl http://localhost:30080/api/system/info
```

Expected result:

Responses may show different hostnames or Pod names.

## 10. Test HPA

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

Backend Pods scale up when CPU usage increases.

## 11. Test Self-healing

Delete one backend Pod:

```bash
kubectl delete pod <backend-pod-name>
```

Watch:

```bash
kubectl get pods -w
```

Expected result:

Kubernetes creates a replacement Pod automatically.

## 12. Test Rolling Update

Build v2:

```bash
docker build -t ecommerce-backend:v2 ./backend
```

Update deployment:

```bash
kubectl set image deployment/ecommerce-backend ecommerce-backend=ecommerce-backend:v2
```

Watch rollout:

```bash
kubectl rollout status deployment/ecommerce-backend
```

Check version:

```bash
curl http://localhost:30080/api/system/version
```

## 13. Common Problems

### Problem 1: ImagePullBackOff

Cause:

Kubernetes cannot find local image or tries to pull image from the Internet.

Fix:

- Make sure the image name in YAML matches the image built locally.
- Use `imagePullPolicy: IfNotPresent`.
- If needed, use `imagePullPolicy: Never`.

### Problem 2: HPA shows `<unknown>`

Cause:

Metrics Server is missing or not working.

Fix:

- Install Metrics Server.
- Patch Metrics Server with `--kubelet-insecure-tls`.
- Verify `kubectl top pods` works.

### Problem 3: Cannot access service

Cause:

Wrong NodePort or service not created.

Fix:

```bash
kubectl get services
```

Then access:

```txt
http://localhost:<nodePort>
```

### Problem 4: HPA does not scale

Possible causes:

- CPU request is missing in backend Deployment.
- `/api/system/load` does not create enough CPU load.
- Metrics Server is not working.
- Max replicas already reached.

Fix:

- Add `resources.requests.cpu`.
- Increase load test concurrency.
- Check `kubectl top pods`.
- Check `kubectl describe hpa ecommerce-backend-hpa`.

## 14. Report Sentence

Use this sentence in the report:

```txt
Trong phạm vi đề tài, hệ thống được triển khai trên Kubernetes local bằng Docker Desktop nhằm mô phỏng các cơ chế cloud-native như container orchestration, load balancing, horizontal auto scaling, self-healing và rolling update. Mô hình này có thể triển khai tương tự trên các nền tảng cloud managed Kubernetes như Google Kubernetes Engine, Amazon EKS hoặc Azure Kubernetes Service.
```
