function ProductFilters({
  filters,
  categories = [],
  onChange,
  onApply,
  onClear,
  isLoading = false,
  resultCount = 0,
  totalCount = 0,
}) {
  const hasTotalCount = Number.isFinite(totalCount) && totalCount > 0;

  return (
    <section className="mb-6 rounded-lg border border-zinc-200 bg-white p-5 shadow-sm">
      <div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
        <div>
          <p className="text-sm font-semibold uppercase tracking-wide text-emerald-700">
            Search and filter
          </p>
          <h3 className="mt-2 text-xl font-semibold tracking-tight text-zinc-950">
            Narrow the catalog quickly
          </h3>
          <p className="mt-2 text-sm text-zinc-600">
            Search by product name, filter by category, or set a price range.
          </p>
        </div>

        <div className="rounded-lg bg-zinc-50 px-4 py-3 text-sm text-zinc-700">
          <p className="font-semibold text-zinc-900">
            Showing {resultCount}
            {hasTotalCount ? ` of ${totalCount}` : ""} products
          </p>
          <p className="mt-1 text-xs text-zinc-500">
            Clear filters to return to the full catalog.
          </p>
        </div>
      </div>

      <form className="mt-5 grid gap-4 xl:grid-cols-[1.4fr_0.9fr_0.7fr_0.7fr_auto_auto]" onSubmit={onApply}>
        <label className="space-y-2 text-sm font-medium text-zinc-700">
          <span>Search</span>
          <input
            type="text"
            name="name"
            value={filters.name}
            onChange={onChange}
            placeholder="Search by product name"
            className="w-full rounded-md border border-zinc-300 px-4 py-3 text-zinc-900 outline-none transition focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100"
          />
        </label>

        <label className="space-y-2 text-sm font-medium text-zinc-700">
          <span>Category</span>
          <select
            name="category"
            value={filters.category}
            onChange={onChange}
            className="w-full rounded-md border border-zinc-300 bg-white px-4 py-3 text-zinc-900 outline-none transition focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100"
          >
            <option value="">All categories</option>
            {categories.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
        </label>

        <label className="space-y-2 text-sm font-medium text-zinc-700">
          <span>Min price</span>
          <input
            type="number"
            name="minPrice"
            value={filters.minPrice}
            onChange={onChange}
            min="0"
            step="0.01"
            placeholder="0"
            className="w-full rounded-md border border-zinc-300 px-4 py-3 text-zinc-900 outline-none transition focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100"
          />
        </label>

        <label className="space-y-2 text-sm font-medium text-zinc-700">
          <span>Max price</span>
          <input
            type="number"
            name="maxPrice"
            value={filters.maxPrice}
            onChange={onChange}
            min="0"
            step="0.01"
            placeholder="10000"
            className="w-full rounded-md border border-zinc-300 px-4 py-3 text-zinc-900 outline-none transition focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100"
          />
        </label>

        <button
          type="submit"
          disabled={isLoading}
          className="self-end rounded-md bg-zinc-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-zinc-800 disabled:cursor-not-allowed disabled:bg-zinc-400"
        >
          {isLoading ? "Searching..." : "Apply"}
        </button>

        <button
          type="button"
          onClick={onClear}
          disabled={isLoading}
          className="self-end rounded-md border border-zinc-300 bg-white px-5 py-3 text-sm font-semibold text-zinc-700 transition hover:border-zinc-400 hover:bg-zinc-50 disabled:cursor-not-allowed disabled:text-zinc-400"
        >
          Clear
        </button>
      </form>
    </section>
  );
}

export default ProductFilters;
