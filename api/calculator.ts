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

      // Создаем конфигурацию для всех языков, обновляя только текущий язык
      const configData = {
        language,
        website_type_ru: language === 'RU' ? (body.websiteType || {}) : (body.website_type_ru || {}),
        website_type_eng: language === 'ENG' ? (body.websiteType || {}) : (body.website_type_eng || {}),
        website_type_uk: language === 'UK' ? (body.websiteType || {}) : (body.website_type_uk || {}),
        complexity_ru: language === 'RU' ? (body.complexity || {}) : (body.complexity_ru || {}),
        complexity_eng: language === 'ENG' ? (body.complexity || {}) : (body.complexity_eng || {}),
        complexity_uk: language === 'UK' ? (body.complexity || {}) : (body.complexity_uk || {}),
        timeline_ru: language === 'RU' ? (body.timeline || {}) : (body.timeline_ru || {}),
        timeline_eng: language === 'ENG' ? (body.timeline || {}) : (body.timeline_eng || {}),
        timeline_uk: language === 'UK' ? (body.timeline || {}) : (body.timeline_uk || {}),
        features_ru: language === 'RU' ? (body.features || {}) : (body.features_ru || {}),
        features_eng: language === 'ENG' ? (body.features || {}) : (body.features_eng || {}),
        features_uk: language === 'UK' ? (body.features || {}) : (body.features_uk || {}),
        design_ru: language === 'RU' ? (body.design || {}) : (body.design_ru || {}),
        design_eng: language === 'ENG' ? (body.design || {}) : (body.design_eng || {}),
        design_uk: language === 'UK' ? (body.design || {}) : (body.design_uk || {}),
        updated_at: new Date().toISOString(),
      };

      // Проверяем, существует ли запись для этого языка
      const { data: existingData, error: fetchError } = await supabase
        .from('calculator_config')
        .select('*')
        .eq('language', language)
        .single();

      if (fetchError && fetchError.code !== 'PGRST116') {
        console.error('Error fetching existing config:', fetchError);
        return res.status(500).json({ ok: false, error: 'Failed to fetch existing config' });
      }

      if (existingData) {
        // Обновляем существующую запись, сохраняя данные других языков
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
          return res.status(500).json({ ok: false, error: 'Failed to update calculator config' });
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
          return res.status(500).json({ ok: false, error: 'Failed to create calculator config' });
        }

        return res.status(201).json({ ok: true, config: data });
      }
    }

    return res.status(405).json({ ok: false, error: 'Method not allowed' });
  } catch (error) {
    console.error('API Error:', error);
    return res.status(500).json({ ok: false, error: 'Internal server error' });
  }
}
