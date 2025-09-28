-- Проверяем текущую структуру таблицы calculator_config
SELECT column_name, data_type, is_nullable, column_default
FROM information_schema.columns 
WHERE table_name = 'calculator_config' 
ORDER BY ordinal_position;
