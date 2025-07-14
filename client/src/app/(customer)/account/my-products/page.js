// E-Commerce_Fashion-main/client/src/app/(customer)/account/my-products/page.js
"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { useAuth } from '../../../_contexts/AuthContext';
import API from '../../../../api'; // Perbaikan path di sini
import { toast } from 'react-toastify';
import Button from '../../../components/Button';
import { UserCircleIcon, ClipboardDocumentListIcon, ArrowLeftStartOnRectangleIcon, BuildingStorefrontIcon } from '@heroicons/react/24/outline';


export default function MyProductsPage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const { isAuthenticated, user, logout } = useAuth();
  const router = useRouter();

  const fetchMyProducts = async () => {
    // Pastikan user sudah ada sebelum fetch
    if (!user) return;
    try {
      setLoading(true);
      const { data } = await API.get('/products/my-products');
      setProducts(data);
    } catch (error) {
      toast.error("Gagal memuat produk Anda.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isAuthenticated === false) {
      router.push('/login');
    }
    // Hanya fetch jika user adalah admin
    if (isAuthenticated && user && user.role === 'admin') {
      fetchMyProducts();
    } else if (isAuthenticated && user && user.role !== 'admin'){
       // Jika bukan admin, arahkan ke halaman utama atau halaman akun
       toast.info("Hanya admin yang dapat mengakses halaman ini.");
       router.push('/account');
    }
  }, [isAuthenticated, user, router]);

  const handleDelete = async (productId) => {
    if (confirm('Apakah Anda yakin ingin menghapus produk ini?')) {
      try {
        await API.delete(`/products/${productId}`);
        toast.success('Produk berhasil dihapus.');
        fetchMyProducts();
      } catch (error) {
        toast.error('Gagal menghapus produk.');
      }
    }
  };

  // Tampilkan loading state jika otentikasi belum selesai
  if (loading || isAuthenticated === null || !user) {
    return <div className="text-center py-16">Loading...</div>;
  }

  // Tampilkan halaman hanya jika admin
  if (user.role !== 'admin') {
      return null; // atau return <div className="text-center py-16">Access Denied</div>;
  }

  return (
    <div className="container mx-auto px-4 py-16">
      <h1 className="text-3xl font-bold text-secondary mb-8">My Account</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-1">
          <div className="bg-white rounded-lg shadow p-6">
             <nav className="space-y-1">
              <Link href="/account" className="text-secondary-light hover:bg-gray-50 hover:text-secondary group flex items-center px-3 py-2 text-sm font-medium rounded-md">
                <UserCircleIcon className="h-6 w-6 mr-3"/>
                Profile
              </Link>
              <Link href="/account/order" className="text-secondary-light hover:bg-gray-50 hover:text-secondary group flex items-center px-3 py-2 text-sm font-medium rounded-md">
                <ClipboardDocumentListIcon className="h-6 w-6 mr-3"/>
                Orders
              </Link>
              <Link href="/account/my-products" className="bg-primary-light text-primary group flex items-center px-3 py-2 text-sm font-medium rounded-md">
                <BuildingStorefrontIcon className="h-6 w-6 mr-3"/>
                My Products
              </Link>
              <button onClick={logout} className="text-secondary-light hover:bg-gray-50 hover:text-secondary group flex items-center px-3 py-2 text-sm font-medium rounded-md w-full">
                <ArrowLeftStartOnRectangleIcon className="h-6 w-6 mr-3"/>
                Logout
              </button>
            </nav>
          </div>
        </div>
        
        <div className="md:col-span-2">
          <div className="bg-white rounded-lg shadow">
            <div className="p-6 flex justify-between items-center">
              <h2 className="text-xl font-bold text-secondary">My Products</h2>
              <Button onClick={() => router.push('/upload-product')}>Upload New Product</Button>
            </div>
            <div className="border-t border-gray-200">
              {products.length > 0 ? (
                <ul role="list" className="divide-y divide-gray-200">
                  {products.map(product => (
                    <li key={product.id} className="p-4 flex items-center justify-between">
                      <div className="flex items-center">
                        <Image
                          src={product.imageUrl || '/images/placeholder.png'}
                          alt={product.name}
                          width={64}
                          height={64}
                          className="w-16 h-16 rounded-md object-cover"
                        />
                        <div className="ml-4">
                          <p className="font-semibold text-secondary">{product.name}</p>
                          <p className="text-sm text-secondary-light">Rp{product.price.toLocaleString('id-ID')}</p>
                          <p className="text-sm text-gray-500">Stock: {product.stock}</p>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button className="!bg-blue-500 hover:!bg-blue-600 !px-3 !py-1 text-xs">Edit</Button>
                        <Button onClick={() => handleDelete(product.id)} className="!bg-red-500 hover:!bg-red-600 !px-3 !py-1 text-xs">Delete</Button>
                      </div>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="p-6 text-gray-500 text-center">You have not uploaded any products yet.</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}