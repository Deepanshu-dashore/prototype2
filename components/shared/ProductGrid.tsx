import React from 'react';
import Link from 'next/link';
import ProductCard, { Product } from './ProductCard';

interface ProductGridProps {
  title: string;
  products: Product[];
  subtitle?: string;
}

const ProductGrid: React.FC<ProductGridProps> = ({ title, products, subtitle }) => {
  return (
    <section className="py-24 bg-background">
      <div className="container">
        <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-8">
          <div className="flex flex-col gap-2">
            {subtitle && (
              <span className="text-primary-bright font-bold uppercase tracking-[0.3em] text-xs">
                {subtitle}
              </span>
            )}
            <h2 className="text-5xl md:text-7xl font-bold uppercase tracking-tighter leading-[0.9]">
              {title}
            </h2>
          </div>
          
          <Link 
            href="#" 
            className="group flex items-center space-x-2 font-bold uppercase tracking-widest text-xs border-b-2 border-black/10 hover:border-primary-bright pb-2 transition-all duration-300"
          >
            <span>Explore All</span>
            <span className="group-hover:translate-x-1 transition-transform">→</span>
          </Link>
        </div>
        
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-x-6 gap-y-16">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default ProductGrid;
