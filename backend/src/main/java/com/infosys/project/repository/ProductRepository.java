package com.infosys.project.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.infosys.project.model.Product;

@Repository
public interface ProductRepository extends JpaRepository<Product, Long> {

    // 🔍 Get only active products
    List<Product> findByIsActiveTrue();

    // 🔍 Find by category
    List<Product> findByCategory(String category);

    // 🔍 Search by name (case insensitive)
    List<Product> findByNameContainingIgnoreCase(String name);

}