const priceFormatter = new Intl.NumberFormat("en-ZA", {
  style: "currency",
  currency: "ZAR",
  maximumFractionDigits: 0,
});

export function formatPrice(priceCents: number) {
  return priceFormatter.format(priceCents / 100);
}

export function getDiscountPercentage(
  priceCents: number,
  compareAtPriceCents?: number,
) {
  if (
    compareAtPriceCents === undefined ||
    compareAtPriceCents <= priceCents
  ) {
    return 0;
  }

  return Math.round(
    ((compareAtPriceCents - priceCents) / compareAtPriceCents) * 100,
  );
}
