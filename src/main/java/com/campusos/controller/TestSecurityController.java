package com.campusos.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@RestController
@RequestMapping("/api/v1/test")
public class TestSecurityController {

    @GetMapping("/protected-ping")
    public ResponseEntity<Map<String, Object>> protectedPing() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        return ResponseEntity.ok(Map.of(
                "message", "Authenticated access granted! Your JWT is valid.",
                "user", authentication.getName(),
                "authorities", authentication.getAuthorities().toString()
        ));
    }

    @GetMapping("/admin-only")
    @PreAuthorize("hasAuthority('ROLE_ADMIN')")
    public ResponseEntity<Map<String, String>> adminOnly() {
        return ResponseEntity.ok(Map.of("message", "Welcome Admin! Access granted to admin portal."));
    }

    @GetMapping("/student-only")
    @PreAuthorize("hasAuthority('ROLE_STUDENT')")
    public ResponseEntity<Map<String, String>> studentOnly() {
        return ResponseEntity.ok(Map.of("message", "Welcome Student! Access granted to student portal."));
    }
}