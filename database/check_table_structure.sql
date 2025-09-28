-- Проверяем структуру таблицы calculator_config
-- Выполните этот скрипт в Supabase SQL Editor

-- 1. Проверяем существование таблицы
SELECT EXISTS (
   SELECT FROM information_schema.tables 
   WHERE table_schema = 'public' 
   AND table_name = 'calculator_config'
) as table_exists;

-- 2. Показываем все столбцы таблицы
SELECT column_name, data_type, is_nullable, column_default
FROM information_schema.columns 
WHERE table_name = 'calculator_config' 
AND table_schema = 'public'
ORDER BY ordinal_position;

-- 3. Показываем данные в таблице
SELECT * FROM calculator_config LIMIT 5;

-- 4. Проверяем конкретные столбцы, которые нужны API
SELECT 
  CASE WHEN EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'calculator_config' 
    AND column_name = 'websiteType_ru'
  ) THEN 'EXISTS' ELSE 'MISSING' END as websiteType_ru,
  
  CASE WHEN EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'calculator_config' 
    AND column_name = 'sections'
  ) THEN 'EXISTS' ELSE 'MISSING' END as sections,
  
  CASE WHEN EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'calculator_config' 
    AND column_name = 'complexity_ru'
  ) THEN 'EXISTS' ELSE 'MISSING' END as complexity_ru;
