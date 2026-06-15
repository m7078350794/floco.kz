import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useSettingsStore } from '@/store/settingsStore';
import { COUNTRIES } from '@/store/regionStore';
import { useProductStore } from '@/store/productStore';
import { isSupabaseConfigured, supabase } from '@/lib/supabase';
import type { Product, CategorySlug } from '@/types';
import { formatPrice } from '@/lib/formatters';
import { Input, Textarea } from '@/components/ui/Input';
import Button from '@/components/ui/Button';
import Modal from '@/components/ui/Modal';
import { showToast } from '@/components/ui/Toast';

// Validation Schemas
const loginSchema = z.object({
  email: z.string().email('Введите корректный email'),
  password: z.string().min(6, 'Пароль должен быть не менее 6 символов'),
});


export default function AdminPage() {
  const { allSettings, isAdmin, loadSettings, checkSession, logout, updateSettings } = useSettingsStore();
  const { products, loadProducts, addProduct, updateProduct, deleteProduct } = useProductStore();
  const [activeTab, setActiveTab] = useState<'products' | 'settings'>('products');
  const [editProduct, setEditProduct] = useState<Product | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  const { register: registerLogin, handleSubmit: handleLoginSubmit, formState: { errors: loginErrors } } = useForm<z.infer<typeof loginSchema>>({
    resolver: zodResolver(loginSchema),
  });

  useEffect(() => {
    checkSession();
    loadSettings();
    loadProducts();
  }, [checkSession, loadSettings, loadProducts]);

  const onLogin = async (data: z.infer<typeof loginSchema>) => {
    if (!supabase) {
      showToast('Supabase не настроен. Добавьте переменные окружения в Netlify.', 'error');
      return;
    }

    setIsLoggingIn(true);
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email: data.email,
        password: data.password,
      });

      if (error) {
        showToast('Ошибка авторизации: ' + error.message, 'error');
      } else {
        showToast('Успешный вход');
      }
    } catch (error) {
      showToast('Ошибка авторизации: ' + (error as Error).message, 'error');
    } finally {
      setIsLoggingIn(false);
    }
  };

  if (!isAdmin) {
    return (
      <div className="pt-24 pb-16 min-h-screen flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-sm mx-auto px-4"
        >
          <div className="bg-surface rounded-[var(--radius-card)] p-8 shadow-soft">
            <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-navy flex items-center justify-center">
              <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </div>
            <h1 className="font-heading text-2xl font-semibold text-navy text-center mb-6">Админ-панель</h1>
            {!isSupabaseConfigured && (
              <p className="mb-4 rounded-xl border border-error/20 bg-error/10 px-4 py-3 text-sm text-error">
                Supabase не настроен. Добавьте VITE_SUPABASE_URL и VITE_SUPABASE_ANON_KEY в Netlify.
              </p>
            )}
            <form onSubmit={handleLoginSubmit(onLogin)} className="space-y-4">
              <Input
                label="Email"
                type="email"
                {...registerLogin('email')}
                error={loginErrors.email?.message}
                id="admin-email"
              />
              <Input
                label="Пароль"
                type="password"
                {...registerLogin('password')}
                error={loginErrors.password?.message}
                id="admin-pass"
              />
              <Button type="submit" fullWidth disabled={isLoggingIn || !isSupabaseConfigured}>
                {isLoggingIn ? 'Вход...' : 'Войти'}
              </Button>
            </form>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="pt-20 md:pt-24 pb-16 min-h-screen">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <h1 className="font-heading text-3xl font-semibold text-navy">Админ-панель</h1>
          <Button variant="ghost" onClick={logout}>Выйти</Button>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-8">
          <button
            onClick={() => setActiveTab('products')}
            className={`px-5 py-2.5 text-sm font-medium rounded-full transition-all cursor-pointer ${
              activeTab === 'products' ? 'bg-navy text-white' : 'bg-surface border border-border text-text-secondary hover:text-navy'
            }`}
          >
            Товары ({products.length})
          </button>
          <button
            onClick={() => setActiveTab('settings')}
            className={`px-5 py-2.5 text-sm font-medium rounded-full transition-all cursor-pointer ${
              activeTab === 'settings' ? 'bg-navy text-white' : 'bg-surface border border-border text-text-secondary hover:text-navy'
            }`}
          >
            Настройки
          </button>
        </div>

        {activeTab === 'products' && (
          <ProductsTab
            products={products}
            onAdd={async (p) => { 
              try { await addProduct(p); showToast('Товар добавлен'); }
              catch (e: any) { showToast('Ошибка: ' + e.message, 'error'); }
            }}
            onUpdate={async (id, data) => { 
              try { await updateProduct(id, data); showToast('Товар обновлён'); }
              catch (e: any) { showToast('Ошибка: ' + e.message, 'error'); }
            }}
            onDelete={async (id) => { 
              try { await deleteProduct(id); showToast('Товар удалён'); }
              catch (e: any) { showToast('Ошибка: ' + e.message, 'error'); }
            }}
            editProduct={editProduct}
            setEditProduct={setEditProduct}
            showForm={showForm}
            setShowForm={setShowForm}
          />
        )}

        {activeTab === 'settings' && (
          <SettingsTab allSettings={useSettingsStore.getState().allSettings} onUpdate={useSettingsStore.getState().updateSettings} />
        )}
      </div>
    </div>
  );
}

