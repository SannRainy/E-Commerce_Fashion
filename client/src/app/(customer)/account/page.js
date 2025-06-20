// client/src/app/(customer)/account/page.js

import Link from 'next/link';
import { UserCircleIcon, ClipboardDocumentListIcon, ArrowRightOnRectangleIcon } from '@heroicons/react/24/outline';

// --- Mock Data ---
const MOCK_USER = {
  name: 'Krisna Satya',
  email: 'krisna.satya@example.com',
};

export default function AccountPage() {
  return (
    <div className="container mx-auto px-4 py-16">
      <h1 className="text-3xl font-bold text-secondary mb-8">My Account</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Kolom Navigasi */}
        <div className="md:col-span-1">
          <div className="bg-white rounded-lg shadow p-6">
            <nav className="space-y-1">
              <Link href="/account" className="bg-primary-light text-primary group flex items-center px-3 py-2 text-sm font-medium rounded-md">
                <UserCircleIcon className="h-6 w-6 mr-3"/>
                Profile
              </Link>
              <Link href="/account/orders" className="text-secondary-light hover:bg-gray-50 hover:text-secondary group flex items-center px-3 py-2 text-sm font-medium rounded-md">
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
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-bold text-secondary mb-4">Profile Information</h2>
            <dl className="divide-y divide-gray-200">
              <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4">
                <dt className="text-sm font-medium text-gray-500">Full name</dt>
                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{MOCK_USER.name}</dd>
              </div>
              <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4">
                <dt className="text-sm font-medium text-gray-500">Email address</dt>
                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{MOCK_USER.email}</dd>
              </div>
            </dl>
          </div>
        </div>
      </div>
    </div>
  );
}