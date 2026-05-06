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
    <section className="mb-5 bg-white px-4 py-4 shadow-sm ring-1 ring-zinc-200 sm:px-5">
      <form
        className="grid gap-3 xl:grid-cols-[1.5fr_0.85fr_0.65fr_0.65fr_auto_auto]"
        onSubmit={onApply}
      >
        <label className="space-y-1 text-sm font-semibold text-zinc-700">
          <span>Product</span>
          <input
            type="text"
            name="name"
            value={filters.name}
            onChange={onChange}
            placeholder="Search by name"
            className="h-11 w-full rounded-sm border border-zinc-300 px-3 text-zinc-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
          />
        </label>

        <label className="space-y-1 text-sm font-semibold text-zinc-700">
          <span>Category</span>
          <select
            name="category"
            value={filters.category}
            onChange={onChange}
            className="h-11 w-full rounded-sm border border-zinc-300 bg-white px-3 text-zinc-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
          >
            <option value="">All categories</option>
            {categories.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
        </label>

        <label className="space-y-1 text-sm font-semibold text-zinc-700">
          <span>Min</span>
          <input
            type="number"
            name="minPrice"
            value={filters.minPrice}
            onChange={onChange}
            min="0"
            step="0.01"
            placeholder="0"
            className="h-11 w-full rounded-sm border border-zinc-300 px-3 text-zinc-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
          />
        </label>

        <label className="space-y-1 text-sm font-semibold text-zinc-700">
          <span>Max</span>
          <input
            type="number"
            name="maxPrice"
            value={filters.maxPrice}
            onChange={onChange}
            min="0"
            step="0.01"
            placeholder="50000"
            className="h-11 w-full rounded-sm border border-zinc-300 px-3 text-zinc-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
          />
        </label>

        <button
          type="submit"
          disabled={isLoading}
          className="self-end rounded-sm bg-blue-600 px-5 py-3 text-sm font-bold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-zinc-400"
        >
          {isLoading ? "Searching" : "Apply"}
        </button>

        <button
          type="button"
          onClick={onClear}
          disabled={isLoading}
          className="self-end rounded-sm border border-zinc-300 bg-white px-5 py-3 text-sm font-bold text-zinc-700 transition hover:bg-zinc-50 disabled:cursor-not-allowed disabled:text-zinc-400"
        >
          Clear
        </button>
      </form>

      <p className="mt-3 text-xs font-medium text-zinc-500">
        Showing {resultCount}
        {hasTotalCount ? ` of ${totalCount}` : ""} products
      </p>
    </section>
  );
}

export default ProductFilters;
