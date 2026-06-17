import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { useTranslation } from 'react-i18next';

const reviews = [
  {
    id: 1,
    name: 'Айгерим',
    text: 'Заказывала букет пионов на день рождения мамы. Цветы свежайшие, аромат потрясающий! Доставили вовремя. Спасибо за отличный сервис.',
    date: '2 дня назад',
    rating: 5,
  },
  {
    id: 2,
    name: 'Данияр',
    text: 'Отличный магазин! Очень вежливый персонал, помогли подобрать букет под бюджет. Девушка была в восторге.',
    date: '1 неделю назад',
    rating: 5,
  },
  {
    id: 3,
    name: 'Мадина',
    text: 'Всегда заказываю цветы только здесь. Эстетика букетов на высшем уровне, выглядят дорого и стильно. Рекомендую!',
    date: '2 недели назад',
    rating: 5,
  },
  {
    id: 4,
    name: 'Ерлан',
    text: 'Удобно, что можно оформить заказ анонимно. Сюрприз удался! Курьер был очень вежлив. Однозначно буду заказывать еще.',
    date: '1 месяц назад',
    rating: 5,
  },
  {
    id: 5,
    name: 'Асель',
    text: 'Потрясающие авторские композиции. Вживую букет оказался даже красивее, чем на фото. Спасибо за вашу работу!',
    date: '2 месяца назад',
    rating: 5,
  },
];

export default function ReviewsSection() {
  const { t } = useTranslation();
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start end', 'end start'],
  });

  const x = useTransform(scrollYProgress, [0, 1], [0, -300]);

  return (
    <section className="py-20 md:py-32 overflow-hidden bg-cream" ref={containerRef}>
      <div className="max-w-7xl mx-auto px-5 sm:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12 md:mb-20"
        >
          <h2 className="font-heading text-3xl md:text-5xl font-semibold text-primary">
            {t('home.reviews.title')}
          </h2>
          <p className="text-text-secondary mt-3 text-sm md:text-base max-w-lg mx-auto">
            {t('home.reviews.subtitle')}
          </p>
        </motion.div>

        {/* Horizontal scroll on mobile, grid on desktop is handled via flex */}
        <div className="relative">
          <motion.div 
            style={{ x }}
            className="flex gap-6 w-max"
          >
            {reviews.map((review) => (
              <div 
                key={review.id} 
                className="w-[320px] md:w-[400px] bg-surface p-8 rounded-[var(--radius-card)] shadow-soft border border-border/50 shrink-0"
              >
                <div className="flex items-center gap-1 mb-4">
                  {[...Array(review.rating)].map((_, i) => (
                    <svg key={i} className="w-5 h-5 text-accent" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
                <p className="text-primary/90 text-base md:text-lg mb-6 leading-relaxed font-body">
                  "{review.text}"
                </p>
                <div className="flex items-center justify-between">
                  <span className="font-medium text-primary">{review.name}</span>
                  <span className="text-sm text-text-muted">{review.date}</span>
                </div>
              </div>
            ))}
            {/* Duplicate for infinite feel */}
            {reviews.map((review) => (
              <div 
                key={`dup-${review.id}`} 
                className="w-[320px] md:w-[400px] bg-surface p-8 rounded-[var(--radius-card)] shadow-soft border border-border/50 shrink-0"
              >
                <div className="flex items-center gap-1 mb-4">
                  {[...Array(review.rating)].map((_, i) => (
                    <svg key={i} className="w-5 h-5 text-accent" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
                <p className="text-primary/90 text-base md:text-lg mb-6 leading-relaxed font-body">
                  "{review.text}"
                </p>
                <div className="flex items-center justify-between">
                  <span className="font-medium text-primary">{review.name}</span>
                  <span className="text-sm text-text-muted">{review.date}</span>
                </div>
              </div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
