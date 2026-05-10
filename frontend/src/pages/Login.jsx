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
  const [successMessage, setSuccessMessage] = useState("");
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
    setSuccessMessage("");
    setIsSubmitting(true);

    try {
      const response = await loginUser({
        email: formData.email.trim(),
        password: formData.password,
      });

      const user = storeAuthToken(response.data);
      setSuccessMessage("Login successful. Redirecting...");
      window.setTimeout(() => {
        navigate(getHomeRouteForRole(user.role), { replace: true });
      }, 700);
    } catch (error) {
      setErrorMessage(
        getErrorMessage(error, "Invalid login. Please check your credentials."),
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="min-h-screen bg-slate-100">
      {errorMessage || successMessage ? (
        <div
          className={`fixed right-4 top-4 z-50 max-w-sm border px-4 py-3 text-sm font-bold shadow-lg ${
            errorMessage
              ? "border-rose-200 bg-rose-50 text-rose-700"
              : "border-emerald-200 bg-emerald-50 text-emerald-700"
          }`}
        >
          {errorMessage || successMessage}
        </div>
      ) : null}

      <div className="grid min-h-screen lg:grid-cols-[0.9fr_1.1fr]">
        <section className="order-2 flex items-center justify-center px-6 py-12 sm:px-10 lg:order-1 lg:px-16">
          <div className="w-full max-w-md bg-white p-8 shadow-sm ring-1 ring-slate-200 sm:p-10">
            <div className="mb-8 space-y-2">
              <p className="text-sm font-black uppercase text-sky-700">
                Welcome back
              </p>
              <h1 className="text-3xl font-black tracking-tight text-slate-950">
                Login to continue
              </h1>
              <p className="text-sm font-medium text-slate-500">
                Sign in with the account you created to enter your workspace.
              </p>
            </div>

            {errorMessage ? (
              <div className="mb-6 border border-rose-200 bg-rose-50 px-4 py-3 text-sm font-semibold text-rose-700">
                {errorMessage}
              </div>
            ) : null}

            {successMessage ? (
              <div className="mb-6 border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-semibold text-emerald-700">
                {successMessage}
              </div>
            ) : null}

            <form className="space-y-5" onSubmit={handleSubmit}>
              <label className="block space-y-2 text-sm font-bold text-slate-700">
                <span>Email address</span>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="you@example.com"
                  className="h-12 w-full rounded-md border border-slate-300 px-4 text-slate-950 outline-none transition focus:border-sky-400 focus:ring-4 focus:ring-sky-100"
                />
              </label>

              <label className="block space-y-2 text-sm font-bold text-slate-700">
                <span>Password</span>
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Enter your password"
                  className="h-12 w-full rounded-md border border-slate-300 px-4 text-slate-950 outline-none transition focus:border-sky-400 focus:ring-4 focus:ring-sky-100"
                />
              </label>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full rounded-md bg-slate-950 px-4 py-3 text-sm font-black text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:bg-slate-300"
              >
                {isSubmitting ? "Signing in..." : "Login"}
              </button>
            </form>

            <p className="mt-6 text-sm font-medium text-slate-600">
              Need an account?{" "}
              <Link to="/" className="font-black text-sky-700 hover:text-sky-800">
                Register here
              </Link>
            </p>
          </div>
        </section>

        <section className="order-1 flex items-center bg-white px-6 py-12 sm:px-10 lg:order-2 lg:px-16">
          <div className="mx-auto max-w-xl space-y-8">
            <div className="space-y-4">
              <p className="inline-flex rounded-full bg-slate-950 px-4 py-2 text-sm font-black text-white">
                Role-based access routing
              </p>
              <h2 className="text-4xl font-black tracking-tight text-slate-950 sm:text-5xl">
                One login, the right workspace.
              </h2>
              <p className="text-base font-medium text-slate-600 sm:text-lg">
                Customer accounts open the product catalog, and admin accounts
                open dedicated catalog management pages.
              </p>
            </div>

            <div className="grid gap-4 sm:grid-cols-3">
              <div className="border border-slate-200 bg-slate-50 p-5">
                <p className="text-2xl font-black text-slate-950">1</p>
                <p className="mt-3 text-sm font-medium text-slate-600">
                  Protected sign-in keeps access limited to registered users.
                </p>
              </div>
              <div className="border border-slate-200 bg-slate-50 p-5">
                <p className="text-2xl font-black text-sky-700">2</p>
                <p className="mt-3 text-sm font-medium text-slate-600">
                  Your account opens the right workspace automatically.
                </p>
              </div>
              <div className="border border-slate-200 bg-slate-50 p-5">
                <p className="text-2xl font-black text-amber-600">3</p>
                <p className="mt-3 text-sm font-medium text-slate-600">
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
