# FLOCO — Цветочная онлайн-студия (Алматы)

Современное PWA-приложение для премиального цветочного магазина FLOCO. Построено на React, TypeScript, Tailwind CSS v4 и Zustand.

## Особенности
- **Mobile First дизайн**: Оптимизировано для мобильных устройств с плавной анимацией.
- **PWA (Progressive Web App)**: Приложение можно установить на экран "Домой" (iOS/Android), оно работает оффлайн (кэширование через Service Worker) и быстро загружается.
- **Интеграция с WhatsApp**: Заказы формируются в удобном текстовом виде и отправляются напрямую в WhatsApp магазина (`wa.me`).
- **Админ-панель**: Встроенная панель администратора для управления товарами (данные сохраняются в `localStorage`).
- **Современный стек**: Vite + React Router + Framer Motion.

## Запуск проекта

### Требования
- Node.js 18+
- npm (или pnpm / yarn)

### Установка зависимостей
```bash
npm install
```

### Запуск в режиме разработки
```bash
npm run dev
```

### Сборка для продакшена
```bash
npm run build
```

### Локальное тестирование PWA
Чтобы протестировать Service Worker и PWA фичи:
```bash
npm run preview
```

## Структура проекта
- `src/components/` — UI-компоненты (ui), секции (home) и лейаут (layout).
- `src/pages/` — Страницы приложения (Главная, Каталог, Корзина, Админка и т.д.).
- `src/store/` — Состояния Zustand (корзина, настройки, каталог товаров).
- `src/lib/` — Вспомогательные утилиты (WhatsApp, форматирование).
- `public/data/` — JSON-файлы с начальными данными товаров и настроек.
- `public/images/` — Оптимизированные изображения букетов.

## Управление товарами
1. Перейдите по адресу `/admin`.
2. Введите любой пароль (в демо-версии пароль не проверяется строго).
3. Изменения товаров, цен и настроек сохраняются в `localStorage` вашего браузера.

## Технологии
- [React](https://reactjs.org/)
- [Vite](https://vitejs.dev/)
- [Tailwind CSS v4](https://tailwindcss.com/)
- [Zustand](https://github.com/pmndrs/zustand)
- [Framer Motion](https://www.framer.com/motion/)
- [React Router](https://reactrouter.com/)
- [Vite PWA](https://vite-pwa-org.netlify.app/)
