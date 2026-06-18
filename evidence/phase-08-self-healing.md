# Phase 8 - Self-healing Evidence

Timestamp: 2026-06-18 14:42:19 +07:00

Environment:

- Kubernetes context: `docker-desktop`
- Backend Deployment: `ecommerce-backend`
- Backend Service URL: `http://localhost:30080`

## Before Deleting A Pod

Command:

```bash
kubectl get deployment ecommerce-backend
```

Output:

```txt
NAME                READY   UP-TO-DATE   AVAILABLE   AGE
ecommerce-backend   2/2     2            2           9m58s
```

Command:

```bash
kubectl get pods -l app=ecommerce-backend -o wide
```

Output:

```txt
NAME                                 READY   STATUS    RESTARTS        AGE     IP         NODE             NOMINATED NODE   READINESS GATES
ecommerce-backend-6b8999d849-24fbm   1/1     Running   1 (9m11s ago)   9m58s   10.1.0.7   docker-desktop   <none>           <none>
ecommerce-backend-6b8999d849-5k7dk   1/1     Running   1 (9m10s ago)   9m58s   10.1.0.6   docker-desktop   <none>           <none>
```

## Delete One Backend Pod

Command:

```bash
kubectl delete pod ecommerce-backend-6b8999d849-24fbm
```

Output:

```txt
pod "ecommerce-backend-6b8999d849-24fbm" deleted
```

## Immediately After Deleting

Command:

```bash
kubectl get pods -l app=ecommerce-backend -o wide
```

Output:

```txt
NAME                                 READY   STATUS    RESTARTS        AGE   IP          NODE             NOMINATED NODE   READINESS GATES
ecommerce-backend-6b8999d849-45jgb   0/1     Running   0               9s    10.1.0.10   docker-desktop   <none>           <none>
ecommerce-backend-6b8999d849-5k7dk   1/1     Running   1 (9m34s ago)   10m   10.1.0.6    docker-desktop   <none>           <none>
```

Command:

```bash
kubectl get deployment ecommerce-backend
```

Output:

```txt
NAME                READY   UP-TO-DATE   AVAILABLE   AGE
ecommerce-backend   1/2     2            1           10m
```

Kubernetes immediately created replacement Pod `ecommerce-backend-6b8999d849-45jgb`.

## Wait For Recovery

Command:

```bash
kubectl rollout status deployment/ecommerce-backend --timeout=180s
```

Output:

```txt
Waiting for deployment "ecommerce-backend" rollout to finish: 1 of 2 updated replicas are available...
deployment "ecommerce-backend" successfully rolled out
```

## After Self-healing

Command:

```bash
kubectl get deployment ecommerce-backend
```

Output:

```txt
NAME                READY   UP-TO-DATE   AVAILABLE   AGE
ecommerce-backend   2/2     2            2           11m
```

Command:

```bash
kubectl get pods -l app=ecommerce-backend -o wide
```

Output:

```txt
NAME                                 READY   STATUS    RESTARTS      AGE   IP          NODE             NOMINATED NODE   READINESS GATES
ecommerce-backend-6b8999d849-45jgb   1/1     Running   0             94s   10.1.0.10   docker-desktop   <none>           <none>
ecommerce-backend-6b8999d849-5k7dk   1/1     Running   1 (10m ago)   11m   10.1.0.6    docker-desktop   <none>           <none>
```

## Service Check After Recovery

Command:

```powershell
$hosts = @()
for ($i = 1; $i -le 12; $i++) {
  $json = curl.exe --silent --no-keepalive -H "Connection: close" http://localhost:30080/api/system/info
  $hostName = ($json | ConvertFrom-Json).hostname
  $hosts += $hostName
  "Request {0:D2} -> {1}" -f $i, $hostName
  Start-Sleep -Milliseconds 100
}
""
"Unique hostnames:"
$hosts | Sort-Object -Unique
```

Output:

```txt
Request 01 -> ecommerce-backend-6b8999d849-5k7dk
Request 02 -> ecommerce-backend-6b8999d849-5k7dk
Request 03 -> ecommerce-backend-6b8999d849-45jgb
Request 04 -> ecommerce-backend-6b8999d849-5k7dk
Request 05 -> ecommerce-backend-6b8999d849-5k7dk
Request 06 -> ecommerce-backend-6b8999d849-45jgb
Request 07 -> ecommerce-backend-6b8999d849-5k7dk
Request 08 -> ecommerce-backend-6b8999d849-45jgb
Request 09 -> ecommerce-backend-6b8999d849-45jgb
Request 10 -> ecommerce-backend-6b8999d849-45jgb
Request 11 -> ecommerce-backend-6b8999d849-45jgb
Request 12 -> ecommerce-backend-6b8999d849-5k7dk

Unique hostnames:
ecommerce-backend-6b8999d849-45jgb
ecommerce-backend-6b8999d849-5k7dk
```

Conclusion:

The backend Pod `ecommerce-backend-6b8999d849-24fbm` was deleted manually. Kubernetes automatically created replacement Pod `ecommerce-backend-6b8999d849-45jgb`, and the Deployment returned to `2/2` available replicas. The backend Service continued serving requests after recovery.
