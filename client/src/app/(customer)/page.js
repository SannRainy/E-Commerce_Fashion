import Button from "../components/Button";
import ProductCard from "../components/ProductCard";

const featuredProducts = [
  { id: 1, name: 'Sandal Merah Elegan', price: 275000, imageUrl: '/images/product-1.jpg' },
  { id: 2, name: 'Sepatu Sporty Dinamis', price: 499000, imageUrl: '/images/product-2.jpg' },
  // ...
];

export default function HomePage() {
  return (
    <>
      <section className="relative flex h-[60vh] items-center justify-center bg-cover bg-center" style={{ backgroundImage: "url('/images/hero.jpg')" }}>
        <div className="absolute inset-0 bg-black/50"></div>
        <div className="relative z-10 text-center text-white">
          <h1 className="text-4xl font-bold md:text-6xl">Style in Every Step</h1>
          <p className="mx-auto mt-4 max-w-xl">Find the perfect pair to complete your look.</p>
          <Button className="mt-8">Shop Now</Button>
        </div>
      </section>

      <section className="container mx-auto px-4 py-16">
        <h2 className="text-center text-3xl font-bold text-secondary">Featured Products</h2>
        <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-3 xl:gap-x-8">
          {featuredProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>
    </>
  );
}