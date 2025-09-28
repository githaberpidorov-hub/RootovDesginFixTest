import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import GlassButton from "./GlassButton";
import OptionCard from "./OptionCard";
import { useLanguage } from "@/hooks/use-language";

interface CalculatorState {
  websiteType: string;
  complexity: string;
  timeline: string;
  features: string[];
  design: string;
}

const PriceCalculator = () => {
  const [calculator, setCalculator] = useState<CalculatorState>({
    websiteType: "",
    complexity: "",
    timeline: "",
    features: [],
    design: "",
  });
  
  const [totalPrice, setTotalPrice] = useState(0);
  const [showResult, setShowResult] = useState(false);
  // Smooth expand/collapse handled by framer's auto height
  const chipsContentRef = useRef<HTMLDivElement | null>(null);
  const [chipsMeasuredHeight, setChipsMeasuredHeight] = useState(0);

  useEffect(() => {
    const el = chipsContentRef.current;
    if (!el) return;
    
    const measureHeight = () => {
      setChipsMeasuredHeight(el.offsetHeight);
    };
    
    if (typeof ResizeObserver !== 'undefined') {
      const ro = new ResizeObserver(measureHeight);
      ro.observe(el);
      return () => ro.disconnect();
    } else {
      // Fallback for browsers without ResizeObserver
      measureHeight();
    }
  }, []);

  const defaultOptions = {
    websiteType: [
      { id: "landing", name: "Лендинг", price: 500, multiplier: 1, priceType: 'fixed' as const },
      { id: "corporate", name: "Корпоративный сайт", price: 1200, multiplier: 1, priceType: 'fixed' as const },
      { id: "ecommerce", name: "Интернет-магазин", price: 2500, multiplier: 1, priceType: 'fixed' as const },
      { id: "portfolio", name: "Портфолио", price: 800, multiplier: 1, priceType: 'fixed' as const },
      { id: "blog", name: "Блог/СМИ", price: 1000, multiplier: 1, priceType: 'fixed' as const },
    ],
    complexity: [
      { id: "simple", name: "Простой", price: 0, multiplier: 1, priceType: 'multiplier' as const },
      { id: "medium", name: "Средний", price: 0, multiplier: 1.5, priceType: 'multiplier' as const },
      { id: "complex", name: "Сложный", price: 0, multiplier: 2.2, priceType: 'multiplier' as const },
    ],
    timeline: [
      { id: "urgent", name: "Срочно (1-2 недели)", price: 0, multiplier: 1.8, priceType: 'multiplier' as const },
      { id: "normal", name: "Обычно (3-4 недели)", price: 0, multiplier: 1, priceType: 'multiplier' as const },
      { id: "flexible", name: "Не горит (1-2 месяца)", price: 0, multiplier: 0.8, priceType: 'multiplier' as const },
    ],
    features: [
      { id: "cms", name: "Система управления", price: 300, multiplier: 1, priceType: 'fixed' as const },
      { id: "seo", name: "SEO оптимизация", price: 400, multiplier: 1, priceType: 'fixed' as const },
      { id: "analytics", name: "Аналитика", price: 200, multiplier: 1, priceType: 'fixed' as const },
      { id: "mobile", name: "Мобильная версия", price: 500, multiplier: 1, priceType: 'fixed' as const },
      { id: "multilang", name: "Многоязычность", price: 600, multiplier: 1, priceType: 'fixed' as const },
      { id: "integration", name: "Интеграции", price: 800, multiplier: 1, priceType: 'fixed' as const },
    ],
    design: [
      { id: "template", name: "На основе шаблона", price: 0, multiplier: 0.7, priceType: 'multiplier' as const },
      { id: "custom", name: "Индивидуальный дизайн", price: 0, multiplier: 1, priceType: 'multiplier' as const },
      { id: "premium", name: "Premium дизайн", price: 0, multiplier: 1.4, priceType: 'multiplier' as const },
    ],
  } as const;

  type CalculatorOptions = typeof defaultOptions;

  const [options, setOptions] = useState<CalculatorOptions>(defaultOptions);
  const { t, language } = useLanguage();

  useEffect(() => {
    // Загружаем конфиг калькулятора по выбранному языку
    const load = async () => {
      try {
        const res = await fetch(`/api/calculator?language=${language}`);
        const j = await res.json();
        if (res.ok && j?.ok && j.config) {
          const cfg = j.config as Record<string, any>;

          const normalizeGroup = (group: any, defaultPriceType: 'fixed' | 'multiplier' = 'fixed') => {
            if (!group) return [] as Array<{ id: string; name: string; price: number; multiplier: number; priceType: 'fixed' | 'multiplier' }>;
            const entries = Array.isArray(group)
              ? (group as any[]).map((val, idx) => [String(val?.id ?? idx), val] as const)
              : Object.entries(group as Record<string, any>);
            return entries.map(([id, value]) => ({ 
              id, 
              name: value?.label || value?.name || id, 
              price: Number(value?.price || 0),
              multiplier: Number(value?.multiplier || 1),
              priceType: value?.priceType || defaultPriceType
            }));
          };

          const next: CalculatorOptions = {
            websiteType: normalizeGroup(cfg[`website_type_${String(language).toLowerCase()}`], 'fixed').map(o => ({ ...o, icon: '⚡' })) as any,
            complexity: normalizeGroup(cfg[`complexity_${String(language).toLowerCase()}`], 'multiplier').map(o => ({ ...o, icon: '🤓' })) as any,
            timeline: normalizeGroup(cfg[`timeline_${String(language).toLowerCase()}`], 'multiplier').map(o => ({ ...o, icon: '📆' })) as any,
            features: normalizeGroup(cfg[`features_${String(language).toLowerCase()}`], 'fixed').map(o => ({ ...o, icon: '🔗' })) as any,
            design: normalizeGroup(cfg[`design_${String(language).toLowerCase()}`], 'multiplier').map(o => ({ ...o, icon: '🧩' })) as any,
          };

          setOptions(next);
          try { localStorage.setItem('calculator-options', JSON.stringify(next)); } catch {}
          return;
        }
      } catch {}

      // Фолбэк на локальное хранилище
      const saved = localStorage.getItem('calculator-options');
      if (saved) {
        try {
          const parsed = JSON.parse(saved);
          setOptions({ ...defaultOptions, ...parsed });
          return;
        } catch {}
      }
      // Иначе дефолт
      setOptions(defaultOptions);
    };
    load();
  }, [language]);

  useEffect(() => {
    // Only calculate if options are loaded and not empty
    if (options.websiteType.length > 0) {
      calculatePrice();
    }
  }, [calculator, options]);

  const calculatePrice = () => {
    let basePrice = 0;
    let multiplier = 1;
    let additionalFeatures = 0;

    // Base price from website type
    const websiteTypeOption = options.websiteType.find(opt => opt.id === calculator.websiteType);
    if (websiteTypeOption) {
      if (websiteTypeOption.priceType === 'fixed') {
        basePrice = websiteTypeOption.price as number;
      } else {
        // Если website type - множитель, то он влияет на общий множитель
        multiplier *= Number((websiteTypeOption as any)?.multiplier ?? 1);
      }
    }

    // Complexity
    const complexityOption = options.complexity.find(opt => opt.id === calculator.complexity);
    if (complexityOption) {
      if (complexityOption.priceType === 'fixed') {
        additionalFeatures += Number((complexityOption as any)?.price ?? 0);
      } else {
        multiplier *= Number((complexityOption as any)?.multiplier ?? 1);
      }
    }

    // Timeline
    const timelineOption = options.timeline.find(opt => opt.id === calculator.timeline);
    if (timelineOption) {
      if (timelineOption.priceType === 'fixed') {
        additionalFeatures += Number((timelineOption as any)?.price ?? 0);
      } else {
        multiplier *= Number((timelineOption as any)?.multiplier ?? 1);
      }
    }

    // Design
    const designOption = options.design.find(opt => opt.id === calculator.design);
    if (designOption) {
      if (designOption.priceType === 'fixed') {
        additionalFeatures += Number((designOption as any)?.price ?? 0);
      } else {
        multiplier *= Number((designOption as any)?.multiplier ?? 1);
      }
    }

    // Additional features
    calculator.features.forEach(featureId => {
      const feature = options.features.find(opt => opt.id === featureId);
      if (feature) {
        if (feature.priceType === 'fixed') {
          additionalFeatures += Number((feature as any).price ?? 0);
        } else {
          // Если feature - множитель, то он влияет на общий множитель
          multiplier *= Number((feature as any)?.multiplier ?? 1);
        }
      }
    });

    const total = Math.round((basePrice * multiplier) + additionalFeatures);
    setTotalPrice(total);
    setShowResult(total > 0);
  };

  const handleOptionSelect = (category: keyof CalculatorState, value: string) => {
    if (category === 'features') {
      const currentFeatures = calculator.features as string[];
      const updatedFeatures = currentFeatures.includes(value)
        ? currentFeatures.filter(f => f !== value)
        : [...currentFeatures, value];
      setCalculator(prev => ({ ...prev, features: updatedFeatures }));
    } else {
      // Allow deselecting the same option by toggling back to empty value
      const currentValue = calculator[category] as string;
      const nextValue = currentValue === value ? "" : value;
      setCalculator(prev => ({ ...prev, [category]: nextValue }));
    }
  };

  const totalSteps = 5;
  const completedSteps = [
    calculator.websiteType,
    calculator.complexity,
    calculator.timeline,
    calculator.design,
    (calculator.features.length ? "features" : "")
  ].filter(Boolean).length;
  const progress = Math.round((completedSteps / totalSteps) * 100);

  // Build link to request page with encoded calculator summary
  const buildRequestHref = () => {
    try {
      const selected = {
        websiteType: options.websiteType.find(o => o.id === calculator.websiteType)?.name,
        complexity: options.complexity.find(o => o.id === calculator.complexity)?.name,
        timeline: options.timeline.find(o => o.id === calculator.timeline)?.name,
        design: options.design.find(o => o.id === calculator.design)?.name,
        features: calculator.features.map(fid => options.features.find(o => o.id === fid)?.name).filter(Boolean),
        totalPrice,
      } as Record<string, any>;
      const json = JSON.stringify(selected);
      const encoded = encodeURIComponent(json);
      return `/request?calc=${encoded}`;
    } catch {
      return "/request";
    }
  };

  const SummaryChip = ({ label, onRemove }: { label: string; onRemove?: () => void }) => (
    <motion.div
      initial={false}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.98 }}
      transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
      className="flex items-center gap-2 px-3 py-1.5 rounded-full border border-white/10 bg-white/5 text-sm text-foreground/80 shadow-[inset_0_0_0_1px_rgba(255,255,255,0.04)] whitespace-nowrap"
    >
      <span>{label}</span>
      {onRemove && (
        <button
          aria-label="Удалить"
          onClick={onRemove}
          className="text-foreground/60 hover:text-foreground/90 transition-colors"
        >
          ×
        </button>
      )}
    </motion.div>
  );


  return (
    <section className="calculator-section py-12 px-6">
      <div className="max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          viewport={{ once: true }}
          className="text-center mb-16 pb-8"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-gradient mb-8 leading-tight py-2">
            {t.calculatorUi.title}
          </h2>
          <p className="text-lg md:text-xl text-foreground/70 max-w-2xl mx-auto leading-relaxed py-2">
            {t.calculatorUi.subtitle}
          </p>
        </motion.div>

        {/* Progress */}
        <div className="glass-card p-5 mb-8">
          <div className="flex items-center justify-between mb-2 text-sm text-foreground/70">
            <span>{t.calculatorUi.filled}</span>
            <span>{progress}%</span>
          </div>
          <div className="progress-track h-2 rounded-full bg-white/10 overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ 
                duration: 0.8, 
                ease: [0.23, 1, 0.32, 1],
                type: "tween"
              }}
              className="progress-fill h-full rounded-full"
            />
          </div>
        </div>

        <div className="glass-card p-8 md:p-12">
          <div className="space-y-12">
            {/* Website Type */}
            <div>
              <h3 className="text-2xl font-semibold mb-6 text-foreground">{t.calculatorUi.websiteType}</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {options.websiteType.map((option) => (
                  <OptionCard
                    key={`websiteType-${option.id}`}
                    optionId={option.id}
                    category="websiteType"
                    isActive={calculator.websiteType === option.id}
                    onClick={() => handleOptionSelect('websiteType', option.id)}
                    headline={option.name as string}
                    subline={option.priceType === 'fixed' 
                      ? `${t.calculatorUi.fromPrefix}${(option as any).price}` 
                      : `${t.calculatorUi.multiplyPrefix}${(option as any).multiplier}`
                    }
                  />
                ))}
              </div>
            </div>

            {/* Complexity */}
            <div>
              <h3 className="text-2xl font-semibold mb-6 text-foreground">{t.calculatorUi.complexity}</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {options.complexity.map((option) => (
                  <OptionCard
                    key={`complexity-${option.id}`}
                    optionId={option.id}
                    category="complexity"
                    isActive={calculator.complexity === option.id}
                    onClick={() => handleOptionSelect('complexity', option.id)}
                    headline={option.name as string}
                    subline={option.priceType === 'fixed' 
                      ? `${t.calculatorUi.plusPrefix}${(option as any).price}` 
                      : `${t.calculatorUi.multiplyPrefix}${(option as any).multiplier}`
                    }
                  />
                ))}
              </div>
            </div>

            {/* Timeline */}
            <div>
              <h3 className="text-2xl font-semibold mb-6 text-foreground">{t.calculatorUi.timeline}</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {options.timeline.map((option) => (
                  <OptionCard
                    key={`timeline-${option.id}`}
                    optionId={option.id}
                    category="timeline"
                    isActive={calculator.timeline === option.id}
                    onClick={() => handleOptionSelect('timeline', option.id)}
                    headline={option.name as string}
                    subline={option.priceType === 'fixed' 
                      ? `${t.calculatorUi.plusPrefix}${(option as any).price}` 
                      : `${t.calculatorUi.multiplyPrefix}${(option as any).multiplier}`
                    }
                  />
                ))}
              </div>
            </div>

            {/* Features */}
            <div>
              <h3 className="text-2xl font-semibold mb-6 text-foreground">{t.calculatorUi.features}</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {options.features.map((option) => (
                  <OptionCard
                    key={`features-${option.id}`}
                    optionId={option.id}
                    category="features"
                    isActive={calculator.features.includes(option.id)}
                    onClick={() => handleOptionSelect('features', option.id)}
                    headline={option.name as string}
                    subline={option.priceType === 'fixed' 
                      ? `${t.calculatorUi.plusPrefix}${(option as any).price}` 
                      : `${t.calculatorUi.multiplyPrefix}${(option as any).multiplier}`
                    }
                  />
                ))}
              </div>
            </div>

            {/* Design */}
            <div>
              <h3 className="text-2xl font-semibold mb-6 text-foreground">{t.calculatorUi.design}</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {options.design.map((option) => (
                  <OptionCard
                    key={`design-${option.id}`}
                    optionId={option.id}
                    category="design"
                    isActive={calculator.design === option.id}
                    onClick={() => handleOptionSelect('design', option.id)}
                    headline={option.name as string}
                    subline={option.priceType === 'fixed' 
                      ? `${t.calculatorUi.plusPrefix}${(option as any).price}` 
                      : `${t.calculatorUi.multiplyPrefix}${(option as any).multiplier}`
                    }
                  />
                ))}
              </div>
            </div>
          </div>

          {/* Summary chips */}
          <div className="mt-10 relative" style={{ contain: 'layout style' }}>
            {/* Height spacer controls layout without clipping content */}
            <motion.div
              aria-hidden
              initial={false}
              animate={{ height: completedSteps > 0 ? (chipsMeasuredHeight || 0) : 0, marginTop: completedSteps > 0 ? 8 : 0, marginBottom: completedSteps > 0 ? 8 : 0 }}
              transition={{ height: { duration: 0.34, ease: 'linear' }, marginTop: { duration: 0.34, ease: 'linear' }, marginBottom: { duration: 0.34, ease: 'linear' } }}
              style={{ height: 0 }}
            />
            {/* Actual content overlays the spacer, so it never gets clipped */}
            <div ref={chipsContentRef} className="absolute inset-x-0 top-0 z-10 pointer-events-auto" style={{ overflow: 'visible' }}>
              <motion.div
                className="flex flex-wrap gap-2"
                initial={false}
                animate={{ opacity: completedSteps > 0 ? 1 : 0, scaleY: completedSteps > 0 ? 1 : 0.98 }}
                transition={{ duration: 0.24, ease: [0.22, 1, 0.36, 1] }}
                style={{ transformOrigin: 'top', overflow: 'visible' }}
              >
                {/* One AnimatePresence per chip group to ensure exit/enter on replacement */}
                <AnimatePresence mode="popLayout">
                  {calculator.websiteType && (
                    <motion.div
                      key={`websiteType-${calculator.websiteType}`}
                      layout
                      initial={{ opacity: 0, scale: 0.8, y: 10 }}
                      animate={{ opacity: 1, scale: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.85, y: 10 }}
                      transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                    >
                      <SummaryChip label={(options.websiteType.find(o=>o.id===calculator.websiteType)?.name as string) || ''} onRemove={() => handleOptionSelect('websiteType', calculator.websiteType)} />
                    </motion.div>
                  )}
                </AnimatePresence>

                <AnimatePresence mode="popLayout">
                  {calculator.complexity && (
                    <motion.div
                      key={`complexity-${calculator.complexity}`}
                      layout
                      initial={{ opacity: 0, scale: 0.8, y: 10 }}
                      animate={{ opacity: 1, scale: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.85, y: 10 }}
                      transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                    >
                      <SummaryChip label={(options.complexity.find(o=>o.id===calculator.complexity)?.name as string) || ''} onRemove={() => handleOptionSelect('complexity', calculator.complexity)} />
                    </motion.div>
                  )}
                </AnimatePresence>

                <AnimatePresence mode="popLayout">
                  {calculator.timeline && (
                    <motion.div
                      key={`timeline-${calculator.timeline}`}
                      layout
                      initial={{ opacity: 0, scale: 0.8, y: 10 }}
                      animate={{ opacity: 1, scale: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.85, y: 10 }}
                      transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                    >
                      <SummaryChip label={(options.timeline.find(o=>o.id===calculator.timeline)?.name as string) || ''} onRemove={() => handleOptionSelect('timeline', calculator.timeline)} />
                    </motion.div>
                  )}
                </AnimatePresence>

                <AnimatePresence mode="popLayout">
                  {calculator.design && (
                    <motion.div
                      key={`design-${calculator.design}`}
                      layout
                      initial={{ opacity: 0, scale: 0.8, y: 10 }}
                      animate={{ opacity: 1, scale: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.85, y: 10 }}
                      transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                    >
                      <SummaryChip label={(options.design.find(o=>o.id===calculator.design)?.name as string) || ''} onRemove={() => handleOptionSelect('design', calculator.design)} />
                    </motion.div>
                  )}
                </AnimatePresence>

                <AnimatePresence mode="popLayout">
                  {calculator.features.map((fid) => (
                    <motion.div
                      key={`feature-${fid}`}
                      layout
                      initial={{ opacity: 0, scale: 0.8, y: 10 }}
                      animate={{ opacity: 1, scale: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.85, y: 10 }}
                      transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                    >
                      <SummaryChip label={(options.features.find(o=>o.id===fid)?.name as string) || ''} onRemove={() => handleOptionSelect('features', fid)} />
                    </motion.div>
                  ))}
                </AnimatePresence>
              </motion.div>
            </div>
          </div>

          {/* Result */}
          <div className="mt-12">
            <AnimatePresence initial={false} mode="wait">
              {showResult && (
                <motion.div
                  initial={{ opacity: 0, height: 0, clipPath: 'inset(0% 0% 100% 0%)' }}
                  animate={{ opacity: 1, height: 'auto', clipPath: 'inset(0% 0% 0% 0%)' }}
                  exit={{ opacity: 0, height: 0, clipPath: 'inset(0% 0% 100% 0%)' }}
                  transition={{
                    opacity: { duration: 0.22, ease: 'linear' },
                    height: { duration: 0.34, ease: 'linear' },
                    clipPath: { duration: 0.34, ease: 'linear' },
                  }}
                style={{ overflow: 'hidden', willChange: 'height, opacity, clip-path' }}
              >
                <div className="relative py-10 md:py-14">
                  {/* Top divider */}
                  <div className="absolute top-0 left-0 right-0 h-px bg-white/10" />
                  <div className="relative z-10 text-center">
                    <motion.div 
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3, delay: 0.05 }}
                      className="text-2xl text-foreground/70 mb-2"
                    >
                      {t.calculatorUi.estimatedPrice}
                    </motion.div>
                    {/* Price wrapper with fixed height to prevent layout shift */}
                    <div className="relative mb-8 h-16 md:h-20">
                      <motion.div
                        initial={false}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                        className="absolute inset-0 flex items-center justify-center"
                      >
                        <AnimatePresence mode="wait">
                          <motion.div 
                            key={totalPrice}
                            initial={{ scale: 0.95, opacity: 0, y: 6 }}
                            animate={{ scale: 1, opacity: 1, y: 0 }}
                            exit={{ scale: 0.98, opacity: 0, y: -4 }}
                            transition={{ 
                              duration: 0.15, 
                              ease: [0.3, 0.7, 0.3, 1],
                              type: "tween"
                            }}
                            className="text-6xl font-bold text-gradient"
                          >
                            ${totalPrice.toLocaleString()}
                          </motion.div>
                        </AnimatePresence>
                      </motion.div>
                    </div>
                    <motion.div 
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3, delay: 0.1 }}
                      className="flex justify-center"
                    >
                      <a href={buildRequestHref()}>
                        <GlassButton size="lg" glow>
                          {t.calculatorUi.consultCta}
                        </GlassButton>
                      </a>
                    </motion.div>
                  </div>
                </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PriceCalculator;