/* ============================================================
   Products Tab
   ============================================================ */

function ProductsTab({
  products, onAdd, onUpdate, onDelete,
  editProduct, setEditProduct, showForm, setShowForm,
}: {
  products: Product[];
  onAdd: (p: any) => Promise<void>;
  onUpdate: (id: number, data: any) => Promise<void>;
  onDelete: (id: number) => Promise<void>;
  editProduct: Product | null;
  setEditProduct: (p: Product | null) => void;
  showForm: boolean;
  setShowForm: (v: boolean) => void;
}) {
  return (
    <div>
      {/* Actions */}
      <div className="flex flex-wrap gap-3 mb-6">
        <Button onClick={() => { setEditProduct(null); setShowForm(true); }}>
          + Добавить товар
        </Button>
      </div>

      {/* Product List */}
      <div className="space-y-3">
        {products.map((product) => (
          <div key={product.id} className="bg-surface rounded-xl p-4 flex items-center gap-4 shadow-sm border border-border/50">
            <div className="w-16 h-16 rounded-lg overflow-hidden img-placeholder flex-shrink-0">
              <img
                src={product.image}
                alt={product.name}
                className="w-full h-full object-cover"
                onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
              />
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="font-medium text-sm truncate">{product.name}</h3>
              <p className="text-sm text-text-secondary">{formatPrice(product.price)} · {product.category}</p>
            </div>
            <div className="flex gap-2 flex-shrink-0">
              <button
                onClick={() => { setEditProduct(product); setShowForm(true); }}
                className="p-2 text-text-muted hover:text-navy transition-colors cursor-pointer"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
              </button>
              <button
                onClick={() => { if (confirm('Удалить товар?')) onDelete(product.id); }}
                className="p-2 text-text-muted hover:text-error transition-colors cursor-pointer"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Product Form Modal */}
      <Modal
        isOpen={showForm}
        onClose={() => setShowForm(false)}
        title={editProduct ? 'Редактировать товар' : 'Новый товар'}
        size="lg"
      >
        <ProductFormContent
          product={editProduct}
          onSave={async (data) => {
            if (editProduct) {
              await onUpdate(editProduct.id, data);
            } else {
              await onAdd(data);
            }
            setShowForm(false);
          }}
          onCancel={() => setShowForm(false)}
        />
      </Modal>
    </div>
  );
}

/* ============================================================
   Product Form (React Hook Form + Zod)
   ============================================================ */

const productSchema = z.object({
  name: z.string().min(1, 'Введите название'),
  slug: z.string().optional(),
  price: z.string().min(1, 'Введите цену'),
  oldPrice: z.string().optional(),
  category: z.string().min(1, 'Выберите категорию'),
  description: z.string().optional(),
  composition: z.string().optional(),
  size: z.enum(['S', 'M', 'L', 'XL']),
  image: z.string().min(1, 'Введите URL или путь к изображению'),
  isPopular: z.boolean(),
  isNew: z.boolean(),
  inStock: z.boolean(),
});

function ProductFormContent({
  product, onSave, onCancel,
}: {
  product: Product | null;
  onSave: (data: any) => Promise<void>;
  onCancel: () => void;
}) {
  const { register, handleSubmit, formState: { errors }, watch, setValue } = useForm<z.infer<typeof productSchema>>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      name: product?.name || '',
      slug: product?.slug || '',
      price: product?.price?.toString() || '',
      oldPrice: product?.oldPrice?.toString() || '',
      category: product?.category || 'mono',
      description: product?.description || '',
      composition: product?.composition?.join(', ') || '',
      size: product?.size || 'M',
      image: product?.image || '',
      isPopular: product?.isPopular || false,
      isNew: product?.isNew || false,
      inStock: product?.inStock ?? true,
    }
  });

  const [isUploading, setIsUploading] = useState(false);
  const currentImage = watch('image');

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setIsUploading(true);
      if (!isSupabaseConfigured || !supabase) throw new Error('Supabase is not configured');

      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random().toString(36).substring(2)}.${fileExt}`;
      const filePath = `public/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('product-images')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('product-images')
        .getPublicUrl(filePath);

      setValue('image', publicUrl, { shouldValidate: true });
      showToast('Изображение загружено!');
    } catch (error: any) {
      showToast('Ошибка загрузки: ' + error.message, 'error');
    } finally {
      setIsUploading(false);
    }
  };

  const onSubmit = async (data: z.infer<typeof productSchema>) => {
    // Auto-generate slug if empty
    const generatedSlug = data.slug || data.name.toLowerCase().replace(/[^a-z0-9]+/g, '-');
    
    await onSave({
      ...data,
      slug: generatedSlug,
      price: Number(data.price),
      oldPrice: data.oldPrice ? Number(data.oldPrice) : null,
      composition: data.composition ? data.composition.split(',').map(s => s.trim()).filter(Boolean) : [],
    });
  };

  const onInvalid = (errors: any) => {
    const firstError = Object.values(errors)[0] as any;
    if (firstError?.message) {
      import('@/components/ui/Toast').then(({ showToast }) => {
        showToast('Ошибка заполнения: ' + firstError.message, 'error');
      });
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit, onInvalid)} className="space-y-4">
      <Input label="Название *" {...register('name')} error={errors.name?.message} id="prod-name" />
      <Input label="Slug (URL) *" {...register('slug')} error={errors.slug?.message} placeholder="auto-generated" id="prod-slug" />
      
      <div className="grid grid-cols-2 gap-4">
        <Input label="Цена (₸) *" type="number" {...register('price')} error={errors.price?.message} id="prod-price" />
        <Input label="Старая цена (₸)" type="number" {...register('oldPrice')} error={errors.oldPrice?.message} id="prod-oldprice" />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <label className="block text-sm font-medium text-text-secondary">Категория *</label>
          <select
            {...register('category')}
            className="w-full px-4 py-3 bg-surface border border-border rounded-[var(--radius-input)] focus:outline-none focus:border-navy"
          >
            <option value="mono">Монобукеты</option>
            <option value="author">Авторские</option>
            <option value="box">В коробке</option>
            <option value="peony-roses">Пионовидные</option>
            <option value="wedding">Свадебные</option>
            <option value="gifts">Подарки</option>
          </select>
          {errors.category && <p className="text-xs text-error mt-1">{errors.category.message}</p>}
        </div>
        <div className="space-y-1.5">
          <label className="block text-sm font-medium text-text-secondary">Размер *</label>
          <select
            {...register('size')}
            className="w-full px-4 py-3 bg-surface border border-border rounded-[var(--radius-input)] focus:outline-none focus:border-navy"
          >
            <option value="S">S — Маленький</option>
            <option value="M">M — Средний</option>
            <option value="L">L — Большой</option>
            <option value="XL">XL — Очень большой</option>
          </select>
        </div>
      </div>

      <Textarea label="Описание" {...register('description')} rows={3} id="prod-desc" />
      <Input label="Состав (через запятую)" {...register('composition')} id="prod-comp" />
      
      <div className="space-y-1.5">
        <label className="block text-sm font-medium text-text-secondary">Изображение *</label>
        <div className="flex items-center gap-4">
          {currentImage && (
            <img 
              src={currentImage} 
              alt="Preview" 
              className="w-16 h-16 object-cover rounded-[var(--radius-sm)] border border-border"
            />
          )}
          <div className="flex-grow">
            <input 
              type="file" 
              accept="image/*" 
              onChange={handleImageUpload}
              disabled={isUploading}
              className="block w-full text-sm text-text-secondary
                file:mr-4 file:py-2 file:px-4
                file:rounded-full file:border-0
                file:text-sm file:font-medium
                file:bg-navy/10 file:text-navy
                hover:file:bg-navy/20 transition-colors
                cursor-pointer disabled:opacity-50"
            />
          </div>
        </div>
        {isUploading && <p className="text-xs text-navy animate-pulse">Загрузка изображения...</p>}
        {errors.image && <p className="text-sm text-error">{errors.image.message}</p>}
      </div>

      <div className="flex flex-wrap gap-4 pt-2">
        <label className="flex items-center gap-2 cursor-pointer">
          <input type="checkbox" {...register('isPopular')} className="accent-navy" />
          <span className="text-sm">Популярный (Хит)</span>
        </label>
        <label className="flex items-center gap-2 cursor-pointer">
          <input type="checkbox" {...register('isNew')} className="accent-navy" />
          <span className="text-sm">Новинка</span>
        </label>
        <label className="flex items-center gap-2 cursor-pointer">
          <input type="checkbox" {...register('inStock')} className="accent-navy" />
          <span className="text-sm">В наличии</span>
        </label>
      </div>

      <div className="flex gap-3 pt-4">
        <Button type="submit" fullWidth>Сохранить</Button>
        <Button type="button" variant="outline" onClick={onCancel} fullWidth>Отмена</Button>
      </div>
    </form>
  );
}

