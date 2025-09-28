-- Исправление схемы таблицы calculator_config для сохранения порядка опций
-- Этот скрипт изменяет поля с объектов на массивы для сохранения порядка

-- Сначала создаем резервную копию данных
CREATE TABLE IF NOT EXISTS calculator_config_backup AS 
SELECT * FROM calculator_config;

-- Изменяем поля с объектов на массивы
-- Для каждого языка и раздела

-- Website Type
ALTER TABLE calculator_config 
ALTER COLUMN websiteType_ru SET DEFAULT '[]',
ALTER COLUMN websiteType_eng SET DEFAULT '[]',
ALTER COLUMN websiteType_uk SET DEFAULT '[]';

-- Complexity  
ALTER TABLE calculator_config 
ALTER COLUMN complexity_ru SET DEFAULT '[]',
ALTER COLUMN complexity_eng SET DEFAULT '[]',
ALTER COLUMN complexity_uk SET DEFAULT '[]';

-- Timeline
ALTER TABLE calculator_config 
ALTER COLUMN timeline_ru SET DEFAULT '[]',
ALTER COLUMN timeline_eng SET DEFAULT '[]',
ALTER COLUMN timeline_uk SET DEFAULT '[]';

-- Features
ALTER TABLE calculator_config 
ALTER COLUMN features_ru SET DEFAULT '[]',
ALTER COLUMN features_eng SET DEFAULT '[]',
ALTER COLUMN features_uk SET DEFAULT '[]';

-- Design
ALTER TABLE calculator_config 
ALTER COLUMN design_ru SET DEFAULT '[]',
ALTER COLUMN design_eng SET DEFAULT '[]',
ALTER COLUMN design_uk SET DEFAULT '[]';

-- Обновляем существующие данные: конвертируем объекты в массивы
-- Для каждого языка и раздела

-- Website Type RU
UPDATE calculator_config 
SET websiteType_ru = (
  SELECT jsonb_agg(
    jsonb_build_object(
      'id', key,
      'label', value->>'label',
      'price', COALESCE((value->>'price')::numeric, 0),
      'multiplier', COALESCE((value->>'multiplier')::numeric, 1),
      'priceType', COALESCE(value->>'priceType', 'fixed'),
      'order', ordinality - 1
    ) ORDER BY key
  )
  FROM jsonb_each(websiteType_ru) WITH ORDINALITY
)
WHERE websiteType_ru != '{}'::jsonb AND websiteType_ru != '[]'::jsonb;

-- Website Type ENG
UPDATE calculator_config 
SET websiteType_eng = (
  SELECT jsonb_agg(
    jsonb_build_object(
      'id', key,
      'label', value->>'label',
      'price', COALESCE((value->>'price')::numeric, 0),
      'multiplier', COALESCE((value->>'multiplier')::numeric, 1),
      'priceType', COALESCE(value->>'priceType', 'fixed'),
      'order', row_number() OVER (ORDER BY key) - 1
    )
  )
  FROM jsonb_each(websiteType_eng)
)
WHERE websiteType_eng != '{}'::jsonb AND websiteType_eng != '[]'::jsonb;

-- Website Type UK
UPDATE calculator_config 
SET websiteType_uk = (
  SELECT jsonb_agg(
    jsonb_build_object(
      'id', key,
      'label', value->>'label',
      'price', COALESCE((value->>'price')::numeric, 0),
      'multiplier', COALESCE((value->>'multiplier')::numeric, 1),
      'priceType', COALESCE(value->>'priceType', 'fixed'),
      'order', row_number() OVER (ORDER BY key) - 1
    )
  )
  FROM jsonb_each(websiteType_uk)
)
WHERE websiteType_uk != '{}'::jsonb AND websiteType_uk != '[]'::jsonb;

-- Complexity RU
UPDATE calculator_config 
SET complexity_ru = (
  SELECT jsonb_agg(
    jsonb_build_object(
      'id', key,
      'label', value->>'label',
      'price', COALESCE((value->>'price')::numeric, 0),
      'multiplier', COALESCE((value->>'multiplier')::numeric, 1),
      'priceType', COALESCE(value->>'priceType', 'fixed'),
      'order', row_number() OVER (ORDER BY key) - 1
    )
  )
  FROM jsonb_each(complexity_ru)
)
WHERE complexity_ru != '{}'::jsonb AND complexity_ru != '[]'::jsonb;

