import { useCart } from '../cart/cart-context';
import { updateLineItem, removeLineItem } from '../api/medusa';
import { Link } from 'react-router-dom';

export default function Cart() {
  const { cart, setCart } = useCart();

  if (!cart) return <div className="p-6">Loading cart…</div>;

  const subtotal = cart.items.reduce(
    (sum, item) => sum + item.unit_price * item.quantity,
    0
  );

  return (
    <div className="px-[100px] py-[50px] bg-[#F8F7F7] min-h-screen">
      <h1 className="text-3xl mb-8 font-bold">Cart</h1>

      {cart.items.length === 0 ? (
        <p>Your cart is empty.</p>
      ) : (
        <>
          {cart.items.map((item) => (
            <div key={item.id} className="flex justify-between mb-4">
              <div>
                <div>{item.title}</div>
                <div className="opacity-70">
                  {/* ₹ {(item.unit_price / 100).toLocaleString('en-IN')} */}
                  ₹ {item.unit_price.toLocaleString('en-IN')}
                </div>
              </div>

              <input
                type="number"
                className='border px-3 rounded-md'
                min={1}
                value={item.quantity}
                onChange={(e) =>
                  updateLineItem(cart.id, item.id, +e.target.value).then(
                    setCart
                  )
                }
              />

              <button
                onClick={() => removeLineItem(cart.id, item.id).then(setCart)}
              >
                Remove
              </button>
            </div>
          ))}

          <hr className="my-6" />

          <div className="flex justify-between text-xl">
            <span>Total</span>
            <span>₹ {subtotal.toLocaleString('en-IN')}</span>
            {/* <span>₹ {(subtotal / 100).toLocaleString('en-IN')}</span> */}
          </div>

          <div className="mt-8">
            <Link
              to="/checkout"
              className="px-8 py-4 bg-[#226A73] text-white font-semibold rounded-lg hover:bg-[#1a5359] transition-colors inline-block"
            >
              Proceed to Checkout
            </Link>
          </div>
        </>
      )}
    </div>
  );
}
