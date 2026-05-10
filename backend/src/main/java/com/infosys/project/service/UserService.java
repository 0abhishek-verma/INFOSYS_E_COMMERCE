package com.infosys.project.service;

import java.security.SecureRandom;
import java.time.Instant;
import java.util.Map;
import java.util.Optional;
import java.util.concurrent.ConcurrentHashMap;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import com.infosys.project.dto.RegisterRequest;
import com.infosys.project.model.User;
import com.infosys.project.repository.UserRepository;
import com.infosys.project.security.JwtUtil;

@Service
public class UserService {

    private static final long OTP_EXPIRY_SECONDS = 600;

    private final SecureRandom secureRandom = new SecureRandom();
    private final Map<String, PendingRegistration> pendingRegistrations = new ConcurrentHashMap<>();

    @Autowired
    private JwtUtil jwtUtil;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private BCryptPasswordEncoder passwordEncoder;

    @Autowired
    private EmailOtpService emailOtpService;

    public String initiateRegistration(RegisterRequest request) {

        String email = normalizeEmail(request.getEmail());

        Optional<User> existingUser =
                userRepository.findByEmail(email);

        if (existingUser.isPresent()) {
            throw new RuntimeException("Email already registered");
        }

        String otp = generateOtp();

        emailOtpService.sendRegistrationOtp(email, otp);

        pendingRegistrations.put(
                email,
                new PendingRegistration(request, otp, Instant.now().plusSeconds(OTP_EXPIRY_SECONDS))
        );

        return "OTP sent to " + email;
    }

    public User verifyRegistrationOtp(String email, String otp) {

        String normalizedEmail = normalizeEmail(email);
        PendingRegistration pendingRegistration = pendingRegistrations.get(normalizedEmail);

        if (pendingRegistration == null) {
            throw new RuntimeException("No pending registration found for this email");
        }

        if (pendingRegistration.expiresAt().isBefore(Instant.now())) {
            pendingRegistrations.remove(normalizedEmail);
            throw new RuntimeException("OTP expired. Please register again.");
        }

        if (!pendingRegistration.otp().equals(otp)) {
            throw new RuntimeException("Invalid OTP");
        }

        Optional<User> existingUser =
                userRepository.findByEmail(normalizedEmail);

        if (existingUser.isPresent()) {
            pendingRegistrations.remove(normalizedEmail);
            throw new RuntimeException("Email already registered");
        }

        User user = createUser(pendingRegistration.request(), normalizedEmail);
        pendingRegistrations.remove(normalizedEmail);

        return userRepository.save(user);
    }

    public String loginUser(String email, String password) {

        User user = userRepository.findByEmail(normalizeEmail(email))
                .orElseThrow(() ->
                        new RuntimeException("User not found")
                );

        if (!passwordEncoder.matches(password, user.getPassword())) {
            throw new RuntimeException("Invalid password");
        }

        return jwtUtil.generateToken(
                user.getEmail(),
                user.getName(),
                user.getRole()
        );
    }

    private User createUser(RegisterRequest request, String email) {

        User user = new User();

        user.setName(request.getName());
        user.setEmail(email);
        user.setPhone(request.getPhone());

        user.setPassword(
                passwordEncoder.encode(request.getPassword())
        );

        user.setRole("USER");

        return user;
    }

    private String generateOtp() {
        return String.valueOf(100000 + secureRandom.nextInt(900000));
    }

    private String normalizeEmail(String email) {
        if (email == null) {
            throw new RuntimeException("Email is required");
        }

        return email.trim().toLowerCase();
    }

    private record PendingRegistration(RegisterRequest request, String otp, Instant expiresAt) {
    }
}
