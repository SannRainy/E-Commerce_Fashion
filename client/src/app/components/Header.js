import Link from 'next/link';
import { MagnifyingGlassIcon, ShoppingBagIcon, UserIcon } from '@heroicons/react/24/outline';

export default function Header() {
  return (
    <header className="sticky top-0 z-50 border-b bg-white/90 backdrop-blur-md">
      <div className="container mx-auto flex h-20 items-center justify-between px-4">
        <Link href="/" className="text-2xl font-bold text-secondary">
          MDG Fashion
        </Link>
        <nav className="hidden items-center space-x-8 md:flex">
          <Link href="/" className="text-sm font-medium transition-colors hover:text-primary">Home</Link>
          <Link href="/products" className="text-sm font-medium transition-colors hover:text-primary">Shop</Link>
        </nav>
        <div className="flex items-center space-x-6">
          <MagnifyingGlassIcon className="h-6 w-6 cursor-pointer text-secondary-light transition-colors hover:text-secondary" />
          <ShoppingBagIcon className="h-6 w-6 cursor-pointer text-secondary-light transition-colors hover:text-secondary" />
          <UserIcon className="h-6 w-6 cursor-pointer text-secondary-light transition-colors hover:text-secondary" />
        </div>
      </div>
    </header>
  );
}