import { BrowserRouter, Routes, Route } from "react-router-dom";

// Pages
import Login from "./pages/Login";
import Register from "./pages/Register";
import Products from "./pages/Products";
import Cart from "./pages/Cart";
import Checkout from "./pages/Checkout";
import Orders from "./pages/Orders";

// Components
import PrivateRoute from "./components/PrivateRoute";
import Navbar from "./components/Navbar";

// Context
import { CartProvider } from "./context/CartContext";

function App() {
  // Reintroduzco CartProvider solamente
  return (
    <CartProvider>
      <BrowserRouter>
        <Navbar />
        <Routes>
          {/* Página principal: catálogo */}
          <Route path="/" element={<Products />} />
          <Route path="/products" element={<Products />} />

          {/* Autenticación */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* Carrito */}
          <Route path="/cart" element={<Cart />} />

          {/* Checkout y órdenes (protegidas con PrivateRoute) */}
          <Route
            path="/checkout"
            element={
              <PrivateRoute>
                <Checkout />
              </PrivateRoute>
            }
          />
          <Route
            path="/orders"
            element={
              <PrivateRoute>
                <Orders />
              </PrivateRoute>
            }
          />
        </Routes>
      </BrowserRouter>
    </CartProvider>
  );
}

export default App;
