import { Eye, Plus, RefreshCw } from "lucide-react";
import EmptyState from "../components/EmptyState";
import ProductImage from "../components/ProductImage";
import StatusMessage from "../components/StatusMessage";
import { formatCurrency } from "../utils/format";

export default function ProductListPage({
  products,
  loading,
  error,
  onRefresh,
  onSelectProduct,
  onAddToCart,
}) {
  return (
    <section className="page-grid page-grid--products">
      <div className="section-heading">
        <div>
          <h1>Products</h1>
          <p>{products.length} available items</p>
        </div>
        <button type="button" className="icon-button" onClick={onRefresh} title="Refresh products">
          <RefreshCw size={18} />
        </button>
      </div>

      <StatusMessage error={error} />

      {loading ? <div className="loading-bar" /> : null}

      {products.length === 0 && !loading ? (
        <EmptyState title="No products found" />
      ) : (
        <div className="product-grid">
          {products.map((product) => (
            <article key={product.id} className="product-card">
              <ProductImage product={product} />
              <div className="product-card__body">
                <div className="product-card__title">
                  <h2>{product.name}</h2>
                  <span>{product.stock} left</span>
                </div>
                <p>{product.description || "No description"}</p>
                <div className="product-card__footer">
                  <strong>{formatCurrency(product.price)}</strong>
                  <div className="button-row">
                    <button
                      type="button"
                      className="icon-button"
                      onClick={() => onSelectProduct(product.id)}
                      title="View detail"
                    >
                      <Eye size={18} />
                    </button>
                    <button
                      type="button"
                      className="primary-button primary-button--icon"
                      onClick={() => onAddToCart(product)}
                      disabled={product.stock <= 0}
                      title="Add to cart"
                    >
                      <Plus size={18} />
                      <span>Add</span>
                    </button>
                  </div>
                </div>
              </div>
            </article>
          ))}
        </div>
      )}
    </section>
  );
}
