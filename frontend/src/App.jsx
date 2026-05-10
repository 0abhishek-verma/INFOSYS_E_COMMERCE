import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import ProtectedRoute from "./components/ProtectedRoute";
import { CartProvider } from "./context/CartContext";
import AdminAddProduct from "./pages/AdminAddProduct";
import AdminProducts from "./pages/AdminProducts";
import Cart from "./pages/Cart";
import Dashboard from "./pages/Dashboard";
import Login from "./pages/Login";
import MyOrders from "./pages/MyOrders";
import PlaceOrder from "./pages/PlaceOrder";
import ProductDetails from "./pages/ProductDetails";
import Register from "./pages/Register";
import {
  clearAuth,
  getHomeRouteForRole,
  getStoredUser,
  getToken,
  isTokenValid,
} from "./services/api";

function HomeRedirect() {
  const token = getToken();
  const user = getStoredUser();

  if (token && isTokenValid(token) && user?.role) {
    return <Navigate to={getHomeRouteForRole(user.role)} replace />;
  }

  clearAuth();
  return <Navigate to="/" replace />;
}

function App() {
  return (
    <CartProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Register />} />
          <Route path="/login" element={<Login />} />

          <Route element={<ProtectedRoute allowedRoles={["USER"]} />}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/place-order" element={<PlaceOrder />} />
            <Route path="/orders" element={<MyOrders />} />
          </Route>

          <Route element={<ProtectedRoute allowedRoles={["ADMIN"]} />}>
            <Route path="/admin" element={<Navigate to="/admin/products" replace />} />
            <Route path="/admin/products" element={<AdminProducts />} />
            <Route path="/admin/add-product" element={<AdminAddProduct />} />
          </Route>

          <Route element={<ProtectedRoute allowedRoles={["USER", "ADMIN"]} />}>
            <Route path="/products/:productId" element={<ProductDetails />} />
          </Route>

          <Route path="*" element={<HomeRedirect />} />
        </Routes>
      </BrowserRouter>
    </CartProvider>
  );
}

export default App;
