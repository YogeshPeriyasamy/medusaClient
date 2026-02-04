import { useState } from 'react';
import { useCart } from '../cart/cart-context';
import {
  completeOrder,
  setCartEmail,
  setShippingAddress,
  addShippingMethod,
  getShippingOptions,
} from '../api/medusa';

export default function Checkout() {
  const { cart, setCart } = useCart();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    phone: '',
    firstName: '',
    lastName: '',
    address: '',
    city: '',
    postalCode: '',
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  async function placeOrder() {
    try {
      setLoading(true);
      let updatedCart;

      // Step 1: Set email
      updatedCart = await setCartEmail(cart.id, formData.email || 'test@example.com');

      // Step 2: Set shipping address
      updatedCart = await setShippingAddress(cart.id, {
        first_name: formData.firstName || 'Guest',
        last_name: formData.lastName || 'User',
        address_1: formData.address || 'Test Street',
        city: formData.city || 'Chennai',
        country_code: 'in',
        postal_code: formData.postalCode || '600001',
        phone: formData.phone || '9999999999',
      });

      // Step 3: Get available shipping options for this cart
      const shippingOptions = await getShippingOptions(cart.id);

      if (!shippingOptions || shippingOptions.length === 0) {
        throw new Error('No shipping options available for your location');
      }

      // Step 4: Add the first available shipping option
      const selectedOption = shippingOptions[0];
      console.log('Using shipping option:', selectedOption.id, selectedOption.name);
      updatedCart = await addShippingMethod(cart.id, selectedOption.id);

      // Step 5: Complete the order
      const order = await completeOrder(cart.id);

      console.log('ORDER CREATED', order);
      alert('Order placed successfully! Order ID: ' + order.id);
      setCart(null);
    } catch (err) {
      console.error(err);
      alert('Checkout failed: ' + err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-[#F8F7F7] py-12 px-4">
      <div className="max-w-xl mx-auto">
        {/* Header */}
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Checkout</h1>

        {/* Form Card */}
        <div className="bg-white rounded-2xl p-8 shadow-sm">
          {/* Contact Information */}
          <div className="mb-8">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Contact Information</h2>
            <div className="space-y-4">
              <input
                type="email"
                name="email"
                placeholder="Email"
                value={formData.email}
                onChange={handleChange}
                className="block w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#226A73] focus:border-transparent transition-all"
              />
              <input
                type="tel"
                name="phone"
                placeholder="Phone Number"
                value={formData.phone}
                onChange={handleChange}
                className="block w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#226A73] focus:border-transparent transition-all"
              />
            </div>
          </div>

          {/* Shipping Address */}
          <div className="mb-8">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Shipping Address</h2>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <input
                  type="text"
                  name="firstName"
                  placeholder="First Name"
                  value={formData.firstName}
                  onChange={handleChange}
                  className="block w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#226A73] focus:border-transparent transition-all"
                />
                <input
                  type="text"
                  name="lastName"
                  placeholder="Last Name"
                  value={formData.lastName}
                  onChange={handleChange}
                  className="block w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#226A73] focus:border-transparent transition-all"
                />
              </div>
              <input
                type="text"
                name="address"
                placeholder="Address"
                value={formData.address}
                onChange={handleChange}
                className="block w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#226A73] focus:border-transparent transition-all"
              />
              <div className="grid grid-cols-2 gap-4">
                <input
                  type="text"
                  name="city"
                  placeholder="City"
                  value={formData.city}
                  onChange={handleChange}
                  className="block w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#226A73] focus:border-transparent transition-all"
                />
                <input
                  type="text"
                  name="postalCode"
                  placeholder="Postal Code"
                  value={formData.postalCode}
                  onChange={handleChange}
                  className="block w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#226A73] focus:border-transparent transition-all"
                />
              </div>
            </div>
          </div>

          {/* Place Order Button */}
          <button
            className="w-full px-8 py-4 bg-[#226A73] text-white font-semibold rounded-lg hover:bg-[#1a5359] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            onClick={() => placeOrder()}
            disabled={loading}
          >
            {loading ? 'Processing...' : 'Place Order'}
          </button>
        </div>
      </div>
    </div>
  );
}
