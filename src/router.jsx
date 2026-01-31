import { createBrowserRouter, Outlet } from "react-router-dom";
import Navbar from "./components/layout/Navbar";

import Categories from "./pages/Categories";
import CategoryProducts from "./pages/CategoryProducts";
import ProductDetails from "./pages/ProductDetails";
import Cart from "./pages/Cart";
import Checkout from "./pages/Checkout";
import ProductsDashboard from "./pages/ProductsDashboard";
// eslint-disable-next-line react-refresh/only-export-components
function Layout() {
  return (
    <div className="min-h-screen">
      <Navbar />
      <Outlet />
    </div>
  );
}

export const router = createBrowserRouter([
  {
    element: <Layout />,
    children: [
      { path: "/", element: <ProductsDashboard /> },
      { path: "/category/:handle", element: <CategoryProducts /> },
      { path: "/product/:id", element: <ProductDetails /> },
      { path: "/cart", element: <Cart /> },
      { path: "/checkout", element: <Checkout /> },
    ],
  },
]);
