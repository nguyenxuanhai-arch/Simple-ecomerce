package com.example.ecommerce.cart;

import java.util.List;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CartItemRepository extends JpaRepository<CartItem, Long> {

    List<CartItem> findBySessionIdOrderByCreatedAtAsc(String sessionId);

    Optional<CartItem> findBySessionIdAndProductId(String sessionId, Long productId);

    void deleteBySessionId(String sessionId);
}
