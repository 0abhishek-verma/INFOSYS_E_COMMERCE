function formatPrice(value) {
  const numericValue = Number(value);

  if (Number.isNaN(numericValue)) {
    return "0.00";
  }

  return new Intl.NumberFormat("en-IN", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(numericValue);
}

function buildFallbackImage(productName) {
  const label = productName ? productName.slice(0, 20) : "Product";
  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" width="640" height="420" viewBox="0 0 640 420">
      <rect width="640" height="420" fill="#ecfdf5" />
      <rect x="56" y="56" width="528" height="308" rx="24" fill="#d1fae5" />
      <text x="320" y="198" text-anchor="middle" font-family="Segoe UI, Arial, sans-serif" font-size="30" fill="#065f46">
        ${label}
      </text>
      <text x="320" y="238" text-anchor="middle" font-family="Segoe UI, Arial, sans-serif" font-size="18" fill="#047857">
        Image unavailable
      </text>
    </svg>
  `;

  return `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(svg)}`;
}

function ProductCard({
  productId,
  name,
  price,
  image,
  category,
  description,
  stockQuantity,
  onViewDetails,
  ctaLabel = "View Details",
}) {
  const displayImage = image?.trim() ? image : buildFallbackImage(name);

  return (
    <article className="flex h-full flex-col overflow-hidden rounded-lg border border-zinc-200 bg-white shadow-sm transition duration-200 hover:-translate-y-1 hover:shadow-lg">
      <div className="aspect-[4/3] overflow-hidden bg-zinc-100">
        <img
          src={displayImage}
          alt={name}
          className="h-full w-full object-cover"
          onError={(event) => {
            event.currentTarget.onerror = null;
            event.currentTarget.src = buildFallbackImage(name);
          }}
        />
      </div>

      <div className="flex flex-1 flex-col gap-4 p-5">
        <div className="flex items-start justify-between gap-3">
          <div className="space-y-2">
            <p className="text-xs font-semibold uppercase tracking-wide text-emerald-700">
              {category || "Uncategorized"}
            </p>
            <h2 className="text-lg font-semibold tracking-tight text-zinc-950">
              {name}
            </h2>
          </div>
          <div className="shrink-0 rounded-md bg-amber-50 px-3 py-2 text-right">
            <p className="text-[11px] font-medium uppercase tracking-wide text-amber-700">
              Price
            </p>
            <p className="text-base font-semibold text-amber-900">{formatPrice(price)}</p>
          </div>
        </div>

        <div
          className="text-sm text-zinc-600"
          style={{
            display: "-webkit-box",
            WebkitBoxOrient: "vertical",
            WebkitLineClamp: 3,
            overflow: "hidden",
          }}
        >
          {description?.trim() || "No description available for this product yet."}
        </div>

        <div className="mt-auto flex items-center justify-between gap-3 border-t border-zinc-100 pt-4">
          <div>
            <p className="text-xs font-medium uppercase tracking-wide text-zinc-500">
              Product ID
            </p>
            <p className="text-sm font-semibold text-zinc-800">{productId}</p>
          </div>
          <div className="text-right">
            <p className="text-xs font-medium uppercase tracking-wide text-zinc-500">
              Stock
            </p>
            <p className="text-sm font-semibold text-zinc-800">{stockQuantity ?? 0}</p>
          </div>
        </div>

        <button
          type="button"
          onClick={onViewDetails}
          className="rounded-md bg-zinc-900 px-4 py-3 text-sm font-semibold text-white transition hover:bg-zinc-800"
        >
          {ctaLabel}
        </button>
      </div>
    </article>
  );
}

export default ProductCard;
