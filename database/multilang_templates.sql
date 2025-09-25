-- Создание таблицы для многоязычных шаблонов
CREATE TABLE IF NOT EXISTS templates (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title_ru TEXT NOT NULL,
  title_eng TEXT NOT NULL,
  title_uk TEXT NOT NULL,
  description_ru TEXT NOT NULL,
  description_eng TEXT NOT NULL,
  description_uk TEXT NOT NULL,
  category TEXT NOT NULL CHECK (category IN ('landing', 'corporate', 'ecommerce', 'portfolio')),
  image TEXT,
  technologies TEXT[] DEFAULT '{}',
  demo_url TEXT,
  price TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Создание индексов для быстрого поиска
CREATE INDEX IF NOT EXISTS idx_templates_category ON templates(category);
CREATE INDEX IF NOT EXISTS idx_templates_created_at ON templates(created_at);

-- Функция для автоматического обновления updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Триггер для автоматического обновления updated_at
CREATE TRIGGER update_templates_updated_at 
    BEFORE UPDATE ON templates 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

-- Вставка примеров данных
INSERT INTO templates (title_ru, title_eng, title_uk, description_ru, description_eng, description_uk, category, image, technologies, demo_url, price) VALUES
(
  'Криптовалютная биржа',
  'Cryptocurrency Exchange',
  'Криптовалютна біржа',
  'Современный лендинг для криптобиржи с интерактивными элементами',
  'Modern landing page for cryptocurrency exchange with interactive elements',
  'Сучасний лендінг для криптобіржі з інтерактивними елементами',
  'landing',
  '/api/placeholder/600/400',
  ARRAY['React', 'TypeScript', 'Tailwind CSS'],
  'https://example.com/demo1',
  '$1,200'
),
(
  'Корпоративный сайт IT-компании',
  'Corporate Website for IT Company',
  'Корпоративний сайт IT-компанії',
  'Многостраничный сайт с системой управления контентом',
  'Multi-page website with content management system',
  'Багатосторінковий сайт з системою управління контентом',
  'corporate',
  '/api/placeholder/600/400',
  ARRAY['Next.js', 'Prisma', 'PostgreSQL'],
  'https://example.com/demo2',
  '$2,500'
),
(
  'Интернет-магазин одежды',
  'Online Clothing Store',
  'Інтернет-магазин одягу',
  'Полнофункциональный e-commerce с корзиной и платежами',
  'Full-featured e-commerce with shopping cart and payments',
  'Повнофункціональний e-commerce з кошиком та платежами',
  'ecommerce',
  '/api/placeholder/600/400',
  ARRAY['React', 'Stripe', 'Node.js'],
  'https://example.com/demo3',
  '$3,200'
),
(
  'Портфолио дизайнера',
  'Designer Portfolio',
  'Портфоліо дизайнера',
  'Минималистичное портфолио с галереей работ',
  'Minimalist portfolio with work gallery',
  'Мінімалістичне портфоліо з галереєю робіт',
  'portfolio',
  '/api/placeholder/600/400',
  ARRAY['Gatsby', 'GraphQL', 'Styled Components'],
  'https://example.com/demo4',
  '$800'
),
(
  'Лендинг SaaS продукта',
  'SaaS Product Landing Page',
  'Лендінг SaaS продукту',
  'Конверсионный лендинг для B2B SaaS решения',
  'Conversion landing page for B2B SaaS solution',
  'Конверсійний лендінг для B2B SaaS рішення',
  'landing',
  '/api/placeholder/600/400',
  ARRAY['Vue.js', 'Nuxt.js', 'Tailwind CSS'],
  'https://example.com/demo5',
  '$1,500'
),
(
  'Медицинская клиника',
  'Medical Clinic',
  'Медична клініка',
  'Сайт с записью на прием и каталогом услуг',
  'Website with appointment booking and services catalog',
  'Сайт з записом на прийом та каталогом послуг',
  'corporate',
  '/api/placeholder/600/400',
  ARRAY['React', 'Firebase', 'Material-UI'],
  'https://example.com/demo6',
  '$2,100'
);
