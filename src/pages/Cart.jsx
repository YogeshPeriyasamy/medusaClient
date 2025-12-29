import { useCart } from '../cart/cart-context';
import { updateLineItem, removeLineItem, getCart } from '../api/medusa';
import { Link } from 'react-router-dom';

export default function Cart() {
  const { cart, setCart } = useCart();

  if (!cart) {
    return <div className="p-6">Loading cart…</div>;
  }

  return (
    <div className="p-12">
      <h1 className="text-3xl mb-8">Cart</h1>

      {cart.items.length === 0 ? (
        <p>Your cart is empty.</p>
      ) : (
        <>
          {cart.items.map((item) => (
            <div key={item.id} className="flex justify-between mb-4">
              <span>{item.title}</span>

              <input
                type="number"
                min={1}
                value={item.quantity}
                onChange={(e) =>
                  updateLineItem(cart.id, item.id, +e.target.value)
                    .then(() => getCart(cart.id))
                    .then(setCart)
                }
              />

              <button
                onClick={() =>
                  removeLineItem(cart.id, item.id)
                    .then(() => getCart(cart.id))
                    .then(setCart)
                }
              >
                Remove
              </button>
            </div>
          ))}

          <div className="mt-8">
            <Link to="/checkout" className="px-6 py-3 border inline-block">
              Proceed to Checkout
            </Link>
          </div>
        </>
      )}
    </div>
  );
}
