// client/src/app/(customer)/products/page.js

import ProductCard from "../../components/ProductCard";

// --- Mock Data (Data Sampel untuk Semua Produk) ---
// Gunakan data ini untuk sementara sampai terhubung dengan backend
const ALL_PRODUCTS = [
  { id: 1, name: 'Sandal Marcaa', price: 275000, imageUrl: '/images/Marca.jpg' },
  { id: 2, name: 'Sepatu Nail Trends', price: 499000, imageUrl: '/images/Nail Trends.jpg' },
  { id: 3, name: 'Sandal Classic Brown', price: 250000, imageUrl: '/images/product-3.jpg' },
  { id: 4, name: 'Sandal Urban Black', price: 310000, imageUrl: '/images/product-4.jpg' },
  { id: 5, name: 'Sepatu Running Pro', price: 550000, imageUrl: '/images/product-5.jpg' },
  { id: 6, name: 'High Heels Glamour', price: 620000, imageUrl: '/images/product-6.jpg' },
];

export default function ShopPage() {
  return (
    <div className="bg-white">
      <div className="container mx-auto px-4 py-16 sm:px-6 lg:px-8">
        <h1 className="text-4xl font-bold tracking-tight text-secondary">Our Products</h1>
        <p className="mt-4 max-w-xl text-secondary-light">
          Check out our new arrivals and find your perfect style for every occasion.
        </p>

        <section aria-labelledby="products-heading" className="mt-12">
          <h2 id="products-heading" className="sr-only">
            Products
          </h2>

          <div className="grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-3 xl:gap-x-8">
            {ALL_PRODUCTS.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}