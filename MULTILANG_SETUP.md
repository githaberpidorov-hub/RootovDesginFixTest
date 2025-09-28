# Настройка многоязычности

## Обзор

Система многоязычности реализована с поддержкой трех языков:
- **RU** - Русский (по умолчанию)
- **ENG** - Английский  
- **UK** - Украинский

## Архитектура

### 1. Статический контент
- Переводы хранятся в `src/lib/i18n.ts`
- Используется хук `useLanguage` для доступа к переводам
- Автоматическое переключение языка через `LanguageSwitcher`

### 2. Динамический контент
- Шаблоны хранятся в БД с поддержкой всех языков
- API endpoint `/api/templates` возвращает контент на выбранном языке
- Автоматическое обновление при смене языка

### 3. База данных
- Таблица `templates` с полями для каждого языка:
  - `title_ru`, `title_eng`, `title_uk`
  - `description_ru`, `description_eng`, `description_uk`

## Настройка

### 1. Создание таблицы в БД

Выполните SQL скрипт из файла `database/multilang_templates.sql`:

```sql
-- Создание таблицы для многоязычных шаблонов
CREATE TABLE IF NOT EXISTS templates (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title_ru TEXT NOT NULL,
  title_eng TEXT NOT NULL,
  title_uk TEXT NOT NULL,
  description_ru TEXT NOT NULL,
  description_eng TEXT NOT NULL,
  description_uk TEXT NOT NULL,
  category TEXT NOT NULL CHECK (category IN ('landing', 'corporate', 'ecommerce', 'portfolio')),
  image TEXT,
  technologies TEXT[] DEFAULT '{}',
  site_url TEXT,
  price TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

### 2. Настройка API

API endpoint `/api/templates` поддерживает:
- `GET /api/templates?language=RU` - получение шаблонов на русском
- `GET /api/templates?language=ENG` - получение шаблонов на английском
- `GET /api/templates?language=UK` - получение шаблонов на украинском
- `POST /api/templates` - создание нового шаблона
- `PUT /api/templates?id=UUID` - обновление шаблона
- `DELETE /api/templates?id=UUID` - удаление шаблона

### 3. Добавление новых переводов

Для добавления новых переводов:

1. Обновите интерфейс `Translations` в `src/lib/i18n.ts`
2. Добавьте переводы для всех языков в объект `translations`
3. Используйте хук `useLanguage` в компонентах:

```tsx
import { useLanguage } from '@/hooks/use-language';

const MyComponent = () => {
  const { t, language, setLanguage } = useLanguage();
  
  return (
    <div>
      <h1>{t.mySection.title}</h1>
      <p>{t.mySection.description}</p>
    </div>
  );
};
```

## Использование

### Переключение языка
Язык переключается через компонент `LanguageSwitcher`, который:
- Сохраняет выбор в localStorage
- Обновляет атрибут `lang` у HTML элемента
- Автоматически перезагружает контент

### Работа с шаблонами
При смене языка:
1. Автоматически загружаются шаблоны на новом языке
2. Обновляется интерфейс админ-панели
3. Сохраняется выбранный язык для будущих сессий

### Админ-панель
В админ-панели можно:
- Просматривать шаблоны на текущем языке
- Редактировать шаблоны (пока только на одном языке)
- Добавлять новые шаблоны
- Удалять шаблоны

## Расширение

### Добавление нового языка

1. Обновите тип `LanguageCode` в `src/lib/i18n.ts`:
```typescript
export type LanguageCode = "RU" | "ENG" | "UK" | "DE";
```

2. Добавьте переводы в объект `translations`

3. Обновите функцию `getAvailableLanguages()`:
```typescript
export const getAvailableLanguages = (): { code: LanguageCode; label: string }[] => [
  { code: "RU", label: "RU" },
  { code: "ENG", label: "ENG" },
  { code: "UK", label: "UK" },
  { code: "DE", label: "DE" },
];
```

4. Добавьте поля в таблицу БД:
```sql
ALTER TABLE templates ADD COLUMN title_de TEXT;
ALTER TABLE templates ADD COLUMN description_de TEXT;
```

### Добавление многоязычности к другим сущностям

1. Создайте API endpoint аналогично `api/templates.ts`
2. Добавьте поля для всех языков в таблицу БД
3. Обновите компоненты для использования переводов

## Производительность

- Переводы загружаются один раз при инициализации
- Шаблоны кэшируются в localStorage
- API запросы выполняются только при смене языка
- Автоматическое обновление контента без перезагрузки страницы
