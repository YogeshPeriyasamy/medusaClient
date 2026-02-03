import { useState } from 'react';
import { useParams, useLocation } from 'react-router-dom';
import { addToCart } from '../api/medusa';
import { useCart } from '../cart/cart-context';
import { getVariantPrice } from '../utils/priceFormatter';
import checkIcon from '../../assets/icons/checkIcon.png';
import arrowDown from '../../assets/icons/arrow_down.png';
import arrowUp from '../../assets/icons/arrow_up.png';

export default function ProductDetails() {
  const { id } = useParams();
  const { cart, setCart } = useCart();
  const [loading, setLoading] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const [showFullDescription, setShowFullDescription] = useState(false);
  const [selectedVariantIndex, setSelectedVariantIndex] = useState(0);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const location = useLocation();
  const { product } = location.state || {};
  console.log("product", product);

  if (!product) return <div className="min-h-screen flex items-center justify-center text-gray-600">Loading product…</div>;
  if (!cart) return <div className="min-h-screen flex items-center justify-center text-gray-600">Initializing cart…</div>;

  const variants = product.variants || [];
  const selectedVariant = variants[selectedVariantIndex];
  const price = getVariantPrice(selectedVariant);
  const highlights = product.highlights || [];

  // Get images: use variant images if available, otherwise use product images
  const variantImages = selectedVariant?.images || [];
  const productImages = product.images || [];
  const images = variantImages.length > 0 ? variantImages : productImages;
  const currentImage = images[currentImageIndex]?.url || product.thumbnail || 'https://via.placeholder.com/600x600/F3F4F6/6B7280?text=No+Image';

  // Check if description needs truncation
  const description = product.description || '';
  const maxChars = 300;
  const needsTruncation = description.length > maxChars;
  const displayedDescription = showFullDescription ? description : description.slice(0, maxChars);

  if (!selectedVariant) {
    return <div className="min-h-screen flex items-center justify-center text-gray-600">No variants available</div>;
  }

  async function handleAddToCart() {
    try {
      setLoading(true);
      const updatedCart = await addToCart(cart.id, selectedVariant.id, quantity);
      setCart(updatedCart);
      alert('Added to cart');
    } catch (err) {
      console.error(err);
      alert(err.message);
    } finally {
      setLoading(false);
    }
  }

  const decreaseQuantity = () => {
    if (quantity > 1) setQuantity(quantity - 1);
  };

  const increaseQuantity = () => {
    setQuantity(quantity + 1);
  };

  const handleVariantChange = (index) => {
    setSelectedVariantIndex(index);
    setCurrentImageIndex(0); // Reset image index when variant changes
  };

  const goToPreviousImage = () => {
    setCurrentImageIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  const goToNextImage = () => {
    setCurrentImageIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };

  return (
    <div className="min-h-screen bg-[#F8F7F7]">
      <div className="max-w-7xl mx-auto px-4 py-8 lg:py-12">
        <div className="flex flex-col lg:flex-row gap-8 lg:gap-16">

          {/* Product Image Section with Navigation */}
          <div className="lg:w-1/2">
            <div className="relative bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl p-8 flex items-center justify-center aspect-square">
              {/* Left Arrow */}
              {images.length > 1 && (
                <button
                  onClick={goToPreviousImage}
                  className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 flex items-center justify-center bg-white rounded-full shadow-md hover:bg-gray-100 transition-colors z-10"
                  aria-label="Previous image"
                >
                  <svg className="w-5 h-5 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                </button>
              )}

              {/* Product Image */}
              <img
                src={currentImage}
                alt={product.title}
                className="max-w-full max-h-full object-contain"
              />

              {/* Right Arrow */}
              {images.length > 1 && (
                <button
                  onClick={goToNextImage}
                  className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 flex items-center justify-center bg-white rounded-full shadow-md hover:bg-gray-100 transition-colors z-10"
                  aria-label="Next image"
                >
                  <svg className="w-5 h-5 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              )}

              {/* Image Indicators */}
              {images.length > 1 && (
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
                  {images.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentImageIndex(index)}
                      className={`w-2 h-2 rounded-full transition-colors ${index === currentImageIndex ? 'bg-[#226A73]' : 'bg-gray-300'
                        }`}
                      aria-label={`Go to image ${index + 1}`}
                    />
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Product Info Section */}
          <div className="lg:w-1/2 flex flex-col">
            {/* Title */}
            <h1 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-4">
              {product.title}
            </h1>

            {/* Description with Show More/Less */}
            {description && (
              <div className="mb-6">
                <p className="text-gray-600 text-sm lg:text-base leading-relaxed" style={{
                  display: '-webkit-box',
                  WebkitLineClamp: showFullDescription ? 'unset' : 5,
                  WebkitBoxOrient: 'vertical',
                  overflow: showFullDescription ? 'visible' : 'hidden'
                }}>
                  {displayedDescription}
                  {!showFullDescription && needsTruncation && '...'}
                </p>
                {needsTruncation && (
                  <button
                    onClick={() => setShowFullDescription(!showFullDescription)}
                    className="flex items-center gap-2 mt-2 text-[#226A73] hover:text-[#1a5359] transition-colors"
                  >
                    <span className="text-sm font-medium">
                      {showFullDescription ? 'Show less' : 'Show more'}
                    </span>
                    <img
                      src={showFullDescription ? arrowUp : arrowDown}
                      alt=""
                      className="w-4 h-4"
                    />
                  </button>
                )}
              </div>
            )}

            {/* Price */}
            <div className="mb-6">
              <span className="text-2xl lg:text-3xl font-bold text-gray-900">
                {price !== null
                  ? `₹${price.toLocaleString('en-IN')}`
                  : 'Price unavailable'}
              </span>
            </div>

            {/* Variant Selection */}
            {variants.length > 1 && (
              <div className="mb-6">
                <h3 className="text-sm font-medium text-gray-900 mb-3">
                  Select Variant
                </h3>
                <div className="flex flex-wrap gap-2">
                  {variants.map((variant, index) => (
                    <button
                      key={variant.id}
                      onClick={() => handleVariantChange(index)}
                      className={`px-4 py-2 rounded-lg border-2 font-medium text-sm transition-all ${selectedVariantIndex === index
                        ? 'border-[#226A73] bg-[#226A73] text-white'
                        : 'border-gray-300 bg-white text-gray-700 hover:border-gray-400'
                        }`}
                    >
                      {variant.title}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Quantity Selector */}
            <div className="mb-6">
              <h3 className="text-sm font-medium text-gray-900 mb-3">Quantity</h3>
              <div className="flex items-center gap-4">
                <div className="flex items-center border border-gray-300 rounded-lg">
                  <button
                    onClick={decreaseQuantity}
                    className="w-10 h-10 flex items-center justify-center text-gray-600 hover:bg-gray-100 transition-colors rounded-l-lg"
                    disabled={quantity <= 1}
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
                    </svg>
                  </button>
                  <span className="w-12 text-center font-medium text-gray-900">{quantity}</span>
                  <button
                    onClick={increaseQuantity}
                    className="w-10 h-10 flex items-center justify-center text-gray-600 hover:bg-gray-100 transition-colors rounded-r-lg"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>

            {/* Add to Cart Button */}
            <button
              className="w-full lg:w-auto px-8 py-4 bg-[#226A73] text-white font-semibold rounded-lg hover:bg-[#1a5359] transition-colors disabled:opacity-50 disabled:cursor-not-allowed mb-8"
              disabled={loading}
              onClick={handleAddToCart}
            >
              {loading ? 'Adding…' : 'Add to Cart'}
            </button>

            {/* Product Highlights */}
            {highlights.length > 0 && (
              <div className="border-t border-gray-200 pt-6">
                <h3 className="text-sm font-semibold text-gray-900 mb-4">Product Highlights</h3>
                <ul className="space-y-3">
                  {highlights.map((highlight, index) => (
                    <li key={index} className="flex items-start gap-3">
                      <span className="flex-shrink-0 flex items-center justify-center w-5 h-5 bg-[#226A73] rounded-full mt-0.5">
                        <img src={checkIcon} alt="" className="w-3 h-3" />
                      </span>
                      <span className="text-sm text-gray-700 leading-relaxed">{highlight}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
