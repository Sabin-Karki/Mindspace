package com.backend.mindspace.dto;

import lombok.Data;

@Data
public class JwtAuthenticationResponse {
    private String token;
    private String firstName;
    private String lastName;
}
