import { useState } from "react";
import { Link, useParams } from "react-router-dom";
import { getProductDetail } from "../api/aggregate";
import { addToCart } from "../api/cartApi";
import AsyncView from "../components/AsyncView";
import ReviewForm from "../components/ReviewForm";
import StarRating from "../components/StarRating";
import { useAsync } from "../hooks/useAsync";
import {
  describeError,
  formatRupiah,
  getProductImage,
} from "../utils/format";

export default function ProductDetailPage({ userId, onCartChange }) {
  const { id } = useParams();
  const { loading, data, error, reload } = useAsync(
    () => getProductDetail(id),
    [id],
  );
  const [quantity, setQuantity] = useState("1");
  const [cartMessage, setCartMessage] = useState(null);
  async function handleAddToCart() {
    const amount = Math.max(1, Number(quantity) || 1);
    try {
      await addToCart(userId, Number(id), amount);
      setCartMessage({ type: "success", text: "Produk ditambahkan ke keranjang." });
      onCartChange();
    } catch (err) {
      setCartMessage({ type: "error", text: describeError(err) });
    }
  }

  return (
    <section className="detail-panel">
      <Link className="back-link" to="/">
        <span aria-hidden="true">←</span> Kembali ke produk
      </Link>
      <AsyncView loading={loading} error={error} onRetry={reload}>
        {data && (
          <>
            <div className="detail-product">
              <div className="detail-image">
                {data.product.image ? (
                  <img
                    src={getProductImage(data.product.image)}
                    alt={data.product.name}
                  />
                ) : (
                  <span aria-hidden="true">
                    {data.product.name?.charAt(0)?.toUpperCase() || "P"}
                  </span>
                )}
              </div>
              <div className="detail-product-info">
                <p className="eyebrow">DETAIL PRODUK</p>
                <h1>{data.product.name}</h1>
                {data.reviews && (
                  <div className="detail-rating">
                    <StarRating
                      average={data.reviews.summary.average_rating}
                      total={data.reviews.summary.total_reviews}
                    />
                  </div>
                )}
                <p className="detail-price">
                  {formatRupiah(data.product.price)}
                </p>
                <p className="detail-description">
                  {data.product.description || "Belum ada deskripsi produk."}
                </p>
                <p className="detail-stock">
                  Stok: <strong>{data.product.stock}</strong>
                </p>
                <div className="detail-actions">
                  <input
                    type="number"
                    min="1"
                    max={data.product.stock}
                    value={quantity}
                    aria-label="Jumlah produk"
                    onChange={(event) => setQuantity(event.target.value)}
                  />
                  <button
                    className="detail-add-button"
                    type="button"
                    onClick={handleAddToCart}
                    disabled={data.product.stock <= 0}
                  >
                    Tambah ke keranjang
                  </button>
                </div>
                {cartMessage && (
                  <p
                    className={`alert alert-${cartMessage.type}`}
                    role={cartMessage.type === "error" ? "alert" : "status"}
                  >
                    {cartMessage.text}
                  </p>
                )}
              </div>
            </div>
            <section className="reviews-section">
              <div className="reviews-heading">
                <div>
                  <p className="eyebrow">KATA PEMBELI</p>
                  <h2>Review produk</h2>
                </div>
                {data.reviews && (
                  <span className="item-count">
                    {data.reviews.reviews.length} review
                  </span>
                )}
              </div>
              {data.reviews ? (
                <ul className="reviews">
                  {data.reviews.reviews.map((review) => (
                    <li key={review.id}>
                      <div className="review-meta">
                        <strong>User {review.user_id}</strong>
                        <small>
                          {new Date(review.created_at).toLocaleDateString(
                            "id-ID",
                          )}
                        </small>
                      </div>
                      <StarRating
                        average={review.rating}
                        total={1}
                        compact
                      />
                      <p>
                        {review.comment || (
                          <em className="muted">Tanpa komentar</em>
                        )}
                      </p>
                    </li>
                  ))}
                  {data.reviews.reviews.length === 0 && (
                    <li className="muted">
                      Belum ada review. Jadilah yang pertama!
                    </li>
                  )}
                </ul>
              ) : (
                <p className="alert alert-error">
                  Review tidak dapat dimuat saat ini.
                </p>
              )}
              <ReviewForm
                productId={Number(id)}
                userId={userId}
                onCreated={reload}
              />
            </section>
          </>
        )}
      </AsyncView>
    </section>
  );
}
