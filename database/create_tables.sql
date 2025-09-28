-- Создание таблиц для многоязычного приложения

-- Таблица для шаблонов
CREATE TABLE IF NOT EXISTS templates (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title_ru TEXT,
  title_eng TEXT,
  title_uk TEXT,
  description_ru TEXT,
  description_eng TEXT,
  description_uk TEXT,
  category TEXT NOT NULL CHECK (category IN ('landing', 'corporate', 'ecommerce', 'portfolio')),
  image TEXT,
  technologies TEXT[] DEFAULT '{}',
  demo_url TEXT,
  price TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Таблица для конфигурации калькулятора
CREATE TABLE IF NOT EXISTS calculator_config (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  language TEXT NOT NULL CHECK (language IN ('RU', 'ENG', 'UK')),
  website_type_ru JSONB DEFAULT '{}',
  website_type_eng JSONB DEFAULT '{}',
  website_type_uk JSONB DEFAULT '{}',
  complexity_ru JSONB DEFAULT '{}',
  complexity_eng JSONB DEFAULT '{}',
  complexity_uk JSONB DEFAULT '{}',
  timeline_ru JSONB DEFAULT '{}',
  timeline_eng JSONB DEFAULT '{}',
  timeline_uk JSONB DEFAULT '{}',
  features_ru JSONB DEFAULT '{}',
  features_eng JSONB DEFAULT '{}',
  features_uk JSONB DEFAULT '{}',
  design_ru JSONB DEFAULT '{}',
  design_eng JSONB DEFAULT '{}',
  design_uk JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(language)
);

-- Таблица для настроек (уже существует, но на всякий случай)
CREATE TABLE IF NOT EXISTS settings (
  key TEXT PRIMARY KEY,
  value JSONB NOT NULL DEFAULT '{}'::jsonb
);

-- Создание индексов для быстрого поиска
CREATE INDEX IF NOT EXISTS idx_templates_category ON templates(category);
CREATE INDEX IF NOT EXISTS idx_templates_created_at ON templates(created_at);

-- Функция для автоматического обновления updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Триггеры для автоматического обновления updated_at
CREATE TRIGGER update_templates_updated_at 
    BEFORE UPDATE ON templates 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_calculator_config_updated_at 
    BEFORE UPDATE ON calculator_config 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();
