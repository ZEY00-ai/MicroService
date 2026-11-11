import { useState } from "react";
import { getCartDetail } from "../api/aggregate";
import { clearCart, removeCartItem, updateCartItem } from "../api/cartApi";
import AsyncView from "../components/AsyncView";
import { useAsync } from "../hooks/useAsync";
import { describeError, formatRupiah, getProductImage } from "../utils/format";

export default function CartPage({ userId, refreshKey }) {
  const { loading, data, error, reload } = useAsync(
    () => getCartDetail(userId),
    [userId, refreshKey],
  );
  const [actionError, setActionError] = useState(null);

  async function run(action) {
    setActionError(null);
    try {
      await action();
      reload();
    } catch (err) {
      setActionError(err);
    }
  }

  return (
    <section className="cart-panel">
      <div className="section-heading cart-heading">
        <div>
          <p className="eyebrow">RINGKASAN BELANJA</p>
          <h1>Keranjang</h1>
        </div>
        {data?.items.length > 0 && (
          <button
            className="text-button"
            type="button"
            onClick={() => run(() => clearCart(userId))}
          >
            Hapus semua
          </button>
        )}
      </div>
      {actionError && (
        <p className="alert alert-error" role="alert">
          {describeError(actionError)}
        </p>
      )}

      <AsyncView loading={loading} error={error} onRetry={reload}>
        {data && data.items.length === 0 && (
          <div className="empty-cart">
            <span aria-hidden="true">🛒</span>
            <strong>Keranjang masih kosong</strong>
            <p>Tambahkan produk untuk mulai belanja.</p>
          </div>
        )}

        {data && data.items.length > 0 && (
          <>
            <div className="cart-items">
              {data.items.map((item) => (
                <article className="cart-item" key={item.id}>
                  <div className="cart-item-image">
                    {item.product?.image ? (
                      <img
                        src={getProductImage(item.product.image)}
                        alt={item.product.name}
                      />
                    ) : (
                      <span aria-hidden="true">P</span>
                    )}
                  </div>
                  <div className="cart-item-content">
                    <div className="cart-item-top">
                      <div>
                        <h2>
                          {item.product?.name || "Produk tidak tersedia"}
                        </h2>
                        <p className="cart-item-price">
                          {item.product
                            ? formatRupiah(item.product.price)
                            : "—"}
                        </p>
                      </div>
                      <button
                        className="remove-button"
                        type="button"
                        aria-label={`Hapus ${item.product?.name || "produk"} dari keranjang`}
                        onClick={() => run(() => removeCartItem(item.id))}
                      >
                        ×
                      </button>
                    </div>
                    <div className="cart-item-bottom">
                      <div className="quantity-control">
                        <button
                          type="button"
                          aria-label={`Kurangi jumlah ${item.product?.name || "produk"}`}
                          disabled={item.quantity <= 1}
                          onClick={() =>
                            run(() =>
                              updateCartItem(item.id, item.quantity - 1),
                            )
                          }
                        >
                          −
                        </button>
                        <span>{item.quantity}</span>
                        <button
                          type="button"
                          aria-label={`Tambah jumlah ${item.product?.name || "produk"}`}
                          onClick={() =>
                            run(() =>
                              updateCartItem(item.id, item.quantity + 1),
                            )
                          }
                        >
                          +
                        </button>
                      </div>
                      <strong className="cart-subtotal">
                        {item.product
                          ? formatRupiah(
                              Number(item.product.price) * item.quantity,
                            )
                          : "—"}
                      </strong>
                    </div>
                  </div>
                </article>
              ))}
            </div>
            <div className="cart-summary">
              <span>Total belanja</span>
              <strong>{formatRupiah(data.totalPrice)}</strong>
            </div>
          </>
        )}
      </AsyncView>
    </section>
  );
}
