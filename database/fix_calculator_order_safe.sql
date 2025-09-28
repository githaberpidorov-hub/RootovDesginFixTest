-- Безопасное исправление схемы для сохранения порядка элементов
-- Этот скрипт работает с любым состоянием данных

-- Шаг 1: Создаем резервную копию
DROP TABLE IF EXISTS calculator_config_backup;
CREATE TABLE calculator_config_backup AS SELECT * FROM calculator_config;

-- Шаг 2: Изменяем дефолтные значения на массивы
ALTER TABLE calculator_config 
  ALTER COLUMN websiteType_ru SET DEFAULT '[]',
  ALTER COLUMN websiteType_eng SET DEFAULT '[]',
  ALTER COLUMN websiteType_uk SET DEFAULT '[]',
  ALTER COLUMN complexity_ru SET DEFAULT '[]',
  ALTER COLUMN complexity_eng SET DEFAULT '[]',
  ALTER COLUMN complexity_uk SET DEFAULT '[]',
  ALTER COLUMN timeline_ru SET DEFAULT '[]',
  ALTER COLUMN timeline_eng SET DEFAULT '[]',
  ALTER COLUMN timeline_uk SET DEFAULT '[]',
  ALTER COLUMN features_ru SET DEFAULT '[]',
  ALTER COLUMN features_eng SET DEFAULT '[]',
  ALTER COLUMN features_uk SET DEFAULT '[]',
  ALTER COLUMN design_ru SET DEFAULT '[]',
  ALTER COLUMN design_eng SET DEFAULT '[]',
  ALTER COLUMN design_uk SET DEFAULT '[]';

