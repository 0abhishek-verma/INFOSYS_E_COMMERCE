package com.infosys.project.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public class PlaceOrderRequest {

    @NotBlank(message = "Delivery address is required")
    @Size(max = 500, message = "Delivery address cannot exceed 500 characters")
    private String deliveryAddress;

    @NotBlank(message = "Payment mode is required")
    @Size(max = 60, message = "Payment mode cannot exceed 60 characters")
    private String paymentMode;

    public String getDeliveryAddress() {
        return deliveryAddress;
    }

    public void setDeliveryAddress(String deliveryAddress) {
        this.deliveryAddress = deliveryAddress;
    }

    public String getPaymentMode() {
        return paymentMode;
    }

    public void setPaymentMode(String paymentMode) {
        this.paymentMode = paymentMode;
    }
}
