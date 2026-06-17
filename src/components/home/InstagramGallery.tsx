import { useRef, useEffect, useState } from 'react';
import { motion, useInView } from 'framer-motion';
import type { Product } from '@/types';
import { useTranslation } from 'react-i18next';
import { useRegionStore } from '@/store/regionStore';
import { useSettingsStore } from '@/store/settingsStore';

export default function InstagramGallery() {
  const { t } = useTranslation();
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });
  const [images, setImages] = useState<Product[]>([]);

  const city = useRegionStore((s) => s.city);
  const settings = useSettingsStore((s) => s.getSettingsForCity(city));
  
  const instagramUrl = settings?.instagramUrl || 'https://www.instagram.com/floco.ala/';
  let instagramHandle = '@floco.ala';
  try {
    if (instagramUrl) {
      const url = new URL(instagramUrl);
      const parts = url.pathname.split('/').filter(Boolean);
      if (parts.length > 0) {
        instagramHandle = `@${parts[0]}`;
      }
    }
  } catch (e) {
    // silently fallback
  }

  useEffect(() => {
    fetch('/data/products.json')
      .then((r) => r.json())
      .then((data: Product[]) => setImages(data.slice(0, 6)));
  }, []);

  return (
    <section className="py-20 md:py-28" id="instagram" ref={ref}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h2 className="font-heading text-3xl md:text-4xl lg:text-5xl font-semibold text-navy mb-3">
            {t('home.instagram.title')}
          </h2>
          <a
            href={instagramUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blush-dark hover:text-navy transition-colors text-lg font-heading"
          >
            {instagramHandle}
          </a>
        </motion.div>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-4">
          {images.map((img, index) => (
            <motion.a
              key={img.id}
              href={instagramUrl}
              target="_blank"
              rel="noopener noreferrer"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={isInView ? { opacity: 1, scale: 1 } : {}}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="relative group aspect-square rounded-[var(--radius-card)] overflow-hidden img-placeholder"
            >
              <img
                src={img.image}
                alt={img.name}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                loading="lazy"
                onError={(e) => {
                  (e.target as HTMLImageElement).style.display = 'none';
                }}
              />
              <div className="absolute inset-0 bg-navy/0 group-hover:bg-navy/40 transition-colors duration-500 flex items-center justify-center">
                <svg
                  className="w-8 h-8 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
                </svg>
              </div>
            </motion.a>
          ))}
        </div>
      </div>
    </section>
  );
}
