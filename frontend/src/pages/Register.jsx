import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  getErrorMessage,
  getHomeRouteForRole,
  getStoredUser,
  getToken,
  isTokenValid,
  registerUser,
} from "../services/api";

const initialFormState = {
  name: "",
  email: "",
  phone: "",
  password: "",
  confirmPassword: "",
  adminKey: "",
};

function Register() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState(initialFormState);
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

    if (formData.password !== formData.confirmPassword) {
      setErrorMessage("Passwords do not match.");
      return;
    }

    if (!formData.name || !formData.email || !formData.phone || !formData.password) {
      setErrorMessage("Please complete all required fields.");
      return;
    }

    setIsSubmitting(true);

    try {
      await registerUser({
        name: formData.name.trim(),
        email: formData.email.trim(),
        phone: formData.phone.trim(),
        password: formData.password,
        adminKey: formData.adminKey.trim(),
      });

      setSuccessMessage("Registration successful. Redirecting to login...");
      setFormData(initialFormState);

      window.setTimeout(() => {
        navigate("/login", { replace: true });
      }, 900);
    } catch (error) {
      setErrorMessage(
        getErrorMessage(
          error,
          "Unable to create your account right now. Please try again.",
        ),
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="min-h-screen">
      <div className="grid min-h-screen lg:grid-cols-[1.1fr_0.9fr]">
        <section className="flex items-center px-6 py-12 sm:px-10 lg:px-16">
          <div className="mx-auto max-w-xl space-y-8">
            <div className="space-y-4">
              <p className="inline-flex rounded-full bg-emerald-50 px-4 py-2 text-sm font-semibold text-emerald-700">
                Secure ecommerce onboarding
              </p>
              <h1 className="text-4xl font-semibold tracking-tight text-zinc-950 sm:text-5xl">
                Create your storefront access in a few clean steps.
              </h1>
              <p className="text-base text-zinc-600 sm:text-lg">
                Register as a shopper by default, or provide the optional admin
                key to open the product management workspace after login.
              </p>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="rounded-lg border border-zinc-200 bg-white p-5 shadow-sm">
                <p className="text-sm font-semibold text-zinc-900">User access</p>
                <p className="mt-2 text-sm text-zinc-600">
                  Browse protected products, view details, and manage your
                  session with JWT-based login.
                </p>
              </div>
              <div className="rounded-lg border border-zinc-200 bg-white p-5 shadow-sm">
                <p className="text-sm font-semibold text-zinc-900">Admin access</p>
                <p className="mt-2 text-sm text-zinc-600">
                  Add new products, review inventory at a glance, and control
                  catalog updates from one dashboard.
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="flex items-center justify-center bg-white px-6 py-12 sm:px-10 lg:px-16">
          <div className="w-full max-w-lg rounded-lg border border-zinc-200 p-8 shadow-lg shadow-zinc-200/50 sm:p-10">
            <div className="mb-8 space-y-2">
              <h2 className="text-3xl font-semibold tracking-tight text-zinc-950">
                Register
              </h2>
              <p className="text-sm text-zinc-600">
                Use the same email and password later on the login page.
              </p>
            </div>

            {errorMessage ? (
              <div className="mb-6 rounded-lg border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
                {errorMessage}
              </div>
            ) : null}

            {successMessage ? (
              <div className="mb-6 rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
                {successMessage}
              </div>
            ) : null}

            <form className="space-y-5" onSubmit={handleSubmit}>
              <div className="grid gap-5 sm:grid-cols-2">
                <label className="space-y-2 text-sm font-medium text-zinc-700">
                  <span>Full name</span>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Aarav Mehta"
                    className="w-full rounded-md border border-zinc-300 px-4 py-3 text-zinc-900 outline-none transition focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100"
                  />
                </label>

                <label className="space-y-2 text-sm font-medium text-zinc-700">
                  <span>Phone</span>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="9876543210"
                    className="w-full rounded-md border border-zinc-300 px-4 py-3 text-zinc-900 outline-none transition focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100"
                  />
                </label>
              </div>

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

              <div className="grid gap-5 sm:grid-cols-2">
                <label className="space-y-2 text-sm font-medium text-zinc-700">
                  <span>Password</span>
                  <input
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="Create a strong password"
                    className="w-full rounded-md border border-zinc-300 px-4 py-3 text-zinc-900 outline-none transition focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100"
                  />
                </label>

                <label className="space-y-2 text-sm font-medium text-zinc-700">
                  <span>Confirm password</span>
                  <input
                    type="password"
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    placeholder="Re-enter your password"
                    className="w-full rounded-md border border-zinc-300 px-4 py-3 text-zinc-900 outline-none transition focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100"
                  />
                </label>
              </div>

              <label className="block space-y-2 text-sm font-medium text-zinc-700">
                <span>Admin key (optional)</span>
                <input
                  type="text"
                  name="adminKey"
                  value={formData.adminKey}
                  onChange={handleChange}
                  placeholder="Only needed for admin registration"
                  className="w-full rounded-md border border-zinc-300 px-4 py-3 text-zinc-900 outline-none transition focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100"
                />
              </label>

              <div className="rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
                Passwords must meet the backend rule: 8+ characters with
                uppercase, lowercase, number, and special character.
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full rounded-md bg-zinc-900 px-4 py-3 text-sm font-semibold text-white transition hover:bg-zinc-800 disabled:cursor-not-allowed disabled:bg-zinc-400"
              >
                {isSubmitting ? "Creating account..." : "Create account"}
              </button>
            </form>

            <p className="mt-6 text-sm text-zinc-600">
              Already registered?{" "}
              <Link to="/login" className="font-semibold text-emerald-700 hover:text-emerald-800">
                Login here
              </Link>
            </p>
          </div>
        </section>
      </div>
    </main>
  );
}

export default Register;