-- Complexity ENG
UPDATE calculator_config 
SET complexity_eng = (
  SELECT jsonb_agg(
    jsonb_build_object(
      'id', key,
      'label', value->>'label',
      'price', COALESCE((value->>'price')::numeric, 0),
      'multiplier', COALESCE((value->>'multiplier')::numeric, 1),
      'priceType', COALESCE(value->>'priceType', 'fixed'),
      'order', row_number() OVER (ORDER BY key) - 1
    )
  )
  FROM jsonb_each(complexity_eng)
)
WHERE complexity_eng != '{}'::jsonb AND complexity_eng != '[]'::jsonb;

-- Complexity UK
UPDATE calculator_config 
SET complexity_uk = (
  SELECT jsonb_agg(
    jsonb_build_object(
      'id', key,
      'label', value->>'label',
      'price', COALESCE((value->>'price')::numeric, 0),
      'multiplier', COALESCE((value->>'multiplier')::numeric, 1),
      'priceType', COALESCE(value->>'priceType', 'fixed'),
      'order', row_number() OVER (ORDER BY key) - 1
    )
  )
  FROM jsonb_each(complexity_uk)
)
WHERE complexity_uk != '{}'::jsonb AND complexity_uk != '[]'::jsonb;

-- Timeline RU
UPDATE calculator_config 
SET timeline_ru = (
  SELECT jsonb_agg(
    jsonb_build_object(
      'id', key,
      'label', value->>'label',
      'price', COALESCE((value->>'price')::numeric, 0),
      'multiplier', COALESCE((value->>'multiplier')::numeric, 1),
      'priceType', COALESCE(value->>'priceType', 'fixed'),
      'order', row_number() OVER (ORDER BY key) - 1
    )
  )
  FROM jsonb_each(timeline_ru)
)
WHERE timeline_ru != '{}'::jsonb AND timeline_ru != '[]'::jsonb;

-- Timeline ENG
UPDATE calculator_config 
SET timeline_eng = (
  SELECT jsonb_agg(
    jsonb_build_object(
      'id', key,
      'label', value->>'label',
      'price', COALESCE((value->>'price')::numeric, 0),
      'multiplier', COALESCE((value->>'multiplier')::numeric, 1),
      'priceType', COALESCE(value->>'priceType', 'fixed'),
      'order', row_number() OVER (ORDER BY key) - 1
    )
  )
  FROM jsonb_each(timeline_eng)
)
WHERE timeline_eng != '{}'::jsonb AND timeline_eng != '[]'::jsonb;

-- Timeline UK
UPDATE calculator_config 
SET timeline_uk = (
  SELECT jsonb_agg(
    jsonb_build_object(
      'id', key,
      'label', value->>'label',
      'price', COALESCE((value->>'price')::numeric, 0),
      'multiplier', COALESCE((value->>'multiplier')::numeric, 1),
      'priceType', COALESCE(value->>'priceType', 'fixed'),
      'order', row_number() OVER (ORDER BY key) - 1
    )
  )
  FROM jsonb_each(timeline_uk)
)
WHERE timeline_uk != '{}'::jsonb AND timeline_uk != '[]'::jsonb;

-- Features RU
UPDATE calculator_config 
SET features_ru = (
  SELECT jsonb_agg(
    jsonb_build_object(
      'id', key,
      'label', value->>'label',
      'price', COALESCE((value->>'price')::numeric, 0),
      'multiplier', COALESCE((value->>'multiplier')::numeric, 1),
      'priceType', COALESCE(value->>'priceType', 'fixed'),
      'order', row_number() OVER (ORDER BY key) - 1
    )
  )
  FROM jsonb_each(features_ru)
)
WHERE features_ru != '{}'::jsonb AND features_ru != '[]'::jsonb;

-- Features ENG
UPDATE calculator_config 
SET features_eng = (
  SELECT jsonb_agg(
    jsonb_build_object(
      'id', key,
      'label', value->>'label',
      'price', COALESCE((value->>'price')::numeric, 0),
      'multiplier', COALESCE((value->>'multiplier')::numeric, 1),
      'priceType', COALESCE(value->>'priceType', 'fixed'),
      'order', row_number() OVER (ORDER BY key) - 1
    )
  )
  FROM jsonb_each(features_eng)
)
WHERE features_eng != '{}'::jsonb AND features_eng != '[]'::jsonb;

