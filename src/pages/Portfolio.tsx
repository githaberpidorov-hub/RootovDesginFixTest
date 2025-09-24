import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Navigation from "@/components/Navigation";
import LiquidBackground from "@/components/LiquidBackground";
import GlassButton from "@/components/GlassButton";
import OptimizedMotion from "@/components/OptimizedMotion";
import LazyImage from "@/components/LazyImage";

interface Template {
  id: string;
  title: string;
  description: string;
  category: string;
  image: string;
  technologies: string[];
  demoUrl?: string;
  price: string;
}

const Portfolio = () => {
  const [templates, setTemplates] = useState<Template[]>([]);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [filteredTemplates, setFilteredTemplates] = useState<Template[]>([]);
  const [previewByUrl, setPreviewByUrl] = useState<Record<string, string>>({});

  const getPreviewImageUrl = (url?: string) => {
    if (!url) return "";
    try {
      const withProtocol = /^(https?:)?\/\//i.test(url) ? url : `https://${url}`;
      const encoded = encodeURIComponent(withProtocol);
      return `https://v1.screenshot.11ty.dev/${encoded}/opengraph/`;
    } catch {
      return "";
    }
  };

  const categories = [
    { id: "all", name: "Все проекты" },
    { id: "landing", name: "Лендинги" },
    { id: "corporate", name: "Корпоративные" },
    { id: "ecommerce", name: "E-commerce" },
    { id: "portfolio", name: "Портфолио" },
  ];

  // Mock data - в реальном проекте это будет из API/базы данных
  const mockTemplates: Template[] = [
    {
      id: "1",
      title: "Криптовалютная биржа",
      description: "Современный лендинг для криптобиржи с интерактивными элементами",
      category: "landing",
      image: "/api/placeholder/600/400",
      technologies: ["React", "TypeScript", "Tailwind CSS"],
      demoUrl: "https://example.com/demo1",
      price: "$1,200",
    },
    {
      id: "2", 
      title: "Корпоративный сайт IT-компании",
      description: "Многостраничный сайт с системой управления контентом",
      category: "corporate",
      image: "/api/placeholder/600/400",
      technologies: ["Next.js", "Prisma", "PostgreSQL"],
      demoUrl: "https://example.com/demo2",
      price: "$2,500",
    },
    {
      id: "3",
      title: "Интернет-магазин одежды",
      description: "Полнофункциональный e-commerce с корзиной и платежами",
      category: "ecommerce",
      image: "/api/placeholder/600/400",
      technologies: ["React", "Stripe", "Node.js"],
      demoUrl: "https://example.com/demo3",
      price: "$3,200",
    },
    {
      id: "4",
      title: "Портфолио дизайнера",
      description: "Минималистичное портфолио с галереей работ",
      category: "portfolio",
      image: "/api/placeholder/600/400",
      technologies: ["Gatsby", "GraphQL", "Styled Components"],
      demoUrl: "https://example.com/demo4",
      price: "$800",
    },
    {
      id: "5",
      title: "Лендинг SaaS продукта",
      description: "Конверсионный лендинг для B2B SaaS решения",
      category: "landing",
      image: "/api/placeholder/600/400",
      technologies: ["Vue.js", "Nuxt.js", "Tailwind CSS"],
      demoUrl: "https://example.com/demo5",
      price: "$1,500",
    },
    {
      id: "6",
      title: "Медицинская клиника",
      description: "Сайт с записью на прием и каталогом услуг",
      category: "corporate",
      image: "/api/placeholder/600/400",
      technologies: ["React", "Firebase", "Material-UI"],
      demoUrl: "https://example.com/demo6",
      price: "$2,100",
    },
  ];

  useEffect(() => {
    // Загрузка шаблонов из localStorage или API
    const savedTemplates = localStorage.getItem('portfolio-templates');
    if (savedTemplates) {
      setTemplates(JSON.parse(savedTemplates));
    } else {
      setTemplates(mockTemplates);
      localStorage.setItem('portfolio-templates', JSON.stringify(mockTemplates));
    }
  }, []);

  // Подтянуть OG-изображение с сайта (если он его предоставляет),
  // иначе fallback на скриншот
  const normalizeUrl = (url?: string) => {
    if (!url) return "";
    return /^(https?:)?\/\//i.test(url) ? url : `https://${url}`;
  };

  useEffect(() => {
    const controller = new AbortController();
    const urls = Array.from(new Set(templates.map(t => t.demoUrl).filter(Boolean) as string[]));

    // восстановить кэш из localStorage
    const cachedRaw = localStorage.getItem('portfolio-preview-cache');
    const cached: Record<string, string> = cachedRaw ? (()=>{ try { return JSON.parse(cachedRaw); } catch { return {}; } })() : {};
    if (Object.keys(cached).length) {
      setPreviewByUrl(prev => ({ ...cached, ...prev }));
    }

    const fetchPreview = async (demoUrl: string) => {
      const norm = normalizeUrl(demoUrl);
      if (cached[norm]) return cached[norm];
      try {
        const api = `https://api.microlink.io?url=${encodeURIComponent(norm)}&meta=true&filter=image.url`;
        const res = await fetch(api, { signal: controller.signal });
        const json = await res.json();
        const img = json?.data?.image?.url as string | undefined;
        if (img) {
          return img;
        }
      } catch {}
      // fallback на скриншот сервиса
      try {
        const encoded = encodeURIComponent(norm);
        return `https://v1.screenshot.11ty.dev/${encoded}/opengraph/`;
      } catch {
        return "";
      }
    };

    (async () => {
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

  useEffect(() => {
    if (selectedCategory === "all") {
      setFilteredTemplates(templates);
    } else {
      setFilteredTemplates(templates.filter(template => template.category === selectedCategory));
    }
  }, [templates, selectedCategory]);

  return (
    <div className="min-h-screen relative">
      <LiquidBackground />
      <Navigation />
      
      {/* Header */}
      <section className="pt-32 pb-16 px-6">
        <div className="max-w-6xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
          >
            <h1 className="text-5xl md:text-7xl font-bold text-gradient text-glow mb-6">
              Наши работы
            </h1>
            <p className="text-xl text-foreground/70 max-w-3xl mx-auto">
              Портфолио выполненных проектов — от лендингов до сложных веб-приложений
            </p>
          </motion.div>
        </div>
      </section>

      {/* Filter Categories */}
      <section className="pb-12 px-6">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}
            className="flex flex-wrap justify-center gap-4"
          >
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className={`px-6 py-3 rounded-2xl border transition-all duration-300 ${
                  selectedCategory === category.id
                    ? 'border-white/30 bg-white/10 text-foreground'
                    : 'border-white/10 hover:border-white/20 hover:bg-white/5 text-foreground/70'
                }`}
              >
                {category.name}
              </button>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Templates Grid */}
      <section className="pb-20 px-6">
        <div className="max-w-6xl mx-auto">
          <AnimatePresence mode="wait">
            <motion.div
              key={selectedCategory}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
            >
              {filteredTemplates.map((template, index) => (
                <OptimizedMotion
                  key={template.id}
                  initial={{ opacity: 0, y: 50 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ 
                    duration: 0.6,
                    ease: [0.16, 1, 0.3, 1],
                    delay: index * 0.1 
                  }}
                  whileHover={{ scale: 1.02, y: -10 }}
                  className="glass-card overflow-hidden group cursor-pointer"
                  mobileOptimized={true}
                >
                  {/* Template Image */}
                  <div className="relative h-48 bg-gradient-to-br from-white/10 to-white/5 overflow-hidden">
                    <div className="absolute inset-0">
                      <LazyImage
                        src={
                          previewByUrl[normalizeUrl(template.demoUrl)]
                          || getPreviewImageUrl(template.demoUrl)
                          || template.image
                          || "/placeholder.svg"
                        }
                        alt={template.title}
                        className="w-full h-full"
                      />
                    </div>
                    <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
                    <div className="absolute top-4 right-4 z-10">
                      <span className="px-3 py-1 rounded-full bg-white/10 backdrop-blur-md text-xs font-medium text-foreground/80 border border-white/10">
                        {categories.find(cat => cat.id === template.category)?.name}
                      </span>
                    </div>
                  </div>

                  {/* Template Info */}
                  <div className="p-6">
                    <h3 className="text-xl font-bold text-foreground mb-2 group-hover:text-gradient transition-all duration-300">
                      {template.title}
                    </h3>
                    <p className="text-foreground/70 text-sm mb-4 leading-relaxed">
                      {template.description}
                    </p>

                    {/* Technologies */}
                    <div className="flex flex-wrap gap-2 mb-4">
                      {template.technologies.map((tech) => (
                        <span
                          key={tech}
                          className="px-2 py-1 rounded-lg bg-white/5 border border-white/10 text-xs text-foreground/60"
                        >
                          {tech}
                        </span>
                      ))}
                    </div>

                    {/* Price and Actions */}
                    <div className="flex justify-between items-center">
                      <span className="text-2xl font-bold text-gradient">
                        {template.price}
                      </span>
                      <div className="flex gap-2">
                        {template.demoUrl && (() => {
                          const href = /^(https?:)?\/\//i.test(template.demoUrl) ? template.demoUrl : `https://${template.demoUrl}`;
                          return (
                            <GlassButton
                              variant="ghost"
                              size="sm"
                              onClick={(e) => { e.stopPropagation(); window.open(href, "_blank", "noopener,noreferrer"); }}
                            >
                              Демо
                            </GlassButton>
                          );
                        })()}
                        <GlassButton size="sm" onClick={(e)=>{ e.stopPropagation(); window.location.href = `/request?templateId=${encodeURIComponent(template.id)}`; }}>
                          Заказать
                        </GlassButton>
                      </div>
                    </div>
                  </div>
                </OptimizedMotion>
              ))}
            </motion.div>
          </AnimatePresence>

          {filteredTemplates.length === 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-20"
            >
              <p className="text-xl text-foreground/60">
                В этой категории пока нет проектов
              </p>
            </motion.div>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="pb-20 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            viewport={{ once: true }}
            className="glass-card p-12"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-gradient mb-6">
              Не нашли подходящий проект?
            </h2>
            <p className="text-xl text-foreground/70 mb-8 max-w-2xl mx-auto">
              Мы создадим уникальный дизайн специально для ваших задач и требований
            </p>
            <div className="flex justify-center">
              <a href="/request">
                <GlassButton size="lg" glow>
                  Заказать индивидуальный проект
                </GlassButton>
              </a>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default Portfolio;