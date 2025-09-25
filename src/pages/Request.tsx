import { useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useLocation, useNavigate } from "react-router-dom";
import Navigation from "@/components/Navigation";
import LiquidBackground from "@/components/LiquidBackground";
import GlassButton from "@/components/GlassButton";
import { useToast } from "@/hooks/use-toast";
import LazyImage from "@/components/LazyImage";

type Template = {
  id: string;
  title: string;
  demoUrl?: string;
  price?: string;
  image?: string;
};

type TelegramConfig = {
  botToken: string;
  username: string;
  chatId: string;
};

const readTemplates = (): Template[] => {
  try {
    const raw = localStorage.getItem('portfolio-templates');
    if (!raw) return [];
    const arr = JSON.parse(raw) as any[];
    return arr.map(t => ({ id: t.id, title: t.title, demoUrl: t.demoUrl, price: t.price, image: t.image }));
  } catch {
    return [];
  }
};

// Safe fallback for empty storage (helps on first mobile loads)
const defaultTemplates: Template[] = [
  { id: '1', title: 'Криптобиржа', demoUrl: 'https://example.com/demo1', price: '$1,200', image: '/placeholder.svg' },
  { id: '2', title: 'Корпоративный сайт', demoUrl: 'https://example.com/demo2', price: '$2,500', image: '/placeholder.svg' },
  { id: '3', title: 'Интернет-магазин', demoUrl: 'https://example.com/demo3', price: '$3,200', image: '/placeholder.svg' },
];

const readTelegramConfig = (): TelegramConfig => {
  try {
    const raw = localStorage.getItem('telegram-config');
    if (!raw) return { botToken: '', username: '', chatId: '' };
    return JSON.parse(raw);
  } catch {
    return { botToken: '', username: '', chatId: '' };
  }
};

