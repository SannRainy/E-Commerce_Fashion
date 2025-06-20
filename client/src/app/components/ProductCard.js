"use client";
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';

export default function ProductCard({ product }) {
  return (
    <motion.div
      whileHover={{ y: -5 }}
      className="group block"
    >
      <Link href={`/products/${product.id}`}>
        <div className="overflow-hidden rounded-lg bg-gray-100">
          <Image
            src={product.imageUrl}
            alt={product.name}
            width={400}
            height={400}
            className="h-full w-full object-cover object-center transition-transform duration-300 group-hover:scale-105"
          />
        </div>
        <div className="mt-4">
          <h3 className="text-sm font-medium text-secondary">{product.name}</h3>
          <p className="mt-1 text-lg font-semibold text-secondary-dark">
            Rp{product.price.toLocaleString('id-ID')}
          </p>
        </div>
      </Link>
    </motion.div>
  );
}