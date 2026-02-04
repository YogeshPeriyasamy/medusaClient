const BASE = 'http://localhost:9000/store';
const PUBLISHABLE_KEY = import.meta.env.VITE_MEDUSA_PUBLISHABLE_KEY;
const SALES_CHANNEL_ID = import.meta.env.VITE_MEDUSA_SALES_CHANNEL_ID;
const REGION_ID = import.meta.env.VITE_MEDUSA_REGION_ID;

async function medusaFetch(path, options = {}) {
  const res = await fetch(`${BASE}${path}`, {
    headers: {
      'Content-Type': 'application/json',
      'x-publishable-api-key': PUBLISHABLE_KEY,
      ...(options.headers || {}),
    },
    ...options,
  });

  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.message || 'Medusa request failed');
  }

  return res.json();
}

export async function getCategories() {
  try {
    const data = await medusaFetch('/product-categories');
    return data.product_categories;
  } catch (error) {
    console.error('Error fetching categories:', error);
    throw error;
  }
}

export async function getProducts() {
  try {
    const data = await medusaFetch(`/products?fields=*categories,*variants,*variants.images,*variants.calculated_price&region_id=${REGION_ID}`);
    const products = data.products;

    // Fetch highlights for all products in parallel
    const productsWithHighlights = await Promise.all(
      products.map(async (product) => {
        try {
          const highlightsData = await medusaFetch(`/products/${product.id}/highlights`);
          return {
            ...product,
            highlights: highlightsData.highlights || []
          };
        } catch (error) {
          // If highlights fetch fails, return product without highlights
          return {
            ...product,
            highlights: []
          };
        }
      })
    );

    return productsWithHighlights;
  } catch (error) {
    console.error('Error fetching products:', error);
    throw error;
  }
}

// export async function getProductsByCategory(handle) {
//   try {
//     const catRes = await medusaFetch(`/product-categories?handle=${handle}`);
//     const category = catRes.product_categories?.[0];
//     if (!category) return [];

//     const data = await medusaFetch(
//       `/products?category_id[]=${category.id}` +
//       `&sales_channel_id=${SALES_CHANNEL_ID}` +
//       `&region_id=${REGION_ID}`
//     );

//     return data.products;
//   } catch (error) {
//     console.error('Error fetching products by category:', error);
//     throw error;
//   }
// }

// export async function getProduct(id) {
//   try {
//     const data = await medusaFetch(
//       `/products/${id}?fields=*variants,*variants.images,*variants.calculated_price&sales_channel_id=${import.meta.env.VITE_MEDUSA_SALES_CHANNEL_ID
//       }&region_id=${REGION_ID}`
//     );
//     return data.product;
//   } catch (error) {
//     console.error('Error fetching product:', error);
//     throw error;
//   }
// }

// create a new cart as medusa recommends that each cart is unique per id
export async function createCart() {
  try {
    const data = await medusaFetch('/carts', {
      method: 'POST',
      body: JSON.stringify({
        region_id: REGION_ID,
      }),
    });
    return data.cart;
  } catch (error) {
    console.error('Error creating cart:', error);
    throw error;
  }
}

// fetch the cart by id
export async function getCart(cartId) {
  try {
    const data = await medusaFetch(`/carts/${cartId}`);
    return data.cart;
  } catch (error) {
    console.error('Error fetching cart:', error);
    throw error;
  }
}

// add item to a cart
export async function addToCart(cartId, variantId, quantity) {
  try {
    const data = await medusaFetch(`/carts/${cartId}/line-items`, {
      method: 'POST',
      body: JSON.stringify({
        variant_id: variantId,
        quantity,
      }),
    });
    return data.cart;
  } catch (error) {
    console.error('Error adding to cart:', error);
    throw error;
  }
}

export async function updateLineItem(cartId, lineId, quantity) {
  try {
    const data = await medusaFetch(`/carts/${cartId}/line-items/${lineId}`, {
      method: 'POST',
      body: JSON.stringify({ quantity }),
    });
    return data.cart;
  } catch (error) {
    console.error('Error updating line item:', error);
    throw error;
  }
}

export async function removeLineItem(cartId, lineId) {
  try {
    const data = await medusaFetch(`/carts/${cartId}/line-items/${lineId}`, {
      method: 'DELETE',
    });
    return data.cart;
  } catch (error) {
    console.error('Error removing line item:', error);
    throw error;
  }
}

// set cart email for guest checkout
export async function setCartEmail(cartId, email) {
  try {
    const data = await medusaFetch(`/carts/${cartId}`, {
      method: 'POST',
      body: JSON.stringify({ email }),
    });
    return data.cart;
  } catch (error) {
    console.error('Error setting cart email:', error);
    throw error;
  }
}

// set shipping address for guest checkout
export async function setShippingAddress(cartId, address) {
  try {
    const data = await medusaFetch(`/carts/${cartId}`, {
      method: 'POST',
      body: JSON.stringify({
        shipping_address: address,
        billing_address: address,
      }),
    });
    return data.cart;
  } catch (error) {
    console.error('Error setting shipping address:', error);
    throw error;
  }
}

// get available shipping options for a cart
export async function getShippingOptions(cartId) {
  try {
    const data = await medusaFetch(`/shipping-options?cart_id=${cartId}`);
    console.log('Available shipping options:', data.shipping_options);
    return data.shipping_options;
  } catch (error) {
    console.error('Error fetching shipping options:', error);
    throw error;
  }
}

// add shipping method to cart for guest checkout
export async function addShippingMethod(cartId, optionId) {
  try {
    const data = await medusaFetch(`/carts/${cartId}/shipping-methods`, {
      method: 'POST',
      body: JSON.stringify({
        option_id: optionId,
      }),
    });
    return data.cart;
  } catch (error) {
    console.error('Error adding shipping method:', error);
    throw error;
  }
}

// complete the order for guest checkout
export async function completeOrder(cartId) {
  try {
    const data = await medusaFetch(`/carts/${cartId}/complete`, {
      method: 'POST',
    });
    return data.order;
  } catch (error) {
    console.error('Error completing order:', error);
    throw error;
  }
}
