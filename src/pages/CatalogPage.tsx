import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { useProductStore } from '@/store/productStore';
import { useCartStore } from '@/store/cartStore';
import { useCartDrawer } from '@/components/cart/CartDrawerProvider';
import { formatPrice } from '@/lib/formatters';
import { Link } from 'react-router-dom';
import type { Product } from '@/types';

const CATEGORIES = [
  { id: 'all', label: 'Все' },
  { id: 'mono', label: 'Монобукеты' },
  { id: 'author', label: 'Авторские букеты' },
  { id: 'box', label: 'Композиции в коробке' },
  { id: 'wedding', label: 'Свадебная флористика' },
];

export default function CatalogPage() {
  const products = useProductStore((s) => s.products);
  const [activeCategory, setActiveCategory] = useState('all');

  const filteredProducts = useMemo(() => {
    if (activeCategory === 'all') return products;
    return products.filter((p) => p.category === activeCategory);
  }, [products, activeCategory]);

  return (
    <div className="pt-24 pb-20 min-h-screen">
      <div className="max-w-7xl mx-auto px-5 sm:px-8">
        <div className="mb-10 md:mb-14 text-center">
          <h1 className="font-heading text-4xl md:text-5xl lg:text-6xl font-bold text-primary mb-4">
            Каталог
          </h1>
          <p className="text-text-secondary">Свежие цветы с доставкой по Алматы</p>
        </div>

        {/* Categories (Pills) */}
        <div className="flex overflow-x-auto no-scrollbar gap-2 mb-10 pb-2">
          {CATEGORIES.map((category) => (
            <button
              key={category.id}
              onClick={() => setActiveCategory(category.id)}
              className={`whitespace-nowrap px-6 py-2.5 rounded-full text-sm font-medium transition-all duration-300 cursor-pointer ${
                activeCategory === category.id
                  ? 'bg-primary text-white shadow-md'
                  : 'bg-white border border-border text-text-secondary hover:border-primary hover:text-primary'
              }`}
            >
              {category.label}
            </button>
          ))}
        </div>

        {/* Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-x-4 gap-y-10 md:gap-x-6 md:gap-y-12">
          {filteredProducts.map((product, index) => (
            <CatalogCard key={product.id} product={product} index={index} />
          ))}
        </div>

        {filteredProducts.length === 0 && (
          <div className="text-center py-20">
            <p className="text-text-secondary text-lg">В этой категории пока нет товаров.</p>
            <button
              onClick={() => setActiveCategory('all')}
              className="mt-4 text-primary font-medium hover:underline cursor-pointer"
            >
              Показать все букеты
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

function CatalogCard({ product, index }: { product: Product; index: number }) {
  const addItem = useCartStore((s) => s.addItem);
  const { open } = useCartDrawer();

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addItem(product);
    open();
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.05 }}
    >
      <Link to={`/product/${product.slug}`} className="block group">
        <div className="relative aspect-[3/4] rounded-2xl overflow-hidden img-placeholder mb-4">
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
            loading="lazy"
          />
          {product.isNew && (
            <div className="absolute top-3 left-3 px-3 py-1 bg-primary text-white text-[10px] font-bold uppercase tracking-widest rounded-full">
              New
            </div>
          )}
          {product.oldPrice && (
            <div className="absolute top-3 left-3 px-3 py-1 bg-error text-white text-[10px] font-bold uppercase tracking-widest rounded-full">
              Sale
            </div>
          )}

          {/* Quick Add Button on Hover (Desktop) */}
          <div className="absolute bottom-0 left-0 right-0 p-4 opacity-0 translate-y-4 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300 hidden md:block">
            <button
              onClick={handleAddToCart}
              className="w-full py-3.5 bg-primary/95 backdrop-blur-sm text-white font-medium rounded-xl hover:bg-primary transition-colors cursor-pointer"
            >
              Добавить в корзину
            </button>
          </div>
        </div>

        <div className="text-center">
          <h3 className="font-medium text-primary text-sm md:text-base group-hover:text-accent-dark transition-colors line-clamp-1">
            {product.name}
          </h3>
          <div className="flex items-center justify-center gap-2 mt-1.5">
            <span className="font-semibold text-primary">
              {formatPrice(product.price)}
            </span>
            {product.oldPrice && (
              <span className="text-xs text-text-muted line-through">
                {formatPrice(product.oldPrice)}
              </span>
            )}
          </div>
          
          {/* Mobile Add Button */}
          <button
            onClick={handleAddToCart}
            className="mt-3 w-full py-2.5 border border-border text-primary text-sm font-medium rounded-xl hover:border-primary transition-colors cursor-pointer md:hidden"
          >
            В корзину
          </button>
        </div>
      </Link>
    </motion.div>
  );
}
