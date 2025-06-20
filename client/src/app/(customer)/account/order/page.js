// client/src/app/(customer)/account/orders/page.js
import Link from 'next/link';
import { UserCircleIcon, ClipboardDocumentListIcon, ArrowRightOnRectangleIcon } from '@heroicons/react/24/outline';

// --- Mock Data ---
const MOCK_ORDERS = [
  { id: 'WU88191111', date: 'July 12, 2024', datetime: '2024-07-12', total: 'Rp 585,000', status: 'Delivered' },
  { id: 'WU88191110', date: 'June 5, 2024', datetime: '2024-06-05', total: 'Rp 620,000', status: 'Delivered' },
];

export default function OrdersPage() {
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
              <Link href="/account/orders" className="bg-primary-light text-primary group flex items-center px-3 py-2 text-sm font-medium rounded-md">
                <ClipboardDocumentListIcon className="h-6 w-6 mr-3"/>
                Orders
              </Link>
               <button className="text-secondary-light hover:bg-gray-50 hover:text-secondary group flex items-center px-3 py-2 text-sm font-medium rounded-md w-full">
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
            <ul role="list" className="divide-y divide-gray-200">
              {MOCK_ORDERS.map((order) => (
                <li key={order.id}>
                  <div className="block hover:bg-gray-50 px-6 py-5">
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-medium text-primary truncate">Order #{order.id}</p>
                      <div className="ml-2 flex-shrink-0 flex">
                        <p className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${order.status === 'Delivered' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                          {order.status}
                        </p>
                      </div>
                    </div>
                    <div className="mt-2 sm:flex sm:justify-between">
                      <div className="sm:flex">
                        <p className="flex items-center text-sm text-gray-500">
                          <time dateTime={order.datetime}>{order.date}</time>
                        </p>
                      </div>
                      <div className="mt-2 flex items-center text-sm text-gray-900 font-semibold sm:mt-0">
                        <p>{order.total}</p>
                      </div>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}