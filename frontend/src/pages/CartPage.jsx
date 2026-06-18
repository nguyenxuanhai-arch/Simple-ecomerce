import { Minus, Plus, Trash2 } from "lucide-react";
import EmptyState from "../components/EmptyState";
import ProductImage from "../components/ProductImage";
import StatusMessage from "../components/StatusMessage";
import { formatCurrency } from "../utils/format";

export default function CartPage({
  cart,
  error,
  success,
  onQuantityChange,
  onRemoveItem,
  onClearCart,
  onCheckout,
}) {
  const items = cart?.items || [];

  return (
    <section className="section-stack">
      <div className="section-heading">
        <div>
          <h1>Cart</h1>
          <p>{items.length} lines</p>
        </div>
        <button type="button" className="ghost-button" onClick={onClearCart} disabled={items.length === 0}>
          Clear
        </button>
      </div>

      <StatusMessage error={error} success={success} />

      {items.length === 0 ? (
        <EmptyState title="Cart is empty" />
      ) : (
        <div className="cart-layout">
          <div className="line-list">
            {items.map((item) => (
              <article key={item.id} className="line-item">
                <ProductImage product={{ id: item.productId, name: item.productName }} compact />
                <div className="line-item__main">
                  <strong>{item.productName}</strong>
                  <span>{formatCurrency(item.price)}</span>
                </div>
                <div className="quantity-control">
                  <button
                    type="button"
                    className="icon-button"
                    onClick={() => onQuantityChange(item, item.quantity - 1)}
                    disabled={item.quantity <= 1}
                    title="Decrease quantity"
                  >
                    <Minus size={16} />
                  </button>
                  <input
                    type="number"
                    min="1"
                    value={item.quantity}
                    onChange={(event) => onQuantityChange(item, Number(event.target.value))}
                  />
                  <button
                    type="button"
                    className="icon-button"
                    onClick={() => onQuantityChange(item, item.quantity + 1)}
                    title="Increase quantity"
                  >
                    <Plus size={16} />
                  </button>
                </div>
                <strong className="line-total">{formatCurrency(item.subtotal)}</strong>
                <button
                  type="button"
                  className="icon-button icon-button--danger"
                  onClick={() => onRemoveItem(item.id)}
                  title="Remove item"
                >
                  <Trash2 size={18} />
                </button>
              </article>
            ))}
          </div>
          <aside className="summary-panel">
            <span>Total</span>
            <strong>{formatCurrency(cart.totalAmount)}</strong>
            <button type="button" className="primary-button" onClick={onCheckout}>
              Checkout
            </button>
          </aside>
        </div>
      )}
    </section>
  );
}
