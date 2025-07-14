// E-Commerce_Fashion-main/client/src/app/(customer)/account/order/[id]/page.js
"use client";

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { useAuth } from '../../../../_contexts/AuthContext';
import API from '../../../../../api';
import { toast } from 'react-toastify';

export default function OrderDetailPage() {
  const { id: orderId } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const { isAuthenticated } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login');
      return;
    }
    const fetchOrderDetails = async () => {
      try {
        setLoading(true);
        const { data } = await API.get(`/orders/${orderId}`);
        setOrder(data);
      } catch (error) {
        toast.error("Gagal memuat detail pesanan.");
        router.push('/account/order');
      } finally {
        setLoading(false);
      }
    };
    fetchOrderDetails();
  }, [isAuthenticated, router, orderId]);

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('id-ID', options);
  };

  if (loading) {
    return <div className="text-center py-16">Loading order details...</div>;
  }

  if (!order) {
    return <div className="text-center py-16">Order not found.</div>;
  }

  return (
    <div className="bg-gray-50">
      <main className="container mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold text-gray-900">Order Details</h1>
            <Link href="/account/order" className="text-sm font-medium text-primary hover:text-primary-dark">
              &larr; Back to Orders
            </Link>
          </div>

          <div className="mt-2 border-t border-b border-gray-200 bg-white shadow-sm sm:rounded-lg sm:border">
            <div className="px-4 py-5 sm:px-6">
              <dl className="grid grid-cols-1 gap-x-4 gap-y-8 sm:grid-cols-2">
                <div className="sm:col-span-1">
                  <dt className="text-sm font-medium text-gray-500">Order number</dt>
                  <dd className="mt-1 text-sm text-gray-900">#{order.id}</dd>
                </div>
                <div className="sm:col-span-1">
                  <dt className="text-sm font-medium text-gray-500">Date placed</dt>
                  <dd className="mt-1 text-sm text-gray-900">
                    <time dateTime={order.created_at}>{formatDate(order.created_at)}</time>
                  </dd>
                </div>
                <div className="sm:col-span-1">
                  <dt className="text-sm font-medium text-gray-500">Total amount</dt>
                  <dd className="mt-1 text-sm font-medium text-gray-900">Rp{order.total_amount.toLocaleString('id-ID')}</dd>
                </div>
                <div className="sm:col-span-1">
                  <dt className="text-sm font-medium text-gray-500">Status</dt>
                  <dd className="mt-1 text-sm text-gray-900 capitalize">{order.status}</dd>
                </div>
              </dl>
            </div>
          </div>
          
          <section aria-labelledby="products-in-order-heading" className="mt-8">
            <h2 id="products-in-order-heading" className="text-lg font-medium text-gray-900">
              Items in this order
            </h2>
            <div className="mt-4 space-y-6">
              {order.items.map((item) => (
                <div key={item.product_id} className="bg-white border-b border-gray-200 p-4 flex">
                  <div className="flex-shrink-0 overflow-hidden rounded-lg w-20 h-20">
                    <Image
                      src={item.imageUrl || '/images/placeholder.png'}
                      alt={item.name}
                      width={80}
                      height={80}
                      className="h-full w-full object-cover object-center"
                    />
                  </div>
                  <div className="ml-4 flex flex-1 flex-col">
                    <div>
                      <h4 className="text-base text-gray-900">{item.name}</h4>
                      <p className="mt-1 text-sm text-gray-500">
                        {item.quantity} x Rp{item.price.toLocaleString('id-ID')}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}