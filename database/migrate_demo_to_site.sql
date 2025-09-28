-- Миграция: переименование demo_url в site_url
-- Выполните этот скрипт для обновления существующей базы данных

-- 1. Добавляем новую колонку site_url
ALTER TABLE templates ADD COLUMN IF NOT EXISTS site_url TEXT;

-- 2. Копируем данные из demo_url в site_url
UPDATE templates SET site_url = demo_url WHERE demo_url IS NOT NULL;

-- 3. Удаляем старую колонку demo_url (раскомментируйте после проверки данных)
-- ALTER TABLE templates DROP COLUMN demo_url;

-- Проверка результата
SELECT id, title_ru, demo_url, site_url FROM templates LIMIT 5;
