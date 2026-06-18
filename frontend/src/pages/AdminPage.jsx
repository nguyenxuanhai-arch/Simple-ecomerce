import { RefreshCw, Save, Trash2 } from "lucide-react";
import StatusMessage from "../components/StatusMessage";
import { formatCurrency, formatDateTime } from "../utils/format";

const emptyProductForm = {
  name: "",
  description: "",
  price: "",
  imageUrl: "",
  stock: "",
};

export { emptyProductForm };

export default function AdminPage({
  products,
  orders,
  form,
  editingId,
  error,
  success,
  onFormChange,
  onSubmit,
  onEdit,
  onCancelEdit,
  onDelete,
  onRefresh,
  onUpdateOrderStatus,
}) {
  return (
    <section className="admin-layout">
      <div className="section-stack">
        <div className="section-heading">
          <div>
            <h1>Admin Products</h1>
            <p>{products.length} products</p>
          </div>
          <button type="button" className="icon-button" onClick={onRefresh} title="Refresh admin data">
            <RefreshCw size={18} />
          </button>
        </div>

        <StatusMessage error={error} success={success} />

        <form className="form-panel" onSubmit={onSubmit}>
          <div className="form-row">
            <label>
              Name
              <input
                value={form.name}
                onChange={(event) => onFormChange("name", event.target.value)}
                required
              />
            </label>
            <label>
              Price
              <input
                type="number"
                min="1"
                value={form.price}
                onChange={(event) => onFormChange("price", event.target.value)}
                required
              />
            </label>
            <label>
              Stock
              <input
                type="number"
                min="0"
                value={form.stock}
                onChange={(event) => onFormChange("stock", event.target.value)}
                required
              />
            </label>
          </div>
          <label>
            Image URL
            <input
              value={form.imageUrl}
              onChange={(event) => onFormChange("imageUrl", event.target.value)}
            />
          </label>
          <label>
            Description
            <textarea
              rows="3"
              value={form.description}
              onChange={(event) => onFormChange("description", event.target.value)}
            />
          </label>
          <div className="button-row">
            <button type="submit" className="primary-button">
              <Save size={18} />
              <span>{editingId ? "Update" : "Create"}</span>
            </button>
            {editingId ? (
              <button type="button" className="ghost-button" onClick={onCancelEdit}>
                Cancel
              </button>
            ) : null}
          </div>
        </form>

        <div className="table-shell">
          <table>
            <thead>
              <tr>
                <th>Name</th>
                <th>Price</th>
                <th>Stock</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {products.map((product) => (
                <tr key={product.id}>
                  <td>
                    <button type="button" className="link-button" onClick={() => onEdit(product)}>
                      {product.name}
                    </button>
                  </td>
                  <td>{formatCurrency(product.price)}</td>
                  <td>{product.stock}</td>
                  <td>
                    <button
                      type="button"
                      className="icon-button icon-button--danger"
                      onClick={() => onDelete(product.id)}
                      title="Delete product"
                    >
                      <Trash2 size={17} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="section-stack">
        <div className="section-heading">
          <div>
            <h1>Orders</h1>
            <p>{orders.length} records</p>
          </div>
        </div>
        <div className="table-shell">
          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>Customer</th>
                <th>Total</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr key={order.id}>
                  <td>#{order.id}</td>
                  <td>
                    <strong>{order.customerName}</strong>
                    <span>{formatDateTime(order.createdAt)}</span>
                  </td>
                  <td>{formatCurrency(order.totalAmount)}</td>
                  <td>
                    <select
                      value={order.status}
                      onChange={(event) => onUpdateOrderStatus(order.id, event.target.value)}
                    >
                      <option value="PENDING">PENDING</option>
                      <option value="CONFIRMED">CONFIRMED</option>
                      <option value="SHIPPING">SHIPPING</option>
                      <option value="COMPLETED">COMPLETED</option>
                      <option value="CANCELLED">CANCELLED</option>
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}
