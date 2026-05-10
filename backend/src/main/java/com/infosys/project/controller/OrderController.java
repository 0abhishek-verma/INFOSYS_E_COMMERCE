package com.infosys.project.controller;

import com.infosys.project.model.Order;
import com.infosys.project.security.JwtUtil;
import com.infosys.project.service.OrderService;
import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/orders")
@CrossOrigin(origins = "http://localhost:5173")
public class OrderController {

    @Autowired
    private OrderService orderService;

    @Autowired
    private JwtUtil jwtUtil;

    @PostMapping("/place")
    public Order placeOrder(@RequestHeader("Authorization") String token) {
        return orderService.placeOrder(extractEmail(token));
    }

    @GetMapping("/my")
    public List<Order> getMyOrders(@RequestHeader("Authorization") String token) {
        return orderService.getMyOrders(extractEmail(token));
    }

    private String extractEmail(String token) {
        token = token.substring(7);
        return jwtUtil.extractEmail(token);
    }
}
