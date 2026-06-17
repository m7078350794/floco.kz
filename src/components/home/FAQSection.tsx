import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';

const faqs = [
  {
    question: 'Как оформить заказ?',
    answer: 'Выберите букет в каталоге, добавьте его в корзину и нажмите «Оформить заказ». Ваш заказ будет отправлен нам в WhatsApp, и мы свяжемся с вами для подтверждения в течение 15 минут.',
  },
  {
    question: 'Какие способы оплаты доступны?',
    answer: 'Мы принимаем оплату наличными при доставке, переводом на Kaspi Gold или через Kaspi QR. Оплата производится после подтверждения заказа.',
  },
  {
    question: 'Сколько стоит доставка?',
    answer: 'Доставка по Алматы — бесплатная при заказе от 15 000 ₸. Для заказов менее 15 000 ₸ стоимость доставки составляет 2 000 ₸.',
  },
  {
    question: 'Как быстро доставите?',
    answer: 'Стандартная доставка — в тот же день, если заказ оформлен до 14:00. Экспресс-доставка — в течение 2 часов. Точное время уточняется при подтверждении заказа.',
  },
  {
    question: 'Можно ли заказать букет анонимно?',
    answer: 'Да! При оформлении заказа отметьте опцию «Анонимная доставка», и получатель не узнает, от кого букет.',
  },
  {
    question: 'Что если букет не понравится?',
    answer: 'Мы гарантируем свежесть и качество каждого букета. Если вы не удовлетворены, свяжитесь с нами в течение 2 часов после получения, и мы решим вопрос.',
  },
];

export default function FAQSection() {
  const { t } = useTranslation();
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <section className="py-16 md:py-24 px-5 sm:px-8" id="faq">
      <div className="max-w-2xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.6 }}
          className="text-center mb-10 md:mb-14"
        >
          <h2 className="font-heading text-3xl md:text-5xl font-semibold text-primary">
            {t('home.faq.title')}
          </h2>
          <p className="text-text-secondary mt-2 text-sm md:text-base">
            {t('home.faq.subtitle')}
          </p>
        </motion.div>

        <div className="space-y-0">
          {faqs.map((faq, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-50px' }}
              transition={{ duration: 0.4, delay: i * 0.05 }}
              className="border-b border-border"
            >
              <button
                onClick={() => setOpenIndex(openIndex === i ? null : i)}
                className="w-full flex items-center justify-between py-5 md:py-6 text-left group cursor-pointer"
              >
                <span className="text-sm md:text-base font-medium text-primary pr-4 group-hover:text-accent-dark transition-colors">
                  {faq.question}
                </span>
                <motion.span
                  animate={{ rotate: openIndex === i ? 45 : 0 }}
                  transition={{ duration: 0.2 }}
                  className="flex-shrink-0 w-6 h-6 flex items-center justify-center text-text-muted"
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" d="M12 4v16m8-8H4" />
                  </svg>
                </motion.span>
              </button>
              <AnimatePresence initial={false}>
                {openIndex === i && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3, ease: [0.04, 0.62, 0.23, 0.98] }}
                    className="overflow-hidden"
                  >
                    <p className="pb-5 md:pb-6 text-sm text-text-secondary leading-relaxed pr-10">
                      {faq.answer}
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
