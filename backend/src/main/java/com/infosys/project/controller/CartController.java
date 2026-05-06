package com.infosys.project.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import com.infosys.project.model.CartItem;
import com.infosys.project.service.CartService;
import com.infosys.project.security.JwtUtil;

@RestController
@RequestMapping("/api/cart")
@CrossOrigin(origins = "http://localhost:5173")
public class CartController {

    @Autowired
    private CartService cartService;

    @Autowired
    private JwtUtil jwtUtil;

    // ✅ ADD TO CART
    @PostMapping("/add")
    public CartItem addToCart(
            @RequestParam Long productId,
            @RequestParam Integer quantity,
            @RequestHeader("Authorization") String token
    ) {

        String email = extractEmail(token);
        return cartService.addToCart(email, productId, quantity);
    }

    // ✅ GET CART
    @GetMapping
    public List<CartItem> getCart(
            @RequestHeader("Authorization") String token
    ) {

        String email = extractEmail(token);
        return cartService.getCart(email);
    }

    // ❌ REMOVE ITEM
    @DeleteMapping("/{id}")
    public void removeItem(@PathVariable Long id) {
        cartService.removeItem(id);
    }

    // 🔐 Extract email from JWT
    private String extractEmail(String token) {
        token = token.substring(7);
        return jwtUtil.extractEmail(token);
    }


    // 🔄 PUT → set exact quantity
    @PutMapping("/update")
    public CartItem updateCartPut(
            @RequestParam Long productId,
            @RequestParam Integer quantity,
            @RequestHeader("Authorization") String token
    ) {
        String email = extractEmail(token);
        return cartService.updateCartPut(email, productId, quantity);
    }

    // 🔄 PATCH → increase/decrease quantity
    @PatchMapping("/update")
    public CartItem updateCartPatch(
            @RequestParam Long productId,
            @RequestParam Integer quantityChange,
            @RequestHeader("Authorization") String token
    ) {
        String email = extractEmail(token);
        return cartService.updateCartPatch(email, productId, quantityChange);
    }
}