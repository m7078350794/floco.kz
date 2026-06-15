import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useProductStore } from '@/store/productStore';
import { useCartStore } from '@/store/cartStore';
import { useCartDrawer } from '@/components/cart/CartDrawerProvider';
import { useRegionStore } from '@/store/regionStore';
import { getProductPrice, getProductOldPrice } from '@/lib/price';
import { formatPrice } from '@/lib/formatters';
import type { Product } from '@/types';

export default function PopularBouquets() {
  const products = useProductStore((s) => s.products);
  const currentCountry = useRegionStore((s) => s.country);
  const popular = products.filter((p) => p.isPopular && p.inStock).slice(0, 6);

  if (popular.length === 0) return null;

  return (
    <section className="py-16 md:py-24 px-5 sm:px-8" id="popular">
      <div className="max-w-7xl mx-auto">
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.6 }}
          className="flex items-end justify-between mb-10 md:mb-14"
        >
          <div>
            <h2 className="font-heading text-3xl md:text-5xl font-semibold text-primary">
              Популярное
            </h2>
            <p className="text-text-secondary mt-2 text-sm md:text-base">
              Букеты, которые выбирают чаще всего
            </p>
          </div>
          <Link
            to="/catalog"
            className="hidden sm:inline-flex items-center gap-1.5 text-sm font-medium text-text-secondary hover:text-primary transition-colors group"
          >
            Смотреть все
            <svg className="w-4 h-4 transition-transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        </motion.div>

        {/* Products grid */}
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
          {popular.map((product, i) => (
            <ProductCard key={product.id} product={product} index={i} />
          ))}
        </div>

        {/* Mobile "View all" */}
        <div className="mt-8 text-center sm:hidden">
          <Link
            to="/catalog"
            className="inline-flex items-center gap-1.5 text-sm font-medium text-text-secondary hover:text-primary transition-colors"
          >
            Смотреть все
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        </div>
      </div>
    </section>
  );
}

function ProductCard({ product, index }: { product: Product; index: number }) {
  const addItem = useCartStore((s) => s.addItem);
  const currentCountry = useRegionStore((s) => s.country);
  const { open } = useCartDrawer();

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addItem(product);
    open();
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
    >
      <Link to={`/product/${product.slug}`} className="block group">
        {/* Image */}
        <div className="relative aspect-[3/4] rounded-2xl md:rounded-3xl overflow-hidden img-placeholder mb-3">
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
            loading="lazy"
          />
          {/* Badges */}
          <div className="absolute top-3 left-3 flex flex-col gap-1.5">
            {product.isNew && (
              <span className="px-2.5 py-1 bg-primary text-white text-[10px] font-semibold uppercase tracking-wider rounded-full">
                New
              </span>
            )}
            {getProductOldPrice(product, currentCountry) && (
              <span className="px-2.5 py-1 bg-error text-white text-[10px] font-semibold uppercase tracking-wider rounded-full">
                Sale
              </span>
            )}
          </div>
          {/* Add to cart overlay */}
          <div className="absolute bottom-0 left-0 right-0 p-3 md:p-4 opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300">
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={handleAddToCart}
              className="w-full py-3 bg-primary text-white text-sm font-medium rounded-xl hover:bg-primary-hover transition-colors cursor-pointer btn-shine"
            >
              Заказать
            </motion.button>
          </div>
        </div>

        {/* Info */}
        <div className="px-0.5">
          <h3 className="text-sm md:text-base font-medium text-primary truncate group-hover:text-accent-dark transition-colors">
            {product.name}
          </h3>
          {product.composition && product.composition.length > 0 && (
            <p className="text-xs text-text-muted mt-0.5 truncate hidden md:block">
              {product.composition.slice(0, 3).join(' · ')}
            </p>
          )}
          <div className="flex items-center gap-2 mt-1.5">
            <span className="text-sm md:text-base font-semibold text-primary">
              {formatPrice(getProductPrice(product, currentCountry), currentCountry)}
            </span>
            {getProductOldPrice(product, currentCountry) && (
              <span className="text-xs text-text-muted line-through">
                {formatPrice(getProductOldPrice(product, currentCountry), currentCountry)}
              </span>
            )}
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
