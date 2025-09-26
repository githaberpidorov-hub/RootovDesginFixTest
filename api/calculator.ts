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
      const { language = 'RU' } = req.query as { language?: string };
      
      const { data, error } = await supabase
        .from('calculator_config')
        .select('*')
        .eq('language', language)
        .maybeSingle();

      if (error) {
        console.error('Error fetching calculator config:', error);
        return res.status(500).json({ ok: false, error: 'Failed to fetch calculator config' });
      }

      return res.status(200).json({ ok: true, config: data });
    }

    if (req.method === 'POST' || req.method === 'PUT') {
      const body = typeof req.body === 'string' ? JSON.parse(req.body) : req.body;
      const { language = 'RU' } = body;

      console.log('Calculator API - Language:', language);
      console.log('Calculator API - Body:', body);

      // Создаем конфигурацию: заполняем только соответствующие текущему языку поля,
      // остальные оставляем значениями по умолчанию
      const configData: any = {
        language,
        website_type_ru: {},
        complexity_ru: {},
        timeline_ru: {},
        features_ru: {},
        design_ru: {},
        website_type_eng: {},
        complexity_eng: {},
        timeline_eng: {},
        features_eng: {},
        design_eng: {},
        website_type_uk: {},
        complexity_uk: {},
        timeline_uk: {},
        features_uk: {},
        design_uk: {},
        updated_at: new Date().toISOString(),
      };
      configData[`website_type_${String(language).toLowerCase()}`] = body.websiteType || {};
      configData[`complexity_${String(language).toLowerCase()}`] = body.complexity || {};
      configData[`timeline_${String(language).toLowerCase()}`] = body.timeline || {};
      configData[`features_${String(language).toLowerCase()}`] = body.features || {};
      configData[`design_${String(language).toLowerCase()}`] = body.design || {};

      // Проверяем, существует ли запись для этого языка
      const { data: existingData, error: fetchError } = await supabase
        .from('calculator_config')
        .select('*')
        .eq('language', language)
        .maybeSingle();

      if (fetchError) {
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
