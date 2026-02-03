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
  const data = await medusaFetch('/product-categories');
  return data.product_categories;
}

export async function getProducts() {
  const data = await medusaFetch('/products?fields=*categories,*variants,*variants.images');
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
}

export async function getProductsByCategory(handle) {
  const catRes = await medusaFetch(`/product-categories?handle=${handle}`);
  console.log('category response', catRes);
  const category = catRes.product_categories?.[0];
  if (!category) return [];

  const data = await medusaFetch(
    `/products?category_id[]=${category.id}` +
    `&sales_channel_id=${SALES_CHANNEL_ID}` +
    `&region_id=${REGION_ID}`
  );

  return data.products;
}

//get product details
export async function getProduct(id) {
  const data = await medusaFetch(
    `/products/${id}?fields=*variants,*variants.images&sales_channel_id=${import.meta.env.VITE_MEDUSA_SALES_CHANNEL_ID
    }&region_id=${REGION_ID}`
  );
  return data.product;
}

// create a new cart as medusa recommends thateach cart is unique per id
export async function createCart() {
  const data = await medusaFetch('/carts', {
    method: 'POST',
    body: JSON.stringify({
      region_id: REGION_ID,
    }),
  });
  return data.cart;
}

//fetch the cart by id
export async function getCart(cartId) {
  const data = await medusaFetch(`/carts/${cartId}`);
  return data.cart;
}

//add item to a cart
export async function addToCart(cartId, variantId, quantity) {
  const data = await medusaFetch(`/carts/${cartId}/line-items`, {
    method: 'POST',
    body: JSON.stringify({
      variant_id: variantId,
      quantity,
    }),
  });
  return data.cart;
}

export async function updateLineItem(cartId, lineId, quantity) {
  const data = await medusaFetch(`/carts/${cartId}/line-items/${lineId}`, {
    method: 'POST',
    body: JSON.stringify({ quantity }),
  });
  return data.cart;
}

export async function removeLineItem(cartId, lineId) {
  const data = await medusaFetch(`/carts/${cartId}/line-items/${lineId}`, {
    method: 'DELETE',
  });
  return data.cart;
}

export async function setCartEmail(cartId, email) {
  const data = await medusaFetch(`/carts/${cartId}`, {
    method: "POST",
    body: JSON.stringify({ email }),
  })
  return data.cart
}

export async function setShippingAddress(cartId, address) {
  const data = await medusaFetch(`/carts/${cartId}`, {
    method: "POST",
    body: JSON.stringify({
      shipping_address: address,
      billing_address: address,
    }),
  })
  return data.cart
}

export async function addShippingMethod(cartId, optionId) {
  const data = await medusaFetch(`/carts/${cartId}/shipping-methods`, {
    method: "POST",
    body: JSON.stringify({
      option_id: optionId,
    }),
  })
  return data.cart
}

export async function completeOrder(cartId) {
  const data = await medusaFetch(`/carts/${cartId}/complete`, {
    method: 'POST',
  });
  return data.order;
}
