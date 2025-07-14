// E-Commerce_Fashion-main/client/src/app/(customer)/cart/page.js
"use client";

import Image from "next/image";
import Link from "next/link";
import { useState, useEffect } from "react";
import Button from "../../components/Button";
import { XMarkIcon } from "@heroicons/react/24/solid";
import { useAuth } from "../../_contexts/AuthContext";
import { useRouter } from "next/navigation";
import API from "../../../api";
import { toast } from "react-toastify";
import debounce from 'lodash.debounce';

export default function CartPage() {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const { isAuthenticated } = useAuth();
  const router = useRouter();

  // Fungsi untuk mengambil data keranjang
  const fetchCartItems = async () => {
    if (!isAuthenticated) {
        router.push('/login');
        return;
    }
    try {
      setLoading(true);
      const { data } = await API.get('/cart');
      // Kita ubah struktur data agar konsisten dengan yang lama
      const formattedData = data.map(item => ({
          id: item.cart_item_id,
          product: {
              id: item.product_id,
              name: item.name,
              price: item.price,
              imageUrl: item.imageUrl,
          },
          quantity: item.quantity,
      }));
      setCartItems(formattedData);
    } catch (error) {
      toast.error("Gagal memuat keranjang belanja.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCartItems();
  }, [isAuthenticated]);

  const handleRemoveItem = async (productId) => {
    try {
      await API.delete(`/cart/${productId}`);
      toast.success("Item berhasil dihapus.");
      fetchCartItems(); // Muat ulang data keranjang
    } catch (error) {
      toast.error("Gagal menghapus item.");
    }
  };

  const handleUpdateQuantity = debounce(async (productId, quantity) => {
    try {
        await API.put(`/cart/${productId}`, { quantity });
        toast.info("Kuantitas diperbarui.");
        fetchCartItems(); // Muat ulang data
    } catch (error) {
        toast.error("Gagal memperbarui kuantitas.");
    }
  }, 500); // Debounce untuk menghindari terlalu banyak request

  const subtotal = cartItems.reduce(
    (acc, item) => acc + item.product.price * item.quantity,
    0
  );

  if (loading) {
      return <div className="text-center py-16">Loading your cart...</div>;
  }
  
  return (
    <div className="bg-white">
      <div className="container mx-auto px-4 py-16 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">Shopping Cart</h1>
        
        {cartItems.length === 0 ? (
          <div className="mt-12 text-center">
            <p className="text-lg text-gray-500">Your cart is empty.</p>
            <Button as={Link} href="/products" className="mt-6">
              Continue Shopping
            </Button>
          </div>
        ) : (
          <form className="mt-12 lg:grid lg:grid-cols-12 lg:items-start lg:gap-x-12 xl:gap-x-16">
            <section aria-labelledby="cart-heading" className="lg:col-span-7">
              <h2 id="cart-heading" className="sr-only">
                Items in your shopping cart
              </h2>

              <ul role="list" className="divide-y divide-gray-200 border-b border-t border-gray-200">
                {cartItems.map((item) => (
                  <li key={item.id} className="flex py-6 sm:py-10">
                    <div className="flex-shrink-0">
                      <Image
                        src={item.product.imageUrl || '/images/placeholder.png'}
                        alt={item.product.name}
                        width={128}
                        height={128}
                        className="h-24 w-24 rounded-md object-cover object-center sm:h-48 sm:w-48"
                      />
                    </div>

                    <div className="ml-4 flex flex-1 flex-col justify-between sm:ml-6">
                      <div className="relative pr-9 sm:grid sm:grid-cols-2 sm:gap-x-6 sm:pr-0">
                        <div>
                          <div className="flex justify-between">
                            <h3 className="text-sm">
                              <Link href={`/products/${item.product.id}`} className="font-medium text-gray-700 hover:text-gray-800">
                                {item.product.name}
                              </Link>
                            </h3>
                          </div>
                          <p className="mt-1 text-sm font-medium text-gray-900">
                            Rp{item.product.price.toLocaleString('id-ID')}
                          </p>
                        </div>

                        <div className="mt-4 sm:mt-0 sm:pr-9">
                          <label htmlFor={`quantity-${item.id}`} className="sr-only">
                            Quantity, {item.product.name}
                          </label>
                          <select
                            id={`quantity-${item.id}`}
                            name={`quantity-${item.id}`}
                            className="max-w-full rounded-md border border-gray-300 py-1.5 text-left text-base font-medium leading-5 text-gray-700 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 sm:text-sm"
                            defaultValue={item.quantity}
                            onChange={(e) => handleUpdateQuantity(item.product.id, e.target.value)}
                          >
                            {[...Array(10).keys()].map(i => (
                                <option key={i+1} value={i + 1}>{i + 1}</option>
                            ))}
                          </select>

                          <div className="absolute right-0 top-0">
                            <button 
                              type="button" 
                              onClick={() => handleRemoveItem(item.product.id)}
                              className="-m-2 inline-flex p-2 text-gray-400 hover:text-gray-500"
                            >
                              <span className="sr-only">Remove</span>
                              <XMarkIcon className="h-5 w-5" aria-hidden="true" />
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </section>

            {/* Order summary */}
            <section
              aria-labelledby="summary-heading"
              className="mt-16 rounded-lg bg-gray-50 px-4 py-6 sm:p-6 lg:col-span-5 lg:mt-0 lg:p-8"
            >
              <h2 id="summary-heading" className="text-lg font-medium text-gray-900">
                Order summary
              </h2>

              <dl className="mt-6 space-y-4">
                <div className="flex items-center justify-between">
                  <dt className="text-sm text-gray-600">Subtotal</dt>
                  <dd className="text-sm font-medium text-gray-900">Rp{subtotal.toLocaleString('id-ID')}</dd>
                </div>
                <div className="flex items-center justify-between border-t border-gray-200 pt-4">
                  <dt className="text-base font-medium text-gray-900">Order total</dt>
                  <dd className="text-base font-medium text-gray-900">Rp{subtotal.toLocaleString('id-ID')}</dd>
                </div>
              </dl>

              <div className="mt-6">
                <Button as={Link} href="/checkout" className="w-full">
                  Checkout
                </Button>
              </div>
            </section>
          </form>
        )}
      </div>
    </div>
  )
}