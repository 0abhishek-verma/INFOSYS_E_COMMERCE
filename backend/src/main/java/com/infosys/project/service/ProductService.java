package com.infosys.project.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.infosys.project.model.Product;
import com.infosys.project.repository.ProductRepository;
import java.math.BigDecimal;


@Service
public class ProductService {

    @Autowired
    private ProductRepository productRepository;

    // ✅ Add Product
    public Product addProduct(Product product) {
        return productRepository.save(product);
    }

    // ✅ Get all active products
    public List<Product> getAllProducts() {
        return productRepository.findByIsActiveTrue();
    }

    // 🔥 GET PRODUCT BY ID
    public Product getProductById(Long id) {
        return productRepository.findById(id)
                .filter(Product::getIsActive) // only active products
                .orElseThrow(() ->
                        new RuntimeException("Product not found with id: " + id)
                );
    }

    public List<Product> searchProducts(
        String name,
        String category,
        BigDecimal minPrice,
        BigDecimal maxPrice
) {

    // default values (important)
    if (name == null) name = "";
    if (category == null) category = "";
    if (minPrice == null) minPrice = BigDecimal.ZERO;
    if (maxPrice == null) maxPrice = BigDecimal.valueOf(Long.MAX_VALUE);

    return productRepository
            .findByIsActiveTrueAndNameContainingIgnoreCaseAndCategoryContainingIgnoreCaseAndPriceBetween(
                    name,
                    category,
                    minPrice,
                    maxPrice
            );
}
}