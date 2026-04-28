import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  getErrorMessage,
  getHomeRouteForRole,
  getStoredUser,
  getToken,
  isTokenValid,
  loginUser,
  storeAuthToken,
} from "../services/api";

function Login() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [errorMessage, setErrorMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const token = getToken();
    const user = getStoredUser();

    if (token && isTokenValid(token) && user?.role) {
      navigate(getHomeRouteForRole(user.role), { replace: true });
    }
  }, [navigate]);

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((currentState) => ({
      ...currentState,
      [name]: value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setErrorMessage("");
    setIsSubmitting(true);

    try {
      const response = await loginUser({
        email: formData.email.trim(),
        password: formData.password,
      });

      const user = storeAuthToken(response.data);
      navigate(getHomeRouteForRole(user.role), { replace: true });
    } catch (error) {
      setErrorMessage(
        getErrorMessage(error, "Invalid login. Please check your credentials."),
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="min-h-screen">
      <div className="grid min-h-screen lg:grid-cols-[0.92fr_1.08fr]">
        <section className="order-2 flex items-center justify-center bg-white px-6 py-12 sm:px-10 lg:order-1 lg:px-16">
          <div className="w-full max-w-md rounded-lg border border-zinc-200 p-8 shadow-lg shadow-zinc-200/50 sm:p-10">
            <div className="mb-8 space-y-2">
              <p className="text-sm font-semibold uppercase tracking-wide text-emerald-700">
                Welcome back
              </p>
              <h1 className="text-3xl font-semibold tracking-tight text-zinc-950">
                Login to continue
              </h1>
              <p className="text-sm text-zinc-600">
                Sign in with the account you created to enter your workspace.
              </p>
            </div>

            {errorMessage ? (
              <div className="mb-6 rounded-lg border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
                {errorMessage}
              </div>
            ) : null}

            <form className="space-y-5" onSubmit={handleSubmit}>
              <label className="block space-y-2 text-sm font-medium text-zinc-700">
                <span>Email address</span>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="you@example.com"
                  className="w-full rounded-md border border-zinc-300 px-4 py-3 text-zinc-900 outline-none transition focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100"
                />
              </label>

              <label className="block space-y-2 text-sm font-medium text-zinc-700">
                <span>Password</span>
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Enter your password"
                  className="w-full rounded-md border border-zinc-300 px-4 py-3 text-zinc-900 outline-none transition focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100"
                />
              </label>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full rounded-md bg-zinc-900 px-4 py-3 text-sm font-semibold text-white transition hover:bg-zinc-800 disabled:cursor-not-allowed disabled:bg-zinc-400"
              >
                {isSubmitting ? "Signing in..." : "Login"}
              </button>
            </form>

            <p className="mt-6 text-sm text-zinc-600">
              Need an account?{" "}
              <Link to="/" className="font-semibold text-emerald-700 hover:text-emerald-800">
                Register here
              </Link>
            </p>
          </div>
        </section>

        <section className="order-1 flex items-center px-6 py-12 sm:px-10 lg:order-2 lg:px-16">
          <div className="mx-auto max-w-xl space-y-8">
            <div className="space-y-4">
              <p className="inline-flex rounded-full bg-amber-50 px-4 py-2 text-sm font-semibold text-amber-700">
                Role-based access routing
              </p>
              <h2 className="text-4xl font-semibold tracking-tight text-zinc-950 sm:text-5xl">
                Pick up right where your shopping or product work left off.
              </h2>
              <p className="text-base text-zinc-600 sm:text-lg">
                Customer accounts open the product catalog, and admin accounts
                head straight into catalog management.
              </p>
            </div>

            <div className="grid gap-4 sm:grid-cols-3">
              <div className="rounded-lg border border-zinc-200 bg-white p-5 shadow-sm">
                <p className="text-2xl font-semibold text-zinc-950">1</p>
                <p className="mt-3 text-sm text-zinc-600">
                  Protected sign-in keeps access limited to registered users.
                </p>
              </div>
              <div className="rounded-lg border border-zinc-200 bg-white p-5 shadow-sm">
                <p className="text-2xl font-semibold text-zinc-950">2</p>
                <p className="mt-3 text-sm text-zinc-600">
                  Your account opens the right workspace automatically.
                </p>
              </div>
              <div className="rounded-lg border border-zinc-200 bg-white p-5 shadow-sm">
                <p className="text-2xl font-semibold text-zinc-950">3</p>
                <p className="mt-3 text-sm text-zinc-600">
                  Browse products or manage inventory without switching apps.
                </p>
              </div>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}

export default Login;
