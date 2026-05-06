import { Link, useLocation, useNavigate } from "react-router-dom";
import { useCart } from "../context/useCart";
import { clearAuth, getHomeRouteForRole } from "../services/api";

function Navbar({ user, title, subtitle }) {
  const location = useLocation();
  const navigate = useNavigate();
  const { itemCount } = useCart();
  const homePath = getHomeRouteForRole(user?.role);
  const isCustomer = user?.role === "USER";

  const handleLogout = () => {
    clearAuth();
    navigate("/login", { replace: true });
  };

  return (
    <header className="sticky top-0 z-40 border-b border-blue-700 bg-blue-600 text-white shadow-sm">
      <div className="mx-auto flex max-w-7xl flex-col gap-3 px-4 py-3 sm:px-6 lg:flex-row lg:items-center lg:px-8">
        <div className="flex items-center justify-between gap-4">
          <Link to={homePath} className="flex items-center gap-2">
            <span className="grid h-9 w-9 place-items-center rounded-md bg-yellow-300 text-lg font-black text-blue-700">
              IC
            </span>
            <span>
              <span className="block text-lg font-bold leading-none tracking-tight">
                Infosys Cart
              </span>
              <span className="text-[11px] font-semibold text-blue-100">
                Explore Plus
              </span>
            </span>
          </Link>

          {isCustomer ? (
            <Link
              to="/cart"
              className="relative rounded-md bg-white px-3 py-2 text-sm font-semibold text-blue-700 shadow-sm lg:hidden"
            >
              Cart
              {itemCount > 0 ? (
                <span className="absolute -right-2 -top-2 grid h-5 min-w-5 place-items-center rounded-full bg-yellow-300 px-1 text-xs text-zinc-950">
                  {itemCount}
                </span>
              ) : null}
            </Link>
          ) : null}
        </div>

        <div className="flex-1 lg:px-5">
          <label className="relative block">
            <span className="sr-only">Search products</span>
            <input
              type="search"
              placeholder="Search for products, brands and categories"
              className="h-11 w-full rounded-sm border-0 bg-white px-4 pr-12 text-sm text-zinc-900 outline-none ring-0 placeholder:text-zinc-500"
            />
            <span className="absolute right-4 top-1/2 -translate-y-1/2 text-blue-600">
              Search
            </span>
          </label>
        </div>

        <nav className="flex flex-wrap items-center gap-2 text-sm font-semibold">
          {location.pathname !== homePath ? (
            <Link
              to={homePath}
              className="rounded-md px-3 py-2 text-blue-50 transition hover:bg-blue-700"
            >
              Home
            </Link>
          ) : null}

          {isCustomer ? (
            <Link
              to="/cart"
              className="relative hidden rounded-md px-3 py-2 text-blue-50 transition hover:bg-blue-700 lg:inline-flex"
            >
              Cart
              {itemCount > 0 ? (
                <span className="ml-2 rounded-full bg-yellow-300 px-2 py-0.5 text-xs text-zinc-950">
                  {itemCount}
                </span>
              ) : null}
            </Link>
          ) : null}

          <div className="hidden min-w-[136px] rounded-md bg-blue-700 px-3 py-2 lg:block">
            <p className="truncate text-sm text-white">{user?.name || "Signed in"}</p>
            <p className="truncate text-[11px] text-blue-100">{user?.email}</p>
          </div>

          <button
            type="button"
            onClick={handleLogout}
            className="rounded-md bg-white px-4 py-2 text-sm font-bold text-blue-700 transition hover:bg-blue-50"
          >
            Logout
          </button>
        </nav>
      </div>

      {title ? (
        <div className="border-t border-blue-500 bg-blue-700/55">
          <div className="mx-auto max-w-7xl px-4 py-2 sm:px-6 lg:px-8">
            <h1 className="text-base font-semibold">{title}</h1>
            {subtitle ? <p className="text-xs text-blue-100">{subtitle}</p> : null}
          </div>
        </div>
      ) : null}
    </header>
  );
}

export default Navbar;
