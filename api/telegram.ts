import type { VercelRequest, VercelResponse } from "@vercel/node";
import { getSupabase } from "./_supabase";

// Serverless function to send a Telegram message using bot token and chat id
// Configure environment variables in Vercel dashboard:
// TELEGRAM_BOT_TOKEN, TELEGRAM_CHAT_ID

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ ok: false, error: "Method Not Allowed" });
  }

  try {
    // Be robust to body being a string or already-parsed object
    let parsed: any = undefined;
    if (typeof req.body === "string") {
      try {
        parsed = JSON.parse(req.body);
      } catch (e: any) {
        return res.status(400).json({ ok: false, error: "Invalid JSON body" });
      }
    } else {
      parsed = req.body || {};
    }

    // Allow overriding bot token and chat id from request body (e.g., when running locally)
    const overrideToken = typeof parsed?.botToken === 'string' ? parsed.botToken.trim() : '';
    const overrideChatId = typeof parsed?.chatId === 'string' ? parsed.chatId.trim() : '';

    let botToken = overrideToken || process.env.TELEGRAM_BOT_TOKEN;
    let chatId = overrideChatId || process.env.TELEGRAM_CHAT_ID;

    // Fallback: read from Supabase settings
    if (!botToken || !chatId) {
      try {
        const supabase = getSupabase();
        const { data, error } = await supabase.from('settings').select('value').eq('key','telegram').single();
        if (!error && data?.value) {
          botToken = botToken || data.value.botToken;
          chatId = chatId || data.value.chatId;
        }
      } catch {}
    }

    if (!botToken || !chatId) {
      return res.status(500).json({ ok: false, error: "Telegram is not configured" });
    }

    const { text } = (parsed as { text?: string }) || {};
    if (!text || typeof text !== "string" || !text.trim()) {
      return res.status(400).json({ ok: false, error: "Text is required" });
    }

    const url = `https://api.telegram.org/bot${botToken}/sendMessage`;
    const tgRes = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ chat_id: chatId, text }),
    });

    if (!tgRes.ok) {
      let bodyText: string | undefined;
      try {
        bodyText = await tgRes.text();
      } catch {}
      return res.status(502).json({ ok: false, error: "Telegram API error", body: bodyText });
    }

    const data = await tgRes.json();
    return res.status(200).json({ ok: true, data });
  } catch (err: any) {
    return res.status(500).json({ ok: false, error: err?.message || "Internal error" });
  }
}


