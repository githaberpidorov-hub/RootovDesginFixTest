-- Добавление поля sections в таблицу calculator_config
ALTER TABLE calculator_config 
ADD COLUMN IF NOT EXISTS sections JSONB DEFAULT '[]';

-- Обновление существующих записей дефолтными разделами
UPDATE calculator_config 
SET sections = '[
  {"key": "websiteType", "label": "Тип сайта", "icon": ""},
  {"key": "complexity", "label": "Сложность", "icon": ""},
  {"key": "timeline", "label": "Сроки", "icon": ""},
  {"key": "features", "label": "Дополнительные функции", "icon": ""},
  {"key": "design", "label": "Дизайн", "icon": ""}
]'::jsonb
WHERE sections IS NULL OR sections = '[]'::jsonb;
