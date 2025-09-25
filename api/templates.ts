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
      const { language = "RU" } = req.query;
      const body = typeof req.body === 'string' ? JSON.parse(req.body) : req.body;
      
      const templateData = {
        title_ru: body.title_ru || body.title,
        title_eng: body.title_eng || body.title,
        title_uk: body.title_uk || body.title,
        description_ru: body.description_ru || body.description,
        description_eng: body.description_eng || body.description,
        description_uk: body.description_uk || body.description,
        category: body.category,
        image: body.image,
        technologies: body.technologies || [],
        demo_url: body.demoUrl || body.demo_url,
        price: body.price,
      };

      const { data, error } = await supabase
        .from('templates')
        .insert([templateData])
        .select()
        .single();

      if (error) throw error;

      return res.status(201).json({ ok: true, template: data });
    }

    if (req.method === "PUT") {
      const { id } = req.query;
      const { language = "RU" } = req.query;
      const body = typeof req.body === 'string' ? JSON.parse(req.body) : req.body;
      
        const updateData: any = {};

        // Обновляем только переданные поля
        Object.keys(body).forEach(key => {
          if (key.startsWith('title_') || key.startsWith('description_')) {
            updateData[key] = body[key];
          } else if (key === 'category') updateData.category = body.category;
          else if (key === 'image') updateData.image = body.image;
          else if (key === 'technologies') updateData.technologies = body.technologies;
          else if (key === 'demoUrl') updateData.demo_url = body.demoUrl;
          else if (key === 'price') updateData.price = body.price;
        });

      const { data, error } = await supabase
        .from('templates')
        .update(updateData)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;

      return res.status(200).json({ ok: true, template: data });
    }

    if (req.method === "DELETE") {
      const { id } = req.query;

      const { error } = await supabase
        .from('templates')
        .delete()
        .eq('id', id);

      if (error) throw error;

      return res.status(200).json({ ok: true });
    }

    res.setHeader('Allow', 'GET, POST, PUT, DELETE, OPTIONS');
    return res.status(405).json({ ok: false, error: 'Method Not Allowed' });
  } catch (e: any) {
    return res.status(500).json({ ok: false, error: e?.message || 'Unexpected error' });
  }
}
