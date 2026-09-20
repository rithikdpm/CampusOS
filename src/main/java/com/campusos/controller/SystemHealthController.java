package com.campusos.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.time.Instant;
import java.util.Map;

@RestController
@RequestMapping("/api/v1/health")
public class SystemHealthController {

    @GetMapping
    public ResponseEntity<Map<String, Object>> checkHealth() {
        Map<String, Object> response = Map.of(
                "status", "UP",
                "service", "CampusOS Core API",
                "timestamp", Instant.now().toString(),
                "version", "1.0.0"
        );
        return ResponseEntity.ok(response);
    }
    @GetMapping("/secure-ping")
    public ResponseEntity<Map<String, String>> securePing() {
        return ResponseEntity.ok(Map.of(
                "message", "Authenticated access granted! Your JWT is valid."
        ));
    }
}