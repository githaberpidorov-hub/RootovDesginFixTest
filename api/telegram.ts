import type { VercelRequest, VercelResponse } from "@vercel/node";

// Serverless function to send a Telegram message using bot token and chat id
// Configure environment variables in Vercel dashboard:
// TELEGRAM_BOT_TOKEN, TELEGRAM_CHAT_ID

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ ok: false, error: "Method Not Allowed" });
  }

  try {
    const botToken = process.env.TELEGRAM_BOT_TOKEN;
    const chatId = process.env.TELEGRAM_CHAT_ID;

    if (!botToken || !chatId) {
      return res.status(500).json({ ok: false, error: "Telegram is not configured" });
    }

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