/* ============================================================
   Settings Tab (React Hook Form + Zod)
   ============================================================ */

const settingsSchema = z.object({
  whatsappPhone: z.string().min(1, 'Обязательное поле'),
  shopAddress: z.string().min(1, 'Обязательное поле'),
  workingHours: z.string().min(1, 'Обязательное поле'),
  deliveryInfo: z.string().min(1, 'Обязательное поле'),
});

function SettingsTab({
  allSettings, onUpdate,
}: {
  allSettings: Record<string, any>;
  onUpdate: (cityId: string, data: any) => Promise<void>;
}) {
  const allCities = Object.values(COUNTRIES).flatMap((c: any) => c.cities);

  return (
    <div className="space-y-8 pb-8">
      {allCities.map((city: any) => {
        const citySettings = allSettings[city.id] || allSettings['almaty'] || {};
        return (
          <SettingsBlock 
            key={city.id} 
            city={city} 
            settings={citySettings} 
            onUpdate={(data: any) => onUpdate(city.id, data)} 
          />
        );
      })}
    </div>
  );
}

function SettingsBlock({ city, settings, onUpdate }: any) {
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<z.infer<typeof settingsSchema>>({
    resolver: zodResolver(settingsSchema),
    defaultValues: {
      whatsappPhone: settings.whatsappPhone || '',
      shopAddress: settings.shopAddress || '',
      workingHours: settings.workingHours || '',
      deliveryInfo: settings.deliveryInfo || '',
    }
  });

  const onSubmit = async (data: z.infer<typeof settingsSchema>) => {
    await onUpdate(data);
    import('@/components/ui/Toast').then(({ showToast }) => showToast(`Настройки (${city.name}) сохранены`));
  };

  return (
    <div className="max-w-xl">
      <form onSubmit={handleSubmit(onSubmit)} className="bg-surface rounded-[var(--radius-card)] p-6 space-y-4 shadow-sm border border-border/50">
        <h2 className="font-heading text-xl font-semibold text-navy mb-4 border-b border-border pb-2">Настройки магазина — {city.name}</h2>
        <Input
          label="Номер WhatsApp"
          {...register('whatsappPhone')}
          error={errors.whatsappPhone?.message}
          placeholder="77001234567"
          id={`set-phone-${city.id}`}
        />
        <Input
          label="Адрес магазина"
          {...register('shopAddress')}
          error={errors.shopAddress?.message}
          id={`set-addr-${city.id}`}
        />
        <Input
          label="Часы работы"
          {...register('workingHours')}
          error={errors.workingHours?.message}
          id={`set-hours-${city.id}`}
        />
        <Input
          label="Информация о доставке"
          {...register('deliveryInfo')}
          error={errors.deliveryInfo?.message}
          id={`set-deliv-${city.id}`}
        />
        <Button type="submit" fullWidth disabled={isSubmitting}>
          {isSubmitting ? 'Сохранение...' : 'Сохранить настройки'}
        </Button>
      </form>
    </div>
  );
}
