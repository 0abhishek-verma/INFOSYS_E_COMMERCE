import { useCart } from "../context/useCart";
import { buildFallbackImage, formatPrice } from "../utils/catalog";

function ProductCard({
  productId,
  name,
  price,
  image,
  category,
  description,
  stockQuantity,
  onViewDetails,
  product,
  ctaLabel = "View",
  showAddButton = true,
}) {
  const { addToCart } = useCart();
  const displayImage = image?.trim() ? image : buildFallbackImage(name);
  const isOutOfStock = Number(stockQuantity) <= 0;
  const rating = (4 + (Number(productId) % 8) / 10).toFixed(1);
  const mrp = Math.round(Number(price || 0) * 1.18);

  const handleAddToCart = () => {
    addToCart(
      product || {
        id: productId,
        name,
        price,
        imageUrl: image,
        category,
        description,
        stockQuantity,
      },
    );
  };

  return (
    <article className="group flex h-full flex-col overflow-hidden bg-white shadow-sm ring-1 ring-slate-200 transition duration-200 hover:-translate-y-0.5 hover:shadow-md">
      <button
        type="button"
        onClick={onViewDetails}
        className="aspect-[4/3] overflow-hidden bg-slate-100 p-4"
      >
        <img
          src={displayImage}
          alt={name}
          className="h-full w-full object-contain transition duration-300 group-hover:scale-105"
          onError={(event) => {
            event.currentTarget.onerror = null;
            event.currentTarget.src = buildFallbackImage(name);
          }}
        />
      </button>

      <div className="flex flex-1 flex-col gap-3 p-4">
        <div className="min-h-[86px]">
          <p className="text-xs font-semibold uppercase text-blue-600">
            {category || "Top deals"}
          </p>
          <button
            type="button"
            onClick={onViewDetails}
            className="mt-1 line-clamp-2 text-left text-base font-black leading-snug text-slate-950 hover:text-sky-700"
          >
            {name}
          </button>
          <p className="mt-2 line-clamp-2 text-sm text-zinc-500">
            {description?.trim() || "Trusted quality, quick delivery, and easy checkout."}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="rounded bg-emerald-600 px-2 py-0.5 text-xs font-bold text-white">
            {rating}
          </span>
          <span className="text-xs font-semibold text-slate-500">
            {Number(stockQuantity) > 0 ? `${stockQuantity} in stock` : "Unavailable"}
          </span>
        </div>

        <div className="mt-auto">
          <div className="flex flex-wrap items-baseline gap-2">
            <p className="text-xl font-black text-slate-950">Rs. {formatPrice(price)}</p>
            <p className="text-sm text-slate-400 line-through">Rs. {formatPrice(mrp)}</p>
            <p className="text-sm font-semibold text-emerald-600">18% off</p>
          </div>
          <p className="mt-1 text-xs font-semibold text-slate-500">Free delivery by tomorrow</p>
        </div>

        <div className={`grid gap-2 pt-1 ${showAddButton ? "grid-cols-2" : "grid-cols-1"}`}>
          <button
            type="button"
            onClick={onViewDetails}
            className="rounded-md border border-slate-300 bg-white px-3 py-2 text-sm font-black text-slate-800 transition hover:border-sky-400 hover:text-sky-700"
          >
            {ctaLabel}
          </button>
          {showAddButton ? (
            <button
              type="button"
              onClick={handleAddToCart}
              disabled={isOutOfStock}
              className="rounded-md bg-amber-400 px-3 py-2 text-sm font-black text-slate-950 transition hover:bg-amber-300 disabled:cursor-not-allowed disabled:bg-slate-200 disabled:text-slate-500"
            >
              Add
            </button>
          ) : null}
        </div>
      </div>
    </article>
  );
}

export default ProductCard;
