import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRegionStore, COUNTRIES } from '@/store/regionStore';

export default function RegionSelector({ isTransparent }: { isTransparent: boolean }) {
  const { country, city, setRegion } = useRegionStore();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const selectedCountry = COUNTRIES[country];
  const selectedCity = selectedCountry?.cities.find((c) => c.id === city) || selectedCountry?.cities[0];

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`flex items-center gap-1 text-sm font-medium tracking-wide uppercase transition-colors duration-300 ${
          isTransparent
            ? 'text-white/80 hover:text-white'
            : 'text-text-secondary hover:text-primary'
        }`}
      >
        <span className="truncate max-w-[100px]">{selectedCity?.name}</span>
        <svg className={`w-4 h-4 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="absolute top-full right-0 mt-2 w-48 bg-surface rounded-xl shadow-lg border border-border/50 py-2 z-50"
          >
            {Object.values(COUNTRIES).map((c) => (
              <div key={c.id} className="px-3 py-2">
                <div className="text-xs font-semibold text-text-muted uppercase tracking-wider mb-1 px-2">
                  {c.name}
                </div>
                {c.cities.map((ct) => (
                  <button
                    key={ct.id}
                    onClick={() => {
                      setRegion(c.id, ct.id);
                      setIsOpen(false);
                    }}
                    className={`block w-full text-left px-2 py-1.5 rounded-md text-sm transition-colors ${
                      city === ct.id ? 'bg-cream text-navy font-medium' : 'text-text-secondary hover:bg-cream/50'
                    }`}
                  >
                    {ct.name}
                  </button>
                ))}
              </div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
