import { CheckCircle2 } from "lucide-react";
import EmptyState from "../components/EmptyState";
import StatusMessage from "../components/StatusMessage";
import { formatCurrency } from "../utils/format";

export default function CheckoutPage({
  cart,
  form,
  error,
  success,
  order,
  onFormChange,
  onSubmit,
  onViewOrder,
}) {
  const items = cart?.items || [];

  return (
    <section className="checkout-grid">
      <div className="section-stack">
        <div className="section-heading">
          <div>
            <h1>Checkout</h1>
            <p>{formatCurrency(cart?.totalAmount || 0)}</p>
          </div>
        </div>

        <StatusMessage error={error} success={success} />

        {items.length === 0 ? (
          <EmptyState title="No items to checkout" />
        ) : (
          <form className="form-panel" onSubmit={onSubmit}>
            <label>
              Customer name
              <input
                value={form.customerName}
                onChange={(event) => onFormChange("customerName", event.target.value)}
                required
              />
            </label>
            <label>
              Phone
              <input
                value={form.phone}
                onChange={(event) => onFormChange("phone", event.target.value)}
                required
              />
            </label>
            <label>
              Address
              <textarea
                rows="4"
                value={form.address}
                onChange={(event) => onFormChange("address", event.target.value)}
                required
              />
            </label>
            <button type="submit" className="primary-button">
              Create order
            </button>
          </form>
        )}
      </div>

      <aside className="summary-panel summary-panel--wide">
        <span>Items</span>
        <div className="mini-lines">
          {items.map((item) => (
            <div key={item.id}>
              <span>{item.productName}</span>
              <strong>{item.quantity} x {formatCurrency(item.price)}</strong>
            </div>
          ))}
        </div>
        <strong>{formatCurrency(cart?.totalAmount || 0)}</strong>
        {order ? (
          <button type="button" className="ghost-button" onClick={onViewOrder}>
            <CheckCircle2 size={18} />
            <span>Order #{order.orderId}</span>
          </button>
        ) : null}
      </aside>
    </section>
  );
}
