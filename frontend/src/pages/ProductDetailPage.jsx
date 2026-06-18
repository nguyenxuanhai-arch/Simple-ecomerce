import { ArrowLeft, Plus } from "lucide-react";
import ProductImage from "../components/ProductImage";
import { formatCurrency } from "../utils/format";

export default function ProductDetailPage({ product, onBack, onAddToCart }) {
  if (!product) {
    return null;
  }

  return (
    <section className="detail-layout">
      <button type="button" className="text-button" onClick={onBack}>
        <ArrowLeft size={18} />
        <span>Products</span>
      </button>

      <div className="detail-panel">
        <ProductImage product={product} />
        <div className="detail-content">
          <span className="pill">{product.stock} in stock</span>
          <h1>{product.name}</h1>
          <p>{product.description || "No description"}</p>
          <strong>{formatCurrency(product.price)}</strong>
          <button
            type="button"
            className="primary-button"
            onClick={() => onAddToCart(product)}
            disabled={product.stock <= 0}
          >
            <Plus size={18} />
            <span>Add to cart</span>
          </button>
        </div>
      </div>
    </section>
  );
}
