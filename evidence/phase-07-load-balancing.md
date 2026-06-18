# Phase 7 - Load Balancing Evidence

Timestamp: 2026-06-18 14:40:05 +07:00

Environment:

- Kubernetes context: `docker-desktop`
- Backend Service URL: `http://localhost:30080`
- Backend endpoint: `GET /api/system/info`

## Backend Deployment

Command:

```bash
kubectl get deployment ecommerce-backend
```

Output:

```txt
NAME                READY   UP-TO-DATE   AVAILABLE   AGE
ecommerce-backend   2/2     2            2           7m43s
```

## Backend Pods

Command:

```bash
kubectl get pods -l app=ecommerce-backend
```

Output:

```txt
NAME                                 READY   STATUS    RESTARTS        AGE
ecommerce-backend-6b8999d849-24fbm   1/1     Running   1 (6m57s ago)   7m44s
ecommerce-backend-6b8999d849-5k7dk   1/1     Running   1 (6m56s ago)   7m44s
```

## Backend Service

Command:

```bash
kubectl get service ecommerce-backend-service
```

Output:

```txt
NAME                        TYPE       CLUSTER-IP      EXTERNAL-IP   PORT(S)        AGE
ecommerce-backend-service   NodePort   10.109.107.87   <none>        80:30080/TCP   7m44s
```

## Load Balancing Test

Command:

```powershell
$hosts = @()
for ($i = 1; $i -le 30; $i++) {
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
Request 03 -> ecommerce-backend-6b8999d849-24fbm
Request 04 -> ecommerce-backend-6b8999d849-24fbm
Request 05 -> ecommerce-backend-6b8999d849-5k7dk
Request 06 -> ecommerce-backend-6b8999d849-24fbm
Request 07 -> ecommerce-backend-6b8999d849-5k7dk
Request 08 -> ecommerce-backend-6b8999d849-5k7dk
Request 09 -> ecommerce-backend-6b8999d849-24fbm
Request 10 -> ecommerce-backend-6b8999d849-24fbm
Request 11 -> ecommerce-backend-6b8999d849-24fbm
Request 12 -> ecommerce-backend-6b8999d849-24fbm
Request 13 -> ecommerce-backend-6b8999d849-24fbm
Request 14 -> ecommerce-backend-6b8999d849-5k7dk
Request 15 -> ecommerce-backend-6b8999d849-24fbm
Request 16 -> ecommerce-backend-6b8999d849-5k7dk
Request 17 -> ecommerce-backend-6b8999d849-24fbm
Request 18 -> ecommerce-backend-6b8999d849-24fbm
Request 19 -> ecommerce-backend-6b8999d849-5k7dk
Request 20 -> ecommerce-backend-6b8999d849-5k7dk
Request 21 -> ecommerce-backend-6b8999d849-5k7dk
Request 22 -> ecommerce-backend-6b8999d849-5k7dk
Request 23 -> ecommerce-backend-6b8999d849-24fbm
Request 24 -> ecommerce-backend-6b8999d849-24fbm
Request 25 -> ecommerce-backend-6b8999d849-24fbm
Request 26 -> ecommerce-backend-6b8999d849-24fbm
Request 27 -> ecommerce-backend-6b8999d849-5k7dk
Request 28 -> ecommerce-backend-6b8999d849-5k7dk
Request 29 -> ecommerce-backend-6b8999d849-5k7dk
Request 30 -> ecommerce-backend-6b8999d849-5k7dk

Unique hostnames:
ecommerce-backend-6b8999d849-24fbm
ecommerce-backend-6b8999d849-5k7dk
```

Conclusion:

The backend Service distributed requests to two different backend Pods:

- `ecommerce-backend-6b8999d849-24fbm`
- `ecommerce-backend-6b8999d849-5k7dk`

This proves Kubernetes Service load balancing is working for the backend application.
