-- Создание таблицы для конфигурации калькулятора с многоязычной поддержкой
CREATE TABLE IF NOT EXISTS calculator_config (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  language TEXT NOT NULL CHECK (language IN ('RU', 'ENG', 'UK')),
  
  -- Website Type (тип сайта)
  website_type_ru JSONB NOT NULL DEFAULT '{}',
  website_type_eng JSONB NOT NULL DEFAULT '{}',
  website_type_uk JSONB NOT NULL DEFAULT '{}',
  
  -- Complexity (сложность)
  complexity_ru JSONB NOT NULL DEFAULT '{}',
  complexity_eng JSONB NOT NULL DEFAULT '{}',
  complexity_uk JSONB NOT NULL DEFAULT '{}',
  
  -- Timeline (сроки)
  timeline_ru JSONB NOT NULL DEFAULT '{}',
  timeline_eng JSONB NOT NULL DEFAULT '{}',
  timeline_uk JSONB NOT NULL DEFAULT '{}',
  
  -- Features (дополнительные функции)
  features_ru JSONB NOT NULL DEFAULT '{}',
  features_eng JSONB NOT NULL DEFAULT '{}',
  features_uk JSONB NOT NULL DEFAULT '{}',
  
  -- Design (дизайн)
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

-- Вставка примеров данных для каждого языка
INSERT INTO calculator_config (language, website_type_ru, website_type_eng, website_type_uk, complexity_ru, complexity_eng, complexity_uk, timeline_ru, timeline_eng, timeline_uk, features_ru, features_eng, features_uk, design_ru, design_eng, design_uk) VALUES
(
  'RU',
  '{"landing": {"label": "Лендинг", "price": 500}, "corporate": {"label": "Корпоративный сайт", "price": 1200}, "ecommerce": {"label": "Интернет-магазин", "price": 2000}, "portfolio": {"label": "Портфолио", "price": 800}}',
  '{"landing": {"label": "Landing Page", "price": 500}, "corporate": {"label": "Corporate Website", "price": 1200}, "ecommerce": {"label": "E-commerce", "price": 2000}, "portfolio": {"label": "Portfolio", "price": 800}}',
  '{"landing": {"label": "Лендінг", "price": 500}, "corporate": {"label": "Корпоративний сайт", "price": 1200}, "ecommerce": {"label": "Інтернет-магазин", "price": 2000}, "portfolio": {"label": "Портфоліо", "price": 800}}',
  '{"simple": {"label": "Простой", "multiplier": 1}, "medium": {"label": "Средний", "multiplier": 1.5}, "complex": {"label": "Сложный", "multiplier": 2}}',
  '{"simple": {"label": "Simple", "multiplier": 1}, "medium": {"label": "Medium", "multiplier": 1.5}, "complex": {"label": "Complex", "multiplier": 2}}',
  '{"simple": {"label": "Простий", "multiplier": 1}, "medium": {"label": "Середній", "multiplier": 1.5}, "complex": {"label": "Складний", "multiplier": 2}}',
  '{"fast": {"label": "Быстро (1-2 недели)", "multiplier": 1}, "normal": {"label": "Обычно (3-4 недели)", "multiplier": 1.2}, "slow": {"label": "Медленно (6+ недель)", "multiplier": 0.8}}',
  '{"fast": {"label": "Fast (1-2 weeks)", "multiplier": 1}, "normal": {"label": "Normal (3-4 weeks)", "multiplier": 1.2}, "slow": {"label": "Slow (6+ weeks)", "multiplier": 0.8}}',
  '{"fast": {"label": "Швидко (1-2 тижні)", "multiplier": 1}, "normal": {"label": "Звичайно (3-4 тижні)", "multiplier": 1.2}, "slow": {"label": "Повільно (6+ тижнів)", "multiplier": 0.8}}',
  '{"cms": {"label": "CMS", "price": 300}, "seo": {"label": "SEO", "price": 200}, "analytics": {"label": "Аналитика", "price": 150}, "payment": {"label": "Платежи", "price": 400}}',
  '{"cms": {"label": "CMS", "price": 300}, "seo": {"label": "SEO", "price": 200}, "analytics": {"label": "Analytics", "price": 150}, "payment": {"label": "Payments", "price": 400}}',
  '{"cms": {"label": "CMS", "price": 300}, "seo": {"label": "SEO", "price": 200}, "analytics": {"label": "Аналітика", "price": 150}, "payment": {"label": "Платежі", "price": 400}}',
  '{"basic": {"label": "Базовый", "price": 0}, "premium": {"label": "Премиум", "price": 500}, "custom": {"label": "Кастомный", "price": 1000}}',
  '{"basic": {"label": "Basic", "price": 0}, "premium": {"label": "Premium", "price": 500}, "custom": {"label": "Custom", "price": 1000}}',
  '{"basic": {"label": "Базовий", "price": 0}, "premium": {"label": "Преміум", "price": 500}, "custom": {"label": "Кастомний", "price": 1000}}'
),
(
  'ENG',
  '{"landing": {"label": "Landing Page", "price": 500}, "corporate": {"label": "Corporate Website", "price": 1200}, "ecommerce": {"label": "E-commerce", "price": 2000}, "portfolio": {"label": "Portfolio", "price": 800}}',
  '{"landing": {"label": "Landing Page", "price": 500}, "corporate": {"label": "Corporate Website", "price": 1200}, "ecommerce": {"label": "E-commerce", "price": 2000}, "portfolio": {"label": "Portfolio", "price": 800}}',
  '{"landing": {"label": "Лендінг", "price": 500}, "corporate": {"label": "Корпоративний сайт", "price": 1200}, "ecommerce": {"label": "Інтернет-магазин", "price": 2000}, "portfolio": {"label": "Портфоліо", "price": 800}}',
  '{"simple": {"label": "Simple", "multiplier": 1}, "medium": {"label": "Medium", "multiplier": 1.5}, "complex": {"label": "Complex", "multiplier": 2}}',
  '{"simple": {"label": "Simple", "multiplier": 1}, "medium": {"label": "Medium", "multiplier": 1.5}, "complex": {"label": "Complex", "multiplier": 2}}',
  '{"simple": {"label": "Простий", "multiplier": 1}, "medium": {"label": "Середній", "multiplier": 1.5}, "complex": {"label": "Складний", "multiplier": 2}}',
  '{"fast": {"label": "Fast (1-2 weeks)", "multiplier": 1}, "normal": {"label": "Normal (3-4 weeks)", "multiplier": 1.2}, "slow": {"label": "Slow (6+ weeks)", "multiplier": 0.8}}',
  '{"fast": {"label": "Fast (1-2 weeks)", "multiplier": 1}, "normal": {"label": "Normal (3-4 weeks)", "multiplier": 1.2}, "slow": {"label": "Slow (6+ weeks)", "multiplier": 0.8}}',
  '{"fast": {"label": "Швидко (1-2 тижні)", "multiplier": 1}, "normal": {"label": "Звичайно (3-4 тижні)", "multiplier": 1.2}, "slow": {"label": "Повільно (6+ тижнів)", "multiplier": 0.8}}',
  '{"cms": {"label": "CMS", "price": 300}, "seo": {"label": "SEO", "price": 200}, "analytics": {"label": "Analytics", "price": 150}, "payment": {"label": "Payments", "price": 400}}',
  '{"cms": {"label": "CMS", "price": 300}, "seo": {"label": "SEO", "price": 200}, "analytics": {"label": "Analytics", "price": 150}, "payment": {"label": "Payments", "price": 400}}',
  '{"cms": {"label": "CMS", "price": 300}, "seo": {"label": "SEO", "price": 200}, "analytics": {"label": "Аналітика", "price": 150}, "payment": {"label": "Платежі", "price": 400}}',
  '{"basic": {"label": "Basic", "price": 0}, "premium": {"label": "Premium", "price": 500}, "custom": {"label": "Custom", "price": 1000}}',
  '{"basic": {"label": "Basic", "price": 0}, "premium": {"label": "Premium", "price": 500}, "custom": {"label": "Custom", "price": 1000}}',
  '{"basic": {"label": "Базовий", "price": 0}, "premium": {"label": "Преміум", "price": 500}, "custom": {"label": "Кастомний", "price": 1000}}'
),
(
  'UK',
  '{"landing": {"label": "Лендінг", "price": 500}, "corporate": {"label": "Корпоративний сайт", "price": 1200}, "ecommerce": {"label": "Інтернет-магазин", "price": 2000}, "portfolio": {"label": "Портфоліо", "price": 800}}',
  '{"landing": {"label": "Landing Page", "price": 500}, "corporate": {"label": "Corporate Website", "price": 1200}, "ecommerce": {"label": "E-commerce", "price": 2000}, "portfolio": {"label": "Portfolio", "price": 800}}',
  '{"landing": {"label": "Лендінг", "price": 500}, "corporate": {"label": "Корпоративний сайт", "price": 1200}, "ecommerce": {"label": "Інтернет-магазин", "price": 2000}, "portfolio": {"label": "Портфоліо", "price": 800}}',
  '{"simple": {"label": "Простий", "multiplier": 1}, "medium": {"label": "Середній", "multiplier": 1.5}, "complex": {"label": "Складний", "multiplier": 2}}',
  '{"simple": {"label": "Simple", "multiplier": 1}, "medium": {"label": "Medium", "multiplier": 1.5}, "complex": {"label": "Complex", "multiplier": 2}}',
  '{"simple": {"label": "Простий", "multiplier": 1}, "medium": {"label": "Середній", "multiplier": 1.5}, "complex": {"label": "Складний", "multiplier": 2}}',
  '{"fast": {"label": "Швидко (1-2 тижні)", "multiplier": 1}, "normal": {"label": "Звичайно (3-4 тижні)", "multiplier": 1.2}, "slow": {"label": "Повільно (6+ тижнів)", "multiplier": 0.8}}',
  '{"fast": {"label": "Fast (1-2 weeks)", "multiplier": 1}, "normal": {"label": "Normal (3-4 weeks)", "multiplier": 1.2}, "slow": {"label": "Slow (6+ weeks)", "multiplier": 0.8}}',
  '{"fast": {"label": "Швидко (1-2 тижні)", "multiplier": 1}, "normal": {"label": "Звичайно (3-4 тижні)", "multiplier": 1.2}, "slow": {"label": "Повільно (6+ тижнів)", "multiplier": 0.8}}',
  '{"cms": {"label": "CMS", "price": 300}, "seo": {"label": "SEO", "price": 200}, "analytics": {"label": "Аналітика", "price": 150}, "payment": {"label": "Платежі", "price": 400}}',
  '{"cms": {"label": "CMS", "price": 300}, "seo": {"label": "SEO", "price": 200}, "analytics": {"label": "Analytics", "price": 150}, "payment": {"label": "Payments", "price": 400}}',
  '{"cms": {"label": "CMS", "price": 300}, "seo": {"label": "SEO", "price": 200}, "analytics": {"label": "Аналітика", "price": 150}, "payment": {"label": "Платежі", "price": 400}}',
  '{"basic": {"label": "Базовий", "price": 0}, "premium": {"label": "Преміум", "price": 500}, "custom": {"label": "Кастомний", "price": 1000}}',
  '{"basic": {"label": "Basic", "price": 0}, "premium": {"label": "Premium", "price": 500}, "custom": {"label": "Custom", "price": 1000}}',
  '{"basic": {"label": "Базовий", "price": 0}, "premium": {"label": "Преміум", "price": 500}, "custom": {"label": "Кастомний", "price": 1000}}'
);
