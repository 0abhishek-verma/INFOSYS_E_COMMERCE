import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  getErrorMessage,
  getHomeRouteForRole,
  getStoredUser,
  getToken,
  isTokenValid,
  registerUser,
  verifyRegistrationOtp,
} from "../services/api";

const initialFormState = {
  name: "",
  email: "",
  phone: "",
  password: "",
  confirmPassword: "",
  otp: "",
};

function Register() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState(initialFormState);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSendingOtp, setIsSendingOtp] = useState(false);
  const [isOtpSent, setIsOtpSent] = useState(false);

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

    if (name !== "otp" && isOtpSent) {
      setIsOtpSent(false);
      setSuccessMessage("");
      setErrorMessage("Registration details changed. Please verify your email again.");
    }
  };

  const validateRegistrationFields = () => {
    if (formData.password !== formData.confirmPassword) {
      setErrorMessage("Passwords do not match.");
      return false;
    }

    if (!formData.name || !formData.email || !formData.phone || !formData.password) {
      setErrorMessage("Please complete all required fields.");
      return false;
    }

    return true;
  };

  const handleSendOtp = async () => {
    setErrorMessage("");
    setSuccessMessage("");

    if (!validateRegistrationFields()) {
      return;
    }

    setIsSendingOtp(true);

    try {
      await registerUser({
        name: formData.name.trim(),
        email: formData.email.trim(),
        phone: formData.phone.trim(),
        password: formData.password,
      });

      setIsOtpSent(true);
      setSuccessMessage("OTP sent successfully. Check your email.");
    } catch (error) {
      setIsOtpSent(false);
      setErrorMessage(
        getErrorMessage(error, "Unable to send OTP right now. Please try again."),
      );
    } finally {
      setIsSendingOtp(false);
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setErrorMessage("");
    setSuccessMessage("");

    if (!validateRegistrationFields()) {
      return;
    }

    if (!isOtpSent) {
      setErrorMessage("Please verify your email before registering.");
      return;
    }

    if (!/^\d{6}$/.test(formData.otp.trim())) {
      setErrorMessage("Please enter the 6 digit OTP sent to your email.");
      return;
    }

    setIsSubmitting(true);

    try {
      await verifyRegistrationOtp({
        email: formData.email.trim(),
        otp: formData.otp.trim(),
      });

      setSuccessMessage("Registration successful. Redirecting to login...");
      setFormData(initialFormState);
      setIsOtpSent(false);

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

      <div className="grid min-h-screen lg:grid-cols-[1fr_0.92fr]">
        <section className="flex items-center bg-slate-950 px-6 py-12 text-white sm:px-10 lg:px-16">
          <div className="mx-auto max-w-xl space-y-8">
            <div className="space-y-4">
              <p className="inline-flex rounded-full bg-sky-400 px-4 py-2 text-sm font-black text-slate-950">
                Customer onboarding
              </p>
              <h1 className="text-4xl font-black tracking-tight sm:text-5xl">
                Create your shopping account.
              </h1>
              <p className="text-base font-medium text-slate-300 sm:text-lg">
                Sign up to browse protected products, manage your cart, and
                place orders from the same account.
              </p>
            </div>

            <div className="grid gap-3 sm:grid-cols-3">
              <div className="border border-slate-700 bg-slate-900 p-4">
                <p className="text-2xl font-black text-sky-300">1</p>
                <p className="mt-2 text-sm font-semibold text-slate-300">
                  Register securely
                </p>
              </div>
              <div className="border border-slate-700 bg-slate-900 p-4">
                <p className="text-2xl font-black text-amber-300">2</p>
                <p className="mt-2 text-sm font-semibold text-slate-300">
                  Explore products
                </p>
              </div>
              <div className="border border-slate-700 bg-slate-900 p-4">
                <p className="text-2xl font-black text-emerald-300">3</p>
                <p className="mt-2 text-sm font-semibold text-slate-300">
                  Place orders
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="flex items-center justify-center px-6 py-12 sm:px-10 lg:px-16">
          <div className="w-full max-w-lg bg-white p-8 shadow-sm ring-1 ring-slate-200 sm:p-10">
            <div className="mb-8 space-y-2">
              <h2 className="text-3xl font-black tracking-tight text-slate-950">
                Register
              </h2>
              <p className="text-sm font-medium text-slate-500">
                Verify your email with a 6 digit OTP before account creation.
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
              <div className="grid gap-5 sm:grid-cols-2">
                <label className="space-y-2 text-sm font-bold text-slate-700">
                  <span>Full name</span>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Aarav Mehta"
                    className="h-12 w-full rounded-md border border-slate-300 px-4 text-slate-950 outline-none transition focus:border-sky-400 focus:ring-4 focus:ring-sky-100"
                  />
                </label>

                <label className="space-y-2 text-sm font-bold text-slate-700">
                  <span>Phone</span>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="9876543210"
                    className="h-12 w-full rounded-md border border-slate-300 px-4 text-slate-950 outline-none transition focus:border-sky-400 focus:ring-4 focus:ring-sky-100"
                  />
                </label>
              </div>

              <label className="block space-y-2 text-sm font-bold text-slate-700">
                <span>Email address</span>
                <div className="grid gap-2 sm:grid-cols-[1fr_auto]">
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="you@example.com"
                    className="h-12 w-full rounded-md border border-slate-300 px-4 text-slate-950 outline-none transition focus:border-sky-400 focus:ring-4 focus:ring-sky-100"
                  />
                  <button
                    type="button"
                    onClick={handleSendOtp}
                    disabled={isSendingOtp || isSubmitting}
                    className="h-12 rounded-md bg-emerald-600 px-5 text-sm font-black text-white transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:bg-slate-300"
                  >
                    {isSendingOtp ? "Sending..." : isOtpSent ? "Resend OTP" : "Send OTP"}
                  </button>
                </div>
              </label>

              {isOtpSent ? (
                <label className="block space-y-2 text-sm font-bold text-slate-700">
                  <span>OTP</span>
                  <input
                    type="text"
                    name="otp"
                    value={formData.otp}
                    onChange={handleChange}
                    placeholder="Enter 6 digit OTP"
                    maxLength="6"
                    inputMode="numeric"
                    pattern="[0-9]{6}"
                    className="h-12 w-full rounded-md border border-slate-300 px-4 text-slate-950 outline-none transition focus:border-sky-400 focus:ring-4 focus:ring-sky-100"
                  />
                </label>
              ) : null}

              <div className="grid gap-5 sm:grid-cols-2">
                <label className="space-y-2 text-sm font-bold text-slate-700">
                  <span>Password</span>
                  <input
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="Create a strong password"
                    className="h-12 w-full rounded-md border border-slate-300 px-4 text-slate-950 outline-none transition focus:border-sky-400 focus:ring-4 focus:ring-sky-100"
                  />
                </label>

                <label className="space-y-2 text-sm font-bold text-slate-700">
                  <span>Confirm password</span>
                  <input
                    type="password"
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    placeholder="Re-enter your password"
                    className="h-12 w-full rounded-md border border-slate-300 px-4 text-slate-950 outline-none transition focus:border-sky-400 focus:ring-4 focus:ring-sky-100"
                  />
                </label>
              </div>

              <div className="border border-amber-200 bg-amber-50 px-4 py-3 text-sm font-semibold text-amber-800">
                Passwords must meet the backend rule: 8+ characters with
                uppercase, lowercase, number, and special character.
              </div>

              <button
                type="submit"
                disabled={isSubmitting || isSendingOtp}
                className="w-full rounded-md bg-sky-600 px-4 py-3 text-sm font-black text-white transition hover:bg-sky-700 disabled:cursor-not-allowed disabled:bg-slate-300"
              >
                {isSubmitting ? "Verifying OTP..." : "Verify OTP"}
              </button>
            </form>

            <p className="mt-6 text-sm font-medium text-slate-600">
              Already registered?{" "}
              <Link to="/login" className="font-black text-sky-700 hover:text-sky-800">
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
