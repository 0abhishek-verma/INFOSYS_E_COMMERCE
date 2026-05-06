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
    <article className="group flex h-full flex-col overflow-hidden rounded bg-white shadow-sm ring-1 ring-zinc-200 transition duration-200 hover:-translate-y-0.5 hover:shadow-md">
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
            className="mt-1 line-clamp-2 text-left text-base font-semibold leading-snug text-zinc-950 hover:text-blue-600"
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
          <span className="text-xs font-medium text-zinc-500">
            {Number(stockQuantity) > 0 ? `${stockQuantity} in stock` : "Unavailable"}
          </span>
        </div>

        <div className="mt-auto">
          <div className="flex flex-wrap items-baseline gap-2">
            <p className="text-xl font-bold text-zinc-950">Rs. {formatPrice(price)}</p>
            <p className="text-sm text-zinc-400 line-through">Rs. {formatPrice(mrp)}</p>
            <p className="text-sm font-semibold text-emerald-600">18% off</p>
          </div>
          <p className="mt-1 text-xs font-medium text-zinc-500">Free delivery by tomorrow</p>
        </div>

        <div className="grid grid-cols-2 gap-2 pt-1">
          <button
            type="button"
            onClick={onViewDetails}
            className="rounded-sm border border-zinc-300 bg-white px-3 py-2 text-sm font-bold text-zinc-800 transition hover:border-blue-400 hover:text-blue-600"
          >
            {ctaLabel}
          </button>
          <button
            type="button"
            onClick={handleAddToCart}
            disabled={isOutOfStock}
            className="rounded-sm bg-yellow-400 px-3 py-2 text-sm font-bold text-zinc-950 transition hover:bg-yellow-300 disabled:cursor-not-allowed disabled:bg-zinc-200 disabled:text-zinc-500"
          >
            Add
          </button>
        </div>
      </div>
    </article>
  );
}

export default ProductCard;
