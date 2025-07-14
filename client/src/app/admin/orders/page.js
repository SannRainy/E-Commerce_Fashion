// E-Commerce_Fashion-main/client/src/app/admin/orders/page.js
"use client";

import { useEffect, useState } from 'react';
import { useAuth } from '../../_contexts/AuthContext';
import { useRouter } from 'next/navigation';
import API from '../../../api';
import { toast } from 'react-toastify';
import Button from '../../components/Button';

export default function ManageOrdersPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user, isAuthenticated } = useAuth();
  const router = useRouter();

  const fetchAllOrders = async () => {
    try {
      setLoading(true);
      const { data } = await API.get('/orders/all/list');
      setOrders(data);
    } catch (error) {
      toast.error("Gagal memuat daftar pesanan.");
    } finally {
      setLoading(false);
    }
  };
  
  useEffect(() => {
    if (isAuthenticated && user?.role === 'admin') {
      fetchAllOrders();
    } else if (isAuthenticated === false) {
      router.push('/login');
    } else if (user && user.role !== 'admin') {
      router.push('/');
    }
  }, [user, isAuthenticated, router]);

  const handleUpdateStatus = async (orderId, newStatus) => {
    try {
      await API.put(`/orders/${orderId}/status`, { status: newStatus });
      toast.success(`Pesanan #${orderId} telah di-${newStatus}.`);
      fetchAllOrders(); // Muat ulang daftar pesanan
    } catch (error) {
      toast.error("Gagal memperbarui status pesanan.");
    }
  };
  
  const formatDate = (dateString) => new Date(dateString).toLocaleString('id-ID');

  if (loading || !user || user.role !== 'admin') {
    return <div className="text-center py-16">Loading...</div>;
  }

  return (
    <div className="container mx-auto px-4 py-16">
      <h1 className="text-3xl font-bold text-secondary mb-8">Manage All Orders</h1>
      <div className="bg-white shadow overflow-hidden rounded-md">
        <ul role="list" className="divide-y divide-gray-200">
          {orders.map((order) => (
            <li key={order.id} className="p-4 sm:p-6">
              <div className="flex items-center justify-between flex-wrap gap-4">
                <div>
                  <p className="text-sm font-medium text-primary truncate">Order #{order.id}</p>
                  <p className="mt-1 text-sm text-gray-500">
                    By: {order.customer_name} ({order.customer_email})
                  </p>
                  <p className="mt-1 text-sm text-gray-500">
                    Date: {formatDate(order.created_at)}
                  </p>
                </div>
                <div className="flex-shrink-0 flex flex-col sm:flex-row items-end gap-4">
                    <div>
                        <p className="font-semibold">Rp{order.total_amount.toLocaleString('id-ID')}</p>
                        <p className={`mt-1 text-right text-sm font-semibold capitalize ${order.status === 'pending' ? 'text-yellow-600' : 'text-green-600'}`}>
                            {order.status}
                        </p>
                    </div>
                    {order.status === 'pending' && (
                        <Button
                          onClick={() => handleUpdateStatus(order.id, 'accepted')}
                          className="!bg-green-600 hover:!bg-green-700 !px-3 !py-1.5 text-sm"
                        >
                          Accept Order
                        </Button>
                    )}
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}