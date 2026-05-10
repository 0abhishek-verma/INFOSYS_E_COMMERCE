import { useState } from "react";
import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import { addProduct, getErrorMessage, getStoredUser } from "../services/api";

const initialProductForm = {
  name: "",
  description: "",
  price: "",
  stockQuantity: "",
  category: "",
  image: null,
};

function AdminAddProduct() {
  const user = getStoredUser();
  const [formData, setFormData] = useState(initialProductForm);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (event) => {
    const { name, value, files } = event.target;

    setFormData((currentState) => ({
      ...currentState,
      [name]: files ? files[0] : value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setErrorMessage("");
    setSuccessMessage("");

    if (
      !formData.name.trim() ||
      !formData.price ||
      !formData.stockQuantity ||
      !formData.category.trim()
    ) {
      setErrorMessage("Name, price, stock quantity, and category are required.");
      return;
    }

    if (!formData.image) {
      setErrorMessage("Please choose a product image.");
      return;
    }

    const parsedPrice = Number.parseFloat(formData.price);
    const parsedStock = Number.parseInt(formData.stockQuantity, 10);

    if (Number.isNaN(parsedPrice) || parsedPrice <= 0) {
      setErrorMessage("Price must be a positive number.");
      return;
    }

    if (Number.isNaN(parsedStock) || parsedStock < 0) {
      setErrorMessage("Stock quantity must be zero or more.");
      return;
    }

    const payload = new FormData();
    payload.append("name", formData.name.trim());
    payload.append("description", formData.description.trim());
    payload.append("price", parsedPrice);
    payload.append("stockQuantity", parsedStock);
    payload.append("category", formData.category.trim());
    payload.append("image", formData.image);

    setIsSubmitting(true);

    try {
      await addProduct(payload);
      setFormData(initialProductForm);
      setSuccessMessage("Product added successfully.");
      event.target.reset();
    } catch (error) {
      setErrorMessage(getErrorMessage(error, "Unable to add the product right now."));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-100">
      <Navbar
        user={user}
        title="Add Product"
        subtitle="Create a catalog item with pricing, stock, category, and image."
      />

      <main className="mx-auto grid max-w-7xl gap-5 px-3 py-5 sm:px-6 lg:grid-cols-[0.78fr_1.22fr] lg:px-8">
        <aside className="h-fit bg-slate-950 p-6 text-white shadow-sm lg:sticky lg:top-28">
          <p className="text-sm font-black uppercase text-sky-300">Catalog setup</p>
          <h1 className="mt-3 text-3xl font-black tracking-tight">Add product</h1>
          <p className="mt-3 text-sm font-medium text-slate-300">
            Product records publish into the live catalog after the backend
            accepts the image upload and inventory details.
          </p>
          <div className="mt-6 grid gap-3 text-sm font-semibold text-slate-200">
            <div className="border border-slate-700 p-4">Use clear names and categories.</div>
            <div className="border border-slate-700 p-4">Keep stock quantity current.</div>
            <div className="border border-slate-700 p-4">Upload a real product image.</div>
          </div>
          <Link
            to="/admin/products"
            className="mt-6 inline-flex rounded-md bg-sky-500 px-4 py-3 text-sm font-black text-white transition hover:bg-sky-400"
          >
            View products
          </Link>
        </aside>

        <section className="bg-white p-5 shadow-sm ring-1 ring-slate-200 sm:p-7">
          <div className="mb-6">
            <h2 className="text-2xl font-black text-slate-950">Product details</h2>
            <p className="mt-2 text-sm font-medium text-slate-500">
              Complete the required fields before publishing the product.
            </p>
          </div>

          {errorMessage ? (
            <div className="mb-5 border border-rose-200 bg-rose-50 px-4 py-3 text-sm font-semibold text-rose-700">
              {errorMessage}
            </div>
          ) : null}

          {successMessage ? (
            <div className="mb-5 border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-semibold text-emerald-700">
              {successMessage}
            </div>
          ) : null}

          <form className="space-y-5" onSubmit={handleSubmit}>
            <label className="block space-y-2 text-sm font-bold text-slate-700">
              <span>Product name</span>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Wireless Keyboard"
                className="h-12 w-full rounded-md border border-slate-300 px-4 text-slate-950 outline-none transition focus:border-sky-400 focus:ring-4 focus:ring-sky-100"
              />
            </label>

            <label className="block space-y-2 text-sm font-bold text-slate-700">
              <span>Description</span>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Write a short product description"
                rows="4"
                className="w-full rounded-md border border-slate-300 px-4 py-3 text-slate-950 outline-none transition focus:border-sky-400 focus:ring-4 focus:ring-sky-100"
              />
            </label>

            <div className="grid gap-5 sm:grid-cols-2">
              <label className="space-y-2 text-sm font-bold text-slate-700">
                <span>Price</span>
                <input
                  type="number"
                  name="price"
                  value={formData.price}
                  onChange={handleChange}
                  placeholder="4999"
                  min="0"
                  step="0.01"
                  className="h-12 w-full rounded-md border border-slate-300 px-4 text-slate-950 outline-none transition focus:border-sky-400 focus:ring-4 focus:ring-sky-100"
                />
              </label>

              <label className="space-y-2 text-sm font-bold text-slate-700">
                <span>Stock quantity</span>
                <input
                  type="number"
                  name="stockQuantity"
                  value={formData.stockQuantity}
                  onChange={handleChange}
                  placeholder="25"
                  min="0"
                  className="h-12 w-full rounded-md border border-slate-300 px-4 text-slate-950 outline-none transition focus:border-sky-400 focus:ring-4 focus:ring-sky-100"
                />
              </label>
            </div>

            <div className="grid gap-5 sm:grid-cols-2">
              <label className="space-y-2 text-sm font-bold text-slate-700">
                <span>Category</span>
                <input
                  type="text"
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  placeholder="Electronics"
                  className="h-12 w-full rounded-md border border-slate-300 px-4 text-slate-950 outline-none transition focus:border-sky-400 focus:ring-4 focus:ring-sky-100"
                />
              </label>

              <label className="space-y-2 text-sm font-bold text-slate-700">
                <span>Product image</span>
                <input
                  type="file"
                  name="image"
                  accept="image/*"
                  onChange={handleChange}
                  className="block h-12 w-full rounded-md border border-slate-300 px-3 py-2 text-sm text-slate-700 file:mr-3 file:rounded-sm file:border-0 file:bg-slate-950 file:px-3 file:py-2 file:text-sm file:font-bold file:text-white"
                />
              </label>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full rounded-md bg-sky-600 px-5 py-3 text-sm font-black text-white transition hover:bg-sky-700 disabled:cursor-not-allowed disabled:bg-slate-300"
            >
              {isSubmitting ? "Adding product..." : "Add product"}
            </button>
          </form>
        </section>
      </main>
    </div>
  );
}

export default AdminAddProduct;
