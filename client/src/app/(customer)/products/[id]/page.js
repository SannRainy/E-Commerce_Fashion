// client/src/app/(customer)/products/[id]/page.js

import Button from "@/app/components/Button";
import Image from "next/image";

const MOCK_PRODUCTS = {
  '1': { id: 1, name: 'Sepatu Marcaa', price: 275000, imageUrl: '/images/Marca.jpg', description: '' },
  '2': { id: 2, name: 'Sepatu Nail Trends', price: 499000, imageUrl: '/images/Nail Trends.jpg', description: '' },

};

async function getProductById(id) {

  console.log(`Fetching product with id: ${id}`);

  const product = MOCK_PRODUCTS[id];
  return product;
}


export default async function ProductDetailPage({ params }) {
  const { id } = params;
  const product = await getProductById(id);

  if (!product) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <h1 className="text-2xl font-bold">Produk tidak ditemukan.</h1>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-16">
      <div className="grid md:grid-cols-2 gap-12">

        <div className="rounded-lg overflow-hidden">
          <Image
            src={product.imageUrl}
            alt={product.name}
            width={600}
            height={600}
            className="w-full h-full object-cover object-center"
          />
        </div>

        {/* Kolom Detail & Aksi */}
        <div className="flex flex-col justify-center">
          <h1 className="text-3xl md:text-4xl font-bold text-secondary mb-4">{product.name}</h1>
          <p className="text-3xl font-semibold text-secondary-dark mb-6">
            Rp{product.price.toLocaleString('id-ID')}
          </p>
          <p className="text-secondary-light mb-8">
            {product.description}
          </p>
          
          <div className="flex items-center gap-4">
            <Button className="w-full md:w-auto">
              Tambah ke Keranjang
            </Button>

          </div>
        </div>
      </div>
    </div>
  );
}