import type { VercelRequest, VercelResponse } from "@vercel/node";
import { getSupabase } from "./_supabase";

// We'll store settings in a single table as key/value JSON
// Table: settings (key text primary key, value jsonb)

function setCors(res: VercelResponse) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET,POST,OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
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
      const body = typeof req.body === 'string' ? JSON.parse(req.body || '{}') : (req.body || {});
      const upserts: Array<{ key: string; value: any }> = [];
      if (body.templates !== undefined) upserts.push({ key: 'templates', value: body.templates });
      if (body.calculator !== undefined) upserts.push({ key: 'calculator', value: body.calculator });
      if (body.telegram !== undefined) upserts.push({ key: 'telegram', value: body.telegram });

      if (upserts.length) {
        const { error } = await supabase
          .from('settings')
          .upsert(upserts, { onConflict: 'key' });
        if (error) throw error;
      }
      return res.status(200).json({ ok: true });
    }

    res.setHeader('Allow', 'GET, POST, OPTIONS');
    return res.status(405).json({ ok: false, error: 'Method Not Allowed' });
  } catch (e: any) {
    return res.status(500).json({ ok: false, error: e?.message || 'Unexpected error' });
  }
}


