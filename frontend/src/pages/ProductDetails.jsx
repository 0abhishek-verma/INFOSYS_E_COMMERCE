import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import Navbar from "../components/Navbar";
import { useCart } from "../context/useCart";
import {
  getErrorMessage,
  getHomeRouteForRole,
  getProductById,
  getStoredUser,
} from "../services/api";
import { buildFallbackImage, formatPrice } from "../utils/catalog";

function ProductDetails() {
  const navigate = useNavigate();
  const { productId } = useParams();
  const user = getStoredUser();
  const { addToCart } = useCart();
  const [product, setProduct] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    let isMounted = true;

    const loadProduct = async () => {
      setIsLoading(true);
      setErrorMessage("");

      try {
        const response = await getProductById(productId);

        if (isMounted) {
          setProduct(response.data);
        }
      } catch (error) {
        if (isMounted) {
          setErrorMessage(
            getErrorMessage(
              error,
              "Unable to load the product details right now.",
            ),
          );
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    loadProduct();

    return () => {
      isMounted = false;
    };
  }, [productId]);

  const handleAddToCart = () => {
    addToCart(product);
  };

  const handleBuyNow = () => {
    addToCart(product);
    navigate("/cart");
  };

  return (
    <div className="min-h-screen bg-slate-100">
      <Navbar
        user={user}
        title="Product Details"
        subtitle="Compare the product, then add it to your shopping cart."
      />

      <main className="mx-auto max-w-7xl px-3 py-5 sm:px-6 lg:px-8">
        <button
          type="button"
          onClick={() => navigate(getHomeRouteForRole(user?.role))}
          className="mb-5 rounded-md bg-white px-4 py-2 text-sm font-black text-slate-700 shadow-sm ring-1 ring-slate-200 transition hover:bg-slate-50"
        >
          Back to shopping
        </button>

        {errorMessage ? (
          <div className="rounded-sm border border-rose-200 bg-rose-50 px-4 py-3 text-sm font-semibold text-rose-700">
            {errorMessage}
          </div>
        ) : null}

        {isLoading ? (
          <div className="rounded-sm bg-white px-6 py-12 text-center text-sm font-semibold text-zinc-600 shadow-sm ring-1 ring-zinc-200">
            Loading product details...
          </div>
        ) : product ? (
          <section className="grid gap-5 lg:grid-cols-[0.9fr_1.1fr]">
            <div className="bg-white p-4 shadow-sm ring-1 ring-zinc-200">
              <div className="aspect-square bg-slate-100 p-6">
                <img
                  src={product.imageUrl || buildFallbackImage(product.name, 900, 900)}
                  alt={product.name}
                  className="h-full w-full object-contain"
                  onError={(event) => {
                    event.currentTarget.onerror = null;
                    event.currentTarget.src = buildFallbackImage(product.name, 900, 900);
                  }}
                />
              </div>

              {user?.role === "USER" ? (
                <div className="mt-4 grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={handleAddToCart}
                    disabled={Number(product.stockQuantity) <= 0}
                    className="rounded-md bg-amber-400 px-5 py-4 text-sm font-black text-slate-950 transition hover:bg-amber-300 disabled:cursor-not-allowed disabled:bg-slate-200 disabled:text-slate-500"
                  >
                    Add to cart
                  </button>
                  <button
                    type="button"
                    onClick={handleBuyNow}
                    disabled={Number(product.stockQuantity) <= 0}
                    className="rounded-md bg-sky-600 px-5 py-4 text-sm font-black text-white transition hover:bg-sky-700 disabled:cursor-not-allowed disabled:bg-slate-300"
                  >
                    Buy now
                  </button>
                </div>
              ) : null}
            </div>

            <div className="bg-white p-5 shadow-sm ring-1 ring-zinc-200 sm:p-7">
              <p className="text-sm font-bold uppercase text-blue-600">
                {product.category || "Uncategorized"}
              </p>
              <h1 className="mt-2 text-3xl font-black tracking-tight text-zinc-950 sm:text-4xl">
                {product.name}
              </h1>

              <div className="mt-4 flex flex-wrap items-center gap-3">
                <span className="rounded bg-emerald-600 px-2 py-1 text-sm font-bold text-white">
                  4.4
                </span>
                <span className="text-sm font-semibold text-zinc-500">
                  Assured quality | Easy returns
                </span>
              </div>

              <div className="mt-5 flex flex-wrap items-baseline gap-3">
                <p className="text-4xl font-black text-zinc-950">
                  Rs. {formatPrice(product.price)}
                </p>
                <p className="text-lg text-zinc-400 line-through">
                  Rs. {formatPrice(Number(product.price || 0) * 1.18)}
                </p>
                <p className="text-base font-bold text-emerald-600">18% off</p>
              </div>

              <div className="mt-6 border-t border-zinc-200 pt-6">
                <h2 className="text-lg font-black text-zinc-950">Highlights</h2>
                <div className="mt-4 grid gap-3 sm:grid-cols-2">
                  <div className="rounded-sm bg-slate-100 p-4">
                    <p className="text-xs font-bold uppercase text-zinc-500">Stock</p>
                    <p className="mt-1 text-2xl font-black text-zinc-950">
                      {product.stockQuantity ?? 0}
                    </p>
                  </div>
                  <div className="rounded-sm bg-slate-100 p-4">
                    <p className="text-xs font-bold uppercase text-zinc-500">Status</p>
                    <p className="mt-1 text-2xl font-black text-zinc-950">
                      {product.isActive === false ? "Inactive" : "Active"}
                    </p>
                  </div>
                </div>
              </div>

              <div className="mt-6 border-t border-zinc-200 pt-6">
                <h2 className="text-lg font-black text-zinc-950">Description</h2>
                <p className="mt-3 text-base leading-7 text-zinc-600">
                  {product.description?.trim() || "No description available for this product."}
                </p>
              </div>

              <div className="mt-6 rounded-sm bg-blue-50 p-4 text-sm font-semibold text-blue-800">
                Product ID: {product.id}. Prices shown are inclusive of cart
                preview discounts and may change after inventory updates.
              </div>

              {user?.role === "USER" ? (
                <Link
                  to="/cart"
                  className="mt-4 inline-flex rounded-md border border-slate-300 px-4 py-3 text-sm font-black text-slate-700 transition hover:bg-slate-50"
                >
                  Open cart
                </Link>
              ) : null}
            </div>
          </section>
        ) : (
          <div className="rounded-sm border border-dashed border-zinc-300 bg-white px-6 py-12 text-center shadow-sm">
            <h2 className="text-lg font-bold text-zinc-900">Product not found</h2>
            <p className="mt-2 text-sm text-zinc-600">
              The requested product could not be loaded.
            </p>
          </div>
        )}
      </main>
    </div>
  );
}

export default ProductDetails;