const Request = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const location = useLocation();
  const [templates, setTemplates] = useState<Template[]>([]);
  const params = useMemo(() => new URLSearchParams(location.search), [location.search]);
  const preselectedId = params.get('templateId') || '';
  const calcParam = params.get('calc') || '';
  const calcFromQuery = useMemo(() => {
    if (!calcParam) return null as null | Record<string, any>;
    try {
      return JSON.parse(decodeURIComponent(calcParam));
    } catch {
      return null;
    }
  }, [calcParam]);

  const [form, setForm] = useState({
    templateId: preselectedId,
    phone: '',
    telegram: '',
    description: '',
  });
  const [submitting, setSubmitting] = useState(false);
  const [pickerOpen, setPickerOpen] = useState(false);
  const [previewByUrl, setPreviewByUrl] = useState<Record<string, string>>({});

  useEffect(() => {
    const existing = readTemplates();
    if (existing.length === 0) {
      try {
        localStorage.setItem('portfolio-templates', JSON.stringify(defaultTemplates));
      } catch {}
      setTemplates(defaultTemplates);
    } else {
      setTemplates(existing);
    }
  }, []);

  // helpers for previews (OG image cache like in portfolio)
  const normalizeUrl = (url?: string) => {
    if (!url) return "";
    return /^(https?:)?\/\//i.test(url) ? url : `https://${url}`;
  };
  const getPreviewImageUrl = (url?: string) => {
    if (!url) return "";
    try {
      const encoded = encodeURIComponent(normalizeUrl(url));
      return `https://v1.screenshot.11ty.dev/${encoded}/opengraph/`;
    } catch {
      return "";
    }
  };

  useEffect(() => {
    const controller = new AbortController();
    const urls = Array.from(new Set(templates.map(t => t.demoUrl).filter(Boolean) as string[]));
    const cachedRaw = localStorage.getItem('portfolio-preview-cache');
    const cached: Record<string, string> = cachedRaw ? (()=>{ try { return JSON.parse(cachedRaw); } catch { return {}; } })() : {};
    if (Object.keys(cached).length) setPreviewByUrl(prev => ({ ...cached, ...prev }));

    const fetchPreview = async (demoUrl: string) => {
      const norm = normalizeUrl(demoUrl);
      if (cached[norm]) return cached[norm];
      try {
        const api = `https://api.microlink.io?url=${encodeURIComponent(norm)}&meta=true&filter=image.url`;
        const res = await fetch(api, { signal: controller.signal });
        const json = await res.json();
        const img = json?.data?.image?.url as string | undefined;
        if (img) return img;
      } catch {}
      try {
        const encoded = encodeURIComponent(norm);
        return `https://v1.screenshot.11ty.dev/${encoded}/opengraph/`;
      } catch { return ""; }
    };

    (async () => {
      if (!urls.length) return;
      const entries = await Promise.all(urls.map(async (u) => [normalizeUrl(u), await fetchPreview(u)] as const));
      const map: Record<string, string> = {};
      for (const [u, v] of entries) { if (v) map[u] = v; }
      if (Object.keys(map).length) {
        setPreviewByUrl(prev => {
          const next = { ...prev, ...map };
          localStorage.setItem('portfolio-preview-cache', JSON.stringify(next));
          return next;
        });
      }
    })();

    return () => controller.abort();
  }, [templates]);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.phone.trim()) {
      toast({ title: 'Введите номер телефона', variant: 'destructive' });
      return;
    }

    // Сборка текста сообщения; отправка будет через серверный эндпоинт

    const selectedTemplate = templates.find(t => t.id === form.templateId);
    const templateLink = selectedTemplate
      ? (selectedTemplate.demoUrl || `${window.location.origin}/portfolio?templateId=${encodeURIComponent(selectedTemplate.id)}`)
      : undefined;
    const messageLines = [
      'Новая заявка на сайт',
      selectedTemplate ? `Шаблон: ${selectedTemplate.title}` : 'Шаблон: не выбран',
      selectedTemplate && templateLink ? `Ссылка: ${templateLink}` : undefined,
      `Телефон: ${form.phone}`,
      form.telegram ? `Telegram: ${form.telegram}` : undefined,
      form.description ? `Описание: ${form.description}` : undefined,
      calcFromQuery ? '--- Калькулятор ---' : undefined,
      calcFromQuery?.websiteType ? `Тип сайта: ${calcFromQuery.websiteType}` : undefined,
      calcFromQuery?.complexity ? `Сложность: ${calcFromQuery.complexity}` : undefined,
      calcFromQuery?.timeline ? `Сроки: ${calcFromQuery.timeline}` : undefined,
      calcFromQuery?.design ? `Дизайн: ${calcFromQuery.design}` : undefined,
      Array.isArray(calcFromQuery?.features) && calcFromQuery.features.length ? `Функции: ${calcFromQuery.features.join(', ')}` : undefined,
      typeof calcFromQuery?.totalPrice === 'number' ? `Итоговая цена: $${calcFromQuery.totalPrice}` : undefined,
    ].filter(Boolean);

    const text = messageLines.join('\n');

    setSubmitting(true);
    try {
      const stored = readTelegramConfig();
      const botToken = (stored.botToken || import.meta.env.VITE_TG_BOT_TOKEN) as string | undefined;
      const chatId = (stored.chatId || import.meta.env.VITE_TG_CHAT_ID) as string | undefined;

      if (!botToken || !chatId) {
        throw new Error('Укажите Bot Token и Chat ID в настройках Telegram (Админ → Telegram).');
      }

      const directUrl = `https://api.telegram.org/bot${botToken}/sendMessage`;
      const tgRes = await fetch(directUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ chat_id: chatId, text }),
      });
      if (!tgRes.ok) {
        let bodyText = '';
        try { bodyText = await tgRes.text(); } catch {}
        throw new Error(`Ошибка Telegram API: ${bodyText || tgRes.status}`);
      }

      toast({ title: 'Заявка отправлена', description: 'Мы скоро свяжемся с вами' });
      navigate('/');
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Ошибка отправки';
      toast({ title: 'Не удалось отправить заявку', description: msg, variant: 'destructive' });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen relative">
      <LiquidBackground />
      <Navigation />

      <div className="pt-32 pb-20 px-6">
        <div className="max-w-3xl mx-auto">
          <div className="glass-card p-8">
            <h1 className="text-3xl md:text-4xl font-bold text-gradient mb-6">Оставить заявку</h1>
            <p className="text-foreground/70 mb-8">Выберите шаблон (необязательно) и оставьте контакты. Мы свяжемся для обсуждения деталей.</p>

            <form onSubmit={submit} className="space-y-6">
              <div className="relative">
                <label className="block text-foreground/80 mb-2 font-medium">Шаблон (необязательно)</label>
                <button
                  type="button"
                  onClick={() => setPickerOpen(v => !v)}
                  className="w-full text-left px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-foreground focus:outline-none focus:border-white/30 hover:bg-white/10 transition-colors"
                >
                  {form.templateId ? (templates.find(t=>t.id===form.templateId)?.title || 'Выбранный шаблон') : '— Не выбирать —'}
                </button>

                <AnimatePresence>
                  {pickerOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 10 }}
                      transition={{ duration: 0.2, ease: [0.16,1,0.3,1] }}
                      className="absolute z-50 mt-2 left-0 right-0 rounded-2xl border border-white/10 bg-background/80 backdrop-blur-xl shadow-xl p-3"
                    >
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-[42vh] overflow-auto pr-1 custom-scroll">
                        {templates.map((t) => {
                          const preview = previewByUrl[normalizeUrl(t.demoUrl)] || getPreviewImageUrl(t.demoUrl) || t.image || '/placeholder.svg';
                          return (
                            <motion.button
                              key={t.id}
                              type="button"
                              onClick={()=>{ setForm(prev=>({...prev, templateId: t.id})); setPickerOpen(false); }}
                              whileHover={{ y: -2 }}
                              className={`text-left rounded-xl overflow-hidden border ${form.templateId===t.id ? 'border-white/30' : 'border-white/10'} bg-white/5 group hover:border-white/20 hover:shadow-[0_10px_30px_rgba(0,0,0,0.35)]`}
                            >
                              <div className="relative h-24">
                                <LazyImage src={preview} alt={t.title} className="w-full h-full" />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
                              </div>
                              <div className="p-2.5 text-center">
                                <div className="text-base sm:text-lg font-semibold text-foreground group-hover:text-gradient transition-colors">{t.title}</div>
                                {t.price && <div className="text-sm sm:text-base text-foreground/70 mt-1">{t.price}</div>}
                              </div>
                            </motion.button>
                          );
                        })}
                        {!templates.length && (
                          <div className="text-sm text-foreground/60">Шаблоны не найдены</div>
                        )}
                      </div>
                      <div className="flex justify-between items-center mt-3">
                        <GlassButton
                          variant="secondary"
                          size="sm"
                          glow
                          className="relative overflow-hidden ring-1 ring-white/15 hover:ring-white/35 [box-shadow:0_0_24px_rgba(255,255,255,0.10)] hover:[box-shadow:0_0_44px_rgba(255,255,255,0.18)] before:content-[''] before:absolute before:inset-[-1px] before:rounded-inherit before:bg-[linear-gradient(135deg,rgba(255,255,255,0.25),rgba(255,255,255,0.08))] before:opacity-0 hover:before:opacity-100 before:transition-opacity"
                          onClick={()=> setPickerOpen(false)}
                        >
                          Закрыть
                        </GlassButton>
                        <GlassButton
                          variant="ghost"
                          size="sm"
                          glow
                          className="relative overflow-hidden ring-1 ring-white/10 hover:ring-white/30 [box-shadow:0_0_22px_rgba(255,255,255,0.08)] hover:[box-shadow:0_0_40px_rgba(255,255,255,0.16)] before:content-[''] before:absolute before:inset-[-1px] before:rounded-inherit before:bg-[radial-gradient(ellipse_at_center,rgba(255,255,255,0.22),rgba(255,255,255,0)_60%)] before:opacity-0 hover:before:opacity-100 before:transition-opacity"
                          onClick={()=>{ setForm(prev=>({...prev, templateId: ''})); setPickerOpen(false); }}
                        >
                          Не выбирать
                        </GlassButton>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              <div>
                <label className="block text-foreground/80 mb-2 font-medium">Номер телефона *</label>
                <input
                  type="tel"
                  required
                  placeholder="+380 99 123 45 67"
                  value={form.phone}
                  onChange={(e) => setForm(prev => ({ ...prev, phone: e.target.value }))}
                  className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-foreground placeholder-foreground/50 focus:outline-none focus:border-white/30"
                />
              </div>

              <div>
                <label className="block text-foreground/80 mb-2 font-medium">Telegram (необязательно)</label>
                <input
                  type="text"
                  placeholder="@username"
                  value={form.telegram}
                  onChange={(e) => setForm(prev => ({ ...prev, telegram: e.target.value }))}
                  className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-foreground placeholder-foreground/50 focus:outline-none focus:border-white/30"
                />
              </div>

              <div>
                <label className="block text-foreground/80 mb-2 font-medium">Описание (необязательно)</label>
                <textarea
                  rows={4}
                  placeholder="Расскажите о задаче, желаемых функциях и сроках"
                  value={form.description}
                  onChange={(e) => setForm(prev => ({ ...prev, description: e.target.value }))}
                  className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-foreground placeholder-foreground/50 focus:outline-none focus:border-white/30 resize-none"
                />
              </div>

              <div className="flex gap-3">
                <GlassButton type="submit" glow disabled={submitting}>
                  {submitting ? 'Отправка…' : 'Отправить заявку'}
                </GlassButton>
                <GlassButton type="button" variant="secondary" onClick={() => navigate(-1)}>Назад</GlassButton>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Request;


