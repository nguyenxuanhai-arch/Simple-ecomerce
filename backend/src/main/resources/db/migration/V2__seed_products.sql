INSERT INTO products (id, name, description, price, image_url, stock, created_at, updated_at)
VALUES
    (1, 'Mechanical Keyboard K8', 'Basic mechanical keyboard for demo customers', 890000.00, 'https://example.com/images/keyboard-k8.jpg', 20, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
    (2, 'Logitech G102 Mouse', 'Basic gaming mouse for simple product listing', 390000.00, 'https://example.com/images/logitech-g102.jpg', 50, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
    (3, 'USB-C Hub 6 in 1', 'Compact USB-C hub with HDMI, USB and card reader ports', 520000.00, 'https://example.com/images/usb-c-hub.jpg', 35, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
    (4, 'Laptop Stand Aluminum', 'Simple aluminum stand for laptop workspace setup', 450000.00, 'https://example.com/images/laptop-stand.jpg', 25, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
    (5, 'Wireless Headset H1', 'Entry-level wireless headset for study and meetings', 690000.00, 'https://example.com/images/headset-h1.jpg', 30, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
    (6, 'Desk Mat Large', 'Large desk mat for keyboard and mouse', 250000.00, 'https://example.com/images/desk-mat.jpg', 60, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
ON DUPLICATE KEY UPDATE
    name = VALUES(name),
    description = VALUES(description),
    price = VALUES(price),
    image_url = VALUES(image_url),
    stock = VALUES(stock),
    updated_at = CURRENT_TIMESTAMP;
