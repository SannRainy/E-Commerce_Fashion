// E-Commerce_Fashion-main/client/src/app/(customer)/products/page.js
"use client";

import { useState, useEffect } from "react";
import ProductCard from "../../components/ProductCard";
import Button from "../../components/Button";
import API from "../../../api";
import { toast } from "react-toastify";
import SkeletonProductCard from "../../components/SkeletonProductCard"; // Impor komponen skeleton

export default function ShopPage() {
  const [products, setProducts] = useState([]);
  const [pagination, setPagination] = useState({});
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);

  const fetchProducts = async (currentPage) => {
    setLoading(true);
    try {
      const { data } = await API.get(`/products?page=${currentPage}&perPage=6`);
      setProducts(prev => currentPage === 1 ? data.data : [...prev, ...data.data]);
      setPagination(data.pagination);
    } catch (error) {
      toast.error("Gagal memuat produk.");
    } finally {
      setLoading(false);
    }
  };
  
  useEffect(() => {
    fetchProducts(1);
  }, []);

  const handleLoadMore = () => {
    const nextPage = page + 1;
    setPage(nextPage);
    fetchProducts(nextPage);
  };

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
            {/* Tampilkan produk jika tidak loading */}
            {!loading && products.map((product) => (
              <ProductCard key={`${product.id}-${Math.random()}`} product={product} />
            ))}

            {/* Tampilkan skeleton saat loading */}
            {loading && 
              Array.from({ length: 6 }).map((_, index) => (
                <SkeletonProductCard key={index} />
              ))
            }
          </div>
          
          {!loading && pagination.currentPage < pagination.lastPage && (
            <div className="mt-12 flex justify-center">
                <Button onClick={handleLoadMore} disabled={loading}>
                    {loading ? 'Loading...' : 'Load More'}
                </Button>
            </div>
          )}
        </section>
      </div>
    </div>
  );
}