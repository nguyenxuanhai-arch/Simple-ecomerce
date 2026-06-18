package com.example.ecommerce.order.dto;

import com.example.ecommerce.order.OrderStatus;
import java.math.BigDecimal;

public record OrderCreatedResponse(
        Long orderId,
        OrderStatus status,
        BigDecimal totalAmount
) {
}
