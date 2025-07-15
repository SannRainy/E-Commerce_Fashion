// E-Commerce_Fashion-main/client/src/app/(customer)/account/page.js
"use client";
import { useAuth } from '../../_contexts/AuthContext';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { UserCircleIcon, ClipboardDocumentListIcon, ArrowLeftStartOnRectangleIcon, BuildingStorefrontIcon } from '@heroicons/react/24/outline';
import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import API from '../../../api';
import Button from '../../components/Button';

export default function AccountPage() {
  const { user, logout, loading, isAuthenticated, refetchUser } = useAuth();
  const router = useRouter();
  
  // State untuk data spesifik admin
  const [adminData, setAdminData] = useState(null);
  
  // State untuk form top-up customer
  const [topUpAmount, setTopUpAmount] = useState('');

  useEffect(() => {
    // Redirect jika belum login
    if (isAuthenticated === false && !loading) {
      router.push('/login');
    }

    // Jika user adalah admin, ambil data dasbornya
    if (user?.role === 'admin') {
      const fetchAdminData = async () => {
        try {
          const { data } = await API.get('/orders/admin/dashboard');
          setAdminData(data);
        } catch (error) {
          toast.error("Gagal memuat data dasbor admin.");
        }
      };
      fetchAdminData();
    }
  }, [user, isAuthenticated, loading, router]);

  const handleTopUp = async (e) => {
    e.preventDefault();
    const amount = parseFloat(topUpAmount);
    if (!amount || amount <= 0) {
      toast.error("Masukkan jumlah top-up yang valid.");
      return;
    }
    try {
      await API.post('/auth/topup', { amount });
      toast.success('Top-up berhasil!');
      setTopUpAmount('');
      if(refetchUser) refetchUser(); // Refresh data user
    } catch (error) {
      toast.error("Gagal melakukan top-up.");
    }
  };

  if (loading || !user) {
    return <div className="text-center py-16">Loading...</div>;
  }
  
  return (
    <div className="container mx-auto px-4 py-16">
      <h1 className="text-3xl font-bold text-secondary mb-8">My Account</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Kolom Navigasi (Sama untuk semua) */}
        <div className="md:col-span-1">
          <div className="bg-white rounded-lg shadow p-6">
            <nav className="space-y-1">
              <Link href="/account" className="bg-primary-light text-primary group flex items-center px-3 py-2 text-sm font-medium rounded-md">
                <UserCircleIcon className="h-6 w-6 mr-3"/>
                Profile
              </Link>
              {/* Menu dinamis berdasarkan peran */}
              {user.role === 'admin' ? (
                <>
                  <Link href="/admin/orders" className="text-secondary-light hover:bg-gray-50 hover:text-secondary group flex items-center px-3 py-2 text-sm font-medium rounded-md">
                    <ClipboardDocumentListIcon className="h-6 w-6 mr-3"/>
                    Manage Orders
                  </Link>
                  <Link href="/account/my-products" className="text-secondary-light hover:bg-gray-50 hover:text-secondary group flex items-center px-3 py-2 text-sm font-medium rounded-md">
                    <BuildingStorefrontIcon className="h-6 w-6 mr-3"/>
                    Manage Products
                  </Link>
                </>
              ) : (
                <Link href="/account/order" className="text-secondary-light hover:bg-gray-50 hover:text-secondary group flex items-center px-3 py-2 text-sm font-medium rounded-md">
                  <ClipboardDocumentListIcon className="h-6 w-6 mr-3"/>
                  My Orders
                </Link>
              )}
              <button onClick={logout} className="text-secondary-light hover:bg-gray-50 hover:text-secondary group flex items-center px-3 py-2 text-sm font-medium rounded-md w-full">
                <ArrowLeftStartOnRectangleIcon className="h-6 w-6 mr-3"/>
                Logout
              </button>
            </nav>
          </div>
        </div>
        
        {/* Kolom Konten (Dinamis) */}
        <div className="md:col-span-2 space-y-8">
          {/* Profile Info */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-bold text-secondary mb-4">Profile Information</h2>
            <dl className="divide-y divide-gray-200">
              <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4">
                <dt className="text-sm font-medium text-gray-500">Full name</dt>
                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{user.name}</dd>
              </div>
              <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4">
                <dt className="text-sm font-medium text-gray-500">Email address</dt>
                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{user.email}</dd>
              </div>
              <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4">
                <dt className="text-sm font-medium text-gray-500">Role</dt>
                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2 capitalize">{user.role}</dd>
              </div>
            </dl>
          </div>

          {/* Bagian Dompet (Dinamis berdasarkan Peran) */}
          {user.role === 'admin' ? (
            // Tampilan Dompet untuk Admin
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-bold text-secondary mb-4">Store Revenue</h2>
              <dl>
                <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4">
                  <dt className="text-sm font-medium text-gray-500">Total Revenue</dt>
                  <dd className="mt-1 text-lg font-bold text-green-600 sm:mt-0 sm:col-span-2">
                    Rp{adminData ? Number(adminData.totalRevenue).toLocaleString('id-ID') : '0'}
                  </dd>
                </div>
                <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 border-t">
                  <dt className="text-sm font-medium text-gray-500">Pending Orders</dt>
                  <dd className="mt-1 text-lg font-bold text-yellow-600 sm:mt-0 sm:col-span-2">
                    {adminData ? adminData.pendingOrders : '0'}
                  </dd>
                </div>
              </dl>
            </div>
          ) : (
            // Tampilan Dompet untuk Customer
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-bold text-secondary mb-4">My Wallet</h2>
              <div className="py-4">
                  <p className="text-sm font-medium text-gray-500">Current Balance</p>
                  <p className="mt-1 text-2xl font-bold text-primary">
                    Rp{user && user.balance ? Number(user.balance).toLocaleString('id-ID') : '0'}
                  </p>
              </div>
              <form onSubmit={handleTopUp} className="flex flex-col sm:flex-row gap-4 border-t pt-4">
                <input
                  type="number"
                  value={topUpAmount}
                  onChange={(e) => setTopUpAmount(e.target.value)}
                  placeholder="Enter top-up amount"
                  className="w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
                  min="1"
                />
                <Button type="submit" className="w-full sm:w-auto">Top Up</Button>
              </form>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}