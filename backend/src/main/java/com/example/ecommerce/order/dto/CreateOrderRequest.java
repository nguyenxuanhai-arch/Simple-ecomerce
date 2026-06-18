package com.example.ecommerce.order.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record CreateOrderRequest(
        @NotBlank(message = "Session id is required")
        String sessionId,

        @NotBlank(message = "Customer name is required")
        @Size(max = 255, message = "Customer name must be at most 255 characters")
        String customerName,

        @NotBlank(message = "Phone is required")
        @Size(max = 50, message = "Phone must be at most 50 characters")
        String phone,

        @NotBlank(message = "Address is required")
        @Size(max = 500, message = "Address must be at most 500 characters")
        String address
) {
}
