# Настройка многоязычной админ-панели

## Обзор

Админ-панель теперь поддерживает редактирование контента на трех языках: русском (RU), английском (ENG) и украинском (UK). Администратор может переключаться между языками и редактировать контент для каждого языка отдельно.

## Функциональность

### 1. Переключатель языков
- Расположен в верхней части админ-панели
- Позволяет выбрать язык для редактирования
- Визуально показывает текущий выбранный язык

### 2. Редактирование шаблонов
- Каждый шаблон может иметь разные названия и описания для каждого языка
- При редактировании сохраняется только контент для выбранного языка
- Индикатор показывает на каком языке происходит редактирование

### 3. Конфигурация калькулятора
- Все опции калькулятора (типы сайтов, сложность, сроки, функции, дизайн) настраиваются отдельно для каждого языка
- Сохранение происходит только для выбранного языка
- Загрузка конфигурации происходит для выбранного языка

## База данных

### Таблица templates
```sql
CREATE TABLE templates (
  id UUID PRIMARY KEY,
  title_ru TEXT NOT NULL,
  title_eng TEXT NOT NULL,
  title_uk TEXT NOT NULL,
  description_ru TEXT NOT NULL,
  description_eng TEXT NOT NULL,
  description_uk TEXT NOT NULL,
  category TEXT NOT NULL,
  image TEXT,
  technologies TEXT[],
  demo_url TEXT,
  price TEXT NOT NULL,
  created_at TIMESTAMP,
  updated_at TIMESTAMP
);
```

### Таблица calculator_config
```sql
CREATE TABLE calculator_config (
  id UUID PRIMARY KEY,
  language TEXT NOT NULL CHECK (language IN ('RU', 'ENG', 'UK')),
  website_type_ru JSONB,
  website_type_eng JSONB,
  website_type_uk JSONB,
  complexity_ru JSONB,
  complexity_eng JSONB,
  complexity_uk JSONB,
  timeline_ru JSONB,
  timeline_eng JSONB,
  timeline_uk JSONB,
  features_ru JSONB,
  features_eng JSONB,
  features_uk JSONB,
  design_ru JSONB,
  design_eng JSONB,
  design_uk JSONB,
  created_at TIMESTAMP,
  updated_at TIMESTAMP,
  UNIQUE(language)
);
```

## API Endpoints

### /api/templates
- **GET**: Получает шаблоны для указанного языка
- **POST**: Создает новый шаблон с многоязычными полями
- **PUT**: Обновляет шаблон (поддерживает частичные обновления по языкам)
- **DELETE**: Удаляет шаблон

### /api/calculator
- **GET**: Получает конфигурацию калькулятора для указанного языка
- **POST**: Создает/обновляет конфигурацию калькулятора для указанного языка

## Использование

### 1. Настройка базы данных
Выполните SQL скрипты:
```bash
# Для шаблонов
psql -d your_database -f database/multilang_templates.sql

# Для калькулятора
psql -d your_database -f database/calculator_config.sql
```

### 2. Настройка переменных окружения
Убедитесь, что настроены переменные Supabase:
```env
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### 3. Запуск приложения
```bash
npm run dev
```

### 4. Доступ к админ-панели
1. Перейдите на `/admin`
2. Войдите в систему
3. Выберите язык для редактирования в верхней части
4. Редактируйте контент для выбранного языка
5. Сохраните изменения

## Особенности

### Частичные обновления
- При редактировании шаблона обновляется только контент для выбранного языка
- Остальные языки остаются неизменными
- Это позволяет редактировать контент поэтапно

### Индикаторы языка
- В каждой форме отображается индикатор текущего языка редактирования
- Формат: "Редактируете на языке: RU/ENG/UA"

### Совместимость
- Существующий контент остается доступным
- Новые языки добавляются постепенно
- Fallback на русский язык при отсутствии перевода

## Структура файлов

```
src/
├── pages/Admin.tsx          # Основная админ-панель
├── lib/i18n.ts             # Переводы и утилиты
├── hooks/use-language.tsx  # Хук для работы с языками
api/
├── templates.ts            # API для шаблонов
├── calculator.ts           # API для калькулятора
database/
├── multilang_templates.sql # Схема шаблонов
└── calculator_config.sql   # Схема калькулятора
```

## Переводы

Все переводы для админ-панели находятся в `src/lib/i18n.ts` в секции `admin`. Добавлены новые ключи:
- `languageSelector` - "Язык редактирования"
- `currentLanguage` - "Редактируете на языке" (для форм)

## Тестирование

1. Создайте шаблон на русском языке
2. Переключитесь на английский и отредактируйте тот же шаблон
3. Переключитесь на украинский и отредактируйте тот же шаблон
4. Проверьте, что каждый язык сохраняет свой контент
5. Протестируйте конфигурацию калькулятора для каждого языка
