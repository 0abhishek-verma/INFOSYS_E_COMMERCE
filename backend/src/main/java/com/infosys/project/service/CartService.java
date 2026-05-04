package com.infosys.project.service;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.infosys.project.model.CartItem;
import com.infosys.project.model.Product;
import com.infosys.project.repository.CartItemRepository;
import com.infosys.project.repository.ProductRepository;

@Service
public class CartService {

    @Autowired
    private CartItemRepository cartItemRepository;

    @Autowired
    private ProductRepository productRepository;

    // ✅ ADD TO CART
    public CartItem addToCart(String userEmail, Long productId, Integer quantity) {

        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new RuntimeException("Product not found"));

        Optional<CartItem> existing =
                cartItemRepository.findByUserEmailAndProductId(userEmail, productId);

        if (existing.isPresent()) {

            CartItem item = existing.get();
            item.setQuantity(item.getQuantity() + quantity);
            return cartItemRepository.save(item);
        }

        CartItem cartItem = new CartItem();

        cartItem.setUserEmail(userEmail);
        cartItem.setProductId(product.getId());
        cartItem.setProductName(product.getName());
        cartItem.setPrice(product.getPrice());
        cartItem.setQuantity(quantity);
        cartItem.setImageUrl(product.getImageUrl());

        return cartItemRepository.save(cartItem);
    }

    // ✅ GET CART
    public List<CartItem> getCart(String userEmail) {
        return cartItemRepository.findByUserEmail(userEmail);
    }

    // ❌ REMOVE ITEM
    public void removeItem(Long id) {
        cartItemRepository.deleteById(id);
    }
}