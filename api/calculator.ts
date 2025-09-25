import { getSupabase } from './_supabase.js';

export default async function handler(req: any, res: any) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  try {
    const supabase = getSupabase();
    if (req.method === 'GET') {
      const { language = 'RU' } = req.query;
      
      const { data, error } = await supabase
        .from('calculator_config')
        .select('*')
        .eq('language', language)
        .single();

      if (error) {
        console.error('Error fetching calculator config:', error);
        return res.status(500).json({ ok: false, error: 'Failed to fetch calculator config' });
      }

      return res.status(200).json({ ok: true, config: data });
    }

    if (req.method === 'POST' || req.method === 'PUT') {
      const body = typeof req.body === 'string' ? JSON.parse(req.body) : req.body;
      const { language = 'RU' } = body;

      // Создаем конфигурацию только для текущего языка
      const configData = {
        language,
        website_type_ru: body.websiteType || {},
        complexity_ru: body.complexity || {},
        timeline_ru: body.timeline || {},
        features_ru: body.features || {},
        design_ru: body.design || {},
        website_type_eng: body.websiteType || {},
        complexity_eng: body.complexity || {},
        timeline_eng: body.timeline || {},
        features_eng: body.features || {},
        design_eng: body.design || {},
        website_type_uk: body.websiteType || {},
        complexity_uk: body.complexity || {},
        timeline_uk: body.timeline || {},
        features_uk: body.features || {},
        design_uk: body.design || {},
        updated_at: new Date().toISOString(),
      };

      // Проверяем, существует ли запись для этого языка
      const { data: existingData, error: fetchError } = await supabase
        .from('calculator_config')
        .select('*')
        .eq('language', language)
        .single();

      // В разных версиях postgrest коды могут отличаться. Если просто нет строки — existingData будет null
      if (fetchError && fetchError.message && !String(fetchError.message).toLowerCase().includes('row not found')) {
        console.error('Error fetching existing config:', fetchError);
        return res.status(500).json({ ok: false, error: fetchError.message });
      }

      if (existingData) {
        // Обновляем существующую запись
        const updateData = {
          [`website_type_${language.toLowerCase()}`]: body.websiteType || {},
          [`complexity_${language.toLowerCase()}`]: body.complexity || {},
          [`timeline_${language.toLowerCase()}`]: body.timeline || {},
          [`features_${language.toLowerCase()}`]: body.features || {},
          [`design_${language.toLowerCase()}`]: body.design || {},
          updated_at: new Date().toISOString(),
        };

        const { data, error } = await supabase
          .from('calculator_config')
          .update(updateData)
          .eq('language', language)
          .select()
          .single();

        if (error) {
          console.error('Error updating calculator config:', error);
          return res.status(500).json({ ok: false, error: error.message });
        }

        return res.status(200).json({ ok: true, config: data });
      } else {
        // Создаем новую запись
        const { data, error } = await supabase
          .from('calculator_config')
          .insert([configData])
          .select()
          .single();

        if (error) {
          console.error('Error creating calculator config:', error);
          return res.status(500).json({ ok: false, error: error.message });
        }

        return res.status(201).json({ ok: true, config: data });
      }
    }

    return res.status(405).json({ ok: false, error: 'Method not allowed' });
  } catch (error: any) {
    console.error('API Error:', error);
    return res.status(500).json({ ok: false, error: error?.message || 'Internal server error' });
  }
}
