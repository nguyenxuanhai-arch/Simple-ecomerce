# 05 - Kubernetes Deployment

## 1. Deployment Overview

The application is deployed on Kubernetes using the following objects:

- Deployment
- Service
- HorizontalPodAutoscaler
- ConfigMap
- Secret
- PersistentVolumeClaim, if MySQL runs inside Kubernetes

The backend is the main component used for load balancing and auto scaling demonstration.

This document supports two local Kubernetes environments:

- Docker Desktop Kubernetes
- Minikube

Recommended environment:

```txt
Docker Desktop Kubernetes
```

## 2. Docker Desktop Kubernetes Setup

Enable Kubernetes in Docker Desktop:

```txt
Docker Desktop -> Settings -> Kubernetes -> Enable Kubernetes -> Apply & Restart
```

Switch kubectl context:

```bash
kubectl config use-context docker-desktop
kubectl get nodes
```

Expected result:

```txt
NAME             STATUS   ROLES           AGE   VERSION
docker-desktop   Ready    control-plane   ...   ...
```

## 3. Build Local Docker Images

With Docker Desktop Kubernetes, local images built by Docker can usually be used directly by Kubernetes.

Build backend image:

```bash
docker build -t ecommerce-backend:v1 ./backend
```

Build frontend image:

```bash
docker build -t ecommerce-frontend:v1 ./frontend
```

Important:

Do not run `minikube image load` when using Docker Desktop Kubernetes.

Use this image policy in Kubernetes YAML:

```yaml
imagePullPolicy: IfNotPresent
```

If Kubernetes still tries to pull the image from the Internet, use:

```yaml
imagePullPolicy: Never
```

## 4. Backend Deployment

Example file: `backend-deployment.yaml`

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: ecommerce-backend
spec:
  replicas: 2
  selector:
    matchLabels:
      app: ecommerce-backend
  template:
    metadata:
      labels:
        app: ecommerce-backend
    spec:
      containers:
        - name: ecommerce-backend
          image: ecommerce-backend:v1
          imagePullPolicy: IfNotPresent
          ports:
            - containerPort: 8080
          env:
            - name: APP_VERSION
              value: "v1"
          resources:
            requests:
              cpu: "100m"
              memory: "256Mi"
            limits:
              cpu: "500m"
              memory: "512Mi"
          readinessProbe:
            httpGet:
              path: /api/system/health
              port: 8080
            initialDelaySeconds: 10
            periodSeconds: 10
          livenessProbe:
            httpGet:
              path: /api/system/health
              port: 8080
            initialDelaySeconds: 30
            periodSeconds: 20
```

Important notes:

- `replicas: 2` creates two backend Pods.
- CPU request is required for HPA calculation.
- Readiness and liveness probes help Kubernetes check application health.

## 5. Backend Service

Example file: `backend-service.yaml`

```yaml
apiVersion: v1
kind: Service
metadata:
  name: ecommerce-backend-service
spec:
  type: NodePort
  selector:
    app: ecommerce-backend
  ports:
    - protocol: TCP
      port: 80
      targetPort: 8080
      nodePort: 30080
```

For Docker Desktop Kubernetes, access backend using:

```txt
http://localhost:30080
```

Example:

```bash
curl http://localhost:30080/api/system/info
```

## 6. Backend HPA

Example file: `backend-hpa.yaml`

```yaml
apiVersion: autoscaling/v2
kind: HorizontalPodAutoscaler
metadata:
  name: ecommerce-backend-hpa
spec:
  scaleTargetRef:
    apiVersion: apps/v1
    kind: Deployment
    name: ecommerce-backend
  minReplicas: 2
  maxReplicas: 6
  metrics:
    - type: Resource
      resource:
        name: cpu
        target:
          type: Utilization
          averageUtilization: 50
```

This HPA keeps at least 2 Pods and can scale up to 6 Pods when CPU usage is high.

## 7. Frontend Deployment

Example file: `frontend-deployment.yaml`

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: ecommerce-frontend
spec:
  replicas: 1
  selector:
    matchLabels:
      app: ecommerce-frontend
  template:
    metadata:
      labels:
        app: ecommerce-frontend
    spec:
      containers:
        - name: ecommerce-frontend
          image: ecommerce-frontend:v1
          imagePullPolicy: IfNotPresent
          ports:
            - containerPort: 80
```

## 8. Frontend Service

Example file: `frontend-service.yaml`

```yaml
apiVersion: v1
kind: Service
metadata:
  name: ecommerce-frontend-service
spec:
  type: NodePort
  selector:
    app: ecommerce-frontend
  ports:
    - protocol: TCP
      port: 80
      targetPort: 80
      nodePort: 30081
```

For Docker Desktop Kubernetes, access frontend using:

```txt
http://localhost:30081
```

## 9. Metrics Server for Docker Desktop Kubernetes

HPA requires Metrics Server.

If `kubectl top pods` does not work or HPA shows `<unknown>`, install Metrics Server manually:

```bash
kubectl apply -f https://github.com/kubernetes-sigs/metrics-server/releases/latest/download/components.yaml
```

Docker Desktop Kubernetes may need this patch:

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

When `kubectl top pods` works, HPA can calculate CPU usage.

## 10. Apply Kubernetes Files

Apply all manifests:

```bash
kubectl apply -f k8s/
```

Check status:

```bash
kubectl get pods
kubectl get services
kubectl get deployments
kubectl get hpa
```

## 11. Load Testing

Use `hey`:

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

The number of backend Pods increases when CPU usage is high.

## 12. Self-healing Test

List Pods:

```bash
kubectl get pods
```

Delete one backend Pod:

```bash
kubectl delete pod <backend-pod-name>
```

Watch Kubernetes recreate a new Pod:

```bash
kubectl get pods -w
```

Expected result:

Kubernetes automatically creates a new backend Pod to maintain the desired replica count.

## 13. Rolling Update Test

Build version v2:

```bash
docker build -t ecommerce-backend:v2 ./backend
```

Update image:

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

Rollback if needed:

```bash
kubectl rollout undo deployment/ecommerce-backend
```

## 14. Minikube Alternative

If using Minikube instead of Docker Desktop Kubernetes:

```bash
minikube start
minikube addons enable metrics-server
```

Load local images into Minikube:

```bash
minikube image load ecommerce-backend:v1
minikube image load ecommerce-frontend:v1
```

Access services:

```bash
minikube service ecommerce-frontend-service
minikube service ecommerce-backend-service
```

Do not use `localhost:30080` unless Minikube is configured to expose NodePort through localhost.
