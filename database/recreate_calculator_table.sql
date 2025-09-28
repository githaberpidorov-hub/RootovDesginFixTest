-- Полное пересоздание таблицы calculator_config с правильной структурой
-- ВНИМАНИЕ: Этот скрипт удалит все существующие данные!

-- Удаляем старую таблицу
DROP TABLE IF EXISTS calculator_config CASCADE;

-- Создаем новую таблицу с правильной структурой
CREATE TABLE calculator_config (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  language TEXT NOT NULL CHECK (language IN ('RU', 'ENG', 'UK')),
  
  -- Поле для хранения разделов калькулятора
  sections JSONB NOT NULL DEFAULT '[]',
  
  -- Динамические поля для каждого раздела и языка
  -- Формат: {section_key}_{language}
  websiteType_ru JSONB NOT NULL DEFAULT '{}',
  websiteType_eng JSONB NOT NULL DEFAULT '{}',
  websiteType_uk JSONB NOT NULL DEFAULT '{}',
  
  complexity_ru JSONB NOT NULL DEFAULT '{}',
  complexity_eng JSONB NOT NULL DEFAULT '{}',
  complexity_uk JSONB NOT NULL DEFAULT '{}',
  
  timeline_ru JSONB NOT NULL DEFAULT '{}',
  timeline_eng JSONB NOT NULL DEFAULT '{}',
  timeline_uk JSONB NOT NULL DEFAULT '{}',
  
  features_ru JSONB NOT NULL DEFAULT '{}',
  features_eng JSONB NOT NULL DEFAULT '{}',
  features_uk JSONB NOT NULL DEFAULT '{}',
  
  design_ru JSONB NOT NULL DEFAULT '{}',
  design_eng JSONB NOT NULL DEFAULT '{}',
  design_uk JSONB NOT NULL DEFAULT '{}',
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  UNIQUE(language)
);

-- Функция для автоматического обновления updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Триггер для автоматического обновления updated_at
CREATE TRIGGER update_calculator_config_updated_at 
    BEFORE UPDATE ON calculator_config 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

-- Вставляем дефолтные данные для каждого языка
INSERT INTO calculator_config (language, sections, websiteType_ru, complexity_ru, timeline_ru, features_ru, design_ru) VALUES
(
  'RU',
  '[
    {"key": "websiteType", "label": "Тип сайта", "icon": ""},
    {"key": "complexity", "label": "Сложность", "icon": ""},
    {"key": "timeline", "label": "Сроки", "icon": ""},
    {"key": "features", "label": "Дополнительные функции", "icon": ""},
    {"key": "design", "label": "Дизайн", "icon": ""}
  ]'::jsonb,
  '{"landing": {"label": "Лендинг", "price": 500, "multiplier": 1, "priceType": "fixed"}, "corporate": {"label": "Корпоративный сайт", "price": 1200, "multiplier": 1, "priceType": "fixed"}, "ecommerce": {"label": "Интернет-магазин", "price": 2000, "multiplier": 1, "priceType": "fixed"}, "portfolio": {"label": "Портфолио", "price": 800, "multiplier": 1, "priceType": "fixed"}}'::jsonb,
  '{"simple": {"label": "Простой", "price": 0, "multiplier": 1, "priceType": "multiplier"}, "medium": {"label": "Средний", "price": 0, "multiplier": 1.5, "priceType": "multiplier"}, "complex": {"label": "Сложный", "price": 0, "multiplier": 2, "priceType": "multiplier"}}'::jsonb,
  '{"fast": {"label": "Быстро (1-2 недели)", "price": 0, "multiplier": 1, "priceType": "multiplier"}, "normal": {"label": "Обычно (3-4 недели)", "price": 0, "multiplier": 1.2, "priceType": "multiplier"}, "slow": {"label": "Медленно (6+ недель)", "price": 0, "multiplier": 0.8, "priceType": "multiplier"}}'::jsonb,
  '{"cms": {"label": "CMS", "price": 300, "multiplier": 1, "priceType": "fixed"}, "seo": {"label": "SEO", "price": 200, "multiplier": 1, "priceType": "fixed"}, "analytics": {"label": "Аналитика", "price": 150, "multiplier": 1, "priceType": "fixed"}, "payment": {"label": "Платежи", "price": 400, "multiplier": 1, "priceType": "fixed"}}'::jsonb,
  '{"basic": {"label": "Базовый", "price": 0, "multiplier": 1, "priceType": "multiplier"}, "premium": {"label": "Премиум", "price": 500, "multiplier": 1, "priceType": "fixed"}, "custom": {"label": "Кастомный", "price": 1000, "multiplier": 1, "priceType": "fixed"}}'::jsonb
);

