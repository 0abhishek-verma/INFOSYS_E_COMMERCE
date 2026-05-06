import { useCallback, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import ProductCard from "../components/ProductCard";
import ProductFilters from "../components/ProductFilters";
import { useCart } from "../context/useCart";
import {
  getErrorMessage,
  getProducts,
  getStoredUser,
  searchProducts,
} from "../services/api";

const initialFilters = {
  name: "",
  category: "",
  minPrice: "",
  maxPrice: "",
};

function hasActiveFilters(filters) {
  return Object.values(filters).some((value) => String(value).trim() !== "");
}

function getCategoryOptions(products) {
  return [...new Set(
    products
      .map((product) => product.category?.trim())
      .filter(Boolean),
  )].sort((firstCategory, secondCategory) =>
    firstCategory.localeCompare(secondCategory),
  );
}

function Dashboard() {
  const navigate = useNavigate();
  const user = getStoredUser();
  const { itemCount } = useCart();
  const [products, setProducts] = useState([]);
  const [filters, setFilters] = useState(initialFilters);
  const [availableCategories, setAvailableCategories] = useState([]);
  const [totalProducts, setTotalProducts] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  const loadProducts = useCallback(async (nextFilters = initialFilters) => {
    setIsLoading(true);
    setErrorMessage("");

    try {
      if (hasActiveFilters(nextFilters)) {
        const response = await searchProducts(nextFilters);
        setProducts(Array.isArray(response.data) ? response.data : []);
      } else {
        const response = await getProducts();
        const allProducts = Array.isArray(response.data) ? response.data : [];

        setProducts(allProducts);
        setTotalProducts(allProducts.length);
        setAvailableCategories(getCategoryOptions(allProducts));
      }
    } catch (error) {
      setErrorMessage(
        getErrorMessage(
          error,
          "Unable to load products right now. Please try again.",
        ),
      );
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadProducts(initialFilters);
  }, [loadProducts]);

  const handleFilterChange = (event) => {
    const { name, value } = event.target;

    setFilters((currentFilters) => ({
      ...currentFilters,
      [name]: value,
    }));
  };

  const handleApplyFilters = async (event) => {
    event.preventDefault();
    setErrorMessage("");

    if (
      filters.minPrice &&
      filters.maxPrice &&
      Number(filters.minPrice) > Number(filters.maxPrice)
    ) {
      setErrorMessage("Minimum price cannot be greater than maximum price.");
      return;
    }

    await loadProducts(filters);
  };

  const handleClearFilters = async () => {
    const clearedFilters = { ...initialFilters };
    setFilters(clearedFilters);
    await loadProducts(clearedFilters);
  };

  const featuredCategories = availableCategories.slice(0, 8);
  const isFilteredView = hasActiveFilters(filters);

  return (
    <div className="min-h-screen bg-slate-100">
      <Navbar
        user={user}
        title="Best deals for you"
        subtitle="Browse products, compare prices, and build your cart."
      />

      <main className="mx-auto max-w-7xl px-3 py-4 sm:px-6 lg:px-8">
        <section className="mb-4 grid gap-4 lg:grid-cols-[1fr_320px]">
          <div className="overflow-hidden rounded-sm bg-blue-700 text-white shadow-sm">
            <div className="grid min-h-[220px] gap-6 p-6 sm:p-8 lg:grid-cols-[1fr_260px] lg:items-center">
              <div>
                <p className="text-sm font-bold uppercase tracking-wide text-yellow-300">
                  Big saving days
                </p>
                <h2 className="mt-3 max-w-2xl text-3xl font-black tracking-tight sm:text-5xl">
                  Fresh picks, sharper prices, faster checkout.
                </h2>
                <p className="mt-3 max-w-xl text-sm text-blue-100 sm:text-base">
                  Explore the live catalog and add your favourites to a cart that
                  stays ready while you compare products.
                </p>
                <div className="mt-5 flex flex-wrap gap-3">
                  <a
                    href="#products"
                    className="rounded-sm bg-yellow-400 px-5 py-3 text-sm font-black text-zinc-950 transition hover:bg-yellow-300"
                  >
                    Shop now
                  </a>
                  <Link
                    to="/cart"
                    className="rounded-sm border border-blue-300 px-5 py-3 text-sm font-bold text-white transition hover:bg-blue-600"
                  >
                    View cart ({itemCount})
                  </Link>
                </div>
              </div>

              <div className="hidden rounded bg-white p-5 text-zinc-950 shadow-sm lg:block">
                <p className="text-sm font-bold text-blue-600">Today only</p>
                <p className="mt-2 text-4xl font-black">8% off</p>
                <p className="mt-1 text-sm text-zinc-500">
                  Applied in cart summary on every order preview.
                </p>
              </div>
            </div>
          </div>

          <aside className="grid gap-3 rounded-sm bg-white p-4 shadow-sm ring-1 ring-zinc-200">
            <div>
              <p className="text-xs font-bold uppercase text-zinc-500">Hello</p>
              <h3 className="mt-1 text-xl font-bold text-zinc-950">
                {user?.name || "Customer"}
              </h3>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="rounded-sm bg-slate-100 p-3">
                <p className="text-2xl font-black text-zinc-950">{products.length}</p>
                <p className="text-xs font-semibold text-zinc-500">
                  {isFilteredView ? "Matches" : "Products"}
                </p>
              </div>
              <div className="rounded-sm bg-yellow-50 p-3">
                <p className="text-2xl font-black text-zinc-950">{itemCount}</p>
                <p className="text-xs font-semibold text-zinc-500">In cart</p>
              </div>
            </div>
            <Link
              to="/cart"
              className="rounded-sm bg-blue-600 px-4 py-3 text-center text-sm font-bold text-white transition hover:bg-blue-700"
            >
              Go to cart
            </Link>
          </aside>
        </section>

        {featuredCategories.length > 0 ? (
          <section className="mb-4 grid grid-cols-2 gap-2 bg-white p-3 shadow-sm ring-1 ring-zinc-200 sm:grid-cols-4 lg:grid-cols-8">
            {featuredCategories.map((category) => (
              <button
                type="button"
                key={category}
                onClick={() => setFilters((current) => ({ ...current, category }))}
                className="rounded-sm px-3 py-3 text-sm font-bold text-zinc-700 transition hover:bg-blue-50 hover:text-blue-600"
              >
                {category}
              </button>
            ))}
          </section>
        ) : null}

        <ProductFilters
          filters={filters}
          categories={availableCategories}
          onChange={handleFilterChange}
          onApply={handleApplyFilters}
          onClear={handleClearFilters}
          isLoading={isLoading}
          resultCount={products.length}
          totalCount={totalProducts}
        />

        {errorMessage ? (
          <div className="mb-5 rounded-sm border border-rose-200 bg-rose-50 px-4 py-3 text-sm font-semibold text-rose-700">
            {errorMessage}
          </div>
        ) : null}

        {isLoading ? (
          <div className="rounded-sm bg-white px-6 py-12 text-center text-sm font-semibold text-zinc-600 shadow-sm ring-1 ring-zinc-200">
            Loading products...
          </div>
        ) : products.length > 0 ? (
          <section id="products" className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {products.map((product) => (
              <ProductCard
                key={product.id}
                productId={product.id}
                name={product.name}
                price={product.price}
                image={product.imageUrl}
                category={product.category}
                description={product.description}
                stockQuantity={product.stockQuantity}
                product={product}
                onViewDetails={() => navigate(`/products/${product.id}`)}
              />
            ))}
          </section>
        ) : (
          <div className="rounded-sm border border-dashed border-zinc-300 bg-white px-6 py-12 text-center shadow-sm">
            <h3 className="text-lg font-bold text-zinc-900">No products found</h3>
            <p className="mt-2 text-sm text-zinc-600">
              {isFilteredView
                ? "No products match the current search and filter settings."
                : "The catalog is empty right now. Check back after an admin adds products."}
            </p>
          </div>
        )}
      </main>
    </div>
  );
}

export default Dashboard;
