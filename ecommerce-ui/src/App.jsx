import { useState } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import Navbar from "./components/Navbar";
import CartPage from "./pages/CartPage";
import ProductDetailPage from "./pages/ProductDetailPage";
import ProductListPage from "./pages/ProductListPage";

export default function App() {
  const [userId, setUserId] = useState(
    () => Number(localStorage.getItem("userId")) || 1,
  );
  const [cartVersion, setCartVersion] = useState(0);

  function changeUser(value) {
    setUserId(value);
    localStorage.setItem("userId", String(value));
  }

  function notifyCartChange() {
    setCartVersion((version) => version + 1);
  }

  return (
    <>
      <Navbar userId={userId} onUserChange={changeUser} />
      <Routes>
        <Route
          path="/"
          element={
            <main className="store-layout">
              <ProductListPage
                userId={userId}
                onCartChange={notifyCartChange}
              />
              <CartPage userId={userId} refreshKey={cartVersion} />
            </main>
          }
        />
        <Route
          path="/products/:id"
          element={
            <main className="review-layout">
              <ProductDetailPage
                userId={userId}
                onCartChange={notifyCartChange}
              />
            </main>
          }
        />
        <Route path="/cart" element={<Navigate to="/" replace />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </>
  );
}
