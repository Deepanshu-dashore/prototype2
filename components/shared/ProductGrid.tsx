import React from 'react';
import Link from 'next/link';
import ProductCard, { Product } from './ProductCard';

interface ProductGridProps {
  title: string;
  products: Product[];
  subtitle?: string;
  showRating?: boolean;
}

const ProductGrid: React.FC<ProductGridProps> = ({ title, products, subtitle, showRating }) => {
  return (
    <section className="py-24 bg-background">
      <div className="container">
        <div className="flex flex-col md:flex-row justify-between items-end mb-8 gap-16">
          <div className="headerLeft">
            <h2 className="heading-brand">
              {title}
            </h2>
            {subtitle && (
              <p className="brand-desc">
                {subtitle}
              </p>
            )}
          </div>

          <Link
            href="#"
            className="group flex items-center space-x-2 font-semibold uppercase text-xs border-b-2 border-black/10 hover:border-primary-bright pb-2 transition-all duration-300"
          >
            <span>Explore All</span>
            <span className="group-hover:translate-x-1 transition-transform">→</span>
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-x-6 gap-y-10">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} showRating={showRating} disableVariants={true} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default ProductGrid;
