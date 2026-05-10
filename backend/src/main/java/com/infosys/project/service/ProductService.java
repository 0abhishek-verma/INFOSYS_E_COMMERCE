package com.infosys.project.service;

import java.util.List;
import java.math.BigDecimal;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import com.infosys.project.model.Product;
import com.infosys.project.repository.ProductRepository;

@Service
public class ProductService {

    @Autowired
    private ProductRepository productRepository;

    @Autowired
    private ImageService imageService;

    // ✅ ADD PRODUCT WITH CLOUDINARY IMAGE
    public Product addProduct(
            String name,
            String description,
            BigDecimal price,
            Integer stockQuantity,
            String category,
            MultipartFile image
    ) {

        String imageUrl = imageService.uploadImage(image);

        Product product = new Product();

        product.setName(name);
        product.setDescription(description);
        product.setPrice(price);
        product.setStockQuantity(stockQuantity);
        product.setCategory(category);

        // 🔥 store CLOUD URL
        product.setImageUrl(imageUrl);

        return productRepository.save(product);
    }

    public List<Product> getAllProducts() {
        return productRepository.findByIsActiveTrue();
    }

    public Product getProductById(Long id) {
        return productRepository.findById(id)
                .filter(Product::getIsActive)
                .orElseThrow(() ->
                        new RuntimeException("Product not found with id: " + id)
                );
    }

    public void removeProduct(Long id) {
        Product product = getProductById(id);
        product.setIsActive(false);
        productRepository.save(product);
    }

    public List<Product> searchProducts(
            String name,
            String category,
            BigDecimal minPrice,
            BigDecimal maxPrice
    ) {

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
