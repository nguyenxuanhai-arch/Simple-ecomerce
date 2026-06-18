package com.example.ecommerce.cart;

import com.example.ecommerce.cart.dto.AddCartItemRequest;
import com.example.ecommerce.cart.dto.CartItemResponse;
import com.example.ecommerce.cart.dto.CartResponse;
import com.example.ecommerce.cart.dto.UpdateCartItemRequest;
import com.example.ecommerce.common.exception.BadRequestException;
import com.example.ecommerce.common.exception.ResourceNotFoundException;
import com.example.ecommerce.product.Product;
import com.example.ecommerce.product.ProductService;
import java.math.BigDecimal;
import java.util.List;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class CartService {

    private final CartItemRepository cartItemRepository;
    private final ProductService productService;

    public CartService(CartItemRepository cartItemRepository, ProductService productService) {
        this.cartItemRepository = cartItemRepository;
        this.productService = productService;
    }

    @Transactional(readOnly = true)
    public CartResponse getCart(String sessionId) {
        return buildCartResponse(sessionId, cartItemRepository.findBySessionIdOrderByCreatedAtAsc(sessionId));
    }

    @Transactional
    public CartResponse addItem(AddCartItemRequest request) {
        Product product = productService.getProductEntity(request.productId());
        CartItem item = cartItemRepository
                .findBySessionIdAndProductId(request.sessionId(), request.productId())
                .orElseGet(() -> createCartItem(request.sessionId(), product));

        int newQuantity = item.getQuantity() + request.quantity();
        ensureEnoughStock(product, newQuantity);
        item.setQuantity(newQuantity);
        cartItemRepository.save(item);
        return getCart(request.sessionId());
    }

    @Transactional
    public CartResponse updateItem(Long itemId, UpdateCartItemRequest request) {
        CartItem item = getCartItem(itemId);
        ensureEnoughStock(item.getProduct(), request.quantity());
        item.setQuantity(request.quantity());
        return getCart(item.getSessionId());
    }

    @Transactional
    public void removeItem(Long itemId) {
        if (!cartItemRepository.existsById(itemId)) {
            throw new ResourceNotFoundException("Cart item not found with id " + itemId);
        }
        cartItemRepository.deleteById(itemId);
    }

    @Transactional
    public void clearCart(String sessionId) {
        cartItemRepository.deleteBySessionId(sessionId);
    }

    @Transactional(readOnly = true)
    public List<CartItem> getCartItems(String sessionId) {
        return cartItemRepository.findBySessionIdOrderByCreatedAtAsc(sessionId);
    }

    private CartItem getCartItem(Long itemId) {
        return cartItemRepository.findById(itemId)
                .orElseThrow(() -> new ResourceNotFoundException("Cart item not found with id " + itemId));
    }

    private CartItem createCartItem(String sessionId, Product product) {
        CartItem item = new CartItem();
        item.setSessionId(sessionId);
        item.setProduct(product);
        item.setQuantity(0);
        return item;
    }

    private CartResponse buildCartResponse(String sessionId, List<CartItem> items) {
        List<CartItemResponse> itemResponses = items.stream()
                .map(CartItemResponse::from)
                .toList();
        BigDecimal totalAmount = itemResponses.stream()
                .map(CartItemResponse::subtotal)
                .reduce(BigDecimal.ZERO, BigDecimal::add);
        return new CartResponse(sessionId, itemResponses, totalAmount);
    }

    private void ensureEnoughStock(Product product, int requestedQuantity) {
        if (requestedQuantity > product.getStock()) {
            throw new BadRequestException("Requested quantity exceeds product stock");
        }
    }
}
