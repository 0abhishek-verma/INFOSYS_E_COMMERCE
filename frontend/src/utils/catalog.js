export function formatPrice(value) {
  const numericValue = Number(value);

  if (Number.isNaN(numericValue)) {
    return "0";
  }

  return new Intl.NumberFormat("en-IN", {
    maximumFractionDigits: 0,
  }).format(numericValue);
}

export function buildFallbackImage(productName, width = 760, height = 560) {
  const label = productName ? productName.slice(0, 24) : "Product";
  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">
      <rect width="${width}" height="${height}" fill="#f1f5f9" />
      <rect x="42" y="42" width="${width - 84}" height="${height - 84}" rx="18" fill="#dbeafe" />
      <circle cx="${width * 0.78}" cy="${height * 0.28}" r="58" fill="#fde68a" />
      <text x="${width / 2}" y="${height / 2 - 8}" text-anchor="middle" font-family="Segoe UI, Arial, sans-serif" font-size="32" font-weight="700" fill="#1e3a8a">
        ${label}
      </text>
      <text x="${width / 2}" y="${height / 2 + 38}" text-anchor="middle" font-family="Segoe UI, Arial, sans-serif" font-size="18" fill="#2563eb">
        Image unavailable
      </text>
    </svg>
  `;

  return `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(svg)}`;
}

export function normalizeProduct(product) {
  return {
    id: product.id,
    name: product.name,
    price: Number(product.price) || 0,
    imageUrl: product.imageUrl || "",
    category: product.category || "Essentials",
    description: product.description || "",
    stockQuantity: Number(product.stockQuantity) || 0,
  };
}
