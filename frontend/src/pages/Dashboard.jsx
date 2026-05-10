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

      <main className="mx-auto max-w-7xl px-3 py-5 sm:px-6 lg:px-8">
        <section className="mb-5 grid gap-4 lg:grid-cols-[1fr_320px]">
          <div className="overflow-hidden bg-slate-950 text-white shadow-sm">
            <div className="grid min-h-[240px] gap-6 p-6 sm:p-8 lg:grid-cols-[1fr_260px] lg:items-center">
              <div>
                <p className="text-sm font-black uppercase text-sky-300">
                  Live marketplace
                </p>
                <h2 className="mt-3 max-w-2xl text-3xl font-black tracking-tight sm:text-5xl">
                  Browse faster. Compare cleaner. Checkout sooner.
                </h2>
                <p className="mt-3 max-w-xl text-sm font-medium text-slate-300 sm:text-base">
                  Explore the live catalog and add your favourites to a cart that
                  stays ready while you compare products.
                </p>
                <div className="mt-5 flex flex-wrap gap-3">
                  <a
                    href="#products"
                    className="rounded-md bg-sky-400 px-5 py-3 text-sm font-black text-slate-950 transition hover:bg-sky-300"
                  >
                    Shop now
                  </a>
                  <Link
                    to="/cart"
                    className="rounded-md border border-slate-600 px-5 py-3 text-sm font-black text-white transition hover:bg-slate-800"
                  >
                    View cart ({itemCount})
                  </Link>
                </div>
              </div>

              <div className="hidden bg-white p-5 text-slate-950 shadow-sm lg:block">
                <p className="text-sm font-black text-sky-700">Today only</p>
                <p className="mt-2 text-4xl font-black">8% off</p>
                <p className="mt-1 text-sm font-medium text-slate-500">
                  Applied in cart summary on every order preview.
                </p>
              </div>
            </div>
          </div>

          <aside className="grid gap-3 bg-white p-4 shadow-sm ring-1 ring-slate-200">
            <div>
              <p className="text-xs font-black uppercase text-slate-500">Hello</p>
              <h3 className="mt-1 text-xl font-black text-slate-950">
                {user?.name || "Customer"}
              </h3>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-slate-100 p-3">
                <p className="text-2xl font-black text-slate-950">{products.length}</p>
                <p className="text-xs font-semibold text-slate-500">
                  {isFilteredView ? "Matches" : "Products"}
                </p>
              </div>
              <div className="bg-amber-50 p-3">
                <p className="text-2xl font-black text-slate-950">{itemCount}</p>
                <p className="text-xs font-semibold text-slate-500">In cart</p>
              </div>
            </div>
            <Link
              to="/cart"
              className="rounded-md bg-slate-950 px-4 py-3 text-center text-sm font-black text-white transition hover:bg-slate-800"
            >
              Go to cart
            </Link>
          </aside>
        </section>

        {featuredCategories.length > 0 ? (
          <section className="mb-5 grid grid-cols-2 gap-2 bg-white p-3 shadow-sm ring-1 ring-slate-200 sm:grid-cols-4 lg:grid-cols-8">
            {featuredCategories.map((category) => (
              <button
                type="button"
                key={category}
                onClick={() => setFilters((current) => ({ ...current, category }))}
                className="rounded-md px-3 py-3 text-sm font-black text-slate-700 transition hover:bg-sky-50 hover:text-sky-700"
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
          <div className="mb-5 border border-rose-200 bg-rose-50 px-4 py-3 text-sm font-semibold text-rose-700">
            {errorMessage}
          </div>
        ) : null}

        {isLoading ? (
          <div className="bg-white px-6 py-12 text-center text-sm font-semibold text-slate-600 shadow-sm ring-1 ring-slate-200">
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
          <div className="border border-dashed border-slate-300 bg-white px-6 py-12 text-center shadow-sm">
            <h3 className="text-lg font-black text-slate-950">No products found</h3>
            <p className="mt-2 text-sm text-slate-600">
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
