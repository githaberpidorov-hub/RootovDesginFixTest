-- Полное восстановление структуры таблицы calculator_config
-- Этот скрипт добавляет все необходимые столбцы

-- Добавляем поле sections
ALTER TABLE calculator_config 
ADD COLUMN IF NOT EXISTS sections JSONB DEFAULT '[]';

-- Добавляем все языковые столбцы, если их нет
ALTER TABLE calculator_config 
ADD COLUMN IF NOT EXISTS websiteType_ru JSONB DEFAULT '{}',
ADD COLUMN IF NOT EXISTS websiteType_eng JSONB DEFAULT '{}',
ADD COLUMN IF NOT EXISTS websiteType_uk JSONB DEFAULT '{}',
ADD COLUMN IF NOT EXISTS complexity_ru JSONB DEFAULT '{}',
ADD COLUMN IF NOT EXISTS complexity_eng JSONB DEFAULT '{}',
ADD COLUMN IF NOT EXISTS complexity_uk JSONB DEFAULT '{}',
ADD COLUMN IF NOT EXISTS timeline_ru JSONB DEFAULT '{}',
ADD COLUMN IF NOT EXISTS timeline_eng JSONB DEFAULT '{}',
ADD COLUMN IF NOT EXISTS timeline_uk JSONB DEFAULT '{}',
ADD COLUMN IF NOT EXISTS features_ru JSONB DEFAULT '{}',
ADD COLUMN IF NOT EXISTS features_eng JSONB DEFAULT '{}',
ADD COLUMN IF NOT EXISTS features_uk JSONB DEFAULT '{}',
ADD COLUMN IF NOT EXISTS design_ru JSONB DEFAULT '{}',
ADD COLUMN IF NOT EXISTS design_eng JSONB DEFAULT '{}',
ADD COLUMN IF NOT EXISTS design_uk JSONB DEFAULT '{}';

-- Обновляем существующие записи дефолтными разделами
UPDATE calculator_config 
SET sections = '[
  {"key": "websiteType", "label": "Тип сайта", "icon": ""},
  {"key": "complexity", "label": "Сложность", "icon": ""},
  {"key": "timeline", "label": "Сроки", "icon": ""},
  {"key": "features", "label": "Дополнительные функции", "icon": ""},
  {"key": "design", "label": "Дизайн", "icon": ""}
]'::jsonb
WHERE sections IS NULL OR sections = '[]'::jsonb;

-- Копируем данные из старых столбцов в новые (если старые существуют)
DO $$
BEGIN
    -- Проверяем, существуют ли старые столбцы
    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'calculator_config' AND column_name = 'website_type_ru') THEN
        UPDATE calculator_config SET websiteType_ru = website_type_ru WHERE websiteType_ru = '{}'::jsonb;
    END IF;
    
    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'calculator_config' AND column_name = 'complexity_ru') THEN
        UPDATE calculator_config SET complexity_ru = complexity_ru WHERE complexity_ru = '{}'::jsonb;
    END IF;
    
    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'calculator_config' AND column_name = 'timeline_ru') THEN
        UPDATE calculator_config SET timeline_ru = timeline_ru WHERE timeline_ru = '{}'::jsonb;
    END IF;
    
    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'calculator_config' AND column_name = 'features_ru') THEN
        UPDATE calculator_config SET features_ru = features_ru WHERE features_ru = '{}'::jsonb;
    END IF;
    
    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'calculator_config' AND column_name = 'design_ru') THEN
        UPDATE calculator_config SET design_ru = design_ru WHERE design_ru = '{}'::jsonb;
    END IF;
END $$;
