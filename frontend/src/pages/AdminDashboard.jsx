import { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import ProductFilters from "../components/ProductFilters";
import ProductCard from "../components/ProductCard";
import {
  addProduct,
  getErrorMessage,
  getProducts,
  getStoredUser,
  searchProducts,
} from "../services/api";

const initialProductForm = {
  name: "",
  description: "",
  price: "",
  stockQuantity: "",
  category: "",
  imageUrl: "",
};

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

function AdminDashboard() {
  const navigate = useNavigate();
  const user = getStoredUser();
  const [products, setProducts] = useState([]);
  const [formData, setFormData] = useState(initialProductForm);
  const [filters, setFilters] = useState(initialFilters);
  const [availableCategories, setAvailableCategories] = useState([]);
  const [totalProducts, setTotalProducts] = useState(0);
  const [catalogErrorMessage, setCatalogErrorMessage] = useState("");
  const [formErrorMessage, setFormErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const refreshCatalogMetadata = useCallback(async () => {
    const response = await getProducts();
    const allProducts = Array.isArray(response.data) ? response.data : [];

    setTotalProducts(allProducts.length);
    setAvailableCategories(getCategoryOptions(allProducts));

    return allProducts;
  }, []);

  const loadProducts = useCallback(
    async (nextFilters = initialFilters) => {
      setIsLoading(true);
      setCatalogErrorMessage("");

      try {
        if (hasActiveFilters(nextFilters)) {
          const response = await searchProducts(nextFilters);
          setProducts(Array.isArray(response.data) ? response.data : []);
        } else {
          const allProducts = await refreshCatalogMetadata();
          setProducts(allProducts);
        }
      } catch (error) {
        setCatalogErrorMessage(
          getErrorMessage(
            error,
            "Unable to load products right now. Please try again.",
          ),
        );
      } finally {
        setIsLoading(false);
      }
    },
    [refreshCatalogMetadata],
  );

  useEffect(() => {
    void loadProducts(initialFilters);
  }, [loadProducts]);

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((currentState) => ({
      ...currentState,
      [name]: value,
    }));
  };

  const handleFilterChange = (event) => {
    const { name, value } = event.target;

    setFilters((currentFilters) => ({
      ...currentFilters,
      [name]: value,
    }));
  };

  const handleApplyFilters = async (event) => {
    event.preventDefault();
    setCatalogErrorMessage("");

    if (
      filters.minPrice &&
      filters.maxPrice &&
      Number(filters.minPrice) > Number(filters.maxPrice)
    ) {
      setCatalogErrorMessage("Minimum price cannot be greater than maximum price.");
      return;
    }

    await loadProducts(filters);
  };

  const handleClearFilters = async () => {
    const clearedFilters = { ...initialFilters };
    setFilters(clearedFilters);
    await loadProducts(clearedFilters);
  };

  const handleRefreshCatalog = async () => {
    if (hasActiveFilters(filters)) {
      try {
        await refreshCatalogMetadata();
      } catch (error) {
        setCatalogErrorMessage(
          getErrorMessage(
            error,
            "Unable to refresh products right now. Please try again.",
          ),
        );
      }
    }

    await loadProducts(filters);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setFormErrorMessage("");
    setSuccessMessage("");

    if (
      !formData.name.trim() ||
      !formData.price ||
      !formData.stockQuantity ||
      !formData.category.trim()
    ) {
      setFormErrorMessage("Name, price, stock quantity, and category are required.");
      return;
    }

    const parsedPrice = Number.parseFloat(formData.price);
    const parsedStock = Number.parseInt(formData.stockQuantity, 10);

    if (Number.isNaN(parsedPrice) || parsedPrice <= 0) {
      setFormErrorMessage("Price must be a positive number.");
      return;
    }

    if (Number.isNaN(parsedStock) || parsedStock < 0) {
      setFormErrorMessage("Stock quantity must be zero or more.");
      return;
    }

    setIsSubmitting(true);

    try {
      await addProduct({
        name: formData.name.trim(),
        description: formData.description.trim(),
        price: parsedPrice,
        stockQuantity: parsedStock,
        category: formData.category.trim(),
        imageUrl: formData.imageUrl.trim(),
      });

      setFormData(initialProductForm);
      setSuccessMessage("Product added successfully.");

      if (hasActiveFilters(filters)) {
        await refreshCatalogMetadata();
      }

      await loadProducts(filters);
    } catch (error) {
      setFormErrorMessage(
        getErrorMessage(
          error,
          "Unable to add the product right now. Please try again.",
        ),
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const isFilteredView = hasActiveFilters(filters);

  return (
    <div className="min-h-screen bg-transparent">
      <Navbar
        user={user}
        title="Admin Dashboard"
        subtitle="Manage the product catalog and publish new inventory."
      />

      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <section className="mb-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <div className="rounded-lg border border-zinc-200 bg-white p-5 shadow-sm">
            <p className="text-sm font-semibold uppercase tracking-wide text-zinc-500">
              Active products
            </p>
            <p className="mt-3 text-3xl font-semibold tracking-tight text-zinc-950">
              {totalProducts}
            </p>
          </div>
          <div className="rounded-lg border border-zinc-200 bg-white p-5 shadow-sm">
            <p className="text-sm font-semibold uppercase tracking-wide text-zinc-500">
              Results shown
            </p>
            <p className="mt-3 text-3xl font-semibold tracking-tight text-zinc-950">
              {products.length}
            </p>
          </div>
          <div className="rounded-lg border border-zinc-200 bg-white p-5 shadow-sm">
            <p className="text-sm font-semibold uppercase tracking-wide text-zinc-500">
              Role
            </p>
            <p className="mt-3 text-3xl font-semibold tracking-tight text-zinc-950">
              {user?.role || "ADMIN"}
            </p>
          </div>
          <div className="rounded-lg border border-zinc-200 bg-white p-5 shadow-sm">
            <p className="text-sm font-semibold uppercase tracking-wide text-zinc-500">
              Quick action
            </p>
            <button
              type="button"
              onClick={() => void handleRefreshCatalog()}
              className="mt-3 rounded-md bg-zinc-900 px-4 py-2 text-sm font-semibold text-white transition hover:bg-zinc-800"
            >
              Refresh catalog
            </button>
          </div>
        </section>

        <section className="grid gap-8 xl:grid-cols-[0.92fr_1.08fr]">
          <div className="rounded-lg border border-zinc-200 bg-white p-6 shadow-sm">
            <div className="mb-6">
              <p className="text-sm font-semibold uppercase tracking-wide text-emerald-700">
                Add product
              </p>
              <h2 className="mt-2 text-2xl font-semibold tracking-tight text-zinc-950">
                Publish a new catalog item
              </h2>
              <p className="mt-2 text-sm text-zinc-600">
                Fill in the product information below and publish it to the
                live catalog.
              </p>
            </div>

            {formErrorMessage ? (
              <div className="mb-5 rounded-lg border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
                {formErrorMessage}
              </div>
            ) : null}

            {successMessage ? (
              <div className="mb-5 rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
                {successMessage}
              </div>
            ) : null}

            <form className="space-y-5" onSubmit={handleSubmit}>
              <label className="block space-y-2 text-sm font-medium text-zinc-700">
                <span>Product name</span>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Wireless Keyboard"
                  className="w-full rounded-md border border-zinc-300 px-4 py-3 text-zinc-900 outline-none transition focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100"
                />
              </label>

              <label className="block space-y-2 text-sm font-medium text-zinc-700">
                <span>Description</span>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  placeholder="Write a short product description"
                  rows="4"
                  className="w-full rounded-md border border-zinc-300 px-4 py-3 text-zinc-900 outline-none transition focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100"
                />
              </label>

              <div className="grid gap-5 sm:grid-cols-2">
                <label className="space-y-2 text-sm font-medium text-zinc-700">
                  <span>Price</span>
                  <input
                    type="number"
                    name="price"
                    value={formData.price}
                    onChange={handleChange}
                    placeholder="4999"
                    min="0"
                    step="0.01"
                    className="w-full rounded-md border border-zinc-300 px-4 py-3 text-zinc-900 outline-none transition focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100"
                  />
                </label>

                <label className="space-y-2 text-sm font-medium text-zinc-700">
                  <span>Stock quantity</span>
                  <input
                    type="number"
                    name="stockQuantity"
                    value={formData.stockQuantity}
                    onChange={handleChange}
                    placeholder="25"
                    min="0"
                    className="w-full rounded-md border border-zinc-300 px-4 py-3 text-zinc-900 outline-none transition focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100"
                  />
                </label>
              </div>

              <div className="grid gap-5 sm:grid-cols-2">
                <label className="space-y-2 text-sm font-medium text-zinc-700">
                  <span>Category</span>
                  <input
                    type="text"
                    name="category"
                    value={formData.category}
                    onChange={handleChange}
                    placeholder="Electronics"
                    className="w-full rounded-md border border-zinc-300 px-4 py-3 text-zinc-900 outline-none transition focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100"
                  />
                </label>

                <label className="space-y-2 text-sm font-medium text-zinc-700">
                  <span>Image URL</span>
                  <input
                    type="url"
                    name="imageUrl"
                    value={formData.imageUrl}
                    onChange={handleChange}
                    placeholder="https://example.com/product.jpg"
                    className="w-full rounded-md border border-zinc-300 px-4 py-3 text-zinc-900 outline-none transition focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100"
                  />
                </label>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full rounded-md bg-zinc-900 px-4 py-3 text-sm font-semibold text-white transition hover:bg-zinc-800 disabled:cursor-not-allowed disabled:bg-zinc-400"
              >
                {isSubmitting ? "Adding product..." : "Add product"}
              </button>
            </form>
          </div>

          <div className="space-y-5">
            <div className="flex items-end justify-between gap-4">
              <div>
                <p className="text-sm font-semibold uppercase tracking-wide text-zinc-500">
                  Catalog overview
                </p>
                <h2 className="mt-2 text-2xl font-semibold tracking-tight text-zinc-950">
                  Current products
                </h2>
              </div>
              <p className="text-sm text-zinc-600">
                Click any card to open the detailed product view.
              </p>
            </div>

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

            {catalogErrorMessage ? (
              <div className="rounded-lg border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
                {catalogErrorMessage}
              </div>
            ) : null}

            {isLoading ? (
              <div className="rounded-lg border border-zinc-200 bg-white px-6 py-12 text-center text-sm text-zinc-600 shadow-sm">
                Loading products...
              </div>
            ) : products.length > 0 ? (
              <div className="grid gap-6 md:grid-cols-2">
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
                    ctaLabel="Open product"
                  />
                ))}
              </div>
            ) : (
              <div className="rounded-lg border border-dashed border-zinc-300 bg-white px-6 py-12 text-center shadow-sm">
                <h3 className="text-lg font-semibold text-zinc-900">No products available</h3>
                <p className="mt-2 text-sm text-zinc-600">
                  {isFilteredView
                    ? "No products match the current search and filter settings."
                    : "Add the first product using the form to the left."}
                </p>
              </div>
            )}
          </div>
        </section>
      </main>
    </div>
  );
}

export default AdminDashboard;
