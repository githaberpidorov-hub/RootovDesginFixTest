import { getSupabase } from "./_supabase.js";

// We'll store settings in a single table as key/value JSON
// Table: settings (key text primary key, value jsonb)

function setCors(res: any) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET,POST,OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
}

export default async function handler(req: any, res: any) {
  setCors(res);
  if (req.method === "OPTIONS") return res.status(204).end();

  try {
    const supabase = getSupabase();

    if (req.method === "GET") {
      const { data, error } = await supabase
        .from('settings')
        .select('key, value');
      if (error) throw error;
      const map = Object.fromEntries((data || []).map((r: any) => [r.key, r.value]));
      return res.status(200).json({ ok: true, templates: map.templates || [], calculator: map.calculator || {}, telegram: map.telegram || {} });
    }

    if (req.method === "POST") {
      // Parse body safely
      let body: any = {};
      try {
        body = typeof req.body === 'string' ? JSON.parse(req.body || '{}') : (req.body || {});
      } catch (e: any) {
        return res.status(400).json({ ok: false, error: 'Invalid JSON body' });
      }

      const upserts: Array<{ key: string; value: any }> = [];
      if (body.templates !== undefined) upserts.push({ key: 'templates', value: body.templates });
      if (body.calculator !== undefined) upserts.push({ key: 'calculator', value: body.calculator });
      if (body.telegram !== undefined) upserts.push({ key: 'telegram', value: body.telegram });

      if (upserts.length) {
        const { data, error } = await supabase
          .from('settings')
          .upsert(upserts, { onConflict: 'key' })
          .select('key');
        if (error) {
          return res.status(500).json({ ok: false, error: error.message });
        }
        return res.status(200).json({ ok: true, updated: data?.map((r: any) => r.key) || [] });
      }

      return res.status(400).json({ ok: false, error: 'Nothing to update' });
    }

    res.setHeader('Allow', 'GET, POST, OPTIONS');
    return res.status(405).json({ ok: false, error: 'Method Not Allowed' });
  } catch (e: any) {
    return res.status(500).json({ ok: false, error: e?.message || 'Unexpected error' });
  }
}


