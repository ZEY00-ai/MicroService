import { useState } from "react";
import { Link } from "react-router-dom";
import { addToCart } from "../api/cartApi";
import { describeError, formatRupiah, getProductImage } from "../utils/format";

export default function ProductCard({ product, userId, onAdded }) {
  const { id, name, price, stock, image } = product;
  const [adding, setAdding] = useState(false);
  const [message, setMessage] = useState(null);

  async function handleAdd() {
    setAdding(true);
    setMessage(null);
    try {
      await addToCart(userId, id, 1);
      setMessage({ type: "success", text: "Ditambahkan ke keranjang" });
      onAdded();
    } catch (error) {
      setMessage({ type: "error", text: describeError(error) });
    } finally {
      setAdding(false);
    }
  }

  return (
    <article className="product-card">
      <Link
        className="product-image product-image-link"
        to={`/products/${id}`}
        aria-label={`Lihat detail dan review ${name}`}
      >
        {image ? (
          <img src={getProductImage(image)} alt="" />
        ) : (
          <span className="product-placeholder" aria-hidden="true">
            {name?.charAt(0)?.toUpperCase() || "P"}
          </span>
        )}
        <span className="stock-tag">
          {stock > 0 ? `${stock} tersedia` : "Habis"}
        </span>
      </Link>
      <div className="product-info">
        <h2>
          <Link className="product-name-link" to={`/products/${id}`}>
            {name}
          </Link>
        </h2>
        <p className="price">{formatRupiah(price)}</p>
        <button
          className="add-button"
          type="button"
          onClick={handleAdd}
          disabled={adding || stock <= 0}
        >
          <span aria-hidden="true">{adding ? "…" : "+"}</span>
          {adding ? "Menambahkan" : "Tambah"}
        </button>
        <Link className="product-review-link" to={`/products/${id}`}>
          Detail &amp; review <span aria-hidden="true">→</span>
        </Link>
        {message && (
          <p
            className={`product-message product-message-${message.type}`}
            role={message.type === "error" ? "alert" : "status"}
          >
            {message.text}
          </p>
        )}
      </div>
    </article>
  );
}
