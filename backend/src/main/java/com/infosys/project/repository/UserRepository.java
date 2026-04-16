package com.infosys.project.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import com.infosys.project.model.*;

public interface UserRepository extends JpaRepository<User, Integer> {
}