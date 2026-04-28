package com.infosys.project.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import com.infosys.project.model.Product;
import com.infosys.project.service.ProductService;

import jakarta.validation.Valid;
import java.math.BigDecimal;


@RestController
@RequestMapping("/api/products")
@CrossOrigin(origins = "http://localhost:5173")
public class ProductController {

    @Autowired
    private ProductService productService;

    // ✅ ADD PRODUCT (ADMIN ONLY)
    @PostMapping("/add")
    public Product addProduct(@Valid @RequestBody Product product) {
        return productService.addProduct(product);
    }

    // ✅ GET ALL PRODUCTS (AUTH REQUIRED)
    @GetMapping
    public List<Product> getAllProducts() {
        return productService.getAllProducts();
    }

    // 🔥 GET PRODUCT BY ID
    @GetMapping("/{id}")
    public Product getProductById(@PathVariable Long id) {
        return productService.getProductById(id);
    }

    @GetMapping("/search")
public List<Product> searchProducts(
        @RequestParam(required = false) String name,
        @RequestParam(required = false) String category,
        @RequestParam(required = false) BigDecimal minPrice,
        @RequestParam(required = false) BigDecimal maxPrice
) {
    return productService.searchProducts(name, category, minPrice, maxPrice);
}
}