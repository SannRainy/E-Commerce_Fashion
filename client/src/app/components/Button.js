"use client";
import { motion } from 'framer-motion';

export default function Button({ children, className = '', ...props }) {
  return (
    <motion.button
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      className={`inline-flex items-center justify-center rounded-lg px-6 py-3 text-sm font-semibold text-white transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 bg-primary hover:bg-primary-dark ${className}`}
      {...props}
    >
      {children}
    </motion.button>
  );
}