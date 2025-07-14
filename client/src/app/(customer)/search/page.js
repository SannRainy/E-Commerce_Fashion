// E-Commerce_Fashion-main/client/src/app/(customer)/search/page.js
"use client";

import { useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import ProductCard from '../../components/ProductCard';
import API from '../../../api';
import { toast } from 'react-toastify';

export default function SearchPage() {
  const searchParams = useSearchParams();
  const query = searchParams.get('q');
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!query) {
      setProducts([]);
      setLoading(false);
      return;
    }

    const fetchSearchResults = async () => {
      try {
        setLoading(true);
        const { data } = await API.get(`/products?q=${query}`);
        setProducts(data);
      } catch (error) {
        toast.error("Gagal melakukan pencarian produk.");
      } finally {
        setLoading(false);
      }
    };

    fetchSearchResults();
  }, [query]);

  return (
    <div className="bg-white">
      <div className="container mx-auto px-4 py-16 sm:px-6 lg:px-8">
        {loading ? (
          <h1 className="text-3xl font-bold tracking-tight text-secondary">Searching...</h1>
        ) : (
          <>
            <h1 className="text-3xl font-bold tracking-tight text-secondary">
              Search Results for: "{query}"
            </h1>
            <p className="mt-4 max-w-xl text-secondary-light">
              {products.length} product(s) found.
            </p>
            
            <section aria-labelledby="products-heading" className="mt-12">
              <h2 id="products-heading" className="sr-only">Products</h2>

              {products.length > 0 ? (
                <div className="grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-3 xl:gap-x-8">
                  {products.map((product) => (
                    <ProductCard key={product.id} product={product} />
                  ))}
                </div>
              ) : (
                <div className="text-center py-10">
                  <p className="text-lg text-gray-500">No products found matching your search.</p>
                </div>
              )}
            </section>
          </>
        )}
      </div>
    </div>
  );
}