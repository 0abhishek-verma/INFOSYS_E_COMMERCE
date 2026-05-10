package com.infosys.project.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import com.infosys.project.model.User;
import com.infosys.project.service.UserService;
import com.infosys.project.dto.LoginRequest;
import com.infosys.project.dto.OtpVerificationRequest;
import com.infosys.project.dto.RegisterRequest;

@RestController
@RequestMapping("/api/users")
@CrossOrigin(origins = "http://localhost:5173")
public class UserController {

    @Autowired
    private UserService userService;

    @PostMapping("/register")
    public String registerUser(@RequestBody RegisterRequest request) {
        return userService.initiateRegistration(request);
    }

    @PostMapping("/verify-otp")
    public User verifyRegistrationOtp(@RequestBody OtpVerificationRequest request) {
        return userService.verifyRegistrationOtp(
                request.getEmail(),
                request.getOtp()
        );
    }

    @PostMapping("/login")
    public String loginUser(@RequestBody LoginRequest request) {
        return userService.loginUser(
                request.getEmail(),
                request.getPassword()
        );
    }

    @GetMapping("/dashboard")
    public String dashboard() {
        return "Protected API Accessed!";
    }
}
