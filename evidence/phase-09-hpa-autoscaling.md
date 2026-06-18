# Phase 9 - HPA Auto Scaling Evidence

Timestamp: 2026-06-18 15:08:35 +07:00

Environment:

- Kubernetes context: `docker-desktop`
- Backend Deployment: `ecommerce-backend`
- Backend HPA: `ecommerce-backend-hpa`
- Load endpoint: `http://localhost:30080/api/system/load?durationMs=10000`

## Metrics Server Before Installation

Command:

```bash
kubectl top pods
```

Output:

```txt
error: Metrics API not available
```

Command:

```bash
kubectl get hpa
```

Output:

```txt
NAME                    REFERENCE                      TARGETS              MINPODS   MAXPODS   REPLICAS   AGE
ecommerce-backend-hpa   Deployment/ecommerce-backend   cpu: <unknown>/50%   2         6         2          13m
```

## Install Metrics Server

Command:

```bash
kubectl apply -f https://github.com/kubernetes-sigs/metrics-server/releases/latest/download/components.yaml
```

Output:

```txt
serviceaccount/metrics-server created
clusterrole.rbac.authorization.k8s.io/system:aggregated-metrics-reader created
clusterrole.rbac.authorization.k8s.io/system:metrics-server created
rolebinding.rbac.authorization.k8s.io/metrics-server-auth-reader created
clusterrolebinding.rbac.authorization.k8s.io/metrics-server:system:auth-delegator created
clusterrolebinding.rbac.authorization.k8s.io/system:metrics-server created
service/metrics-server created
deployment.apps/metrics-server created
apiservice.apiregistration.k8s.io/v1beta1.metrics.k8s.io created
```

Metrics Server initially failed to scrape Docker Desktop kubelet metrics because of kubelet certificate SAN validation.

Relevant log:

```txt
Failed to scrape node ... tls: failed to verify certificate: x509: cannot validate certificate for 192.168.65.3 because it doesn't contain any IP SANs
```

Patch file:

```txt
scripts/metrics-server-insecure-tls-patch.json
```

Command:

```bash
kubectl patch deployment metrics-server -n kube-system --type=json --patch-file scripts/metrics-server-insecure-tls-patch.json
kubectl rollout status deployment/metrics-server -n kube-system --timeout=180s
```

Output:

```txt
deployment.apps/metrics-server patched
deployment "metrics-server" successfully rolled out
```

## Verify Metrics Server

Command:

```bash
kubectl get pods -n kube-system -l k8s-app=metrics-server
```

Output:

```txt
NAME                              READY   STATUS    RESTARTS   AGE
metrics-server-56ff78d5b7-tldc9   1/1     Running   0          15m
```

Command:

```bash
kubectl top nodes
```

Output:

```txt
NAME             CPU(cores)   CPU(%)   MEMORY(bytes)   MEMORY(%)
docker-desktop   2061m        17%      4089Mi          53%
```

Command:

```bash
kubectl top pods
```

Output:

```txt
NAME                                  CPU(cores)   MEMORY(bytes)
ecommerce-backend-6b8999d849-45jgb    5m           218Mi
ecommerce-backend-6b8999d849-5k7dk    5m           233Mi
ecommerce-frontend-78dbd48869-jhhsx   1m           11Mi
ecommerce-mysql-84bc77b97f-wbpnm      22m          462Mi
```

## HPA Before Load Test

Command:

```bash
kubectl get hpa
```

Output:

```txt
NAME                    REFERENCE                      TARGETS       MINPODS   MAXPODS   REPLICAS   AGE
ecommerce-backend-hpa   Deployment/ecommerce-backend   cpu: 5%/50%   2         6         2          21m
```

Command:

```bash
kubectl get pods -l app=ecommerce-backend
```

Output:

```txt
NAME                                 READY   STATUS    RESTARTS      AGE
ecommerce-backend-6b8999d849-45jgb   1/1     Running   0             11m
ecommerce-backend-6b8999d849-5k7dk   1/1     Running   1 (20m ago)   21m
```

Backend Deployment already contains CPU resources required by HPA:

```yaml
resources:
  requests:
    cpu: "100m"
    memory: "256Mi"
  limits:
    cpu: "500m"
    memory: "512Mi"
```

Backend HPA configuration:

```yaml
minReplicas: 2
maxReplicas: 6
averageUtilization: 50
```