INSERT INTO calculator_config (language, sections, websiteType_eng, complexity_eng, timeline_eng, features_eng, design_eng) VALUES
(
  'ENG',
  '[
    {"key": "websiteType", "label": "Website Type", "icon": ""},
    {"key": "complexity", "label": "Complexity", "icon": ""},
    {"key": "timeline", "label": "Timeline", "icon": ""},
    {"key": "features", "label": "Additional Features", "icon": ""},
    {"key": "design", "label": "Design", "icon": ""}
  ]'::jsonb,
  '{"landing": {"label": "Landing Page", "price": 500, "multiplier": 1, "priceType": "fixed"}, "corporate": {"label": "Corporate Website", "price": 1200, "multiplier": 1, "priceType": "fixed"}, "ecommerce": {"label": "E-commerce", "price": 2000, "multiplier": 1, "priceType": "fixed"}, "portfolio": {"label": "Portfolio", "price": 800, "multiplier": 1, "priceType": "fixed"}}'::jsonb,
  '{"simple": {"label": "Simple", "price": 0, "multiplier": 1, "priceType": "multiplier"}, "medium": {"label": "Medium", "price": 0, "multiplier": 1.5, "priceType": "multiplier"}, "complex": {"label": "Complex", "price": 0, "multiplier": 2, "priceType": "multiplier"}}'::jsonb,
  '{"fast": {"label": "Fast (1-2 weeks)", "price": 0, "multiplier": 1, "priceType": "multiplier"}, "normal": {"label": "Normal (3-4 weeks)", "price": 0, "multiplier": 1.2, "priceType": "multiplier"}, "slow": {"label": "Slow (6+ weeks)", "price": 0, "multiplier": 0.8, "priceType": "multiplier"}}'::jsonb,
  '{"cms": {"label": "CMS", "price": 300, "multiplier": 1, "priceType": "fixed"}, "seo": {"label": "SEO", "price": 200, "multiplier": 1, "priceType": "fixed"}, "analytics": {"label": "Analytics", "price": 150, "multiplier": 1, "priceType": "fixed"}, "payment": {"label": "Payments", "price": 400, "multiplier": 1, "priceType": "fixed"}}'::jsonb,
  '{"basic": {"label": "Basic", "price": 0, "multiplier": 1, "priceType": "multiplier"}, "premium": {"label": "Premium", "price": 500, "multiplier": 1, "priceType": "fixed"}, "custom": {"label": "Custom", "price": 1000, "multiplier": 1, "priceType": "fixed"}}'::jsonb
);

INSERT INTO calculator_config (language, sections, websiteType_uk, complexity_uk, timeline_uk, features_uk, design_uk) VALUES
(
  'UK',
  '[
    {"key": "websiteType", "label": "Тип сайту", "icon": ""},
    {"key": "complexity", "label": "Складність", "icon": ""},
    {"key": "timeline", "label": "Терміни", "icon": ""},
    {"key": "features", "label": "Додаткові функції", "icon": ""},
    {"key": "design", "label": "Дизайн", "icon": ""}
  ]'::jsonb,
  '{"landing": {"label": "Лендінг", "price": 500, "multiplier": 1, "priceType": "fixed"}, "corporate": {"label": "Корпоративний сайт", "price": 1200, "multiplier": 1, "priceType": "fixed"}, "ecommerce": {"label": "Інтернет-магазин", "price": 2000, "multiplier": 1, "priceType": "fixed"}, "portfolio": {"label": "Портфоліо", "price": 800, "multiplier": 1, "priceType": "fixed"}}'::jsonb,
  '{"simple": {"label": "Простий", "price": 0, "multiplier": 1, "priceType": "multiplier"}, "medium": {"label": "Середній", "price": 0, "multiplier": 1.5, "priceType": "multiplier"}, "complex": {"label": "Складний", "price": 0, "multiplier": 2, "priceType": "multiplier"}}'::jsonb,
  '{"fast": {"label": "Швидко (1-2 тижні)", "price": 0, "multiplier": 1, "priceType": "multiplier"}, "normal": {"label": "Звичайно (3-4 тижні)", "price": 0, "multiplier": 1.2, "priceType": "multiplier"}, "slow": {"label": "Повільно (6+ тижнів)", "price": 0, "multiplier": 0.8, "priceType": "multiplier"}}'::jsonb,
  '{"cms": {"label": "CMS", "price": 300, "multiplier": 1, "priceType": "fixed"}, "seo": {"label": "SEO", "price": 200, "multiplier": 1, "priceType": "fixed"}, "analytics": {"label": "Аналітика", "price": 150, "multiplier": 1, "priceType": "fixed"}, "payment": {"label": "Платежі", "price": 400, "multiplier": 1, "priceType": "fixed"}}'::jsonb,
  '{"basic": {"label": "Базовий", "price": 0, "multiplier": 1, "priceType": "multiplier"}, "premium": {"label": "Преміум", "price": 500, "multiplier": 1, "priceType": "fixed"}, "custom": {"label": "Кастомний", "price": 1000, "multiplier": 1, "priceType": "fixed"}}'::jsonb
);
