// E-Commerce_Fashion-main/client/src/app/(customer)/products/[id]/page.js
"use client"; // Ubah menjadi Client Component

import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import Button from "../../../components/Button";
import Image from "next/image";
import API from '../../../../api';
import { useAuth } from '../../../_contexts/AuthContext';
import { useRouter } from 'next/navigation';

export default function ProductDetailPage({ params }) {
  const { id } = params;
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const { isAuthenticated } = useAuth();
  const router = useRouter();
  
  // Fungsi untuk menambahkan item ke keranjang
  const handleAddToCart = async () => {
    if (!isAuthenticated) {
      toast.info("Silakan login untuk menambahkan item ke keranjang.");
      router.push('/login');
      return;
    }
    try {
      await API.post('/cart', {
        productId: product.id,
        quantity: 1, // default quantity
      });
      toast.success(`${product.name} telah ditambahkan ke keranjang!`);
    } catch (error) {
      toast.error("Gagal menambahkan item ke keranjang.");
    }
  };

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        const { data } = await API.get(`/products/${id}`);
        setProduct(data);
      } catch (error) {
        console.error("Failed to fetch product:", error);
        toast.error("Produk tidak ditemukan.");
      } finally {
        setLoading(false);
      }
    };
    
    fetchProduct();
  }, [id]);

  if (loading) {
    return (
       <div className="container mx-auto px-4 py-16 text-center">
        <h1 className="text-2xl font-bold">Loading...</h1>
      </div>
    )
  }

  if (!product) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <h1 className="text-2xl font-bold">Produk tidak ditemukan.</h1>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-16">
      <div className="grid md:grid-cols-2 gap-12">
        <div className="rounded-lg overflow-hidden">
          <Image
            src={product.imageUrl || '/images/placeholder.png'}
            alt={product.name}
            width={600}
            height={600}
            className="w-full h-full object-cover object-center"
            priority
          />
        </div>
        <div className="flex flex-col justify-center">
          <h1 className="text-3xl md:text-4xl font-bold text-secondary mb-4">{product.name}</h1>
          <p className="text-3xl font-semibold text-secondary-dark mb-6">
            Rp{product.price.toLocaleString('id-ID')}
          </p>
          <p className="text-secondary-light mb-8">
            {product.description || 'No description available.'}
          </p>
          
          <div className="flex items-center gap-4">
            <Button className="w-full md:w-auto" onClick={handleAddToCart}>
              Tambah ke Keranjang
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}