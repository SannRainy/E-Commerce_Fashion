// E-Commerce_Fashion-main/client/src/app/components/Header.js
"use client";
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '../_contexts/AuthContext';
import { MagnifyingGlassIcon, ShoppingBagIcon, UserIcon, ArrowLeftStartOnRectangleIcon } from '@heroicons/react/24/outline';
import { useState } from 'react';

export default function Header() {
  const { isAuthenticated, user, logout } = useAuth();
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState('');

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchTerm.trim())}`);
    }
  };

  return (
    <header className="sticky top-0 z-50 border-b bg-white/90 backdrop-blur-md">
      <div className="container mx-auto flex h-20 items-center justify-between px-4">
        <Link href="/" className="text-2xl font-bold text-secondary">
          MDG Fashion
        </Link>
        <nav className="hidden items-center space-x-8 md:flex">
          <Link href="/" className="text-sm font-medium transition-colors hover:text-primary">Home</Link>
          <Link href="/products" className="text-sm font-medium transition-colors hover:text-primary">Shop</Link>
          {isAuthenticated && user && user.role === 'admin' && (
             <>
                <Link href="/account/my-products" className="text-sm font-medium transition-colors hover:text-primary">Manage Products</Link>
                <Link href="/admin/orders" className="text-sm font-medium transition-colors hover:text-primary">Manage Orders</Link>
             </>
          )}
        </nav>
        <div className="flex items-center space-x-4">
          <form onSubmit={handleSearch} className="relative">
            <input
              type="text"
              placeholder="Search products..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="hidden sm:block w-40 rounded-md border border-gray-300 px-3 py-1.5 text-sm focus:border-primary focus:ring-primary"
            />
            <button type="submit" className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-secondary">
               <MagnifyingGlassIcon className="h-5 w-5" />
            </button>
          </form>
          
          {isAuthenticated ? (
            <>
              <Link href="/cart">
                <ShoppingBagIcon className="h-6 w-6 cursor-pointer text-secondary-light transition-colors hover:text-secondary" />
              </Link>
              <Link href="/account">
                <UserIcon className="h-6 w-6 cursor-pointer text-secondary-light transition-colors hover:text-secondary" />
              </Link>
              <button onClick={logout} title="Logout">
                <ArrowLeftStartOnRectangleIcon className="h-6 w-6 cursor-pointer text-secondary-light transition-colors hover:text-secondary" />
              </button>
            </>
          ) : (
             <Link href="/login" title="Login">
               <UserIcon className="h-6 w-6 cursor-pointer text-secondary-light transition-colors hover:text-secondary" />
             </Link>
          )}
        </div>
      </div>
    </header>
  );
}