import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function InstallPrompt() {
  const [showPrompt, setShowPrompt] = useState(false);
  const [isIOS, setIsIOS] = useState(false);
  const [isStandalone, setIsStandalone] = useState(false);

  useEffect(() => {
    // Check if it's iOS
    const userAgent = window.navigator.userAgent.toLowerCase();
    const isIosDevice = /iphone|ipad|ipod/.test(userAgent);
    setIsIOS(isIosDevice);

    // Check if it's already installed (standalone mode)
    const isStand = window.matchMedia('(display-mode: standalone)').matches || ('standalone' in window.navigator && (window.navigator as any).standalone === true);
    setIsStandalone(isStand);
  }, []);

  if (!isIOS || isStandalone) return null;

  return (
    <>
      <div className="fixed bottom-6 left-0 right-0 z-50 px-4 flex justify-center pointer-events-none">
        <button
          onClick={() => setShowPrompt(true)}
          className="pointer-events-auto bg-surface/90 backdrop-blur-md shadow-elevated border border-border/50 text-primary px-5 py-3 rounded-full flex items-center gap-3 hover-lift"
        >
          <div className="bg-primary text-white w-8 h-8 rounded-full flex items-center justify-center">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
            </svg>
          </div>
          <span className="font-medium text-sm">Установить приложение</span>
        </button>
      </div>

      <AnimatePresence>
        {showPrompt && (
          <div className="fixed inset-0 z-50 flex items-end justify-center sm:items-center px-4 pb-8 pt-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowPrompt(false)}
              className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, y: 100 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 100 }}
              className="relative w-full max-w-sm bg-surface rounded-[24px] p-6 shadow-elevated"
            >
              <button
                onClick={() => setShowPrompt(false)}
                className="absolute top-4 right-4 p-2 text-text-muted hover:text-primary transition-colors bg-surface rounded-full"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>

              <div className="text-center mb-6 pt-2">
                <div className="w-16 h-16 bg-cream rounded-2xl mx-auto mb-4 flex items-center justify-center shadow-soft">
                  <span className="font-heading text-2xl font-bold text-primary">F</span>
                </div>
                <h3 className="text-xl font-heading font-semibold text-primary mb-2">Установить FLOCO</h3>
                <p className="text-text-secondary text-sm">Добавьте магазин на главный экран для быстрого доступа</p>
              </div>

              <div className="space-y-4 bg-background rounded-xl p-4 border border-border/50">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-surface rounded-full shadow-sm flex items-center justify-center flex-shrink-0 text-primary">
                    1
                  </div>
                  <p className="text-sm font-medium">Нажмите иконку <span className="font-bold">«Поделиться»</span> (квадрат со стрелочкой) в меню Safari</p>
                </div>
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-surface rounded-full shadow-sm flex items-center justify-center flex-shrink-0 text-primary">
                    2
                  </div>
                  <p className="text-sm font-medium">Прокрутите вниз и выберите <span className="font-bold">«На экран Домой»</span> (кнопка с плюсом)</p>
                </div>
              </div>

              <button
                onClick={() => setShowPrompt(false)}
                className="w-full mt-6 py-3.5 bg-primary text-white rounded-[14px] font-medium"
              >
                Понятно
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
