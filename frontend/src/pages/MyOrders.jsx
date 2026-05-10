import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import Navbar from "../components/Navbar";
import { getErrorMessage, getMyOrders, getStoredUser } from "../services/api";
import { buildFallbackImage, formatPrice } from "../utils/catalog";

function formatOrderDate(value) {
  if (!value) {
    return "Recently";
  }

  return new Intl.DateTimeFormat("en-IN", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(value));
}

function MyOrders() {
  const user = getStoredUser();
  const location = useLocation();
  const [orders, setOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");
  const placedOrderId = location.state?.placedOrderId;

  useEffect(() => {
    let isMounted = true;

    const loadOrders = async () => {
      setIsLoading(true);
      setErrorMessage("");

      try {
        const response = await getMyOrders();

        if (isMounted) {
          setOrders(Array.isArray(response.data) ? response.data : []);
        }
      } catch (error) {
        if (isMounted) {
          setErrorMessage(getErrorMessage(error, "Unable to load your orders right now."));
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    loadOrders();

    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <div className="min-h-screen bg-slate-100">
      <Navbar
        user={user}
        title="My Orders"
        subtitle="Track your placed orders and review purchased items."
      />

      <main className="mx-auto max-w-7xl px-3 py-5 sm:px-6 lg:px-8">
        {placedOrderId ? (
          <div className="mb-5 rounded-sm border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-semibold text-emerald-700">
            Order #{placedOrderId} placed successfully.
          </div>
        ) : null}

        {errorMessage ? (
          <div className="mb-5 rounded-sm border border-rose-200 bg-rose-50 px-4 py-3 text-sm font-semibold text-rose-700">
            {errorMessage}
          </div>
        ) : null}

        <div className="mb-5 flex flex-wrap items-center justify-between gap-3 bg-white px-5 py-4 shadow-sm ring-1 ring-zinc-200">
          <div>
            <h1 className="text-xl font-black text-zinc-950">Order history</h1>
            <p className="text-sm font-medium text-zinc-500">
              {isLoading ? "Loading orders..." : `${orders.length} orders found`}
            </p>
          </div>
          <Link
            to="/dashboard"
            className="rounded-md border border-slate-300 px-4 py-2 text-sm font-black text-slate-700 transition hover:bg-slate-50"
          >
            Continue shopping
          </Link>
        </div>

        {isLoading ? (
          <div className="bg-white px-6 py-12 text-center text-sm font-semibold text-zinc-600 shadow-sm ring-1 ring-zinc-200">
            Loading your orders...
          </div>
        ) : orders.length > 0 ? (
          <section className="space-y-4">
            {orders.map((order) => (
              <article key={order.id} className="bg-white shadow-sm ring-1 ring-zinc-200">
                <div className="grid gap-3 border-b border-zinc-200 px-5 py-4 md:grid-cols-[1fr_auto_auto] md:items-center">
                  <div>
                    <h2 className="text-lg font-black text-zinc-950">Order #{order.id}</h2>
                    <p className="mt-1 text-sm font-medium text-zinc-500">
                      Placed on {formatOrderDate(order.createdAt)}
                    </p>
                  </div>
                  <span className="w-fit rounded-md bg-sky-50 px-3 py-2 text-xs font-black uppercase text-sky-700">
                    {order.status || "PLACED"}
                  </span>
                  <p className="text-lg font-black text-zinc-950">
                    Rs. {formatPrice(order.totalAmount)}
                  </p>
                </div>

                <div className="divide-y divide-zinc-100">
                  {(order.items || []).map((item) => (
                    <div
                      key={item.id}
                      className="grid gap-4 px-5 py-4 sm:grid-cols-[72px_1fr_auto]"
                    >
                      <img
                        src={item.imageUrl || buildFallbackImage(item.productName, 300, 300)}
                        alt={item.productName}
                        className="aspect-square w-full bg-slate-100 object-contain p-2 sm:w-18"
                        onError={(event) => {
                          event.currentTarget.onerror = null;
                          event.currentTarget.src = buildFallbackImage(item.productName, 300, 300);
                        }}
                      />
                      <div>
                        <h3 className="font-black text-zinc-950">{item.productName}</h3>
                        <p className="mt-1 text-sm font-medium text-zinc-500">
                          Quantity: {item.quantity}
                        </p>
                      </div>
                      <p className="text-left font-black text-zinc-950 sm:text-right">
                        Rs. {formatPrice(Number(item.price || 0) * Number(item.quantity || 1))}
                      </p>
                    </div>
                  ))}
                </div>

                <div className="grid gap-2 border-t border-zinc-200 bg-slate-50 px-5 py-4 text-sm font-semibold text-zinc-700 sm:grid-cols-4">
                  <span>Subtotal: Rs. {formatPrice(order.subtotal)}</span>
                  <span>Discount: Rs. {formatPrice(order.discount)}</span>
                  <span>Delivery: {Number(order.deliveryFee) ? `Rs. ${formatPrice(order.deliveryFee)}` : "Free"}</span>
                  <span className="font-black text-zinc-950">
                    Total: Rs. {formatPrice(order.totalAmount)}
                  </span>
                </div>
              </article>
            ))}
          </section>
        ) : (
          <div className="bg-white px-6 py-16 text-center shadow-sm ring-1 ring-zinc-200">
            <h2 className="text-2xl font-black text-zinc-950">No orders yet</h2>
            <p className="mx-auto mt-2 max-w-md text-sm text-zinc-500">
              Once you place an order, it will appear here with item details and totals.
            </p>
            <Link
              to="/dashboard"
              className="mt-6 inline-flex rounded-md bg-slate-950 px-5 py-3 text-sm font-black text-white transition hover:bg-slate-800"
            >
              Start shopping
            </Link>
          </div>
        )}
      </main>
    </div>
  );
}

export default MyOrders;
