import { useCart } from '../cart/cart-context';
import {
  completeOrder,
  setCartEmail,
  setShippingAddress,
  addShippingMethod,
} from '../api/medusa';

export default function Checkout() {
  const { cart, setCart } = useCart();

  async function placeOrder() {
    try {
      let updatedCart;

      updatedCart = await setCartEmail(cart.id, 'test@example.com');
      updatedCart = await setShippingAddress(cart.id, {
        first_name: 'Test',
        last_name: 'User',
        address_1: 'Test Street',
        city: 'Chennai',
        country_code: 'in',
        postal_code: '600001',
        phone: '9999999999',
      });

      updatedCart = await addShippingMethod(
        cart.id,
        import.meta.env.VITE_MEDUSA_SHIPPING_OPTION_ID
      );

      const order = await completeOrder(cart.id);

      console.log('ORDER CREATED', order);
      alert('Order placed successfully');
      setCart(null);
    } catch (err) {
      console.error(err);
      alert('Checkout failed');
    }
  }
  return (
    <div className="p-12 max-w-xl">
      <h1 className="text-3xl mb-8">Checkout</h1>

      <input placeholder="Email" className="block w-full mb-4 p-2" />
      <input placeholder="Phone" className="block w-full mb-4 p-2" />
      <input placeholder="Address" className="block w-full mb-4 p-2" />

      <button className="border px-6 py-3" onClick={() => placeOrder()}>
        Place Order
      </button>
    </div>
  );
}
