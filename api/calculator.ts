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

      const configData = {
        language,
        website_type_ru: body.website_type_ru || body.websiteType || {},
        website_type_eng: body.website_type_eng || body.websiteType || {},
        website_type_uk: body.website_type_uk || body.websiteType || {},
        complexity_ru: body.complexity_ru || body.complexity || {},
        complexity_eng: body.complexity_eng || body.complexity || {},
        complexity_uk: body.complexity_uk || body.complexity || {},
        timeline_ru: body.timeline_ru || body.timeline || {},
        timeline_eng: body.timeline_eng || body.timeline || {},
        timeline_uk: body.timeline_uk || body.timeline || {},
        features_ru: body.features_ru || body.features || {},
        features_eng: body.features_eng || body.features || {},
        features_uk: body.features_uk || body.features || {},
        design_ru: body.design_ru || body.design || {},
        design_eng: body.design_eng || body.design || {},
        design_uk: body.design_uk || body.design || {},
        updated_at: new Date().toISOString(),
      };

      if (req.method === 'POST') {
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
      } else {
        const { data, error } = await supabase
          .from('calculator_config')
          .update(configData)
          .eq('language', language)
          .select()
          .single();

        if (error) {
          console.error('Error updating calculator config:', error);
          return res.status(500).json({ ok: false, error: 'Failed to update calculator config' });
        }

        return res.status(200).json({ ok: true, config: data });
      }
    }

    return res.status(405).json({ ok: false, error: 'Method not allowed' });
  } catch (error) {
    console.error('API Error:', error);
    return res.status(500).json({ ok: false, error: 'Internal server error' });
  }
}
