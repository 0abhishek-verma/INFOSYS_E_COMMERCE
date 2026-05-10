import { Link } from "react-router-dom";
import { useEffect } from "react";
import Navbar from "../components/Navbar";
import { useCart } from "../context/useCart";
import { getStoredUser } from "../services/api";
import { buildFallbackImage, formatPrice } from "../utils/catalog";

function Cart() {
  const user = getStoredUser();
  const {
    items,
    itemCount,
    subtotal,
    discount,
    deliveryFee,
    total,
    isLoading,
    errorMessage,
    refreshCart,
    updateQuantity,
    removeFromCart,
    clearCart,
  } = useCart();

  useEffect(() => {
    refreshCart();
  }, [refreshCart]);

  return (
    <div className="min-h-screen bg-slate-100">
      <Navbar
        user={user}
        title="My Cart"
        subtitle="Review quantities, pricing, delivery charges, and order total."
      />

      <main className="mx-auto grid max-w-7xl gap-5 px-3 py-5 sm:px-6 lg:grid-cols-[1fr_360px] lg:px-8">
        <section className="space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3 bg-white px-5 py-4 shadow-sm ring-1 ring-zinc-200">
            <div>
              <h1 className="text-xl font-black text-zinc-950">Shopping Cart</h1>
              <p className="text-sm font-medium text-zinc-500">
                {isLoading ? "Loading cart..." : `${itemCount} items selected`}
              </p>
            </div>
            <Link
              to="/dashboard"
              className="rounded-md border border-slate-300 px-4 py-2 text-sm font-black text-slate-700 transition hover:bg-slate-50"
            >
              Continue shopping
            </Link>
          </div>

          {errorMessage ? (
            <div className="border border-rose-200 bg-rose-50 px-4 py-3 text-sm font-semibold text-rose-700">
              {errorMessage}
            </div>
          ) : null}

          {items.length > 0 ? (
            items.map((item) => (
              <article
                key={item.id}
                className="grid gap-4 bg-white p-4 shadow-sm ring-1 ring-slate-200 sm:grid-cols-[150px_1fr]"
              >
                <Link to={`/products/${item.id}`} className="aspect-square bg-slate-100 p-3">
                  <img
                    src={item.imageUrl || buildFallbackImage(item.name, 500, 500)}
                    alt={item.name}
                    className="h-full w-full object-contain"
                    onError={(event) => {
                      event.currentTarget.onerror = null;
                      event.currentTarget.src = buildFallbackImage(item.name, 500, 500);
                    }}
                  />
                </Link>

                <div className="flex flex-col gap-4">
                  <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
                    <div>
                      <Link
                        to={`/products/${item.id}`}
                        className="text-lg font-black text-slate-950 hover:text-sky-700"
                      >
                        {item.name}
                      </Link>
                      <p className="mt-1 text-sm font-medium text-zinc-500">
                        {item.category} | Seller: Infosys Commerce
                      </p>
                      <p className="mt-2 text-sm font-semibold text-emerald-600">
                        Delivery by tomorrow
                      </p>
                    </div>

                    <div className="text-left md:text-right">
                      <p className="text-xl font-black text-zinc-950">
                        Rs. {formatPrice(item.price * item.quantity)}
                      </p>
                      <p className="text-sm text-zinc-400 line-through">
                        Rs. {formatPrice(item.price * item.quantity * 1.18)}
                      </p>
                    </div>
                  </div>

                  <div className="mt-auto flex flex-wrap items-center gap-3">
                    <div className="inline-flex items-center rounded-sm border border-zinc-300">
                      <button
                        type="button"
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        className="h-10 w-10 text-lg font-black text-slate-700 transition hover:bg-slate-100"
                      >
                        -
                      </button>
                      <input
                        type="number"
                        min="1"
                        max={item.stockQuantity || 99}
                        value={item.quantity}
                        onChange={(event) => updateQuantity(item.id, event.target.value)}
                        className="h-10 w-14 border-x border-zinc-300 text-center text-sm font-bold outline-none"
                      />
                      <button
                        type="button"
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        className="h-10 w-10 text-lg font-black text-slate-700 transition hover:bg-slate-100"
                      >
                        +
                      </button>
                    </div>

                    <button
                      type="button"
                      onClick={() => removeFromCart(item.id)}
                      className="rounded-md px-3 py-2 text-sm font-black text-slate-700 transition hover:bg-rose-50 hover:text-rose-600"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              </article>
            ))
          ) : (
            <div className="bg-white px-6 py-16 text-center shadow-sm ring-1 ring-zinc-200">
              <h2 className="text-2xl font-black text-zinc-950">Your cart is empty</h2>
              <p className="mx-auto mt-2 max-w-md text-sm text-zinc-500">
                Add products from the dashboard and they will appear here with
                quantity controls and a price summary.
              </p>
              <Link
                to="/dashboard"
              className="mt-6 inline-flex rounded-md bg-slate-950 px-5 py-3 text-sm font-black text-white transition hover:bg-slate-800"
              >
                Start shopping
              </Link>
            </div>
          )}
        </section>

        <aside className="h-fit bg-white shadow-sm ring-1 ring-zinc-200 lg:sticky lg:top-28">
          <div className="border-b border-zinc-200 px-5 py-4">
            <h2 className="text-lg font-black uppercase text-zinc-500">Price details</h2>
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
            <p className="rounded-sm bg-emerald-50 px-3 py-3 text-emerald-700">
              You save Rs. {formatPrice(discount)} on this order preview.
            </p>
          </div>

          <div className="grid gap-3 border-t border-zinc-200 p-5">
            {items.length > 0 ? (
              <Link
                to="/place-order"
                className="rounded-md bg-sky-600 px-5 py-3 text-center text-sm font-black text-white transition hover:bg-sky-700"
              >
                Place order
              </Link>
            ) : (
              <button
                type="button"
                disabled
                className="rounded-md bg-slate-300 px-5 py-3 text-sm font-black text-white disabled:cursor-not-allowed"
              >
                Place order
              </button>
            )}
            <button
              type="button"
              onClick={clearCart}
              disabled={items.length === 0}
              className="rounded-md border border-slate-300 px-5 py-3 text-sm font-black text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:text-slate-400"
            >
              Clear cart
            </button>
          </div>
        </aside>
      </main>
    </div>
  );
}

export default Cart;
