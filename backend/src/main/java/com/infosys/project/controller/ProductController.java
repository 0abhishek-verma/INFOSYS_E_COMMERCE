package com.infosys.project.controller;

import java.util.List;
import java.math.BigDecimal;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import com.infosys.project.model.Product;
import com.infosys.project.service.ProductService;

@RestController
@RequestMapping("/api/products")
@CrossOrigin(origins = "http://localhost:5173")
public class ProductController {

    @Autowired
    private ProductService productService;

    // 🔥 ADMIN ONLY (already secured in SecurityConfig)
    @PostMapping("/add")
    public Product addProduct(
            @RequestParam("name") String name,
            @RequestParam("description") String description,
            @RequestParam("price") BigDecimal price,
            @RequestParam("stockQuantity") Integer stockQuantity,
            @RequestParam("category") String category,
            @RequestParam("image") MultipartFile image
    ) {
        return productService.addProduct(
                name, description, price, stockQuantity, category, image
        );
    }

    @DeleteMapping("/{id}")
    public String removeProduct(@PathVariable Long id) {
        productService.removeProduct(id);
        return "Product removed successfully";
    }

    @GetMapping
    public List<Product> getAllProducts() {
        return productService.getAllProducts();
    }

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
