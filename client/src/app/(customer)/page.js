// E-Commerce_Fashion-main/client/src/app/(customer)/page.js
import Button from "../components/Button";
import ProductCard from "../components/ProductCard";
import API from "../../api";

// Fungsi untuk mengambil produk dari API
async function getFeaturedProducts() {
  try {
    // Panggil API dengan parameter untuk hanya mengambil halaman pertama
    const { data: responseData } = await API.get('/products?page=1&perPage=3');
    
    // Akses array produk melalui properti 'data' dari respons
    return responseData.data; 
  } catch (error) {
    console.error("Failed to fetch featured products:", error);
    return []; // Kembalikan array kosong jika terjadi error
  }
}


export default async function HomePage() {
  const featuredProducts = await getFeaturedProducts();

  return (
    <>
      {/* Bagian Hero Section */}
      <section className="relative flex h-[60vh] items-center justify-center bg-cover bg-center" style={{ backgroundImage: "url('/images/Hero.jpg')" }}>
        <div className="absolute inset-0 bg-black/50"></div>
        <div className="relative z-10 text-center text-white">
          <h1 className="text-4xl font-bold md:text-6xl">Style in Every Step</h1>
          <p className="mx-auto mt-4 max-w-xl">Find the perfect pair to complete your look.</p>
          <Button className="mt-8">Shop Now</Button>
        </div>
      </section>

      {/* Bagian Featured Products */}
      <section className="container mx-auto px-4 py-16">
        <h2 className="text-center text-3xl font-bold text-secondary">Featured Products</h2>
        <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-3 xl:gap-x-8">
          {featuredProducts && featuredProducts.length > 0 ? (
            featuredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))
          ) : (
            <p className="col-span-full text-center text-secondary-light">Could not load products at the moment.</p>
          )}
        </div>
      </section>
    </>
  );
}