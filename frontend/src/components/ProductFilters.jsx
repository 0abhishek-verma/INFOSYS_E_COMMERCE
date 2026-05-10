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
    <section className="mb-5 bg-white px-4 py-4 shadow-sm ring-1 ring-slate-200 sm:px-5">
      <form
        className="grid gap-3 xl:grid-cols-[1.5fr_0.85fr_0.65fr_0.65fr_auto_auto]"
        onSubmit={onApply}
      >
        <label className="space-y-1 text-sm font-bold text-slate-700">
          <span>Product</span>
          <input
            type="text"
            name="name"
            value={filters.name}
            onChange={onChange}
            placeholder="Search by name"
            className="h-11 w-full rounded-md border border-slate-300 px-3 text-slate-950 outline-none transition focus:border-sky-400 focus:ring-4 focus:ring-sky-100"
          />
        </label>

        <label className="space-y-1 text-sm font-bold text-slate-700">
          <span>Category</span>
          <select
            name="category"
            value={filters.category}
            onChange={onChange}
            className="h-11 w-full rounded-md border border-slate-300 bg-white px-3 text-slate-950 outline-none transition focus:border-sky-400 focus:ring-4 focus:ring-sky-100"
          >
            <option value="">All categories</option>
            {categories.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
        </label>

        <label className="space-y-1 text-sm font-bold text-slate-700">
          <span>Min</span>
          <input
            type="number"
            name="minPrice"
            value={filters.minPrice}
            onChange={onChange}
            min="0"
            step="0.01"
            placeholder="0"
            className="h-11 w-full rounded-md border border-slate-300 px-3 text-slate-950 outline-none transition focus:border-sky-400 focus:ring-4 focus:ring-sky-100"
          />
        </label>

        <label className="space-y-1 text-sm font-bold text-slate-700">
          <span>Max</span>
          <input
            type="number"
            name="maxPrice"
            value={filters.maxPrice}
            onChange={onChange}
            min="0"
            step="0.01"
            placeholder="50000"
            className="h-11 w-full rounded-md border border-slate-300 px-3 text-slate-950 outline-none transition focus:border-sky-400 focus:ring-4 focus:ring-sky-100"
          />
        </label>

        <button
          type="submit"
          disabled={isLoading}
          className="self-end rounded-md bg-slate-950 px-5 py-3 text-sm font-black text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:bg-slate-300"
        >
          {isLoading ? "Searching" : "Apply"}
        </button>

        <button
          type="button"
          onClick={onClear}
          disabled={isLoading}
          className="self-end rounded-md border border-slate-300 bg-white px-5 py-3 text-sm font-black text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:text-slate-400"
        >
          Clear
        </button>
      </form>

      <p className="mt-3 text-xs font-semibold text-slate-500">
        Showing {resultCount}
        {hasTotalCount ? ` of ${totalCount}` : ""} products
      </p>
    </section>
  );
}

export default ProductFilters;
