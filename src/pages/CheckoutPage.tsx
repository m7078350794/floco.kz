import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { motion } from 'framer-motion';
import { useCartStore } from '@/store/cartStore';
import { useSettingsStore } from '@/store/settingsStore';
import { useRegionStore } from '@/store/regionStore';
import { formatPrice } from '@/lib/formatters';
import { Input, Textarea } from '@/components/ui/Input';

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
  const navigate = useNavigate();
  const { items, getTotal, clearCart } = useCartStore();
  const city = useRegionStore((s) => s.city);
  const settings = useSettingsStore((s) => s.getSettingsForCity(city));
  const [isSubmitting, setIsSubmitting] = useState(false);

  const total = getTotal();
  const deliveryPrice = total >= 15000 ? 0 : 2000;
  const finalTotal = total + deliveryPrice;

  useEffect(() => {
    if (items.length === 0) {
      navigate('/catalog');
    }
  }, [items, navigate]);

  const {
    control,
    handleSubmit,
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
      // Format message for WhatsApp
      const orderId = Math.random().toString(36).substring(2, 8).toUpperCase();
      let message = `*Новый заказ #${orderId}* 🌸\n\n`;
      
      message += `*Заказчик:*\n`;
      message += `Имя: ${data.customerName}\n`;
      message += `Телефон: ${data.customerPhone}\n\n`;
      
      if (!data.isAnonymous && data.recipientName) {
        message += `*Получатель:*\n`;
        message += `Имя: ${data.recipientName}\n`;
        message += `Телефон: ${data.recipientPhone}\n\n`;
      }

      if (data.isAnonymous) {
        message += `🤫 *Анонимная доставка*\n\n`;
      }
      
      message += `*Доставка:*\n`;
      message += `Адрес: ${data.deliveryAddress}\n`;
      message += `Дата: ${data.deliveryDate}\n`;
      message += `Время: ${data.deliveryTime}\n\n`;
      
      message += `*Состав заказа:*\n`;
      items.forEach((item, index) => {
        message += `${index + 1}. ${item.product.name} x${item.quantity} = ${formatPrice((item.product.price ?? 0) * item.quantity)}\n`;
      });
      
      message += `\n*Сумма заказа:* ${formatPrice(total)}\n`;
      message += `*Доставка:* ${deliveryPrice === 0 ? 'Бесплатно' : formatPrice(deliveryPrice)}\n`;
      message += `*ИТОГО к оплате:* ${formatPrice(finalTotal)}\n`;

      if (data.comment) {
        message += `\n*Комментарий:* ${data.comment}`;
      }

      // Encode and open WhatsApp
      const phone = settings?.whatsappPhone || '77001234567';
      const encodedMessage = encodeURIComponent(message);
      const whatsappUrl = `https://wa.me/${phone}?text=${encodedMessage}`;
      
      window.open(whatsappUrl, '_blank');
      
      // Clear cart and redirect
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
          <Link to="/cart" className="inline-flex items-center text-sm font-medium text-text-secondary hover:text-primary transition-colors cursor-pointer">
            <svg className="w-4 h-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
            </svg>
            Назад в корзину
          </Link>
          <h1 className="font-heading text-3xl md:text-5xl font-bold text-primary mt-4">
            Оформление заказа
          </h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          
          {/* Form */}
          <div className="lg:col-span-7 xl:col-span-8">
            <div className="bg-surface p-6 md:p-10 rounded-[32px] shadow-soft border border-border/50">
              <form id="checkout-form" onSubmit={handleSubmit(onSubmit)} className="space-y-10">
                
                {/* Customer Details */}
                <section>
                  <h2 className="text-xl font-medium text-primary mb-6 flex items-center gap-3">
                    <span className="flex items-center justify-center w-8 h-8 rounded-full bg-cream text-sm font-bold">1</span>
                    Ваши данные
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <Controller
                      name="customerName"
                      control={control}
                      render={({ field }) => (
                        <Input
                          label="Ваше имя *"
                          placeholder="Иван Иванов"
                          error={errors.customerName?.message}
                          {...field}
                        />
                      )}
                    />
                    <Controller
                      name="customerPhone"
                      control={control}
                      render={({ field }) => (
                        <Input
                          label="Ваш телефон *"
                          placeholder="+7 (700) 000-00-00"
                          error={errors.customerPhone?.message}
                          {...field}
                        />
                      )}
                    />
                  </div>
                </section>

                <hr className="border-border" />

                {/* Delivery Details */}
                <section>
                  <h2 className="text-xl font-medium text-primary mb-6 flex items-center gap-3">
                    <span className="flex items-center justify-center w-8 h-8 rounded-full bg-cream text-sm font-bold">2</span>
                    Доставка
                  </h2>
                  
                  <div className="space-y-5">
                    <Controller
                      name="deliveryAddress"
                      control={control}
                      render={({ field }) => (
                        <Input
                          label="Адрес доставки *"
                          placeholder="г. Алматы, ул. Абая 1, кв. 2"
                          error={errors.deliveryAddress?.message}
                          {...field}
                        />
                      )}
                    />

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                      <Controller
                        name="deliveryDate"
                        control={control}
                        render={({ field }) => (
                          <Input
                            type="date"
                            label="Дата доставки *"
                            min={new Date().toISOString().split('T')[0]}
                            error={errors.deliveryDate?.message}
                            {...field}
                          />
                        )}
                      />
                      <Controller
                        name="deliveryTime"
                        control={control}
                        render={({ field }) => (
                          <div className="space-y-1.5">
                            <label className="block text-sm font-medium text-text-secondary">Время доставки *</label>
                            <select
                              className="w-full px-4 py-3 bg-surface border border-border rounded-[var(--radius-input)] text-text-primary focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 transition-all cursor-pointer"
                              {...field}
                            >
                              <option value="09:00 - 11:00">09:00 - 11:00</option>
                              <option value="11:00 - 13:00">11:00 - 13:00</option>
                              <option value="13:00 - 15:00">13:00 - 15:00</option>
                              <option value="15:00 - 17:00">15:00 - 17:00</option>
                              <option value="17:00 - 19:00">17:00 - 19:00</option>
                              <option value="19:00 - 21:00">19:00 - 21:00</option>
                            </select>
                            {errors.deliveryTime && <p className="text-sm text-error">{errors.deliveryTime.message}</p>}
                          </div>
                        )}
                      />
                    </div>
                  </div>
                </section>

                <hr className="border-border" />

                {/* Recipient Details */}
                <section>
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-medium text-primary flex items-center gap-3">
                      <span className="flex items-center justify-center w-8 h-8 rounded-full bg-cream text-sm font-bold">3</span>
                      Данные получателя
                    </h2>
                    <Controller
                      name="isAnonymous"
                      control={control}
                      render={({ field }) => (
                        <label className="flex items-center gap-2 cursor-pointer group">
                          <div className="relative flex items-center justify-center">
                            <input
                              type="checkbox"
                              className="peer sr-only"
                              checked={field.value}
                              onChange={(e) => field.onChange(e.target.checked)}
                            />
                            <div className="w-5 h-5 border-2 border-border rounded transition-colors peer-checked:border-primary peer-checked:bg-primary group-hover:border-primary/50" />
                            <svg className="absolute w-3 h-3 text-white opacity-0 peer-checked:opacity-100 pointer-events-none transition-opacity" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                            </svg>
                          </div>
                          <span className="text-sm text-text-secondary group-hover:text-primary transition-colors">Анонимно</span>
                        </label>
                      )}
                    />
                  </div>
                  
                  {!isAnonymous && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="grid grid-cols-1 md:grid-cols-2 gap-5"
                    >
                      <Controller
                        name="recipientName"
                        control={control}
                        render={({ field }) => (
                          <Input
                            label="Имя получателя"
                            placeholder="Анна"
                            error={errors.recipientName?.message}
                            {...field}
                          />
                        )}
                      />
                      <Controller
                        name="recipientPhone"
                        control={control}
                        render={({ field }) => (
                          <Input
                            label="Телефон получателя"
                            placeholder="+7 (700) 000-00-00"
                            error={errors.recipientPhone?.message}
                            {...field}
                          />
                        )}
                      />
                    </motion.div>
                  )}
                  {isAnonymous && (
                    <div className="bg-primary/5 border border-primary/10 rounded-2xl p-4 text-sm text-text-secondary">
                      Мы не сообщим получателю ваше имя. Заказ будет передан как сюрприз.
                    </div>
                  )}
                </section>

                <hr className="border-border" />

                {/* Comment */}
                <section>
                  <Controller
                    name="comment"
                    control={control}
                    render={({ field }) => (
                      <Textarea
                        label="Комментарий к заказу"
                        placeholder="Текст открытки или пожелания по доставке..."
                        rows={3}
                        {...field}
                      />
                    )}
                  />
                </section>
              </form>
            </div>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-5 xl:col-span-4">
            <div className="bg-surface p-6 md:p-8 rounded-[32px] shadow-soft border border-border/50 sticky top-28">
              <h2 className="text-xl font-medium text-primary mb-6">Ваш заказ</h2>
              
              <div className="space-y-4 mb-6 max-h-[300px] overflow-y-auto no-scrollbar pr-2">
                {items.map((item) => (
                  <div key={item.product.id} className="flex gap-4">
                    <div className="w-16 h-16 rounded-xl overflow-hidden shrink-0 bg-cream-dark">
                      <img src={item.product.image} alt={item.product.name} className="w-full h-full object-cover" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="text-sm font-medium text-primary truncate">{item.product.name}</h4>
                      <div className="flex items-center justify-between mt-1 text-sm text-text-secondary">
                        <span>{item.quantity} шт.</span>
                        <span className="font-medium text-primary">{formatPrice((item.product.price ?? 0) * item.quantity)}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="border-t border-border pt-4 space-y-3 mb-6 text-sm">
                <div className="flex justify-between text-text-secondary">
                  <span>Товары ({items.length})</span>
                  <span>{formatPrice(total)}</span>
                </div>
                <div className="flex justify-between text-text-secondary">
                  <span>Доставка</span>
                  <span>{deliveryPrice === 0 ? 'Бесплатно' : formatPrice(deliveryPrice)}</span>
                </div>
              </div>

              <div className="border-t border-primary pt-4 mb-8 flex items-end justify-between">
                <span className="font-medium text-primary">Итого к оплате</span>
                <span className="text-2xl font-semibold text-primary">{formatPrice(finalTotal)}</span>
              </div>

              <button
                type="submit"
                form="checkout-form"
                disabled={isSubmitting}
                className="w-full py-4 bg-primary text-white font-medium rounded-[var(--radius-button)] hover:bg-primary-hover transition-colors cursor-pointer flex items-center justify-center gap-2 btn-shine disabled:opacity-50"
              >
                {isSubmitting ? 'Оформление...' : 'Заказать через WhatsApp'}
                {!isSubmitting && (
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
                )}
              </button>
              <p className="text-center text-xs text-text-muted mt-4">
                Нажимая на кнопку, вы соглашаетесь с условиями <Link to="/privacy" className="underline hover:text-primary">оферты</Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