-- Features UK
UPDATE calculator_config 
SET features_uk = (
  SELECT jsonb_agg(
    jsonb_build_object(
      'id', key,
      'label', value->>'label',
      'price', COALESCE((value->>'price')::numeric, 0),
      'multiplier', COALESCE((value->>'multiplier')::numeric, 1),
      'priceType', COALESCE(value->>'priceType', 'fixed'),
      'order', row_number() OVER (ORDER BY key) - 1
    )
  )
  FROM jsonb_each(features_uk)
)
WHERE features_uk != '{}'::jsonb AND features_uk != '[]'::jsonb;

-- Design RU
UPDATE calculator_config 
SET design_ru = (
  SELECT jsonb_agg(
    jsonb_build_object(
      'id', key,
      'label', value->>'label',
      'price', COALESCE((value->>'price')::numeric, 0),
      'multiplier', COALESCE((value->>'multiplier')::numeric, 1),
      'priceType', COALESCE(value->>'priceType', 'fixed'),
      'order', row_number() OVER (ORDER BY key) - 1
    )
  )
  FROM jsonb_each(design_ru)
)
WHERE design_ru != '{}'::jsonb AND design_ru != '[]'::jsonb;

-- Design ENG
UPDATE calculator_config 
SET design_eng = (
  SELECT jsonb_agg(
    jsonb_build_object(
      'id', key,
      'label', value->>'label',
      'price', COALESCE((value->>'price')::numeric, 0),
      'multiplier', COALESCE((value->>'multiplier')::numeric, 1),
      'priceType', COALESCE(value->>'priceType', 'fixed'),
      'order', row_number() OVER (ORDER BY key) - 1
    )
  )
  FROM jsonb_each(design_eng)
)
WHERE design_eng != '{}'::jsonb AND design_eng != '[]'::jsonb;

-- Design UK
UPDATE calculator_config 
SET design_uk = (
  SELECT jsonb_agg(
    jsonb_build_object(
      'id', key,
      'label', value->>'label',
      'price', COALESCE((value->>'price')::numeric, 0),
      'multiplier', COALESCE((value->>'multiplier')::numeric, 1),
      'priceType', COALESCE(value->>'priceType', 'fixed'),
      'order', row_number() OVER (ORDER BY key) - 1
    )
  )
  FROM jsonb_each(design_uk)
)
WHERE design_uk != '{}'::jsonb AND design_uk != '[]'::jsonb;

-- Устанавливаем пустые массивы для полей, которые остались пустыми объектами
UPDATE calculator_config 
SET 
  websiteType_ru = '[]'::jsonb,
  websiteType_eng = '[]'::jsonb,
  websiteType_uk = '[]'::jsonb,
  complexity_ru = '[]'::jsonb,
  complexity_eng = '[]'::jsonb,
  complexity_uk = '[]'::jsonb,
  timeline_ru = '[]'::jsonb,
  timeline_eng = '[]'::jsonb,
  timeline_uk = '[]'::jsonb,
  features_ru = '[]'::jsonb,
  features_eng = '[]'::jsonb,
  features_uk = '[]'::jsonb,
  design_ru = '[]'::jsonb,
  design_eng = '[]'::jsonb,
  design_uk = '[]'::jsonb
WHERE 
  websiteType_ru = '{}'::jsonb OR
  websiteType_eng = '{}'::jsonb OR
  websiteType_uk = '{}'::jsonb OR
  complexity_ru = '{}'::jsonb OR
  complexity_eng = '{}'::jsonb OR
  complexity_uk = '{}'::jsonb OR
  timeline_ru = '{}'::jsonb OR
  timeline_eng = '{}'::jsonb OR
  timeline_uk = '{}'::jsonb OR
  features_ru = '{}'::jsonb OR
  features_eng = '{}'::jsonb OR
  features_uk = '{}'::jsonb OR
  design_ru = '{}'::jsonb OR
  design_eng = '{}'::jsonb OR
  design_uk = '{}'::jsonb;

-- Проверяем результат
SELECT 
  language,
  jsonb_array_length(websiteType_ru) as websiteType_ru_count,
  jsonb_array_length(complexity_ru) as complexity_ru_count,
  jsonb_array_length(timeline_ru) as timeline_ru_count,
  jsonb_array_length(features_ru) as features_ru_count,
  jsonb_array_length(design_ru) as design_ru_count
FROM calculator_config;
