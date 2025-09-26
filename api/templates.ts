import { getSupabase } from "./_supabase.js";

// API для работы с многоязычными шаблонами
// Таблица: templates (id, title_ru, title_eng, title_uk, description_ru, description_eng, description_uk, category, image, technologies, demo_url, price, created_at, updated_at)

function setCors(res: any) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET,POST,PUT,DELETE,OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
}

export default async function handler(req: any, res: any) {
  setCors(res);
  if (req.method === "OPTIONS") return res.status(204).end();

  try {
    const supabase = getSupabase();

    if (req.method === "GET") {
      const { language = "RU" } = req.query;
      
      const { data, error } = await supabase
        .from('templates')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;

      // Преобразуем данные в формат для фронтенда
      const templates = data?.map(template => ({
        id: template.id,
        title: template[`title_${language.toLowerCase()}`] || template.title_ru,
        description: template[`description_${language.toLowerCase()}`] || template.description_ru,
        category: template.category,
        image: template.image,
        technologies: template.technologies || [],
        demoUrl: template.demo_url,
        price: template.price,
      })) || [];

      return res.status(200).json({ ok: true, templates });
    }

    if (req.method === "POST") {
      const { language = "RU" } = req.query as { language?: string };
      const body = typeof req.body === 'string' ? JSON.parse(req.body) : req.body;

      console.log('Template POST - Language:', language);
      console.log('Template POST - Body:', body);

      // Валидация обязательных полей
      if (!body?.category || !body?.price) {
        return res.status(400).json({ ok: false, error: 'Missing required fields: category, price' });
      }

      // Разрешаем два формата:
      // 1) Переданы per-language поля (title_ru/eng/uk и description_ru/eng/uk)
      // 2) Переданы универсальные title/description + language — тогда заполняем только соответствующие колонки
      const lang = String(language || 'RU').toUpperCase();

      const resolvedTitles = {
        title_ru: body.title_ru ?? (lang === 'RU' ? body.title : ''),
        title_eng: body.title_eng ?? (lang === 'ENG' ? body.title : ''),
        title_uk: body.title_uk ?? (lang === 'UK' ? body.title : ''),
      } as Record<string, string>;

      const resolvedDescriptions = {
        description_ru: body.description_ru ?? (lang === 'RU' ? body.description : ''),
        description_eng: body.description_eng ?? (lang === 'ENG' ? body.description : ''),
        description_uk: body.description_uk ?? (lang === 'UK' ? body.description : ''),
      } as Record<string, string>;

      // Проверим: хотя бы одна языковая колонка должна быть непустой
      const hasAnyTitle = Object.values(resolvedTitles).some(v => typeof v === 'string' && v.length > 0);
      const hasAnyDescription = Object.values(resolvedDescriptions).some(v => typeof v === 'string' && v.length > 0);
      if (!hasAnyTitle || !hasAnyDescription) {
        return res.status(400).json({ ok: false, error: 'Missing required fields: title/description (at least for one language)' });
      }

      const baseData = {
        category: body.category,
        image: body.image || "/api/placeholder/600/400",
        technologies: body.technologies || [],
        demo_url: body.demoUrl || body.demo_url,
        price: body.price,
      };

      const rowToInsert = {
        ...baseData,
        ...resolvedTitles,
        ...resolvedDescriptions,
      };

      const { data, error } = await supabase
        .from('templates')
        .insert([rowToInsert])
        .select()
        .single();

      if (error) {
        console.error('Template insert error:', error);
        return res.status(500).json({ ok: false, error: error.message });
      }

      return res.status(201).json({ ok: true, template: data });
    }

    if (req.method === "PUT") {
      const { id } = req.query as { id?: string };
      const { language = "RU" } = req.query as { language?: string };
      const body = typeof req.body === 'string' ? JSON.parse(req.body) : req.body;
      
      if (!id) return res.status(400).json({ ok: false, error: 'Missing id' });

      const updateData: any = {};

      // 1) Поддержка универсальных полей title/description: меняем только колонку выбранного языка
      if (body.title) updateData[`title_${String(language).toLowerCase()}`] = body.title;
      if (body.description) updateData[`description_${String(language).toLowerCase()}`] = body.description;

      // 2) Поддержка пер-языковых полей (если переданы) — обновляем их напрямую
      if (typeof body.title_ru === 'string') updateData.title_ru = body.title_ru;
      if (typeof body.title_eng === 'string') updateData.title_eng = body.title_eng;
      if (typeof body.title_uk === 'string') updateData.title_uk = body.title_uk;
      if (typeof body.description_ru === 'string') updateData.description_ru = body.description_ru;
      if (typeof body.description_eng === 'string') updateData.description_eng = body.description_eng;
      if (typeof body.description_uk === 'string') updateData.description_uk = body.description_uk;

      if (body.category) updateData.category = body.category;
      if (body.image) updateData.image = body.image;
      if (body.technologies) updateData.technologies = body.technologies;
      if (body.demoUrl) updateData.demo_url = body.demoUrl;
      if (body.price) updateData.price = body.price;

      const { data, error } = await supabase
        .from('templates')
        .update(updateData)
        .eq('id', id)
        .select()
        .single();

      if (error) {
        console.error('Template update error:', error);
        return res.status(500).json({ ok: false, error: error.message });
      }

      return res.status(200).json({ ok: true, template: data });
    }

    if (req.method === "DELETE") {
      const { id } = req.query;

      const { error } = await supabase
        .from('templates')
        .delete()
        .eq('id', id);

      if (error) return res.status(500).json({ ok: false, error: error.message });

      return res.status(200).json({ ok: true });
    }

    res.setHeader('Allow', 'GET, POST, PUT, DELETE, OPTIONS');
    return res.status(405).json({ ok: false, error: 'Method Not Allowed' });
  } catch (e: any) {
    return res.status(500).json({ ok: false, error: e?.message || 'Unexpected error' });
  }
}
