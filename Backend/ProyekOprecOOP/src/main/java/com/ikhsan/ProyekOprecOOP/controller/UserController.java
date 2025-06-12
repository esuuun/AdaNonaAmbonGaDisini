package com.ikhsan.ProyekOprecOOP.controller;

import com.ikhsan.ProyekOprecOOP.model.User;
import com.ikhsan.ProyekOprecOOP.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.sql.Timestamp;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.UUID;

@CrossOrigin
@RestController
@RequestMapping("/user")
public class UserController {
    private final UserRepository userRepository;

    @Autowired
    public UserController(UserRepository userRepository) {
        this.userRepository = userRepository;
    }
    
    // DTO untuk User
    public static class UserDTO {
        private UUID userId;
        private String name;
        private String email;
        private Date createdAt;
        
        public UserDTO(User user) {
            this.userId = user.getUserId();
            this.name = user.getName();
            this.email = user.getEmail();
            
            if (user.getCreatedAt() != null) {
                this.createdAt = Timestamp.valueOf(user.getCreatedAt());
            }
        }
        
        // Getters and setters
        public UUID getUserId() {
            return userId;
        }

        public void setUserId(UUID userId) {
            this.userId = userId;
        }

        public String getName() {
            return name;
        }

        public void setName(String name) {
            this.name = name;
        }

        public String getEmail() {
            return email;
        }

        public void setEmail(String email) {
            this.email = email;
        }

        public Date getCreatedAt() {
            return createdAt;
        }

        public void setCreatedAt(Date createdAt) {
            this.createdAt = createdAt;
        }
    }

    @GetMapping("/email/{email}")
    public BaseResponse<UserDTO> getUserByEmail(@PathVariable String email) {
        User user = userRepository.findByEmail(email);
        if (user == null) {
            return new BaseResponse<>(false, "User not found", null);
        }
        return new BaseResponse<>(true, "Data retrieved successfully", new UserDTO(user));
    }

    @GetMapping("/all")
    public BaseResponse<List<UserDTO>> getAllUsers() {
        List<User> users = (List<User>) userRepository.findAll();
        
        // Convert to DTOs
        List<UserDTO> userDTOs = new ArrayList<>();
        for (User user : users) {
            userDTOs.add(new UserDTO(user));
        }
        
        return new BaseResponse<>(true, "All users retrieved successfully", userDTOs);
    }

    @PostMapping("/create")
    public BaseResponse<UserDTO> createUser(@RequestBody User user) {
        if (user.getEmail() == null || user.getEmail().isEmpty()) {
            return new BaseResponse<>(false, "Email is required", null);
        }
        if (userRepository.findByEmail(user.getEmail()) != null) {
            return new BaseResponse<>(false, "Email already exists", null);
        }
        User savedUser = userRepository.save(user);
        return new BaseResponse<>(true, "User created successfully", new UserDTO(savedUser));
    }

    @PostMapping("/login")
    public BaseResponse<UserDTO> loginUser(@RequestBody User user) {
        if (user.getEmail() == null || user.getEmail().isEmpty()) {
            return new BaseResponse<>(false, "Email is required", null);
        }
        if (user.getPassword() == null || user.getPassword().isEmpty()) {
            return new BaseResponse<>(false, "Password is required", null);
        }
        User foundUser = userRepository.findByEmailAndPassword(user.getEmail(), user.getPassword());
        if (foundUser == null) {
            return new BaseResponse<>(false, "Invalid email or password", null);
        }
        return new BaseResponse<>(true, "Login successful", new UserDTO(foundUser));
    }
}
