package com.infosys.project.repository;

import java.math.BigDecimal;
import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.infosys.project.model.Product;

@Repository
public interface ProductRepository extends JpaRepository<Product, Long> {

    List<Product> findByIsActiveTrue();

    // 🔍 Search + Filter (combined)
    List<Product> findByIsActiveTrueAndNameContainingIgnoreCaseAndCategoryContainingIgnoreCaseAndPriceBetween(
            String name,
            String category,
            BigDecimal minPrice,
            BigDecimal maxPrice
    );
}