## Generate CPU Load

Because `hey` and `ab` were not installed on this machine, the demo used a local PowerShell load generator:

```txt
scripts/generate-hpa-load.ps1
```

Command:

```powershell
Start-Process -FilePath powershell.exe `
  -ArgumentList @(
    '-NoProfile',
    '-ExecutionPolicy',
    'Bypass',
    '-File',
    'scripts/generate-hpa-load.ps1',
    '-DurationSeconds',
    '240',
    '-Concurrency',
    '16'
  ) `
  -WindowStyle Hidden `
  -PassThru
```

The load generator repeatedly called:

```txt
http://localhost:30080/api/system/load?durationMs=10000
```

## HPA During Load Test

First HPA reaction:

```txt
NAME                    REFERENCE                      TARGETS         MINPODS   MAXPODS   REPLICAS   AGE
ecommerce-backend-hpa   Deployment/ecommerce-backend   cpu: 222%/50%   2         6         2          23m
```

Pods started scaling:

```txt
NAME                                 READY   STATUS              RESTARTS      AGE
ecommerce-backend-6b8999d849-45jgb   1/1     Running             0             12m
ecommerce-backend-6b8999d849-5k7dk   1/1     Running             1 (22m ago)   23m
ecommerce-backend-6b8999d849-7hnct   0/1     ContainerCreating   0             1s
ecommerce-backend-6b8999d849-ztqds   0/1     ContainerCreating   0             1s
```

HPA scaled the Deployment to desired replicas 6:

```txt
NAME                    REFERENCE                      TARGETS         MINPODS   MAXPODS   REPLICAS   AGE
ecommerce-backend-hpa   Deployment/ecommerce-backend   cpu: 504%/50%   2         6         4          24m
```

Deployment state:

```txt
NAME                READY   UP-TO-DATE   AVAILABLE   AGE
ecommerce-backend   2/6     6            2           24m
```

Final scale-up state:

```txt
NAME                    REFERENCE                      TARGETS         MINPODS   MAXPODS   REPLICAS   AGE
ecommerce-backend-hpa   Deployment/ecommerce-backend   cpu: 500%/50%   2         6         6          26m
```

Deployment reached 6 available backend Pods:

```txt
NAME                READY   UP-TO-DATE   AVAILABLE   AGE
ecommerce-backend   6/6     6            6           26m
```

Backend Pods after scale-up:

```txt
NAME                                 READY   STATUS    RESTARTS      AGE
ecommerce-backend-6b8999d849-45jgb   1/1     Running   0             16m
ecommerce-backend-6b8999d849-5k7dk   1/1     Running   1 (25m ago)   26m
ecommerce-backend-6b8999d849-7hnct   1/1     Running   0             3m26s
ecommerce-backend-6b8999d849-l9k6z   1/1     Running   0             2m26s
ecommerce-backend-6b8999d849-qfnt8   1/1     Running   0             2m26s
ecommerce-backend-6b8999d849-ztqds   1/1     Running   0             3m26s
```

## After Stopping Load

The load generator process was stopped after HPA reached max replicas.

CPU dropped back to a low level:

```txt
NAME                    REFERENCE                      TARGETS       MINPODS   MAXPODS   REPLICAS   AGE
ecommerce-backend-hpa   Deployment/ecommerce-backend   cpu: 4%/50%   2         6         6          35m
```

HPA did not immediately scale down because it was inside the downscale stabilization window.

Relevant HPA condition:

```txt
AbleToScale     True    ScaleDownStabilized  recent recommendations were higher than current one, applying the highest recent recommendation
ScalingActive   True    ValidMetricFound     the HPA was able to successfully calculate a replica count from cpu resource utilization (percentage of request)
```

Relevant HPA events:

```txt
Normal   SuccessfulRescale   12m   horizontal-pod-autoscaler   New size: 4; reason: cpu resource utilization (percentage of request) above target
Normal   SuccessfulRescale   11m   horizontal-pod-autoscaler   New size: 6; reason: cpu resource utilization (percentage of request) above target
```

Conclusion:

Metrics Server was installed and patched successfully for Docker Desktop Kubernetes. HPA read CPU metrics, detected high backend CPU load, and scaled the backend Deployment from 2 Pods to 6 Pods. After load stopped, CPU usage dropped, while HPA temporarily kept 6 replicas because of the standard downscale stabilization behavior.
