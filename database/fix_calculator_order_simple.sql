-- Простое исправление схемы таблицы calculator_config для сохранения порядка опций
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

-- Устанавливаем пустые массивы для всех полей
-- Это сбросит существующие данные, но исправит схему
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
  design_uk = '[]'::jsonb;

-- Проверяем результат
SELECT 
  language,
  jsonb_typeof(websiteType_ru) as websiteType_ru_type,
  jsonb_typeof(complexity_ru) as complexity_ru_type,
  jsonb_typeof(timeline_ru) as timeline_ru_type,
  jsonb_typeof(features_ru) as features_ru_type,
  jsonb_typeof(design_ru) as design_ru_type
FROM calculator_config;
