"use client";
import { useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import API from '../../../api';
import Button from '../../components/Button';
import { useAuth } from '../../_contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import Image from 'next/image';

export default function UploadProductPage() {
  const { register, handleSubmit, watch, formState: { errors } } = useForm();
  const { user, isAuthenticated } = useAuth();
  const router = useRouter();
  const [imagePreview, setImagePreview] = useState(null);

  const watchedImage = watch("image");

  // Update image preview when a new file is selected
  useEffect(() => {
    if (watchedImage && watchedImage.length > 0) {
      const file = watchedImage[0];
      setImagePreview(URL.createObjectURL(file));
    } else {
      setImagePreview(null);
    }
  }, [watchedImage]);

  // Protect the route for admin only
  useEffect(() => {
    if (isAuthenticated === false) {
      router.push('/login');
    } else if (user && user.role !== 'admin') {
      toast.error("Hanya admin yang dapat mengakses halaman ini.");
      router.push('/');
    }
  }, [user, isAuthenticated, router]);
  
  const onSubmit = async (data) => {
    const formData = new FormData();
    formData.append('name', data.name);
    formData.append('description', data.description);
    formData.append('price', data.price);
    formData.append('stock', data.stock);
    formData.append('image', data.image[0]);

    try {
      toast.info("Mengunggah produk...");
      await API.post('/products', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      toast.success('Produk berhasil diunggah!');
      router.push('/account/my-products');
    } catch (error) {
      toast.error('Gagal mengunggah produk.');
    }
  };
  
  if (!user || user.role !== 'admin') {
    return <div className="text-center py-16">Loading...</div>; // Render loading/fallback
  }

  return (
    <div className="container mx-auto px-4 py-16">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold text-secondary mb-8">Upload New Product</h1>
        <form className="space-y-6 rounded-lg bg-white p-8 shadow-lg" onSubmit={handleSubmit(onSubmit)}>
          
          {/* Product Name */}
          <div>
            <label htmlFor="name" className="block text-sm font-semibold text-gray-700 mb-1">
              Product Name
            </label>
            <input
              id="name"
              {...register("name", { required: "Nama produk wajib diisi" })}
              className="w-full rounded-md border border-gray-300 px-3 py-2 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary"
              placeholder="e.g., Classic Leather Shoes"
            />
            {errors.name && <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>}
          </div>

          {/* Description */}
          <div>
            <label htmlFor="description" className="block text-sm font-semibold text-gray-700 mb-1">
              Description
            </label>
            <textarea
              id="description"
              rows={4}
              {...register("description")}
              className="w-full rounded-md border border-gray-300 px-3 py-2 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary"
              placeholder="Describe the product details"
            />
          </div>

          {/* Price & Stock */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="price" className="block text-sm font-semibold text-gray-700 mb-1">
                Price (IDR)
              </label>
              <input
                id="price"
                type="number"
                {...register("price", { required: "Harga wajib diisi", valueAsNumber: true })}
                className="w-full rounded-md border border-gray-300 px-3 py-2 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary"
                placeholder="e.g., 500000"
              />
              {errors.price && <p className="mt-1 text-sm text-red-600">{errors.price.message}</p>}
            </div>
            <div>
              <label htmlFor="stock" className="block text-sm font-semibold text-gray-700 mb-1">
                Stock
              </label>
              <input
                id="stock"
                type="number"
                {...register("stock", { required: "Stok wajib diisi", valueAsNumber: true })}
                className="w-full rounded-md border border-gray-300 px-3 py-2 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary"
                placeholder="e.g., 50"
              />
              {errors.stock && <p className="mt-1 text-sm text-red-600">{errors.stock.message}</p>}
            </div>
          </div>
          
          {/* Product Image */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">
              Product Image
            </label>
            <div className="mt-2 flex items-center justify-center w-full">
              <label htmlFor="image" className="flex flex-col items-center justify-center w-full h-64 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100">
                {imagePreview ? (
                  <Image src={imagePreview} alt="Preview" width={200} height={200} className="h-full w-auto object-contain p-2"/>
                ) : (
                  <div className="flex flex-col items-center justify-center pt-5 pb-6">
                    <svg className="w-8 h-8 mb-4 text-gray-500" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 16"><path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2"/></svg>
                    <p className="mb-2 text-sm text-gray-500"><span className="font-semibold">Click to upload</span> or drag and drop</p>
                    <p className="text-xs text-gray-500">PNG, JPG, or WEBP</p>
                  </div>
                )}
                <input id="image" type="file" {...register("image", { required: "Gambar wajib diunggah" })} className="hidden" accept="image/png, image/jpeg, image/webp" />
              </label>
            </div>
            {errors.image && <p className="mt-1 text-sm text-red-600">{errors.image.message}</p>}
          </div>

          <div className="pt-4">
            <Button type="submit" className="w-full">
              Upload Product
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}