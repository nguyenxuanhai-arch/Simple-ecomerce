import { ImageOff } from "lucide-react";

const fallbackImages = [
  "https://images.unsplash.com/photo-1587829741301-dc798b83add3?auto=format&fit=crop&w=800&q=80",
  "https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7?auto=format&fit=crop&w=800&q=80",
  "https://images.unsplash.com/photo-1625842268584-8f3296236761?auto=format&fit=crop&w=800&q=80",
  "https://images.unsplash.com/photo-1619953942547-233eab5a70d6?auto=format&fit=crop&w=800&q=80",
  "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=800&q=80",
  "https://images.unsplash.com/photo-1616627981671-b998f9238352?auto=format&fit=crop&w=800&q=80",
];

function pickFallback(product) {
  const id = Number(product?.id || 1);
  return fallbackImages[(id - 1) % fallbackImages.length];
}

export default function ProductImage({ product, compact = false }) {
  const imageUrl = product?.imageUrl?.includes("example.com")
    ? pickFallback(product)
    : product?.imageUrl || pickFallback(product);

  return (
    <div className={compact ? "product-image product-image--compact" : "product-image"}>
      {imageUrl ? (
        <img
          src={imageUrl}
          alt={product?.name || "Product"}
          loading="lazy"
          onError={(event) => {
            event.currentTarget.style.display = "none";
            event.currentTarget.nextElementSibling?.classList.remove("is-hidden");
          }}
        />
      ) : null}
      <div className="product-image__fallback is-hidden">
        <ImageOff size={compact ? 20 : 28} />
      </div>
    </div>
  );
}
