-- Исправление схемы для многоязычности
-- Убираем NOT NULL ограничения для языковых полей, чтобы можно было создавать записи постепенно

-- Обновляем таблицу templates
ALTER TABLE templates 
  ALTER COLUMN title_ru DROP NOT NULL,
  ALTER COLUMN title_eng DROP NOT NULL,
  ALTER COLUMN title_uk DROP NOT NULL,
  ALTER COLUMN description_ru DROP NOT NULL,
  ALTER COLUMN description_eng DROP NOT NULL,
  ALTER COLUMN description_uk DROP NOT NULL;

-- Обновляем таблицу calculator_config
ALTER TABLE calculator_config 
  ALTER COLUMN website_type_ru DROP NOT NULL,
  ALTER COLUMN website_type_eng DROP NOT NULL,
  ALTER COLUMN website_type_uk DROP NOT NULL,
  ALTER COLUMN complexity_ru DROP NOT NULL,
  ALTER COLUMN complexity_eng DROP NOT NULL,
  ALTER COLUMN complexity_uk DROP NOT NULL,
  ALTER COLUMN timeline_ru DROP NOT NULL,
  ALTER COLUMN timeline_eng DROP NOT NULL,
  ALTER COLUMN timeline_uk DROP NOT NULL,
  ALTER COLUMN features_ru DROP NOT NULL,
  ALTER COLUMN features_eng DROP NOT NULL,
  ALTER COLUMN features_uk DROP NOT NULL,
  ALTER COLUMN design_ru DROP NOT NULL,
  ALTER COLUMN design_eng DROP NOT NULL,
  ALTER COLUMN design_uk DROP NOT NULL;

-- Добавляем значения по умолчанию для пустых полей
UPDATE templates SET 
  title_ru = COALESCE(title_ru, ''),
  title_eng = COALESCE(title_eng, ''),
  title_uk = COALESCE(title_uk, ''),
  description_ru = COALESCE(description_ru, ''),
  description_eng = COALESCE(description_eng, ''),
  description_uk = COALESCE(description_uk, '')
WHERE title_ru IS NULL OR title_eng IS NULL OR title_uk IS NULL 
   OR description_ru IS NULL OR description_eng IS NULL OR description_uk IS NULL;

UPDATE calculator_config SET 
  website_type_ru = COALESCE(website_type_ru, '{}'),
  website_type_eng = COALESCE(website_type_eng, '{}'),
  website_type_uk = COALESCE(website_type_uk, '{}'),
  complexity_ru = COALESCE(complexity_ru, '{}'),
  complexity_eng = COALESCE(complexity_eng, '{}'),
  complexity_uk = COALESCE(complexity_uk, '{}'),
  timeline_ru = COALESCE(timeline_ru, '{}'),
  timeline_eng = COALESCE(timeline_eng, '{}'),
  timeline_uk = COALESCE(timeline_uk, '{}'),
  features_ru = COALESCE(features_ru, '{}'),
  features_eng = COALESCE(features_eng, '{}'),
  features_uk = COALESCE(features_uk, '{}'),
  design_ru = COALESCE(design_ru, '{}'),
  design_eng = COALESCE(design_eng, '{}'),
  design_uk = COALESCE(design_uk, '{}')
WHERE website_type_ru IS NULL OR website_type_eng IS NULL OR website_type_uk IS NULL
   OR complexity_ru IS NULL OR complexity_eng IS NULL OR complexity_uk IS NULL
   OR timeline_ru IS NULL OR timeline_eng IS NULL OR timeline_uk IS NULL
   OR features_ru IS NULL OR features_eng IS NULL OR features_uk IS NULL
   OR design_ru IS NULL OR design_eng IS NULL OR design_uk IS NULL;
