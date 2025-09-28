-- Простое исправление схемы для сохранения порядка элементов
-- Выполняйте по шагам, если возникают ошибки

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

-- Шаг 3: Очищаем все поля (это заставит использовать новые дефолты)
UPDATE calculator_config SET
  websiteType_ru = '[]',
  websiteType_eng = '[]',
  websiteType_uk = '[]',
  complexity_ru = '[]',
  complexity_eng = '[]',
  complexity_uk = '[]',
  timeline_ru = '[]',
  timeline_eng = '[]',
  timeline_uk = '[]',
  features_ru = '[]',
  features_eng = '[]',
  features_uk = '[]',
  design_ru = '[]',
  design_eng = '[]',
  design_uk = '[]';

-- Шаг 4: Проверяем результат
SELECT 
  language,
  websiteType_ru,
  complexity_ru
FROM calculator_config 
WHERE language = 'RU';