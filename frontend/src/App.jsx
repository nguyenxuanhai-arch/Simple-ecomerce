import { useCallback, useEffect, useMemo, useState } from "react";
import TopNav from "./components/TopNav";
import { getApiError } from "./api/client";
import {
  addCartItem,
  clearCart,
  createOrder,
  createProduct,
  deleteProduct,
  generateSystemLoad,
  getCart,
  getOrders,
  getProducts,
  getSystemHealth,
  getSystemInfo,
  getSystemVersion,
  removeCartItem,
  updateCartItem,
  updateOrderStatus,
  updateProduct,
} from "./api/ecommerceApi";
import AdminPage, { emptyProductForm } from "./pages/AdminPage";
import CartPage from "./pages/CartPage";
import CheckoutPage from "./pages/CheckoutPage";
import ProductDetailPage from "./pages/ProductDetailPage";
import ProductListPage from "./pages/ProductListPage";
import SystemPage from "./pages/SystemPage";

const sessionStorageKey = "simple-ecommerce-session-id";

function getSessionId() {
  const existing = localStorage.getItem(sessionStorageKey);
  if (existing) {
    return existing;
  }
  const next = `demo-${crypto.randomUUID()}`;
  localStorage.setItem(sessionStorageKey, next);
  return next;
}

function normalizeProductPayload(form) {
  return {
    name: form.name.trim(),
    description: form.description.trim(),
    price: Number(form.price),
    imageUrl: form.imageUrl.trim(),
    stock: Number(form.stock),
  };
}

