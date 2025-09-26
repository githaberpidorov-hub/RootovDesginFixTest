import { getSupabase } from "./_supabase.js";

function setCors(res: any) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST,OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
}

export default async function handler(req: any, res: any) {
  setCors(res);
  if (req.method === "OPTIONS") return res.status(204).end();

  if (req.method !== "POST") {
    res.setHeader('Allow', 'POST, OPTIONS');
    return res.status(405).json({ ok: false, error: 'Method Not Allowed' });
  }

  try {
    const supabase = getSupabase();

    let body: any = {};
    try {
      body = typeof req.body === 'string' ? JSON.parse(req.body || '{}') : (req.body || {});
    } catch {
      return res.status(400).json({ ok: false, error: 'Invalid JSON body' });
    }

    const username: string = String(body.username || '').trim();
    const password: string = String(body.password || '');

    if (!username || !password) {
      return res.status(400).json({ ok: false, error: 'Missing credentials' });
    }

    const { data: row, error } = await supabase
      .from('settings')
      .select('value')
      .eq('key', 'admin')
      .maybeSingle();
    if (error && (error as any).code !== 'PGRST116') {
      return res.status(500).json({ ok: false, error: error.message });
    }

    // Fallback to default admin/admin if no credentials stored
    const saved = (row as any)?.value || null;

    const { createHash } = await import('crypto');
    const incomingHash = createHash('sha256').update(password).digest('hex');

    let isValid = false;
    if (!saved) {
      isValid = (username === 'admin' && password === 'admin');
    } else {
      const savedUser = String(saved.username || 'admin');
      const savedHash = String(saved.passwordHash || '');
      isValid = (username === savedUser && !!savedHash && incomingHash === savedHash);
    }

    if (!isValid) {
      return res.status(401).json({ ok: false, error: 'Invalid username or password' });
    }

    return res.status(200).json({ ok: true });
  } catch (e: any) {
    return res.status(500).json({ ok: false, error: e?.message || 'Unexpected error' });
  }
}


