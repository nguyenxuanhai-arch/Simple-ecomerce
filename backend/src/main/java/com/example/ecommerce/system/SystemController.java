package com.example.ecommerce.system;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import java.net.InetAddress;
import java.net.UnknownHostException;
import java.time.LocalDateTime;
import java.util.LinkedHashMap;
import java.util.Map;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@Validated
@RestController
@RequestMapping("/api/system")
public class SystemController {

    private final String appName;
    private final String version;

    public SystemController(
            @Value("${spring.application.name:simple-ecommerce-api}") String appName,
            @Value("${app.version:v1}") String version
    ) {
        this.appName = appName;
        this.version = version;
    }

    @GetMapping("/info")
    public Map<String, Object> getInfo() {
        Map<String, Object> response = new LinkedHashMap<>();
        response.put("app", appName);
        response.put("version", version);
        response.put("hostname", resolveHostname());
        response.put("time", LocalDateTime.now());
        return response;
    }

    @GetMapping("/health")
    public Map<String, String> getHealth() {
        return Map.of("status", "UP");
    }

    @GetMapping("/load")
    public Map<String, Object> generateLoad(
            @RequestParam(defaultValue = "3000")
            @Min(value = 100, message = "durationMs must be at least 100")
            @Max(value = 10000, message = "durationMs must be at most 10000")
            long durationMs
    ) {
        long deadline = System.nanoTime() + durationMs * 1_000_000L;
        double accumulator = 0;
        long iterations = 0;
        while (System.nanoTime() < deadline) {
            accumulator += Math.sqrt(accumulator + System.nanoTime());
            if (accumulator > 1_000_000) {
                accumulator = accumulator % 1_000;
            }
            iterations++;
        }

        Map<String, Object> response = new LinkedHashMap<>();
        response.put("message", "CPU load generated");
        response.put("durationMs", durationMs);
        response.put("hostname", resolveHostname());
        response.put("iterations", iterations);
        return response;
    }

    @GetMapping("/version")
    public Map<String, String> getVersion() {
        return Map.of("version", version);
    }

    private String resolveHostname() {
        String hostname = System.getenv("HOSTNAME");
        if (hostname != null && !hostname.isBlank()) {
            return hostname;
        }

        String computerName = System.getenv("COMPUTERNAME");
        if (computerName != null && !computerName.isBlank()) {
            return computerName;
        }

        try {
            return InetAddress.getLocalHost().getHostName();
        } catch (UnknownHostException exception) {
            return "unknown-host";
        }
    }
}
