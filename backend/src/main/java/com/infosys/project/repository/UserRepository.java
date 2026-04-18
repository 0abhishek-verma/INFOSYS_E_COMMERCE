package com.infosys.project.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.infosys.project.model.User;

public interface UserRepository
extends JpaRepository<User, Integer> {

    Optional<User> findByEmail(String email);

}