"use client";
import { useEffect } from 'react';
import { useAuth } from '@/app/_hooks/useAuth';
import { useRouter } from 'next/navigation';

export default function CheckoutPage() {
  const { isAuthenticated, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.push('/login');
    }
  }, [isAuthenticated, loading, router]);

  if (loading || !isAuthenticated) {
    return <div>Loading...</div>; 
  }
  
  return (
    <div>
      <h1>Checkout</h1>

    </div>
  );
}