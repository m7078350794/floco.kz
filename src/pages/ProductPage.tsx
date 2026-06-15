import { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useProductStore } from '@/store/productStore';
import { useCartStore } from '@/store/cartStore';
import { useCartDrawer } from '@/components/cart/CartDrawerProvider';
import { useFavoritesStore } from '@/store/favoritesStore';
import { useRegionStore } from '@/store/regionStore';
import { getProductPrice, getProductOldPrice } from '@/lib/price';
import { formatPrice } from '@/lib/formatters';
import type { Product } from '@/types';

export default function ProductPage() {
  const { slug } = useParams<{ slug: string }>();
  const currentCountry = useRegionStore((s) => s.country);
  const navigate = useNavigate();
  const products = useProductStore((s) => s.products);
  const addItem = useCartStore((s) => s.addItem);
  const { open } = useCartDrawer();
  const { toggle: toggleFavorite, isFavorite } = useFavoritesStore();

  const product = products.find((p) => p.slug === slug);
  const [quantity, setQuantity] = useState(1);

  // Scroll to top on mount
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [slug]);

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center pt-20">
        <div className="text-center">
          <h1 className="text-2xl font-semibold mb-4 text-primary">Букет не найден</h1>
          <button onClick={() => navigate('/catalog')} className="text-text-secondary hover:text-primary transition-colors cursor-pointer">
            Вернуться в каталог
          </button>
        </div>
      </div>
    );
  }

  const handleAddToCart = () => {
    for (let i = 0; i < quantity; i++) {
      addItem(product);
    }
    open();
  };

  const favorite = isFavorite(product.id);

  // Get similar products (same category)
  const similarProducts = products
    .filter((p) => p.category === product.category && p.id !== product.id)
    .slice(0, 4);

  return (
    <div className="pt-24 pb-20">
      <div className="max-w-7xl mx-auto px-5 sm:px-8">
        
        {/* Breadcrumbs */}
        <nav className="flex text-sm text-text-muted mb-8">
          <Link to="/" className="hover:text-primary transition-colors">Главная</Link>
          <span className="mx-2">/</span>
          <Link to="/catalog" className="hover:text-primary transition-colors">Каталог</Link>
          <span className="mx-2">/</span>
          <span className="text-primary truncate">{product.name}</span>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16">
          {/* Image */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="relative"
          >
            <div className="aspect-[3/4] md:aspect-square rounded-2xl md:rounded-[32px] overflow-hidden bg-cream-dark">
              <img
                src={product.image}
                alt={product.name}
                className="w-full h-full object-cover"
              />
            </div>
            <button
              onClick={() => toggleFavorite(product.id)}
              className="absolute top-6 right-6 w-12 h-12 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center shadow-soft hover:scale-105 transition-transform cursor-pointer"
            >
              <svg 
                className={`w-6 h-6 transition-colors ${favorite ? 'text-error fill-error' : 'text-primary'}`} 
                fill={favorite ? "currentColor" : "none"} 
                viewBox="0 0 24 24" 
                stroke="currentColor" 
                strokeWidth={favorite ? 0 : 1.5}
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
              </svg>
            </button>
          </motion.div>

          {/* Details */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="flex flex-col"
          >
            {product.isNew && (
              <span className="inline-block px-3 py-1 mb-4 bg-primary text-white text-xs font-bold uppercase tracking-widest rounded-full w-fit">
                Новинка
              </span>
            )}
            
            <h1 className="font-heading text-3xl md:text-5xl font-bold text-primary mb-4">
              {product.name}
            </h1>
            
            <div className="flex items-end gap-3 mb-8">
              <span className="text-2xl md:text-3xl font-semibold text-primary">
                {formatPrice(getProductPrice(product, currentCountry), currentCountry)}
              </span>
              {getProductOldPrice(product, currentCountry) && (
                <span className="text-base md:text-lg text-text-muted line-through">
                  {formatPrice(getProductOldPrice(product, currentCountry), currentCountry)}
                </span>
              )}
            </div>

            <p className="text-text-secondary leading-relaxed mb-8">
              {product.description || 'Элегантный букет, собранный нашими флористами с любовью. Идеально подойдет для любого повода и подарит незабываемые эмоции.'}
            </p>

            {product.composition && product.composition.length > 0 && (
              <div className="mb-10">
                <h3 className="font-medium text-primary mb-3">Состав:</h3>
                <ul className="grid grid-cols-2 gap-2">
                  {product.composition.map((item, idx) => (
                    <li key={idx} className="text-sm text-text-secondary flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-accent/50" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Actions */}
            <div className="mt-auto space-y-4 pt-8 border-t border-border">
              <div className="flex gap-4">
                {/* Quantity */}
                <div className="flex items-center justify-between border border-border rounded-[var(--radius-button)] px-4 py-3 min-w-[120px]">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="text-text-secondary hover:text-primary transition-colors p-1 cursor-pointer"
                  >
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" d="M20 12H4" />
                    </svg>
                  </button>
                  <span className="font-medium text-primary">{quantity}</span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="text-text-secondary hover:text-primary transition-colors p-1 cursor-pointer"
                  >
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" d="M12 4v16m8-8H4" />
                    </svg>
                  </button>
                </div>
                
                {/* Add to cart */}
                <button
                  onClick={handleAddToCart}
                  disabled={!product.inStock}
                  className="flex-1 bg-primary text-white font-medium rounded-[var(--radius-button)] hover:bg-primary-hover transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed btn-shine"
                >
                  {product.inStock ? 'Добавить в корзину' : 'Нет в наличии'}
                </button>
              </div>

              {/* Quick checkout */}
              <button
                onClick={() => {
                  addItem(product);
                  navigate('/checkout');
                }}
                disabled={!product.inStock}
                className="w-full py-4 bg-transparent border-2 border-primary text-primary font-medium rounded-[var(--radius-button)] hover:bg-primary/5 transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Купить сейчас
              </button>
            </div>
            
            {/* Guarantee */}
            <div className="mt-8 flex items-center gap-4 text-sm text-text-secondary bg-surface p-4 rounded-2xl border border-border">
              <div className="w-10 h-10 rounded-full bg-cream flex items-center justify-center shrink-0">
                <svg className="w-5 h-5 text-accent-dark" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <p>Свежие цветы и быстрая доставка. Фото букета перед отправкой в WhatsApp.</p>
            </div>
          </motion.div>
        </div>

        {/* Similar Products */}
        {similarProducts.length > 0 && (
          <div className="mt-32">
            <h2 className="font-heading text-3xl font-semibold text-primary mb-8 text-center md:text-left">
              Вам также может понравиться
            </h2>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
              {similarProducts.map((p, i) => (
                <div key={p.id}>
                  <Link to={`/product/${p.slug}`} className="block group">
                    <div className="relative aspect-[3/4] rounded-2xl overflow-hidden img-placeholder mb-3">
                      <img
                        src={p.image}
                        alt={p.name}
                        className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                        loading="lazy"
                      />
                    </div>
                    <div className="text-center md:text-left px-1">
                      <h3 className="font-medium text-primary text-sm group-hover:text-accent-dark transition-colors truncate">
                        {p.name}
                      </h3>
                      <p className="font-semibold text-primary mt-1 text-sm">
                        {formatPrice(p.price)}
                      </p>
                    </div>
                  </Link>
                </div>
              ))}
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
