import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useCartStore } from '@/store/cartStore';
import { useCartDrawer } from '@/components/cart/CartDrawerProvider';
import { useRegionStore } from '@/store/regionStore';
import { useSettingsStore } from '@/store/settingsStore';
import RegionSelector from './RegionSelector';
import LanguageSelector from './LanguageSelector';
import { useTranslation } from 'react-i18next';

export default function Header() {
  const { t } = useTranslation();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const location = useLocation();
  const itemCount = useCartStore((s) => s.getItemCount());
  const { open: openCart } = useCartDrawer();

  const city = useRegionStore((s) => s.city);
  const settings = useSettingsStore((s) => s.getSettingsForCity(city));

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    setMenuOpen(false);
  }, [location]);

  // Lock body scroll when menu is open
  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [menuOpen]);

  // Auto-detect location
  useEffect(() => {
    const detectLocation = async () => {
      if (localStorage.getItem('locationDetected')) return;
      try {
        const res = await fetch('https://ipapi.co/json/');
        const data = await res.json();
        const countryCode = data.country?.toLowerCase() as import('@/store/regionStore').CountryId;
        const cityStr = data.city?.toLowerCase();
        
        // Find matching country
        const { COUNTRIES } = await import('@/store/regionStore');
        const matchedCountryId = Object.keys(COUNTRIES).find(c => c === countryCode) as import('@/store/regionStore').CountryId | undefined;
        if (matchedCountryId) {
          // Try to match city
          const countryData = COUNTRIES[matchedCountryId];
          const matchedCity = countryData.cities.find((c: any) => c.name.toLowerCase() === cityStr || c.id === cityStr);
          if (matchedCity) {
            useRegionStore.getState().setRegion(matchedCountryId, matchedCity.id);
          } else {
            useRegionStore.getState().setRegion(matchedCountryId, countryData.cities[0].id);
          }
        }
        localStorage.setItem('locationDetected', 'true');
      } catch (error) {
        console.error('Failed to detect location', error);
      }
    };
    detectLocation();
  }, []);

  const isHome = location.pathname === '/';
  const isTransparent = isHome && !scrolled;

  const instagramLink = settings?.instagramUrl || 'https://www.instagram.com/floco.ala/';
  const whatsappLink = settings?.whatsappPhone ? `https://wa.me/${settings.whatsappPhone.replace(/\D/g, '')}` : 'https://wa.me/77001234567';

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-40 transition-all duration-500 ${
          isTransparent
            ? 'bg-transparent'
            : 'glass border-b border-border/50'
        }`}
      >
        <div className="max-w-7xl mx-auto px-5 sm:px-8">
          <div className="flex items-center justify-between h-16 md:h-[72px] relative">
            {/* Logo */}
            <Link to="/" className="group" id="header-logo">
              <span className={`font-heading text-2xl md:text-[26px] font-bold tracking-tight transition-colors ${
                isTransparent ? 'text-white' : 'text-primary'
              }`}>
                FLOCO
              </span>
            </Link>

            {/* Desktop Nav */}
            <nav className="hidden md:flex items-center gap-8 absolute left-1/2 -translate-x-1/2" id="desktop-nav">
              <NavLink to="/catalog" isTransparent={isTransparent}>{t('nav.catalog')}</NavLink>
              <NavLink to="/contacts" isTransparent={isTransparent}>{t('nav.contacts')}</NavLink>
              <RegionSelector isTransparent={isTransparent} />
              <LanguageSelector isTransparent={isTransparent} />
            </nav>

            {/* Right section */}
            <div className="flex items-center gap-2">
              {/* Social icons - desktop only */}
              <div className="hidden md:flex items-center gap-1">
                {settings?.instagramUrl && (
                  <a
                    href={instagramLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`p-2.5 rounded-full transition-colors ${
                      isTransparent ? 'text-white/80 hover:text-white' : 'text-text-secondary hover:text-primary'
                    }`}
                    aria-label="Instagram"
                  >
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                    </svg>
                  </a>
                )}
                <a
                  href={whatsappLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`p-2.5 rounded-full transition-colors ${
                    isTransparent ? 'text-white/80 hover:text-white' : 'text-text-secondary hover:text-primary'
                  }`}
                  aria-label="WhatsApp"
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                  </svg>
                </a>
                {city === 'tashkent' && (
                  <a
                    href={settings?.telegramUrl || "https://t.me/floco_tashkent"}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`p-2.5 rounded-full transition-colors ${
                      isTransparent ? 'text-white/80 hover:text-white' : 'text-text-secondary hover:text-primary'
                    }`}
                    aria-label="Telegram"
                  >
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.894 8.221l-1.97 9.28c-.145.658-.537.818-1.084.508l-3-2.21-1.446 1.394c-.14.18-.357.223-.548.223l.188-2.85 5.18-4.686c.223-.195-.054-.306-.346-.112l-6.4 4.027-2.76-.864c-.6-.188-.612-.6.126-.89l10.78-4.155c.498-.184.94.11.78.335z"/>
                    </svg>
                  </a>
                )}
              </div>

              {/* Cart button */}
              <button
                onClick={openCart}
                className={`relative p-2.5 rounded-full transition-colors cursor-pointer ${
                  isTransparent ? 'text-white/90 hover:text-white' : 'text-text-primary hover:text-primary'
                }`}
                id="cart-btn"
                aria-label="Корзина"
              >
                <svg className="w-[22px] h-[22px]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                </svg>
                {itemCount > 0 && (
                  <motion.span
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="absolute -top-0.5 -right-0.5 w-5 h-5 text-[10px] font-bold text-white bg-primary rounded-full flex items-center justify-center"
                  >
                    {itemCount}
                  </motion.span>
                )}
              </button>

              {/* Mobile burger */}
              <button
                onClick={() => setMenuOpen(!menuOpen)}
                className={`text-sm font-bold uppercase tracking-wider transition-colors hover:text-primary ${
                  isTransparent ? 'text-white/90' : 'text-primary'
                }`}
                id="mobile-menu-btn"
                aria-label="Меню"
              >
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  {menuOpen ? (
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                  ) : (
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
                  )}
                </svg>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Menu */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-30 md:hidden"
          >
            <div className="absolute inset-0 bg-black/20" onClick={() => setMenuOpen(false)} />
            <motion.nav
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 30, stiffness: 300 }}
              className="absolute top-0 right-0 bottom-0 w-72 bg-surface shadow-drawer flex flex-col"
            >
              <div className="pt-20 px-6 flex-grow overflow-y-auto">
                <MobileNavLink to="/" onClick={() => setMenuOpen(false)}>{t('nav.home')}</MobileNavLink>
                <MobileNavLink to="/catalog" onClick={() => setMenuOpen(false)}>{t('nav.catalog')}</MobileNavLink>
                <MobileNavLink to="/contacts" onClick={() => setMenuOpen(false)}>{t('nav.contacts')}</MobileNavLink>
                
                <div className="mt-6 flex gap-4 border-t border-border pt-6">
                  <div className="flex-1 bg-cream rounded-lg p-2">
                    <RegionSelector isTransparent={false} />
                  </div>
                  <div className="flex-1 bg-cream rounded-lg p-2">
                    <LanguageSelector isTransparent={false} />
                  </div>
                </div>

                <div className="mt-8 pt-6 border-t border-border">
                  <div className="flex gap-4">
                    {settings?.instagramUrl && (
                      <a href={instagramLink} target="_blank" rel="noopener noreferrer" className="text-text-secondary hover:text-primary transition-colors">
                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/></svg>
                      </a>
                    )}
                    <a href={whatsappLink} target="_blank" rel="noopener noreferrer" className="text-text-secondary hover:text-primary transition-colors">
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
                    </a>
                    {city === 'tashkent' && (
                      <a href="https://t.me/floco_tashkent" target="_blank" rel="noopener noreferrer" className="text-text-secondary hover:text-primary transition-colors">
                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.894 8.221l-1.97 9.28c-.145.658-.537.818-1.084.508l-3-2.21-1.446 1.394c-.14.18-.357.223-.548.223l.188-2.85 5.18-4.686c.223-.195-.054-.306-.346-.112l-6.4 4.027-2.76-.864c-.6-.188-.612-.6.126-.89l10.78-4.155c.498-.184.94.11.78.335z"/></svg>
                      </a>
                    )}
                  </div>
                </div>
              </div>
            </motion.nav>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

function NavLink({ to, children, isTransparent }: { to: string; children: React.ReactNode; isTransparent: boolean }) {
  const location = useLocation();
  const isActive = location.pathname === to;
  return (
    <Link
      to={to}
      className={`relative text-sm font-medium tracking-wide uppercase transition-colors duration-300 ${
        isTransparent
          ? isActive ? 'text-white' : 'text-white/70 hover:text-white'
          : isActive ? 'text-primary' : 'text-text-secondary hover:text-primary'
      }`}
    >
      {children}
    </Link>
  );
}

function MobileNavLink({ to, children, onClick }: { to: string; children: React.ReactNode; onClick: () => void }) {
  const location = useLocation();
  const isActive = location.pathname === to;
  return (
    <Link
      to={to}
      onClick={onClick}
      className={`block py-4 text-lg font-medium border-b border-border/50 transition-colors ${
        isActive ? 'text-primary' : 'text-text-secondary hover:text-primary'
      }`}
    >
      {children}
    </Link>
  );
}
