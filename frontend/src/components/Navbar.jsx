import { Link, useLocation, useNavigate } from "react-router-dom";
import { clearAuth, getHomeRouteForRole } from "../services/api";

function Navbar({ user, title, subtitle }) {
  const location = useLocation();
  const navigate = useNavigate();
  const homePath = getHomeRouteForRole(user?.role);
  const homeLabel = user?.role === "ADMIN" ? "Admin Dashboard" : "Dashboard";

  const handleLogout = () => {
    clearAuth();
    navigate("/login", { replace: true });
  };

  return (
    <header className="border-b border-zinc-200 bg-white/85 backdrop-blur">
      <div className="mx-auto flex max-w-7xl flex-col gap-4 px-4 py-4 sm:px-6 lg:flex-row lg:items-center lg:justify-between lg:px-8">
        <div className="space-y-2">
          <div className="flex flex-wrap items-center gap-3">
            <Link
              to={homePath}
              className="text-lg font-semibold tracking-tight text-zinc-900"
            >
              Infosys Commerce
            </Link>
            <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold tracking-wide text-emerald-700">
              {user?.role || "USER"}
            </span>
          </div>
          <div>
            <h1 className="text-2xl font-semibold tracking-tight text-zinc-950">
              {title}
            </h1>
            {subtitle ? (
              <p className="text-sm text-zinc-600">{subtitle}</p>
            ) : null}
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {location.pathname !== homePath ? (
            <Link
              to={homePath}
              className="rounded-md border border-zinc-200 px-4 py-2 text-sm font-medium text-zinc-700 transition hover:border-zinc-300 hover:bg-zinc-50"
            >
              {homeLabel}
            </Link>
          ) : null}

          <div className="min-w-[140px] rounded-md border border-zinc-200 bg-zinc-50 px-4 py-2 text-sm text-zinc-700">
            <p className="font-medium text-zinc-900">{user?.name || "Signed in"}</p>
            <p className="truncate text-xs text-zinc-500">{user?.email}</p>
          </div>

          <button
            type="button"
            onClick={handleLogout}
            className="rounded-md bg-zinc-900 px-4 py-2 text-sm font-semibold text-white transition hover:bg-zinc-800"
          >
            Logout
          </button>
        </div>
      </div>
    </header>
  );
}

export default Navbar;
