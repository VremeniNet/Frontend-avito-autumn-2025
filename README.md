# Frontend-avito-autumn-2025

Основано на **React 18**, **Vite**, **TypeScript**, **Material UI** и встроенном сервере из репозитория задания.

---

# Функциональность

## 1. Страница списка объявлений — `/list`

- Просмотр объявлений  
- Серверная пагинация по 10 элементов  
- Фильтры:
  - статус  
  - категория  
  - цена  
  - текстовый поиск  
- Сортировка по цене, дате и приоритету  
- Горячие клавиши:
  - <kbd>/</kbd> — фокус на строку поиска  
  - <kbd>↑</kbd>/<kbd>↓</kbd> — перемещение по списку  
  - <kbd>Enter</kbd> — открыть выделенное объявление  
- Подсказка горячих клавиш в правом верхнем углу

## 2. Страница объявления — `/item/:id`

- Фото, описание, характеристики  
- Продавец, дата создания, обновления  
- История модерации  
- Действия модератора:  
  - «Одобрить»  
  - «Отклонить»  
  - «На доработку»  
- Горячие клавиши:
  - <kbd>A</kbd> — одобрить  
  - <kbd>D</kbd> — отклонить  
  - <kbd>Backspace</kbd> — назад к списку  
- Подсказка горячих клавиш отображается справа

## 3. Страница статистики — `/stats`
  
Полноценная аналитическая панель:
- карточки метрик за выбранный период  
- график активности  
- распределение решений 
- категории проверенных объявлений  
- выбор периода:
  - Сегодня  
  - 7 дней  
  - 30 дней  
- Горячая клавиша:
  - <kbd>Backspace</kbd> — назад к списку  
- Подсказка горячих клавиш в правом верхнем углу  

Вся логика статистики вынесена в **features + shared/api + shared/types**.

---

# Архитектура проекта
src/

├─ app/

│ ├─ layout/ # AppLayout

│ ├─ App.tsx

│ └─ main.tsx

├─ pages/

│ ├─ ListPage.tsx

│ ├─ ItemPage.tsx

│ └─ StatsPage.tsx

├─ features/

│ ├─ ads-list/

│ │ ├─ useAdsList.ts

│ │ └─ components/

│ │ ├─ AdsList.tsx

│ │ ├─ ListFilters.tsx

│ │ └─ ListHotkeysHint.tsx

│ │

│ ├─ ad-item/

│ │ ├─ useAdItem.ts

│ │ └─ components/

│ │ ├─ AdItemHeader.tsx

│ │ ├─ AdItemMainContent.tsx

│ │ └─ ...

│ │

│ └─ stats/

│ ├─ useStats.ts

│ └─ components/

│ ├─ StatsHotkeysHint.tsx

│ ├─ StatsPeriodControls.tsx

│ ├─ StatsSummaryCards.tsx

│ ├─ StatsActivityChart.tsx

│ └─ StatsDecisionsAndCategories.tsx

│

├─ shared/

│ ├─ types/

│ │ ├─ ads.ts

│ │ └─ stats.ts

│ └─ api/

│ ├─ adsApi.ts

│ └─ statsApi.ts

---

# Используемые технологии

| Категория | Технологии |
|----------|------------|
| **Основные** | React 18, TypeScript, Vite, React Router |
| **UI** | Material UI (MUI) |
| **Структура** | Feature-based architecture |
| **API** | Встроенный mock-сервер из репозитория задания |
| **Инструменты** | ESLint |

---

# Запуск проекта

## Запуск сервера

```bash
# Переход в директорию сервера
cd tech-int3-server

# Установка зависимостей
npm install

# Запуск сервера
npm start

# Или запуск в режиме разработки с автоматической перезагрузкой
npm run dev
```

## Запуск клиентской части

```bash

cd moderation-client

# Установка зависимостей
npm install

npm run dev
```
