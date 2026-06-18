package com.example.ecommerce.cart.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;

public record AddCartItemRequest(
        @NotBlank(message = "Session id is required")
        String sessionId,

        @NotNull(message = "Product id is required")
        @Positive(message = "Product id must be greater than 0")
        Long productId,

        @NotNull(message = "Quantity is required")
        @Positive(message = "Quantity must be greater than 0")
        Integer quantity
) {
}
