package com.infosys.project.service;

import com.infosys.project.model.CartItem;
import com.infosys.project.model.Order;
import com.infosys.project.model.OrderItem;
import com.infosys.project.model.Product;
import com.infosys.project.repository.CartItemRepository;
import com.infosys.project.repository.OrderRepository;
import com.infosys.project.repository.ProductRepository;
import jakarta.transaction.Transactional;
import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class OrderService {

    @Autowired
    private CartItemRepository cartItemRepository;

    @Autowired
    private OrderRepository orderRepository;

    @Autowired
    private ProductRepository productRepository;

    @Transactional
    public Order placeOrder(String userEmail) {
        List<CartItem> cartItems = cartItemRepository.findByUserEmail(userEmail);

        if (cartItems.isEmpty()) {
            throw new RuntimeException("Cart is empty");
        }

        Order order = new Order();
        order.setUserEmail(userEmail);

        BigDecimal subtotal = BigDecimal.ZERO;

        for (CartItem cartItem : cartItems) {
            Product product = productRepository.findById(cartItem.getProductId())
                    .orElseThrow(() -> new RuntimeException("Product not found"));

            int quantity = cartItem.getQuantity() == null ? 1 : cartItem.getQuantity();
            int stockQuantity = product.getStockQuantity() == null ? 0 : product.getStockQuantity();

            if (stockQuantity < quantity) {
                throw new RuntimeException(product.getName() + " does not have enough stock");
            }

            product.setStockQuantity(stockQuantity - quantity);
            productRepository.save(product);

            BigDecimal price = cartItem.getPrice() == null ? BigDecimal.ZERO : cartItem.getPrice();
            subtotal = subtotal.add(price.multiply(BigDecimal.valueOf(quantity)));

            OrderItem orderItem = new OrderItem();
            orderItem.setProductId(cartItem.getProductId());
            orderItem.setProductName(cartItem.getProductName());
            orderItem.setPrice(price);
            orderItem.setQuantity(quantity);
            orderItem.setImageUrl(cartItem.getImageUrl());
            order.addItem(orderItem);
        }

        BigDecimal discount = subtotal.multiply(BigDecimal.valueOf(0.08)).setScale(2, RoundingMode.HALF_UP);
        BigDecimal deliveryFee = subtotal.compareTo(BigDecimal.ZERO) > 0
                && subtotal.compareTo(BigDecimal.valueOf(999)) < 0
                        ? BigDecimal.valueOf(49)
                        : BigDecimal.ZERO;

        order.setSubtotal(subtotal);
        order.setDiscount(discount);
        order.setDeliveryFee(deliveryFee);
        order.setTotalAmount(subtotal.subtract(discount).add(deliveryFee));

        Order savedOrder = orderRepository.save(order);
        cartItemRepository.deleteAll(cartItems);

        return savedOrder;
    }

    public List<Order> getMyOrders(String userEmail) {
        return orderRepository.findByUserEmailOrderByCreatedAtDesc(userEmail);
    }
}
