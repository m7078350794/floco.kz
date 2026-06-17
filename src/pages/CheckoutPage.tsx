import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { motion } from 'framer-motion';
import { useCartStore } from '@/store/cartStore';
import { useSettingsStore } from '@/store/settingsStore';
import { useRegionStore } from '@/store/regionStore';
import { getProductPrice } from '@/lib/price';
import { sendOrderWhatsApp } from '@/lib/whatsapp';
import { formatPrice } from '@/lib/formatters';
import { Input, Textarea } from '@/components/ui/Input';
import { useTranslation } from 'react-i18next';

const checkoutSchema = z.object({
  customerName: z.string().min(2, 'Имя должно содержать минимум 2 символа'),
  customerPhone: z.string().min(10, 'Введите корректный номер телефона'),
  recipientName: z.string().optional(),
  recipientPhone: z.string().optional(),
  deliveryAddress: z.string().min(5, 'Введите полный адрес доставки'),
  deliveryDate: z.string().min(1, 'Выберите дату доставки'),
  deliveryTime: z.string().min(1, 'Выберите время доставки'),
  isAnonymous: z.boolean(),
  comment: z.string().optional(),
});

type CheckoutForm = z.infer<typeof checkoutSchema>;

export default function CheckoutPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { items, getTotal, clearCart } = useCartStore();
  const currentCountry = useRegionStore((s) => s.country);
  const city = useRegionStore((s) => s.city);
  const settings = useSettingsStore((s) => s.getSettingsForCity(city));
  const [isSubmitting, setIsSubmitting] = useState(false);

  const total = getTotal(currentCountry);
  const deliveryPrice = total >= 15000 ? 0 : 2000;

  useEffect(() => {
    if (items.length === 0) {
      navigate('/catalog');
    }
  }, [items, navigate]);

  const {
    control,
    handleSubmit,
    register,
    watch,
    formState: { errors },
  } = useForm<CheckoutForm>({
    resolver: zodResolver(checkoutSchema),
    defaultValues: {
      isAnonymous: false,
      deliveryDate: new Date().toISOString().split('T')[0],
      deliveryTime: '10:00 - 12:00',
    },
  });

  const isAnonymous = watch('isAnonymous');

  const onSubmit = async (data: CheckoutForm) => {
    setIsSubmitting(true);
    try {
      const orderData: import('@/types').OrderData = {
        name: data.customerName,
        phone: data.customerPhone,
        deliveryDate: data.deliveryDate,
        deliveryTime: data.deliveryTime,
        address: data.deliveryAddress,
        cardText: data.comment || '',
        isAnonymous: data.isAnonymous,
      };

      sendOrderWhatsApp(settings?.whatsappPhone || '77001234567', orderData, items, total, deliveryPrice, currentCountry);
      
      clearCart();
      navigate('/');
    } catch (error) {
      console.error('Checkout error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (items.length === 0) return null;

  return (
    <div className="pt-24 pb-20 min-h-screen bg-cream">
      <div className="max-w-6xl mx-auto px-5 sm:px-8">
        
        <div className="mb-8">
          <button
            onClick={() => navigate(-1)}
            className="inline-flex items-center gap-2 text-sm text-text-secondary hover:text-primary transition-colors cursor-pointer"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
            </svg>
            {t('checkout.backToCart')}
          </button>
          <h1 className="font-heading text-3xl md:text-5xl font-bold text-primary mt-6 mb-8 md:mb-12">
            {t('checkout.title')}
          </h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          
          <div className="lg:col-span-7 xl:col-span-8">
            <form id="checkout-form" onSubmit={handleSubmit(onSubmit)} className="space-y-8">
              
              <div className="bg-surface rounded-2xl p-6 md:p-8 border border-border">
                <h2 className="font-heading text-xl font-semibold text-primary mb-6 flex items-center gap-3">
                  <span className="w-8 h-8 rounded-full bg-cream text-primary flex items-center justify-center text-sm">1</span>
                  {t('checkout.step1')}
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <Input
                    label={t('checkout.form.name')}
                    placeholder={t('checkout.form.namePlaceholder')}
                    error={errors.customerName?.message}
                    {...register('customerName')}
                  />
                  <Input
                    label={t('checkout.form.phone')}
                    placeholder="+7 (___) ___-__-__"
                    error={errors.customerPhone?.message}
                    {...register('customerPhone')}
                  />
                </div>
              </div>

              <div className="bg-surface rounded-2xl p-6 md:p-8 border border-border">
                <h2 className="font-heading text-xl font-semibold text-primary mb-6 flex items-center gap-3">
                  <span className="w-8 h-8 rounded-full bg-cream text-primary flex items-center justify-center text-sm">2</span>
                  {t('checkout.step2')}
                </h2>
                <div className="space-y-5">
                  <Input
                    label={t('checkout.form.address')}
                    placeholder={t('checkout.form.addressPlaceholder')}
                    error={errors.deliveryAddress?.message}
                    {...register('deliveryAddress')}
                  />
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Input
                      label={t('checkout.form.date')}
                      type="date"
                      error={errors.deliveryDate?.message}
                      {...register('deliveryDate')}
                    />
                    <Input
                      label={t('checkout.form.time')}
                      type="time"
                      error={errors.deliveryTime?.message}
                      {...register('deliveryTime')}
                    />
                  </div>
                </div>
              </div>

              <div className="bg-surface rounded-2xl p-6 md:p-8 border border-border">
                <h2 className="font-heading text-xl font-semibold text-primary mb-6 flex items-center gap-3">
                  <span className="w-8 h-8 rounded-full bg-cream text-primary flex items-center justify-center text-sm">3</span>
                  {t('checkout.step3')}
                </h2>
                
                <div className="space-y-6">
                  <label className="flex items-start gap-3 cursor-pointer group">
                    <div className="relative flex items-center justify-center mt-1">
                      <input
                        type="checkbox"
                        className="peer appearance-none w-5 h-5 border-2 border-border rounded checked:border-primary checked:bg-primary transition-colors cursor-pointer"
                        {...register('isAnonymous')}
                      />
                      <svg className="absolute w-3 h-3 text-white opacity-0 peer-checked:opacity-100 pointer-events-none" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <div>
                      <span className="block font-medium text-primary group-hover:text-accent-dark transition-colors">{t('checkout.form.anonymous')}</span>
                      <span className="block text-sm text-text-secondary mt-1">{t('checkout.form.anonymousDesc')}</span>
                    </div>
                  </label>

                  {!isAnonymous && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      className="grid grid-cols-1 md:grid-cols-2 gap-5"
                    >
                      <Input
                        label={t('checkout.form.recipientName')}
                        placeholder={t('checkout.form.namePlaceholder')}
                        {...register('recipientName')}
                      />
                      <Input
                        label={t('checkout.form.recipientPhone')}
                        placeholder="+7 (___) ___-__-__"
                        {...register('recipientPhone')}
                      />
                    </motion.div>
                  )}
                </div>
              </div>

              <div className="bg-surface rounded-2xl p-6 md:p-8 border border-border">
                <Textarea
                  label={t('checkout.form.comment')}
                  placeholder={t('checkout.form.commentPlaceholder')}
                  {...register('comment')}
                />
              </div>
            </form>
          </div>

          <div className="lg:col-span-5 xl:col-span-4">
            <div className="bg-cream/30 rounded-2xl p-6 md:p-8 border border-border/50 sticky top-28">
              <h3 className="font-heading text-2xl font-semibold text-primary mb-6">
                {t('checkout.summary.title')}
              </h3>
              
              <div className="space-y-4 mb-6 max-h-[300px] overflow-y-auto no-scrollbar pr-2">
                {items.map((item) => (
                  <div key={item.product.id} className="flex gap-4">
                    <div className="w-16 h-16 rounded-xl overflow-hidden shrink-0 bg-cream-dark">
                      <img src={item.product.image} alt={item.product.name} className="w-full h-full object-cover" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="text-sm font-medium text-primary truncate">{item.product.name}</h4>
                      <div className="flex items-center justify-between mt-1 text-sm text-text-secondary">
                        <span>{item.quantity} {t('cart.quantity')}</span>
                        <span className="font-medium text-primary">{formatPrice((getProductPrice(item.product, currentCountry) ?? 0) * item.quantity, currentCountry)}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-6 pt-6 border-t border-border space-y-3 text-sm">
                <div className="flex justify-between text-text-secondary">
                  <span>{t('checkout.summary.items')}</span>
                  <span>{formatPrice(total, currentCountry)}</span>
                </div>
                <div className="flex justify-between text-text-secondary">
                  <span>{t('checkout.summary.delivery')}</span>
                  <span>{deliveryPrice > 0 ? formatPrice(deliveryPrice, currentCountry) : t('checkout.summary.free')}</span>
                </div>
                <div className="flex justify-between font-bold text-lg text-primary pt-3 border-t border-border">
                  <span>{t('checkout.summary.total')}</span>
                  <span>{formatPrice(total + deliveryPrice, currentCountry)}</span>
                </div>
              </div>

              <button
                type="submit"
                form="checkout-form"
                disabled={isSubmitting}
                className="w-full mt-8 py-4 bg-primary text-white font-medium rounded-xl hover:bg-primary-hover transition-colors cursor-pointer disabled:opacity-70 flex items-center justify-center gap-2 btn-shine"
              >
                {isSubmitting ? t('checkout.summary.submitting') : t('checkout.summary.submit')}
                {!isSubmitting && (
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
                )}
              </button>
              <p className="text-center text-xs text-text-muted mt-4">
                {t('checkout.summary.terms')} <Link to="/privacy" className="underline hover:text-primary">{t('nav.privacy')}</Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
