export function getVariantPrice(variant) {
  if (!variant) return null;

  const price = variant.calculated_price;

  if (!price || typeof price.calculated_amount !== 'number') {
    return null;
  }

  // Medusa stores prices in smallest currency unit
  return price.calculated_amount / 100;
}
