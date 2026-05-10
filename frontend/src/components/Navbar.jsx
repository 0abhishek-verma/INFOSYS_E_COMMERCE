import { Link, useLocation, useNavigate } from "react-router-dom";
import { useCart } from "../context/useCart";
import { clearAuth, getHomeRouteForRole } from "../services/api";

function Navbar({ user, title, subtitle }) {
  const location = useLocation();
  const navigate = useNavigate();
  const { itemCount } = useCart();
  const homePath = getHomeRouteForRole(user?.role);
  const isCustomer = user?.role === "USER";
  const isAdmin = user?.role === "ADMIN";

  const handleLogout = () => {
    clearAuth();
    navigate("/login", { replace: true });
  };

  return (
    <header className="sticky top-0 z-40 border-b border-slate-200 bg-white text-slate-950 shadow-sm">
      <div className="mx-auto flex max-w-7xl flex-col gap-3 px-4 py-3 sm:px-6 lg:flex-row lg:items-center lg:px-8">
        <div className="flex items-center justify-between gap-4">
          <Link to={homePath} className="flex items-center gap-2">
            <span className="grid h-9 w-9 place-items-center rounded-md bg-slate-950 text-lg font-black text-white">
              IC
            </span>
            <span>
              <span className="block text-lg font-bold leading-none tracking-tight">
                Infosys Cart
              </span>
              <span className="text-[11px] font-semibold text-slate-500">
                Commerce Console
              </span>
            </span>
          </Link>

          {isCustomer ? (
            <div className="flex items-center gap-2 lg:hidden">
              <Link
                to="/orders"
                className="rounded-md px-3 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-100"
              >
                Orders
              </Link>
              <Link
                to="/cart"
                className="relative rounded-md bg-slate-950 px-3 py-2 text-sm font-semibold text-white shadow-sm"
              >
                Cart
                {itemCount > 0 ? (
                  <span className="absolute -right-2 -top-2 grid h-5 min-w-5 place-items-center rounded-full bg-amber-400 px-1 text-xs text-slate-950">
                    {itemCount}
                  </span>
                ) : null}
              </Link>
            </div>
          ) : null}
        </div>

        <div className="flex-1 lg:px-5">
          <label className="relative block">
            <span className="sr-only">Search products</span>
            <input
              type="search"
              placeholder="Search for products, brands and categories"
              className="h-11 w-full rounded-md border border-slate-200 bg-slate-50 px-4 pr-12 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-sky-400 focus:bg-white focus:ring-4 focus:ring-sky-100"
            />
            <span className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500">
              Search
            </span>
          </label>
        </div>

        <nav className="flex flex-wrap items-center gap-2 text-sm font-semibold">
          {location.pathname !== homePath ? (
            <Link
              to={homePath}
              className="rounded-md px-3 py-2 text-slate-700 transition hover:bg-slate-100"
            >
              Home
            </Link>
          ) : null}

          {isAdmin ? (
            <>
              <Link
                to="/admin/products"
                className="rounded-md px-3 py-2 text-slate-700 transition hover:bg-slate-100"
              >
                Products
              </Link>
              <Link
                to="/admin/add-product"
                className="rounded-md bg-sky-600 px-3 py-2 text-white transition hover:bg-sky-700"
              >
                Add product
              </Link>
            </>
          ) : null}

          {isCustomer ? (
            <>
              <Link
                to="/orders"
                className="hidden rounded-md px-3 py-2 text-slate-700 transition hover:bg-slate-100 lg:inline-flex"
              >
                Orders
              </Link>
              <Link
                to="/cart"
                className="relative hidden rounded-md px-3 py-2 text-slate-700 transition hover:bg-slate-100 lg:inline-flex"
              >
                Cart
                {itemCount > 0 ? (
                  <span className="ml-2 rounded-full bg-amber-400 px-2 py-0.5 text-xs text-slate-950">
                    {itemCount}
                  </span>
                ) : null}
              </Link>
            </>
          ) : null}

          <div className="hidden min-w-[136px] rounded-md bg-slate-100 px-3 py-2 lg:block">
            <p className="truncate text-sm text-slate-950">{user?.name || "Signed in"}</p>
            <p className="truncate text-[11px] text-slate-500">{user?.email}</p>
          </div>

          <button
            type="button"
            onClick={handleLogout}
            className="rounded-md border border-slate-200 bg-white px-4 py-2 text-sm font-bold text-slate-700 transition hover:bg-slate-100"
          >
            Logout
          </button>
        </nav>
      </div>

      {title ? (
        <div className="border-t border-slate-200 bg-slate-50">
          <div className="mx-auto max-w-7xl px-4 py-2 sm:px-6 lg:px-8">
            <h1 className="text-base font-semibold">{title}</h1>
            {subtitle ? <p className="text-xs text-slate-500">{subtitle}</p> : null}
          </div>
        </div>
      ) : null}
    </header>
  );
}

export default Navbar;
