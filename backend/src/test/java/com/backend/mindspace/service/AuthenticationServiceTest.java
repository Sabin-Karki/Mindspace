package com.backend.mindspace.service;

import com.backend.mindspace.dto.JwtAuthenticationResponse;
import com.backend.mindspace.dto.SignUpRequest;
import com.backend.mindspace.dto.SigninRequest;
import com.backend.mindspace.entity.User;
import com.backend.mindspace.repository.UserRepository;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.time.LocalDate;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class AuthenticationServiceTest {

    @Mock
    private UserRepository userRepository;

    @Mock
    private PasswordEncoder passwordEncoder;

    @Mock
    private JwtService jwtService;

    @Mock
    private AuthenticationManager authenticationManager;

    @InjectMocks
    private AuthenticationService authenticationService;

    @Test
    void signupShouldEncodePasswordSaveUserAndReturnJwtResponse() {
        SignUpRequest request = new SignUpRequest();
        request.setFirstName("Sabin");
        request.setLastName("Karki");
        request.setEmail("sabin@example.com");
        request.setPassword("raw-password");

        when(passwordEncoder.encode("raw-password")).thenReturn("encoded-password");
        when(userRepository.save(any(User.class))).thenAnswer(invocation -> invocation.getArgument(0));
        when(jwtService.generateToken(any(User.class))).thenReturn("jwt-token");

        JwtAuthenticationResponse response = authenticationService.signup(request);

        assertEquals("jwt-token", response.getToken());
        assertEquals("Sabin", response.getFirstName());
        assertEquals("Karki", response.getLastName());

        ArgumentCaptor<User> userCaptor = ArgumentCaptor.forClass(User.class);
        verify(userRepository).save(userCaptor.capture());

        User savedUser = userCaptor.getValue();
        assertEquals("Sabin", savedUser.getFirstName());
        assertEquals("Karki", savedUser.getLastName());
        assertEquals("sabin@example.com", savedUser.getEmail());
        assertEquals("encoded-password", savedUser.getPassword());
        assertEquals(LocalDate.now(), savedUser.getCreatedAt());
    }

    @Test
    void signinShouldAuthenticateAndReturnJwtResponse() {
        SigninRequest request = new SigninRequest();
        request.setEmail("sabin@example.com");
        request.setPassword("raw-password");

        User user = User.builder()
                .userId(1L)
                .firstName("Sabin")
                .lastName("Karki")
                .email("sabin@example.com")
                .password("encoded-password")
                .build();

        Authentication auth = new UsernamePasswordAuthenticationToken(request.getEmail(), request.getPassword());
        when(authenticationManager.authenticate(any(UsernamePasswordAuthenticationToken.class))).thenReturn(auth);
        when(userRepository.findByEmail("sabin@example.com")).thenReturn(Optional.of(user));
        when(jwtService.generateToken(user)).thenReturn("jwt-token");

        JwtAuthenticationResponse response = authenticationService.signin(request);

        assertEquals("jwt-token", response.getToken());
        assertEquals("Sabin", response.getFirstName());
        assertEquals("Karki", response.getLastName());

        ArgumentCaptor<UsernamePasswordAuthenticationToken> authCaptor = ArgumentCaptor.forClass(UsernamePasswordAuthenticationToken.class);
        verify(authenticationManager).authenticate(authCaptor.capture());
        assertEquals("sabin@example.com", authCaptor.getValue().getPrincipal());
        assertEquals("raw-password", authCaptor.getValue().getCredentials());
    }

    @Test
    void signinShouldThrowWhenUserNotFound() {
        SigninRequest request = new SigninRequest();
        request.setEmail("missing@example.com");
        request.setPassword("raw-password");

        when(authenticationManager.authenticate(any(UsernamePasswordAuthenticationToken.class)))
                .thenReturn(new UsernamePasswordAuthenticationToken(request.getEmail(), request.getPassword()));
        when(userRepository.findByEmail(anyString())).thenReturn(Optional.empty());

        IllegalArgumentException exception = assertThrows(IllegalArgumentException.class,
                () -> authenticationService.signin(request));

        assertNotNull(exception.getMessage());
        assertEquals("Invalid email or password.", exception.getMessage());
    }
}
