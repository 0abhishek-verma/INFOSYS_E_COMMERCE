import { useCallback, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import ProductCard from "../components/ProductCard";
import ProductFilters from "../components/ProductFilters";
import {
  getErrorMessage,
  getProducts,
  getStoredUser,
  removeProduct,
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

function AdminProducts() {
  const navigate = useNavigate();
  const user = getStoredUser();
  const [products, setProducts] = useState([]);
  const [filters, setFilters] = useState(initialFilters);
  const [availableCategories, setAvailableCategories] = useState([]);
  const [totalProducts, setTotalProducts] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [removingProductId, setRemovingProductId] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

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
      setErrorMessage("");
      setSuccessMessage("");

      try {
        if (hasActiveFilters(nextFilters)) {
          const response = await searchProducts(nextFilters);
          setProducts(Array.isArray(response.data) ? response.data : []);
          await refreshCatalogMetadata();
        } else {
          setProducts(await refreshCatalogMetadata());
        }
      } catch (error) {
        setErrorMessage(
          getErrorMessage(error, "Unable to load products right now."),
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

  const handleFilterChange = (event) => {
    const { name, value } = event.target;

    setFilters((currentFilters) => ({
      ...currentFilters,
      [name]: value,
    }));
  };

  const handleApplyFilters = async (event) => {
    event.preventDefault();

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

  const handleRemoveProduct = async (productId) => {
    const shouldRemove = window.confirm("Remove this product from the catalog?");

    if (!shouldRemove) {
      return;
    }

    setRemovingProductId(productId);
    setErrorMessage("");
    setSuccessMessage("");

    try {
      await removeProduct(productId);
      await loadProducts(filters);
      setSuccessMessage("Product removed successfully.");
    } catch (error) {
      setErrorMessage(getErrorMessage(error, "Unable to remove this product right now."));
    } finally {
      setRemovingProductId(null);
    }
  };

  const lowStockCount = products.filter(
    (product) => Number(product.stockQuantity || 0) <= 5,
  ).length;
  const isFilteredView = hasActiveFilters(filters);

  return (
    <div className="min-h-screen bg-slate-100">
      <Navbar
        user={user}
        title="Product Catalog"
        subtitle="Review inventory, search the catalog, and open product records."
      />

      <main className="mx-auto max-w-7xl px-3 py-5 sm:px-6 lg:px-8">
        <section className="mb-5 grid gap-4 lg:grid-cols-[1fr_auto] lg:items-end">
          <div>
            <p className="text-sm font-black uppercase text-sky-700">Admin workspace</p>
            <h1 className="mt-2 text-3xl font-black tracking-tight text-slate-950 sm:text-4xl">
              Products
            </h1>
            <p className="mt-2 max-w-2xl text-sm font-medium text-slate-600">
              Keep the catalog tidy with quick search, stock visibility, and a
              separate creation flow.
            </p>
          </div>
          <Link
            to="/admin/add-product"
            className="rounded-md bg-sky-600 px-5 py-3 text-center text-sm font-black text-white shadow-sm transition hover:bg-sky-700"
          >
            Add product
          </Link>
        </section>

        <section className="mb-5 grid gap-3 sm:grid-cols-3">
          <div className="bg-white p-5 shadow-sm ring-1 ring-slate-200">
            <p className="text-xs font-black uppercase text-slate-500">Active products</p>
            <p className="mt-2 text-3xl font-black text-slate-950">{totalProducts}</p>
          </div>
          <div className="bg-white p-5 shadow-sm ring-1 ring-slate-200">
            <p className="text-xs font-black uppercase text-slate-500">Results shown</p>
            <p className="mt-2 text-3xl font-black text-slate-950">{products.length}</p>
          </div>
          <div className="bg-white p-5 shadow-sm ring-1 ring-slate-200">
            <p className="text-xs font-black uppercase text-slate-500">Low stock</p>
            <p className="mt-2 text-3xl font-black text-amber-600">{lowStockCount}</p>
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
          <div className="mb-5 border border-rose-200 bg-rose-50 px-4 py-3 text-sm font-semibold text-rose-700">
            {errorMessage}
          </div>
        ) : null}

        {successMessage ? (
          <div className="mb-5 border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-semibold text-emerald-700">
            {successMessage}
          </div>
        ) : null}

        {isLoading ? (
          <div className="bg-white px-6 py-12 text-center text-sm font-semibold text-slate-600 shadow-sm ring-1 ring-slate-200">
            Loading products...
          </div>
        ) : products.length > 0 ? (
          <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {products.map((product) => (
              <div key={product.id} className="flex h-full flex-col gap-2">
                <ProductCard
                  productId={product.id}
                  name={product.name}
                  price={product.price}
                  image={product.imageUrl}
                  category={product.category}
                  description={product.description}
                  stockQuantity={product.stockQuantity}
                  onViewDetails={() => navigate(`/products/${product.id}`)}
                  ctaLabel="Open product"
                  showAddButton={false}
                />
                <button
                  type="button"
                  onClick={() => handleRemoveProduct(product.id)}
                  disabled={removingProductId === product.id}
                  className="rounded-md bg-rose-600 px-4 py-2 text-sm font-black text-white transition hover:bg-rose-700 disabled:cursor-not-allowed disabled:bg-slate-300"
                >
                  {removingProductId === product.id ? "Removing..." : "Remove product"}
                </button>
              </div>
            ))}
          </section>
        ) : (
          <div className="border border-dashed border-slate-300 bg-white px-6 py-12 text-center shadow-sm">
            <h3 className="text-lg font-black text-slate-950">No products found</h3>
            <p className="mt-2 text-sm text-slate-600">
              {isFilteredView
                ? "No products match the current filters."
                : "Add the first product to start building your catalog."}
            </p>
          </div>
        )}
      </main>
    </div>
  );
}

export default AdminProducts;
