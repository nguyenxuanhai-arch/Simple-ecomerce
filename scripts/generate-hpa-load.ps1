param(
    [string]$Url = "http://localhost:30080/api/system/load?durationMs=10000",
    [int]$DurationSeconds = 240,
    [int]$Concurrency = 16,
    [string]$OutputPath = "evidence/phase-09-load-client.log"
)

$ErrorActionPreference = "Stop"

$outputDirectory = Split-Path -Parent $OutputPath
if ($outputDirectory -and -not (Test-Path -LiteralPath $outputDirectory)) {
    New-Item -ItemType Directory -Path $outputDirectory | Out-Null
}

$startTime = Get-Date
$endTime = $startTime.AddSeconds($DurationSeconds)

"Start: $($startTime.ToString("yyyy-MM-dd HH:mm:ss K"))" | Set-Content -Encoding UTF8 -LiteralPath $OutputPath
"Url: $Url" | Add-Content -Encoding UTF8 -LiteralPath $OutputPath
"DurationSeconds: $DurationSeconds" | Add-Content -Encoding UTF8 -LiteralPath $OutputPath
"Concurrency: $Concurrency" | Add-Content -Encoding UTF8 -LiteralPath $OutputPath

$worker = {
    param($WorkerId, $RequestUrl, $Deadline)

    $completed = 0
    $failed = 0

    while ((Get-Date) -lt $Deadline) {
        try {
            curl.exe --silent --show-error --no-keepalive -H "Connection: close" $RequestUrl | Out-Null
            $completed++
        } catch {
            $failed++
        }
    }

    [PSCustomObject]@{
        WorkerId = $WorkerId
        Completed = $completed
        Failed = $failed
    }
}

$jobs = for ($i = 1; $i -le $Concurrency; $i++) {
    Start-Job -ScriptBlock $worker -ArgumentList $i, $Url, $endTime
}

Wait-Job -Job $jobs | Out-Null
$results = Receive-Job -Job $jobs
Remove-Job -Job $jobs

$endActual = Get-Date
"End: $($endActual.ToString("yyyy-MM-dd HH:mm:ss K"))" | Add-Content -Encoding UTF8 -LiteralPath $OutputPath
"TotalCompleted: $(($results | Measure-Object -Property Completed -Sum).Sum)" | Add-Content -Encoding UTF8 -LiteralPath $OutputPath
"TotalFailed: $(($results | Measure-Object -Property Failed -Sum).Sum)" | Add-Content -Encoding UTF8 -LiteralPath $OutputPath
$results | Format-Table -AutoSize | Out-String | Add-Content -Encoding UTF8 -LiteralPath $OutputPath
