import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import { useCart } from "../context/useCart";
import { getErrorMessage, getStoredUser, placeOrder } from "../services/api";
import { buildFallbackImage, formatPrice } from "../utils/catalog";

function PlaceOrder() {
  const navigate = useNavigate();
  const user = getStoredUser();
  const {
    items,
    itemCount,
    subtotal,
    discount,
    deliveryFee,
    total,
    isLoading,
    errorMessage: cartErrorMessage,
    refreshCart,
  } = useCart();
  const [isPlacingOrder, setIsPlacingOrder] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const handlePlaceOrder = async () => {
    setIsPlacingOrder(true);
    setErrorMessage("");

    try {
      const response = await placeOrder();
      await refreshCart();
      navigate("/orders", {
        replace: true,
        state: { placedOrderId: response.data?.id },
      });
    } catch (error) {
      setErrorMessage(getErrorMessage(error, "Unable to place your order right now."));
      await refreshCart();
    } finally {
      setIsPlacingOrder(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-100">
      <Navbar
        user={user}
        title="Place Order"
        subtitle="Confirm cart items, delivery details, and payment summary."
      />

      <main className="mx-auto grid max-w-7xl gap-5 px-3 py-5 sm:px-6 lg:grid-cols-[1fr_380px] lg:px-8">
        <section className="space-y-4">
          <div className="bg-white px-5 py-4 shadow-sm ring-1 ring-zinc-200">
            <h1 className="text-xl font-black text-zinc-950">Order review</h1>
            <p className="mt-1 text-sm font-medium text-zinc-500">
              {isLoading ? "Loading cart..." : `${itemCount} items ready for checkout`}
            </p>
          </div>

          {cartErrorMessage || errorMessage ? (
            <div className="rounded-sm border border-rose-200 bg-rose-50 px-4 py-3 text-sm font-semibold text-rose-700">
              {errorMessage || cartErrorMessage}
            </div>
          ) : null}

          <div className="bg-white p-5 shadow-sm ring-1 ring-zinc-200">
            <div className="flex items-start justify-between gap-4 border-b border-zinc-200 pb-4">
              <div>
                <h2 className="text-base font-black text-zinc-950">Delivery details</h2>
                <p className="mt-1 text-sm font-semibold text-zinc-600">
                  {user?.name || "Customer"}
                </p>
                <p className="text-sm text-zinc-500">{user?.email}</p>
              </div>
              <span className="rounded-sm bg-emerald-50 px-3 py-2 text-xs font-black uppercase text-emerald-700">
                Standard
              </span>
            </div>
            <p className="mt-4 text-sm font-medium text-zinc-600">
              Delivery by tomorrow. Payment mode is cash on delivery for this order preview.
            </p>
          </div>

          {items.length > 0 ? (
            <div className="space-y-3">
              {items.map((item) => (
                <article
                  key={item.id}
                  className="grid gap-4 bg-white p-4 shadow-sm ring-1 ring-zinc-200 sm:grid-cols-[96px_1fr_auto]"
                >
                  <img
                    src={item.imageUrl || buildFallbackImage(item.name, 400, 400)}
                    alt={item.name}
                    className="aspect-square w-full bg-slate-100 object-contain p-2 sm:w-24"
                    onError={(event) => {
                      event.currentTarget.onerror = null;
                      event.currentTarget.src = buildFallbackImage(item.name, 400, 400);
                    }}
                  />
                  <div>
                    <h3 className="font-black text-zinc-950">{item.name}</h3>
                    <p className="mt-1 text-sm font-medium text-zinc-500">
                      Quantity: {item.quantity}
                    </p>
                    <p className="mt-2 text-sm font-semibold text-emerald-600">
                      Eligible for order placement
                    </p>
                  </div>
                  <p className="text-left text-lg font-black text-zinc-950 sm:text-right">
                    Rs. {formatPrice(item.price * item.quantity)}
                  </p>
                </article>
              ))}
            </div>
          ) : (
            <div className="bg-white px-6 py-16 text-center shadow-sm ring-1 ring-zinc-200">
              <h2 className="text-2xl font-black text-zinc-950">No items to place</h2>
              <p className="mx-auto mt-2 max-w-md text-sm text-zinc-500">
                Add products to your cart before placing an order.
              </p>
              <Link
                to="/dashboard"
                className="mt-6 inline-flex rounded-md bg-slate-950 px-5 py-3 text-sm font-black text-white transition hover:bg-slate-800"
              >
                Continue shopping
              </Link>
            </div>
          )}
        </section>

        <aside className="h-fit bg-white shadow-sm ring-1 ring-zinc-200 lg:sticky lg:top-28">
          <div className="border-b border-zinc-200 px-5 py-4">
            <h2 className="text-lg font-black uppercase text-zinc-500">Payment summary</h2>
          </div>
          <div className="space-y-4 px-5 py-5 text-sm font-semibold text-zinc-700">
            <div className="flex justify-between gap-4">
              <span>Price ({itemCount} items)</span>
              <span>Rs. {formatPrice(subtotal)}</span>
            </div>
            <div className="flex justify-between gap-4 text-emerald-600">
              <span>Discount</span>
              <span>- Rs. {formatPrice(discount)}</span>
            </div>
            <div className="flex justify-between gap-4">
              <span>Delivery charges</span>
              <span>{deliveryFee ? `Rs. ${formatPrice(deliveryFee)}` : "Free"}</span>
            </div>
            <div className="border-t border-dashed border-zinc-300 pt-4">
              <div className="flex justify-between gap-4 text-lg font-black text-zinc-950">
                <span>Total amount</span>
                <span>Rs. {formatPrice(total)}</span>
              </div>
            </div>
          </div>
          <div className="grid gap-3 border-t border-zinc-200 p-5">
            <button
              type="button"
              onClick={handlePlaceOrder}
              disabled={items.length === 0 || isPlacingOrder || isLoading}
              className="rounded-md bg-sky-600 px-5 py-3 text-sm font-black text-white transition hover:bg-sky-700 disabled:cursor-not-allowed disabled:bg-slate-300"
            >
              {isPlacingOrder ? "Placing order..." : "Confirm order"}
            </button>
            <Link
              to="/cart"
              className="rounded-md border border-slate-300 px-5 py-3 text-center text-sm font-black text-slate-700 transition hover:bg-slate-50"
            >
              Back to cart
            </Link>
          </div>
        </aside>
      </main>
    </div>
  );
}

export default PlaceOrder;
