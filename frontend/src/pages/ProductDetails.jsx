import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Navbar from "../components/Navbar";
import {
  getErrorMessage,
  getHomeRouteForRole,
  getProductById,
  getStoredUser,
} from "../services/api";

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
    <svg xmlns="http://www.w3.org/2000/svg" width="1200" height="900" viewBox="0 0 1200 900">
      <rect width="1200" height="900" fill="#f4f4f5" />
      <rect x="120" y="120" width="960" height="660" rx="32" fill="#e4e4e7" />
      <text x="600" y="430" text-anchor="middle" font-family="Segoe UI, Arial, sans-serif" font-size="52" fill="#3f3f46">
        ${label}
      </text>
      <text x="600" y="500" text-anchor="middle" font-family="Segoe UI, Arial, sans-serif" font-size="28" fill="#52525b">
        Image unavailable
      </text>
    </svg>
  `;

  return `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(svg)}`;
}

function ProductDetails() {
  const navigate = useNavigate();
  const { productId } = useParams();
  const user = getStoredUser();
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

  return (
    <div className="min-h-screen bg-transparent">
      <Navbar
        user={user}
        title="Product Details"
        subtitle="View the full product information in one place."
      />

      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <button
          type="button"
          onClick={() => navigate(getHomeRouteForRole(user?.role))}
          className="mb-6 rounded-md border border-zinc-200 bg-white px-4 py-2 text-sm font-medium text-zinc-700 shadow-sm transition hover:border-zinc-300 hover:bg-zinc-50"
        >
          Back to dashboard
        </button>

        {errorMessage ? (
          <div className="rounded-lg border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
            {errorMessage}
          </div>
        ) : null}

        {isLoading ? (
          <div className="rounded-lg border border-zinc-200 bg-white px-6 py-12 text-center text-sm text-zinc-600 shadow-sm">
            Loading product details...
          </div>
        ) : product ? (
          <section className="grid gap-8 rounded-lg border border-zinc-200 bg-white p-6 shadow-sm lg:grid-cols-[1fr_0.95fr] lg:p-8">
            <div className="overflow-hidden rounded-lg bg-zinc-100">
              <img
                src={product.imageUrl || buildFallbackImage(product.name)}
                alt={product.name}
                className="h-full w-full object-cover"
                onError={(event) => {
                  event.currentTarget.onerror = null;
                  event.currentTarget.src = buildFallbackImage(product.name);
                }}
              />
            </div>

            <div className="space-y-6">
              <div className="space-y-3">
                <p className="text-sm font-semibold uppercase tracking-wide text-emerald-700">
                  {product.category || "Uncategorized"}
                </p>
                <h1 className="text-4xl font-semibold tracking-tight text-zinc-950">
                  {product.name}
                </h1>
                <p className="text-base text-zinc-600">
                  {product.description?.trim() || "No description available for this product."}
                </p>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="rounded-lg bg-amber-50 p-5">
                  <p className="text-sm font-semibold uppercase tracking-wide text-amber-700">
                    Price
                  </p>
                  <p className="mt-2 text-3xl font-semibold tracking-tight text-amber-900">
                    {formatPrice(product.price)}
                  </p>
                </div>

                <div className="rounded-lg bg-emerald-50 p-5">
                  <p className="text-sm font-semibold uppercase tracking-wide text-emerald-700">
                    Available stock
                  </p>
                  <p className="mt-2 text-3xl font-semibold tracking-tight text-emerald-900">
                    {product.stockQuantity ?? 0}
                  </p>
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="rounded-lg border border-zinc-200 p-5">
                  <p className="text-xs font-semibold uppercase tracking-wide text-zinc-500">
                    Product id
                  </p>
                  <p className="mt-2 text-lg font-semibold text-zinc-900">{product.id}</p>
                </div>
                <div className="rounded-lg border border-zinc-200 p-5">
                  <p className="text-xs font-semibold uppercase tracking-wide text-zinc-500">
                    Visibility
                  </p>
                  <p className="mt-2 text-lg font-semibold text-zinc-900">
                    {product.isActive ? "Active" : "Inactive"}
                  </p>
                </div>
              </div>
            </div>
          </section>
        ) : (
          <div className="rounded-lg border border-dashed border-zinc-300 bg-white px-6 py-12 text-center shadow-sm">
            <h2 className="text-lg font-semibold text-zinc-900">Product not found</h2>
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
