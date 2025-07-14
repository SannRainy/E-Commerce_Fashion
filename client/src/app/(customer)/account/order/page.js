// E-Commerce_Fashion-main/client/src/app/(customer)/account/order/page.js
"use client";
import Link from 'next/link';
import { UserCircleIcon, ClipboardDocumentListIcon, ArrowRightOnRectangleIcon } from '@heroicons/react/24/outline';
import { useAuth } from '../../../_contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import API from '../../../../api';
import { toast } from 'react-toastify';


export default function OrdersPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const { logout, isAuthenticated } = useAuth();
  const router = useRouter();

  useEffect(() => {
     if (!isAuthenticated) {
      router.push('/login');
      return;
    }
    const fetchOrders = async () => {
      try {
        setLoading(true);
        const { data } = await API.get('/orders');
        setOrders(data);
      } catch (error) {
        toast.error("Gagal memuat riwayat pesanan.");
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, [isAuthenticated, router]);
  
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('id-ID', options);
  };

  if (loading) {
      return <div className="text-center py-16">Loading your orders...</div>;
  }

  return (
    <div className="container mx-auto px-4 py-16">
      <h1 className="text-3xl font-bold text-secondary mb-8">My Account</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Kolom Navigasi */}
        <div className="md:col-span-1">
          <div className="bg-white rounded-lg shadow p-6">
            <nav className="space-y-1">
              <Link href="/account" className="text-secondary-light hover:bg-gray-50 hover:text-secondary group flex items-center px-3 py-2 text-sm font-medium rounded-md">
                <UserCircleIcon className="h-6 w-6 mr-3"/>
                Profile
              </Link>
              <Link href="/account/order" className="bg-primary-light text-primary group flex items-center px-3 py-2 text-sm font-medium rounded-md">
                <ClipboardDocumentListIcon className="h-6 w-6 mr-3"/>
                Orders
              </Link>
               <button onClick={logout} className="text-secondary-light hover:bg-gray-50 hover:text-secondary group flex items-center px-3 py-2 text-sm font-medium rounded-md w-full">
                <ArrowRightOnRectangleIcon className="h-6 w-6 mr-3"/>
                Logout
              </button>
            </nav>
          </div>
        </div>
        
        {/* Kolom Konten */}
         <div className="md:col-span-2">
      <div className="bg-white rounded-lg shadow">
        <div className="p-6">
          <h2 className="text-xl font-bold text-secondary">Order History</h2>
        </div>
        {orders.length > 0 ? (
          <ul role="list" className="divide-y divide-gray-200">
            {orders.map((order) => (
              <li key={order.id}>
                {/* Ubah div menjadi Link */}
                <Link href={`/account/order/${order.id}`} className="block hover:bg-gray-50 px-6 py-5">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-medium text-primary truncate">Order #{order.id}</p>
                    <div className="ml-2 flex-shrink-0 flex">
                      <p className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full capitalize ${order.status === 'pending' ? 'bg-yellow-100 text-yellow-800' : 'bg-green-100 text-green-800'}`}>
                        {order.status}
                      </p>
                    </div>
                  </div>
                  <div className="mt-2 sm:flex sm:justify-between">
                    <div className="sm:flex">
                      <p className="flex items-center text-sm text-gray-500">
                        <time dateTime={order.created_at}>{formatDate(order.created_at)}</time>
                      </p>
                    </div>
                    <div className="mt-2 flex items-center text-sm text-gray-900 font-semibold sm:mt-0">
                      <p>Rp{order.total_amount.toLocaleString('id-ID')}</p>
                    </div>
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        ) : (
          <p className="p-6 text-gray-500">Anda belum memiliki riwayat pesanan.</p>
        )}
      </div>
    </div>
      </div>
    </div>
  );
}