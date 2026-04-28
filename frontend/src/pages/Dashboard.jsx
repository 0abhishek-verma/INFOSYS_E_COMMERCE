import { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import ProductFilters from "../components/ProductFilters";
import ProductCard from "../components/ProductCard";
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

  const isFilteredView = hasActiveFilters(filters);

  return (
    <div className="min-h-screen bg-transparent">
      <Navbar
        user={user}
        title="Product Dashboard"
        subtitle="Browse the latest products available in the catalog."
      />

      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <section className="mb-8 grid gap-4 lg:grid-cols-[1.4fr_0.6fr]">
          <div className="rounded-lg border border-zinc-200 bg-white p-6 shadow-sm">
            <p className="text-sm font-semibold uppercase tracking-wide text-emerald-700">
              Signed in as
            </p>
            <h2 className="mt-3 text-3xl font-semibold tracking-tight text-zinc-950">
              {user?.name || "Customer"}
            </h2>
            <p className="mt-2 max-w-2xl text-sm text-zinc-600">
              Explore the product catalog, open detailed product views, and
              keep track of what is currently available.
            </p>
          </div>

          <div className="rounded-lg border border-zinc-200 bg-white p-6 shadow-sm">
            <p className="text-sm font-semibold uppercase tracking-wide text-zinc-500">
              {isFilteredView ? "Filtered results" : "Live products"}
            </p>
            <p className="mt-3 text-3xl font-semibold tracking-tight text-zinc-950">
              {products.length}
            </p>
            <p className="mt-2 text-sm text-zinc-600">
              {isFilteredView
                ? `Matching results from ${totalProducts} available products.`
                : "Updated from the shared catalog available to your account."}
            </p>
          </div>
        </section>

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
          <div className="mb-6 rounded-lg border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
            {errorMessage}
          </div>
        ) : null}

        {isLoading ? (
          <div className="rounded-lg border border-zinc-200 bg-white px-6 py-12 text-center text-sm text-zinc-600 shadow-sm">
            Loading products...
          </div>
        ) : products.length > 0 ? (
          <section className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
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
                onViewDetails={() => navigate(`/products/${product.id}`)}
              />
            ))}
          </section>
        ) : (
          <div className="rounded-lg border border-dashed border-zinc-300 bg-white px-6 py-12 text-center shadow-sm">
            <h3 className="text-lg font-semibold text-zinc-900">No products found</h3>
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
