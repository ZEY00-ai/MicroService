import { getProductsWithRating } from "../api/aggregate";
import AsyncView from "../components/AsyncView";
import ProductCard from "../components/ProductCard";
import { useAsync } from "../hooks/useAsync";

export default function ProductListPage({ userId, onCartChange }) {
  const { loading, data, error, reload } = useAsync(getProductsWithRating);

  return (
    <section className="products-panel">
      <div className="section-heading">
        <div>
          <p className="eyebrow">PILIHAN HARI INI</p>
          <h1>Produk</h1>
        </div>
        {data && <span className="item-count">{data.length} produk</span>}
      </div>
      <AsyncView loading={loading} error={error} onRetry={reload}>
        {data && (
          <div className="product-grid">
            {data.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                userId={userId}
                onAdded={onCartChange}
              />
            ))}
          </div>
        )}
      </AsyncView>
    </section>
  );
}
