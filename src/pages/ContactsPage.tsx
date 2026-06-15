import { useSettingsStore } from '@/store/settingsStore';

export default function ContactsPage() {
  const settings = useSettingsStore((s) => s.settings);

  return (
    <div className="pt-24 pb-20 min-h-screen bg-cream">
      <div className="max-w-4xl mx-auto px-5 sm:px-8">
        
        <div className="mb-12 text-center">
          <h1 className="font-heading text-4xl md:text-5xl lg:text-6xl font-bold text-primary mb-4">
            Контакты
          </h1>
          <p className="text-text-secondary">Свяжитесь с нами для заказа или консультации</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
          {/* Contact info cards */}
          <div className="bg-surface p-8 rounded-[32px] shadow-soft border border-border/50 flex flex-col justify-center">
            <h3 className="font-heading text-2xl font-semibold text-primary mb-6">Связаться с нами</h3>
            
            <div className="space-y-6">
              {settings?.whatsappPhone && (
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-full bg-cream flex items-center justify-center shrink-0">
                    <svg className="w-6 h-6 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-sm text-text-secondary mb-1">Телефон / WhatsApp</p>
                    <a href={`https://wa.me/${settings.whatsappPhone}`} className="text-lg font-medium text-primary hover:text-accent-dark transition-colors">
                      +{settings.whatsappPhone}
                    </a>
                  </div>
                </div>
              )}

              {settings?.instagramUrl && (
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-full bg-cream flex items-center justify-center shrink-0">
                    <svg className="w-6 h-6 text-primary" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                    </svg>
                  </div>
                  <div>
                    <p className="text-sm text-text-secondary mb-1">Instagram</p>
                    <a href={settings.instagramUrl} target="_blank" rel="noopener noreferrer" className="text-lg font-medium text-primary hover:text-accent-dark transition-colors">
                      @floco.ala
                    </a>
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="bg-surface p-8 rounded-[32px] shadow-soft border border-border/50 flex flex-col justify-center">
            <h3 className="font-heading text-2xl font-semibold text-primary mb-6">Наш магазин</h3>
            
            <div className="space-y-6">
              {settings?.shopAddress && (
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-full bg-cream flex items-center justify-center shrink-0">
                    <svg className="w-6 h-6 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-sm text-text-secondary mb-1">Адрес</p>
                    <p className="text-lg font-medium text-primary leading-tight">
                      {settings.shopAddress}
                    </p>
                  </div>
                </div>
              )}

              {settings?.workingHours && (
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-full bg-cream flex items-center justify-center shrink-0">
                    <svg className="w-6 h-6 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-sm text-text-secondary mb-1">Режим работы</p>
                    <p className="text-lg font-medium text-primary">
                      {settings.workingHours}
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
