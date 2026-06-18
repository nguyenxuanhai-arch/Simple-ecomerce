import { Activity, Boxes, ClipboardList, Home, Settings, ShoppingCart } from "lucide-react";
import { formatCurrency } from "../utils/format";

const navItems = [
  { id: "products", label: "Products", icon: Home },
  { id: "cart", label: "Cart", icon: ShoppingCart },
  { id: "checkout", label: "Checkout", icon: ClipboardList },
  { id: "admin", label: "Admin", icon: Settings },
  { id: "system", label: "System", icon: Activity },
];

export default function TopNav({ currentView, onChangeView, cart }) {
  const totalItems = cart?.items?.reduce((sum, item) => sum + item.quantity, 0) || 0;

  return (
    <header className="app-header">
      <div className="brand">
        <Boxes size={24} />
        <div>
          <strong>Simple E-commerce</strong>
          <span>Kubernetes demo workload</span>
        </div>
      </div>
      <nav className="top-nav" aria-label="Main navigation">
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <button
              key={item.id}
              type="button"
              className={currentView === item.id ? "nav-button nav-button--active" : "nav-button"}
              onClick={() => onChangeView(item.id)}
              title={item.label}
            >
              <Icon size={18} />
              <span>{item.label}</span>
            </button>
          );
        })}
      </nav>
      <button
        type="button"
        className="cart-summary"
        onClick={() => onChangeView("cart")}
        title="Cart"
      >
        <ShoppingCart size={18} />
        <span>{totalItems}</span>
        <strong>{formatCurrency(cart?.totalAmount || 0)}</strong>
      </button>
    </header>
  );
}
