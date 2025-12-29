const BASE = 'http://localhost:9000/store';
const PUBLISHABLE_KEY = import.meta.env.VITE_MEDUSA_PUBLISHABLE_KEY;
const SALES_CHANNEL_ID = import.meta.env.VITE_MEDUSA_SALES_CHANNEL_ID;

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
  const data = await medusaFetch('/products');
  return data.products;
}

export async function getProductsByCategory(handle) {

  const catRes = await medusaFetch(`/product-categories?handle=${handle}`);

  const category = catRes.product_categories?.[0];
  if (!category) return [];

  //  Fetch products
  const data = await medusaFetch(
    `/products?category_id[]=${category.id}&sales_channel_id=${SALES_CHANNEL_ID}`
  );
  console.log('category products', data.products);
  return data.products;
}

//get product details 
export async function getProduct(handle) {
  const data = await medusaFetch(`/products/${handle}`);
  return data.product;
}

// create a new cart as medusa recommends thateach cart is unique per id
export async function createCart() {
  const data = await medusaFetch('/carts', {
    method: 'POST',
    body: JSON.stringify({
      region_id: import.meta.env.VITE_MEDUSA_REGION_ID,
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