-- Шаг 3: Безопасно конвертируем объекты в массивы
UPDATE calculator_config SET
  websiteType_ru = CASE 
    WHEN jsonb_typeof(websiteType_ru) = 'object' AND websiteType_ru != '{}' THEN (
      SELECT jsonb_agg(
        jsonb_build_object(
          'id', key,
          'label', value->>'label',
          'price', (value->>'price')::numeric,
          'multiplier', (value->>'multiplier')::numeric,
          'priceType', value->>'priceType'
        ) ORDER BY key
      )
      FROM jsonb_each(websiteType_ru)
    )
    WHEN jsonb_typeof(websiteType_ru) = 'array' THEN websiteType_ru
    ELSE '[]'::jsonb
  END,
  websiteType_eng = CASE 
    WHEN jsonb_typeof(websiteType_eng) = 'object' AND websiteType_eng != '{}' THEN (
      SELECT jsonb_agg(
        jsonb_build_object(
          'id', key,
          'label', value->>'label',
          'price', (value->>'price')::numeric,
          'multiplier', (value->>'multiplier')::numeric,
          'priceType', value->>'priceType'
        ) ORDER BY key
      )
      FROM jsonb_each(websiteType_eng)
    )
    WHEN jsonb_typeof(websiteType_eng) = 'array' THEN websiteType_eng
    ELSE '[]'::jsonb
  END,
  websiteType_uk = CASE 
    WHEN jsonb_typeof(websiteType_uk) = 'object' AND websiteType_uk != '{}' THEN (
      SELECT jsonb_agg(
        jsonb_build_object(
          'id', key,
          'label', value->>'label',
          'price', (value->>'price')::numeric,
          'multiplier', (value->>'multiplier')::numeric,
          'priceType', value->>'priceType'
        ) ORDER BY key
      )
      FROM jsonb_each(websiteType_uk)
    )
    WHEN jsonb_typeof(websiteType_uk) = 'array' THEN websiteType_uk
    ELSE '[]'::jsonb
  END,
  complexity_ru = CASE 
    WHEN jsonb_typeof(complexity_ru) = 'object' AND complexity_ru != '{}' THEN (
      SELECT jsonb_agg(
        jsonb_build_object(
          'id', key,
          'label', value->>'label',
          'price', (value->>'price')::numeric,
          'multiplier', (value->>'multiplier')::numeric,
          'priceType', value->>'priceType'
        ) ORDER BY key
      )
      FROM jsonb_each(complexity_ru)
    )
    WHEN jsonb_typeof(complexity_ru) = 'array' THEN complexity_ru
    ELSE '[]'::jsonb
  END,
  complexity_eng = CASE 
    WHEN jsonb_typeof(complexity_eng) = 'object' AND complexity_eng != '{}' THEN (
      SELECT jsonb_agg(
        jsonb_build_object(
          'id', key,
          'label', value->>'label',
          'price', (value->>'price')::numeric,
          'multiplier', (value->>'multiplier')::numeric,
          'priceType', value->>'priceType'
        ) ORDER BY key
      )
      FROM jsonb_each(complexity_eng)
    )
    WHEN jsonb_typeof(complexity_eng) = 'array' THEN complexity_eng
    ELSE '[]'::jsonb
  END,
  complexity_uk = CASE 
    WHEN jsonb_typeof(complexity_uk) = 'object' AND complexity_uk != '{}' THEN (
      SELECT jsonb_agg(
        jsonb_build_object(
          'id', key,
          'label', value->>'label',
          'price', (value->>'price')::numeric,
          'multiplier', (value->>'multiplier')::numeric,
          'priceType', value->>'priceType'
        ) ORDER BY key
      )
      FROM jsonb_each(complexity_uk)
    )
    WHEN jsonb_typeof(complexity_uk) = 'array' THEN complexity_uk
    ELSE '[]'::jsonb
  END,
  timeline_ru = CASE 
    WHEN jsonb_typeof(timeline_ru) = 'object' AND timeline_ru != '{}' THEN (
      SELECT jsonb_agg(
        jsonb_build_object(
          'id', key,
          'label', value->>'label',
          'price', (value->>'price')::numeric,
          'multiplier', (value->>'multiplier')::numeric,
          'priceType', value->>'priceType'
        ) ORDER BY key
      )
      FROM jsonb_each(timeline_ru)
    )
    WHEN jsonb_typeof(timeline_ru) = 'array' THEN timeline_ru
    ELSE '[]'::jsonb
  END,
  timeline_eng = CASE 
    WHEN jsonb_typeof(timeline_eng) = 'object' AND timeline_eng != '{}' THEN (
      SELECT jsonb_agg(
        jsonb_build_object(
          'id', key,
          'label', value->>'label',
          'price', (value->>'price')::numeric,
          'multiplier', (value->>'multiplier')::numeric,
          'priceType', value->>'priceType'
        ) ORDER BY key
      )
      FROM jsonb_each(timeline_eng)
    )
    WHEN jsonb_typeof(timeline_eng) = 'array' THEN timeline_eng
    ELSE '[]'::jsonb
  END,
  timeline_uk = CASE 
    WHEN jsonb_typeof(timeline_uk) = 'object' AND timeline_uk != '{}' THEN (
      SELECT jsonb_agg(
        jsonb_build_object(
          'id', key,
          'label', value->>'label',
          'price', (value->>'price')::numeric,
          'multiplier', (value->>'multiplier')::numeric,
          'priceType', value->>'priceType'
        ) ORDER BY key
      )
      FROM jsonb_each(timeline_uk)
    )
    WHEN jsonb_typeof(timeline_uk) = 'array' THEN timeline_uk
    ELSE '[]'::jsonb
  END,
  features_ru = CASE 
    WHEN jsonb_typeof(features_ru) = 'object' AND features_ru != '{}' THEN (
      SELECT jsonb_agg(
        jsonb_build_object(
          'id', key,
          'label', value->>'label',
          'price', (value->>'price')::numeric,
          'multiplier', (value->>'multiplier')::numeric,
          'priceType', value->>'priceType'
        ) ORDER BY key
      )
      FROM jsonb_each(features_ru)
    )
    WHEN jsonb_typeof(features_ru) = 'array' THEN features_ru
    ELSE '[]'::jsonb
  END,
  features_eng = CASE 
    WHEN jsonb_typeof(features_eng) = 'object' AND features_eng != '{}' THEN (
      SELECT jsonb_agg(
        jsonb_build_object(
          'id', key,
          'label', value->>'label',
          'price', (value->>'price')::numeric,
          'multiplier', (value->>'multiplier')::numeric,
          'priceType', value->>'priceType'
        ) ORDER BY key
      )
      FROM jsonb_each(features_eng)
    )
    WHEN jsonb_typeof(features_eng) = 'array' THEN features_eng
    ELSE '[]'::jsonb
  END,
  features_uk = CASE 
    WHEN jsonb_typeof(features_uk) = 'object' AND features_uk != '{}' THEN (
      SELECT jsonb_agg(
        jsonb_build_object(
          'id', key,
          'label', value->>'label',
          'price', (value->>'price')::numeric,
          'multiplier', (value->>'multiplier')::numeric,
          'priceType', value->>'priceType'
        ) ORDER BY key
      )
      FROM jsonb_each(features_uk)
    )
    WHEN jsonb_typeof(features_uk) = 'array' THEN features_uk
    ELSE '[]'::jsonb
  END,
  design_ru = CASE 
    WHEN jsonb_typeof(design_ru) = 'object' AND design_ru != '{}' THEN (
      SELECT jsonb_agg(
        jsonb_build_object(
          'id', key,
          'label', value->>'label',
          'price', (value->>'price')::numeric,
          'multiplier', (value->>'multiplier')::numeric,
          'priceType', value->>'priceType'
        ) ORDER BY key
      )
      FROM jsonb_each(design_ru)
    )
    WHEN jsonb_typeof(design_ru) = 'array' THEN design_ru
    ELSE '[]'::jsonb
  END,
  design_eng = CASE 
    WHEN jsonb_typeof(design_eng) = 'object' AND design_eng != '{}' THEN (
      SELECT jsonb_agg(
        jsonb_build_object(
          'id', key,
          'label', value->>'label',
          'price', (value->>'price')::numeric,
          'multiplier', (value->>'multiplier')::numeric,
          'priceType', value->>'priceType'
        ) ORDER BY key
      )
      FROM jsonb_each(design_eng)
    )
    WHEN jsonb_typeof(design_eng) = 'array' THEN design_eng
    ELSE '[]'::jsonb
  END,
  design_uk = CASE 
    WHEN jsonb_typeof(design_uk) = 'object' AND design_uk != '{}' THEN (
      SELECT jsonb_agg(
        jsonb_build_object(
          'id', key,
          'label', value->>'label',
          'price', (value->>'price')::numeric,
          'multiplier', (value->>'multiplier')::numeric,
          'priceType', value->>'priceType'
        ) ORDER BY key
      )
      FROM jsonb_each(design_uk)
    )
    WHEN jsonb_typeof(design_uk) = 'array' THEN design_uk
    ELSE '[]'::jsonb
  END;

-- Шаг 4: Проверяем результат
SELECT 
  language,
  jsonb_pretty(websiteType_ru) as websiteType_ru,
  jsonb_pretty(complexity_ru) as complexity_ru
FROM calculator_config 
WHERE language = 'RU';