export default function App() {
  const [currentView, setCurrentView] = useState("products");
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [cart, setCart] = useState({ sessionId: "", items: [], totalAmount: 0 });
  const [selectedProductId, setSelectedProductId] = useState(null);
  const [checkoutForm, setCheckoutForm] = useState({
    customerName: "Nguyen Van A",
    phone: "0900000000",
    address: "TP.HCM",
  });
  const [productForm, setProductForm] = useState(emptyProductForm);
  const [editingProductId, setEditingProductId] = useState(null);
  const [lastOrder, setLastOrder] = useState(null);
  const [systemInfo, setSystemInfo] = useState(null);
  const [systemHealth, setSystemHealth] = useState(null);
  const [systemVersion, setSystemVersion] = useState(null);
  const [systemLoad, setSystemLoad] = useState(null);
  const [loading, setLoading] = useState({ products: false, system: false });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const sessionId = useMemo(getSessionId, []);
  const selectedProduct = products.find((product) => product.id === selectedProductId);

  const showError = useCallback((exception) => {
    setError(getApiError(exception));
    setSuccess("");
  }, []);

  const showSuccess = useCallback((message) => {
    setSuccess(message);
    setError("");
  }, []);

  const loadProducts = useCallback(async () => {
    setLoading((state) => ({ ...state, products: true }));
    try {
      setProducts(await getProducts());
      setError("");
    } catch (exception) {
      showError(exception);
    } finally {
      setLoading((state) => ({ ...state, products: false }));
    }
  }, [showError]);

  const loadCart = useCallback(async () => {
    try {
      setCart(await getCart(sessionId));
    } catch (exception) {
      showError(exception);
    }
  }, [sessionId, showError]);

  const loadOrders = useCallback(async () => {
    try {
      setOrders(await getOrders());
    } catch (exception) {
      showError(exception);
    }
  }, [showError]);

  const loadSystem = useCallback(async () => {
    setLoading((state) => ({ ...state, system: true }));
    try {
      const [info, health, version] = await Promise.all([
        getSystemInfo(),
        getSystemHealth(),
        getSystemVersion(),
      ]);
      setSystemInfo(info);
      setSystemHealth(health);
      setSystemVersion(version);
      setError("");
    } catch (exception) {
      showError(exception);
    } finally {
      setLoading((state) => ({ ...state, system: false }));
    }
  }, [showError]);

  useEffect(() => {
    loadProducts();
    loadCart();
    loadSystem();
  }, [loadCart, loadProducts, loadSystem]);

  useEffect(() => {
    if (currentView === "admin") {
      loadOrders();
    }
    if (currentView === "system") {
      loadSystem();
    }
  }, [currentView, loadOrders, loadSystem]);

  async function handleAddToCart(product) {
    try {
      const nextCart = await addCartItem({
        sessionId,
        productId: product.id,
        quantity: 1,
      });
      setCart(nextCart);
      showSuccess(`${product.name} added to cart`);
    } catch (exception) {
      showError(exception);
    }
  }

  async function handleQuantityChange(item, quantity) {
    if (!Number.isFinite(quantity) || quantity < 1) {
      return;
    }
    try {
      setCart(await updateCartItem(item.id, { quantity }));
      setSuccess("");
    } catch (exception) {
      showError(exception);
    }
  }

  async function handleRemoveItem(itemId) {
    try {
      await removeCartItem(itemId);
      await loadCart();
      showSuccess("Item removed");
    } catch (exception) {
      showError(exception);
    }
  }

  async function handleClearCart() {
    try {
      await clearCart(sessionId);
      await loadCart();
      showSuccess("Cart cleared");
    } catch (exception) {
      showError(exception);
    }
  }

  async function handleCheckoutSubmit(event) {
    event.preventDefault();
    try {
      const order = await createOrder({ sessionId, ...checkoutForm });
      setLastOrder(order);
      await Promise.all([loadCart(), loadProducts(), loadOrders()]);
      showSuccess(`Order #${order.orderId} created`);
    } catch (exception) {
      showError(exception);
    }
  }

  async function handleProductSubmit(event) {
    event.preventDefault();
    const payload = normalizeProductPayload(productForm);
    try {
      if (editingProductId) {
        await updateProduct(editingProductId, payload);
        showSuccess("Product updated");
      } else {
        await createProduct(payload);
        showSuccess("Product created");
      }
      setProductForm(emptyProductForm);
      setEditingProductId(null);
      await loadProducts();
    } catch (exception) {
      showError(exception);
    }
  }

  function handleEditProduct(product) {
    setEditingProductId(product.id);
    setProductForm({
      name: product.name || "",
      description: product.description || "",
      price: product.price || "",
      imageUrl: product.imageUrl || "",
      stock: product.stock ?? "",
    });
  }

  async function handleDeleteProduct(productId) {
    try {
      await deleteProduct(productId);
      await loadProducts();
      showSuccess("Product deleted");
    } catch (exception) {
      showError(exception);
    }
  }

  async function handleUpdateOrderStatus(orderId, status) {
    try {
      await updateOrderStatus(orderId, status);
      await loadOrders();
      showSuccess("Order status updated");
    } catch (exception) {
      showError(exception);
    }
  }

  async function handleGenerateLoad() {
    try {
      setSystemLoad(await generateSystemLoad(3000));
      await loadSystem();
    } catch (exception) {
      showError(exception);
    }
  }

  function renderCurrentView() {
    if (selectedProduct) {
      return (
        <ProductDetailPage
          product={selectedProduct}
          onBack={() => setSelectedProductId(null)}
          onAddToCart={handleAddToCart}
        />
      );
    }

    if (currentView === "cart") {
      return (
        <CartPage
          cart={cart}
          error={error}
          success={success}
          onQuantityChange={handleQuantityChange}
          onRemoveItem={handleRemoveItem}
          onClearCart={handleClearCart}
          onCheckout={() => setCurrentView("checkout")}
        />
      );
    }

    if (currentView === "checkout") {
      return (
        <CheckoutPage
          cart={cart}
          form={checkoutForm}
          error={error}
          success={success}
          order={lastOrder}
          onFormChange={(field, value) => setCheckoutForm((form) => ({ ...form, [field]: value }))}
          onSubmit={handleCheckoutSubmit}
          onViewOrder={() => setCurrentView("admin")}
        />
      );
    }

    if (currentView === "admin") {
      return (
        <AdminPage
          products={products}
          orders={orders}
          form={productForm}
          editingId={editingProductId}
          error={error}
          success={success}
          onFormChange={(field, value) => setProductForm((form) => ({ ...form, [field]: value }))}
          onSubmit={handleProductSubmit}
          onEdit={handleEditProduct}
          onCancelEdit={() => {
            setEditingProductId(null);
            setProductForm(emptyProductForm);
          }}
          onDelete={handleDeleteProduct}
          onRefresh={() => {
            loadProducts();
            loadOrders();
          }}
          onUpdateOrderStatus={handleUpdateOrderStatus}
        />
      );
    }

    if (currentView === "system") {
      return (
        <SystemPage
          info={systemInfo}
          health={systemHealth}
          version={systemVersion}
          loadResult={systemLoad}
          loading={loading.system}
          error={error}
          onRefresh={loadSystem}
          onGenerateLoad={handleGenerateLoad}
        />
      );
    }

    return (
      <ProductListPage
        products={products}
        loading={loading.products}
        error={error}
        onRefresh={loadProducts}
        onSelectProduct={setSelectedProductId}
        onAddToCart={handleAddToCart}
      />
    );
  }

  return (
    <div className="app-shell">
      <TopNav currentView={currentView} onChangeView={(view) => {
        setSelectedProductId(null);
        setCurrentView(view);
      }} cart={cart} />
      <main className="app-main">{renderCurrentView()}</main>
    </div>
  );
}
