package com.example.ecommerce.product.dto;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.PositiveOrZero;
import jakarta.validation.constraints.Size;
import java.math.BigDecimal;

public record ProductRequest(
        @NotBlank(message = "Product name is required")
        @Size(max = 255, message = "Product name must be at most 255 characters")
        String name,

        String description,

        @NotNull(message = "Product price is required")
        @DecimalMin(value = "0.01", message = "Product price must be greater than 0")
        BigDecimal price,

        @Size(max = 1000, message = "Image URL must be at most 1000 characters")
        String imageUrl,

        @NotNull(message = "Product stock is required")
        @PositiveOrZero(message = "Product stock must be zero or greater")
        Integer stock
) {
}
