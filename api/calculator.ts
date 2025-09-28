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

      // Добавляем sections в ответ, если их нет
      if (data && !data.sections) {
        data.sections = [
          { key: 'websiteType', label: 'Тип сайта', icon: '' },
          { key: 'complexity', label: 'Сложность', icon: '' },
          { key: 'timeline', label: 'Сроки', icon: '' },
          { key: 'features', label: 'Дополнительные функции', icon: '' },
          { key: 'design', label: 'Дизайн', icon: '' },
        ];
      }

      return res.status(200).json({ ok: true, config: data });
    }

    if (req.method === 'POST' || req.method === 'PUT') {
      const body = typeof req.body === 'string' ? JSON.parse(req.body) : req.body;
      const { language = 'RU' } = body;

      console.log('Calculator API - Language:', language);
      console.log('Calculator API - Body:', JSON.stringify(body, null, 2));

      // Создаем конфигурацию: заполняем только соответствующие текущему языку поля,
      // остальные оставляем значениями по умолчанию
      const configData: any = {
        language,
        websiteType_ru: {},
        complexity_ru: {},
        timeline_ru: {},
        features_ru: {},
        design_ru: {},
        websiteType_eng: {},
        complexity_eng: {},
        timeline_eng: {},
        features_eng: {},
        design_eng: {},
        websiteType_uk: {},
        complexity_uk: {},
        timeline_uk: {},
        features_uk: {},
        design_uk: {},
        sections: body.sections || [],
        updated_at: new Date().toISOString(),
      };
      
      
      // Динамически заполняем данные для всех разделов
      if (body.sections && Array.isArray(body.sections)) {
        body.sections.forEach((section: any) => {
          const sectionKey = `${section.key}_${String(language).toLowerCase()}`;
          configData[sectionKey] = body[section.key] || {};
        });
      } else {
        // Fallback для старых разделов
        configData[`websiteType_${String(language).toLowerCase()}`] = body.websiteType || {};
        configData[`complexity_${String(language).toLowerCase()}`] = body.complexity || {};
        configData[`timeline_${String(language).toLowerCase()}`] = body.timeline || {};
        configData[`features_${String(language).toLowerCase()}`] = body.features || {};
        configData[`design_${String(language).toLowerCase()}`] = body.design || {};
      }

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
        const updateData: any = {
          sections: body.sections || [],
          updated_at: new Date().toISOString(),
        };
        
        // Динамически заполняем данные для всех разделов
        if (body.sections && Array.isArray(body.sections)) {
          body.sections.forEach((section: any) => {
            const sectionKey = `${section.key}_${String(language).toLowerCase()}`;
            updateData[sectionKey] = body[section.key] || {};
          });
        } else {
          // Fallback для старых разделов
          updateData[`websiteType_${language.toLowerCase()}`] = body.websiteType || {};
          updateData[`complexity_${language.toLowerCase()}`] = body.complexity || {};
          updateData[`timeline_${language.toLowerCase()}`] = body.timeline || {};
          updateData[`features_${language.toLowerCase()}`] = body.features || {};
          updateData[`design_${language.toLowerCase()}`] = body.design || {};
        }

        console.log('Updating with data:', JSON.stringify(updateData, null, 2));
        
        const { data, error } = await supabase
          .from('calculator_config')
          .update(updateData)
          .eq('language', language)
          .select()
          .single();

        if (error) {
          console.error('Error updating calculator config:', error);
          console.error('Update data was:', JSON.stringify(updateData, null, 2));
          return res.status(500).json({ ok: false, error: error.message, details: error });
        }

        return res.status(200).json({ ok: true, config: data });
      } else {
        // Создаем новую запись
        console.log('Creating new record with data:', JSON.stringify(configData, null, 2));
        
        const { data, error } = await supabase
          .from('calculator_config')
          .insert([configData])
          .select()
          .single();

        if (error) {
          console.error('Error creating calculator config:', error);
          console.error('Config data was:', JSON.stringify(configData, null, 2));
          return res.status(500).json({ ok: false, error: error.message, details: error });
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
