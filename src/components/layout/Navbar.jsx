import { Link } from "react-router-dom";
import { useCart } from "../../cart/cart-context";

export default function Navbar() {
  const { cart } = useCart();

  const count =
    cart?.items?.reduce((sum, i) => sum + i.quantity, 0) || 0;

  return (
    <header className="flex justify-between items-center p-4 border-b">
      <Link to="/" className="text-xl font-semibold">
        TOYAMA
      </Link>

      <Link to="/cart" className="relative">
        🛒
        {count > 0 && (
          <span className="absolute -top-2 -right-2 bg-white text-black text-xs px-2 rounded-full">
            {count}
          </span>
        )}
      </Link>
    </header>
  );
}
