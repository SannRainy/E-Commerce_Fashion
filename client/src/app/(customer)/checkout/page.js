// E-Commerce_Fashion-main/client/src/app/(customer)/checkout/page.js
"use client";
import Image from "next/image";
import Button from "../../components/Button";
import { useState, useEffect } from "react";
import { useAuth } from "../../_contexts/AuthContext";
import { useRouter } from "next/navigation";
import API from "../../../api";
import { toast } from "react-toastify";

export default function CheckoutPage() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user, isAuthenticated } = useAuth();
  const router = useRouter();

  // Mengambil data keranjang saat komponen dimuat
  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login');
      return;
    }

    const fetchCartItems = async () => {
      try {
        const { data } = await API.get('/cart');
        const formattedData = data.map(item => ({
          id: item.product_id,
          name: item.name,
          price: item.price,
          imageUrl: item.imageUrl,
          quantity: item.quantity,
        }));
        setItems(formattedData);
      } catch (error) {
        toast.error("Gagal memuat item untuk checkout.");
      } finally {
        setLoading(false);
      }
    };

    fetchCartItems();
  }, [isAuthenticated, router]);

  const subtotal = items.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const shipping = 25000; // Contoh biaya pengiriman
  const total = subtotal + shipping;

  const handlePlaceOrder = async (e) => {
    e.preventDefault();
    if (items.length === 0) {
      toast.error("Keranjang Anda kosong.");
      return;
    }

    const orderData = {
      items: items.map(item => ({
        id: item.id,
        quantity: item.quantity,
        price: item.price,
      })),
      total_amount: total,
    };

    try {
      const { data } = await API.post('/orders', orderData);
      toast.success(`Pesanan #${data.orderId} berhasil dibuat!`);
      
      // Kosongkan keranjang setelah pesanan berhasil
      await API.delete('/cart');
      
      router.push('/account/order'); // Arahkan ke halaman riwayat pesanan
    } catch (error) {
      toast.error("Gagal membuat pesanan.");
    }
  };

  if (loading) {
    return <div className="text-center py-16">Loading checkout...</div>;
  }

  return (
    <div className="bg-gray-50">
      <main className="container mx-auto max-w-7xl px-4 pb-24 pt-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl lg:max-w-none">
          <h1 className="sr-only">Checkout</h1>

          <form className="lg:grid lg:grid-cols-2 lg:gap-x-12 xl:gap-x-16" onSubmit={handlePlaceOrder}>
            <div>
              <div>
                <h2 className="text-lg font-medium text-gray-900">Contact information</h2>
                <div className="mt-4">
                  <label htmlFor="email-address" className="block text-sm font-medium text-gray-700">Email address</label>
                  <div className="mt-1">
                    <input type="email" id="email-address" name="email-address" autoComplete="email" defaultValue={user?.email || ''} required className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2" />
                  </div>
                </div>
              </div>

              <div className="mt-10 border-t border-gray-200 pt-10">
                <h2 className="text-lg font-medium text-gray-900">Shipping information</h2>
                <div className="mt-4 grid grid-cols-1 gap-y-6 sm:grid-cols-2 sm:gap-x-4">
                  <div>
                    <label htmlFor="full-name" className="block text-sm font-medium text-gray-700">Full name</label>
                    <div className="mt-1">
                      <input type="text" id="full-name" name="full-name" defaultValue={user?.name || ''} required className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2" />
                    </div>
                  </div>
                  <div className="sm:col-span-2">
                    <label htmlFor="address" className="block text-sm font-medium text-gray-700">Address</label>
                    <div className="mt-1">
                      <input type="text" name="address" id="address" required className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2" />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Order summary */}
            <div className="mt-10 lg:mt-0">
              <h2 className="text-lg font-medium text-gray-900">Order summary</h2>

              <div className="mt-4 rounded-lg border border-gray-200 bg-white shadow-sm">
                <ul role="list" className="divide-y divide-gray-200">
                  {items.map((product) => (
                    <li key={product.id} className="flex px-4 py-6 sm:px-6">
                      <div className="flex-shrink-0">
                         <Image src={product.imageUrl || '/images/placeholder.png'} alt={product.name} width={80} height={80} className="w-20 rounded-md" />
                      </div>
                      <div className="ml-6 flex flex-1 flex-col">
                        <div className="flex">
                          <div className="min-w-0 flex-1">
                            <h4 className="text-sm">
                              <span className="font-medium text-gray-700 hover:text-gray-800">{product.name}</span>
                            </h4>
                            <p className="mt-1 text-sm text-gray-500">Qty: {product.quantity}</p>
                          </div>
                        </div>
                        <div className="flex flex-1 items-end justify-between pt-2">
                          <p className="mt-1 text-sm font-medium text-gray-900">Rp{product.price.toLocaleString('id-ID')}</p>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
                <dl className="space-y-6 border-t border-gray-200 px-4 py-6 sm:px-6">
                  <div className="flex items-center justify-between">
                    <dt className="text-sm">Subtotal</dt>
                    <dd className="text-sm font-medium text-gray-900">Rp{subtotal.toLocaleString('id-ID')}</dd>
                  </div>
                  <div className="flex items-center justify-between">
                    <dt className="text-sm">Shipping</dt>
                    <dd className="text-sm font-medium text-gray-900">Rp{shipping.toLocaleString('id-ID')}</dd>
                  </div>
                  <div className="flex items-center justify-between border-t border-gray-200 pt-6">
                    <dt className="text-base font-medium">Total</dt>
                    <dd className="text-base font-medium text-gray-900">Rp{total.toLocaleString('id-ID')}</dd>
                  </div>
                </dl>

                <div className="border-t border-gray-200 px-4 py-6 sm:px-6">
                  <Button type="submit" className="w-full">
                    Place order
                  </Button>
                </div>
              </div>
            </div>
          </form>
        </div>
      </main>
    </div>
  )
}