import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getProduct, addToCart } from '../api/medusa';
import { useCart } from '../cart/cart-context';
import { getVariantPrice } from '../utils/priceFormatter';

export default function ProductDetails() {
  const { id } = useParams();
  const { cart, setCart } = useCart();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    getProduct(id).then(setProduct);
  }, [id]);

  if (!product) return <div className="p-6">Loading product…</div>;
  if (!cart) return <div className="p-6">Initializing cart…</div>;

  const variant = product.variants?.[0];
  const price = getVariantPrice(variant);
  console.log('product price', price);

  if (!variant) {
    return <div className="p-6">No variants available</div>;
  }

  async function handleAddToCart() {
    try {
      setLoading(true);
      console.log('adding to cart', variant.id, cart.id);
      const updatedCart = await addToCart(cart.id, variant.id, 1);
      setCart(updatedCart);
      alert('Added to cart');
    } catch (err) {
      console.error(err);
      alert(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="p-6 grid grid-cols-2 gap-8">
      <img src={product.thumbnail} alt={product.title} className="border" />

      <div>
        <h1 className="text-3xl">{product.title}</h1>
        <p className="mt-4 opacity-80">{product.description}</p>
        <h3 className="">
          {price !== null
            ? `₹ ${price.toLocaleString('en-IN')}`
            : 'Price unavailable'}
        </h3>
        <button
          className="mt-6 px-6 py-2 border disabled:opacity-50"
          disabled={loading}
          onClick={handleAddToCart}
        >
          {loading ? 'Adding…' : 'Add to Cart'}
        </button>
      </div>
    </div>
  );
}
