-- Исправление схемы для сохранения порядка элементов
-- Этот скрипт изменит все JSONB поля с объектов на массивы

-- Сначала создаем резервную копию (удаляем старую, если существует)
DROP TABLE IF EXISTS calculator_config_backup;
CREATE TABLE calculator_config_backup AS SELECT * FROM calculator_config;

-- Изменяем дефолтные значения для всех полей на массивы
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

-- Преобразуем существующие данные из объектов в массивы
-- Для каждого поля конвертируем объект в массив, сохраняя порядок ключей
UPDATE calculator_config SET
  websiteType_ru = CASE 
    WHEN jsonb_typeof(websiteType_ru) = 'object' THEN (
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
    ELSE websiteType_ru
  END,
  websiteType_eng = (
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
  ),
  websiteType_uk = (
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
  ),
  complexity_ru = (
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
  ),
  complexity_eng = (
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
  ),
  complexity_uk = (
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
  ),
  timeline_ru = (
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
  ),
  timeline_eng = (
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
  ),
  timeline_uk = (
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
  ),
  features_ru = (
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
  ),
  features_eng = (
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
  ),
  features_uk = (
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
  ),
  design_ru = (
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
  ),
  design_eng = (
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
  ),
  design_uk = (
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
  );

-- Проверяем результат
SELECT 
  language,
  jsonb_pretty(websiteType_ru) as websiteType_ru,
  jsonb_pretty(complexity_ru) as complexity_ru
FROM calculator_config 
WHERE language = 'RU';
