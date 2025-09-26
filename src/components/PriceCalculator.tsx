import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence, LayoutGroup, useAnimation } from "framer-motion";
import GlassButton from "./GlassButton";
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
      { id: "landing", name: "Лендинг", price: 500, icon: "⚡" },
      { id: "corporate", name: "Корпоративный сайт", price: 1200, icon: "🏢" },
      { id: "ecommerce", name: "Интернет-магазин", price: 2500, icon: "🛒" },
      { id: "portfolio", name: "Портфолио", price: 800, icon: "🎨" },
      { id: "blog", name: "Блог/СМИ", price: 1000, icon: "📰" },
    ],
    complexity: [
      { id: "simple", name: "Простой", multiplier: 1, icon: "🙂" },
      { id: "medium", name: "Средний", multiplier: 1.5, icon: "🤓" },
      { id: "complex", name: "Сложный", multiplier: 2.2, icon: "🧠" },
    ],
    timeline: [
      { id: "urgent", name: "Срочно (1-2 недели)", multiplier: 1.8, icon: "🚀" },
      { id: "normal", name: "Обычно (3-4 недели)", multiplier: 1, icon: "📆" },
      { id: "flexible", name: "Не горит (1-2 месяца)", multiplier: 0.8, icon: "🧘" },
    ],
    features: [
      { id: "cms", name: "Система управления", price: 300, icon: "⚙️" },
      { id: "seo", name: "SEO оптимизация", price: 400, icon: "🔍" },
      { id: "analytics", name: "Аналитика", price: 200, icon: "📈" },
      { id: "mobile", name: "Мобильная версия", price: 500, icon: "📱" },
      { id: "multilang", name: "Многоязычность", price: 600, icon: "🌍" },
      { id: "integration", name: "Интеграции", price: 800, icon: "🔗" },
    ],
    design: [
      { id: "template", name: "На основе шаблона", multiplier: 0.7, icon: "🧩" },
      { id: "custom", name: "Индивидуальный дизайн", multiplier: 1, icon: "✏️" },
      { id: "premium", name: "Premium дизайн", multiplier: 1.4, icon: "💎" },
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

          const normalizePrice = (group: any) => {
            if (!group) return [] as Array<{ id: string; name: string; price: number }>;
            const entries = Array.isArray(group)
              ? (group as any[]).map((val, idx) => [String(val?.id ?? idx), val] as const)
              : Object.entries(group as Record<string, any>);
            return entries.map(([id, value]) => ({ id, name: value?.label || value?.name || id, price: Number(value?.price || 0) }));
          };
          const normalizeMult = (group: any) => {
            if (!group) return [] as Array<{ id: string; name: string; multiplier: number }>;
            const entries = Array.isArray(group)
              ? (group as any[]).map((val, idx) => [String(val?.id ?? idx), val] as const)
              : Object.entries(group as Record<string, any>);
            return entries.map(([id, value]) => ({ id, name: value?.label || value?.name || id, multiplier: Number(value?.multiplier || 1) }));
          };

          const next: CalculatorOptions = {
            websiteType: normalizePrice(cfg[`website_type_${String(language).toLowerCase()}`]).map(o => ({ ...o, icon: '⚡' })) as any,
            complexity: normalizeMult(cfg[`complexity_${String(language).toLowerCase()}`]).map(o => ({ ...o, icon: '🤓' })) as any,
            timeline: normalizeMult(cfg[`timeline_${String(language).toLowerCase()}`]).map(o => ({ ...o, icon: '📆' })) as any,
            features: normalizePrice(cfg[`features_${String(language).toLowerCase()}`]).map(o => ({ ...o, icon: '🔗' })) as any,
            design: normalizeMult(cfg[`design_${String(language).toLowerCase()}`]).map(o => ({ ...o, icon: '🧩' })) as any,
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
      basePrice = websiteTypeOption.price as number;
    }

    // Complexity multiplier
    const complexityOption = options.complexity.find(opt => opt.id === calculator.complexity);
    multiplier *= Number((complexityOption as any)?.multiplier ?? 1);

    // Timeline multiplier
    const timelineOption = options.timeline.find(opt => opt.id === calculator.timeline);
    multiplier *= Number((timelineOption as any)?.multiplier ?? 1);

    // Design multiplier
    const designOption = options.design.find(opt => opt.id === calculator.design);
    multiplier *= Number((designOption as any)?.multiplier ?? 1);

    // Additional features
    calculator.features.forEach(featureId => {
      const feature = options.features.find(opt => opt.id === featureId);
      if (feature) {
        additionalFeatures += Number((feature as any).price ?? 0);
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

  const OptionCard = ({
    active,
    headline,
    subline,
    icon,
    onClick,
    category,
    enableSharedActiveBg = false,
  }: {
    active: boolean;
    headline: string;
    subline?: string;
    icon?: string;
    onClick: () => void;
    category: keyof CalculatorState;
    enableSharedActiveBg?: boolean;
  }) => {
    return (
    <motion.button
      initial={false}
      onClick={onClick}
      animate={{ 
        scale: active ? 1.01 : 1,
        opacity: active ? 1 : 0.9 
      }}
      transition={{ 
        duration: 0.3,
        ease: [0.25, 0.8, 0.25, 1]
      }}
      className={`option-card relative p-4 rounded-2xl border overflow-hidden group transition-colors transition-shadow duration-500 ease-out ${
        active
          ? 'option-card--active border-white/30 bg-white/10 shadow-[0_12px_40px_rgba(0,0,0,0.35)]'
          : 'border-white/10 hover:border-white/20 hover:bg-white/5'
      }`}
      style={{ willChange: 'transform, background, box-shadow' }}
    >
      {/* Removed shared moving background to prevent sweeping stripe */}
      {/* Shared moving highlight for active card (state-driven, no remount) */}
      <motion.div
        className="absolute inset-0 rounded-2xl"
        initial={false}
        animate={{ opacity: active ? 1 : 0 }}
        transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1], type: 'tween' }}
        style={{
          background:
            'radial-gradient(120% 120% at 50% 50%, rgba(255,255,255,0.06) 0%, rgba(255,255,255,0.03) 55%, rgba(255,255,255,0.00) 80%)'
        }}
      />

      {/* Accent gradient ring */}
      <div
        className={`option-card__ring pointer-events-none absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity ${
          active ? 'opacity-100' : ''
        }`}
        style={{
          background:
            'radial-gradient(60% 60% at 20% 0%, rgba(255,255,255,0.10) 0%, rgba(255,255,255,0) 60%)'
        }}
      />

      <div className="relative z-10 flex items-center gap-3 text-left">
        <motion.div
          className={`option-card__icon w-10 h-10 rounded-xl flex items-center justify-center shrink-0 transition-colors transition-shadow duration-500 ease-out ${
            active ? 'bg-white/15' : 'bg-white/5'
          }`}
          initial={false}
          animate={{ 
            scale: active ? 1.05 : 1, 
            opacity: active ? 1 : 0.7 
          }}
          transition={{ 
            duration: 0.8,
            ease: [0.25, 0.8, 0.25, 1]
          }}
        >
          {icon && (
            <motion.span
              aria-hidden="true"
              initial={false}
              animate={{ scale: active ? 1.1 : 1 }}
              transition={{ 
                duration: 0.8,
                ease: [0.25, 0.8, 0.25, 1]
              }}
            >
              {icon}
            </motion.span>
          )}
        </motion.div>
            <div>
          <motion.div
            className="font-medium text-foreground"
            initial={false}
                animate={{ y: active ? -0.2 : 0, opacity: 1 }}
                transition={{ duration: 0.18, ease: [0.22, 1, 0.36, 1] }}
          >
            {headline}
          </motion.div>
          {subline && (
            <motion.div
              className="text-sm text-foreground/60"
              initial={{ opacity: 0.85 }}
              animate={{ opacity: active ? 1 : 0.85 }}
              transition={{ duration: 0.25 }}
            >
              {subline}
            </motion.div>
          )}
        </div>
      </div>

      {/* Removed shine overlay to avoid occasional sweeping stripe */}
    </motion.button>
  );
  }

  return (
    <section className="calculator-section py-32 px-6">
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
              <LayoutGroup id="websiteType">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {options.websiteType.map((option) => (
                    <OptionCard
                      key={option.id}
                      active={calculator.websiteType === option.id}
                      onClick={() => handleOptionSelect('websiteType', option.id)}
                      icon={(option as any).icon}
                      headline={option.name as string}
                      subline={`${t.calculatorUi.fromPrefix}${(option as any).price}`}
                      category={'websiteType'}
                    />
                  ))}
                </div>
              </LayoutGroup>
            </div>

            {/* Complexity */}
            <div>
              <h3 className="text-2xl font-semibold mb-6 text-foreground">{t.calculatorUi.complexity}</h3>
              <LayoutGroup id="complexity">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {options.complexity.map((option) => (
                    <OptionCard
                      key={option.id}
                      active={calculator.complexity === option.id}
                      onClick={() => handleOptionSelect('complexity', option.id)}
                      icon={(option as any).icon}
                      headline={option.name as string}
                      subline={`${t.calculatorUi.multiplyPrefix}${(option as any).multiplier}`}
                      category={'complexity'}
                    />
                  ))}
                </div>
              </LayoutGroup>
            </div>

            {/* Timeline */}
            <div>
              <h3 className="text-2xl font-semibold mb-6 text-foreground">{t.calculatorUi.timeline}</h3>
              <LayoutGroup id="timeline">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {options.timeline.map((option) => (
                    <OptionCard
                      key={option.id}
                      active={calculator.timeline === option.id}
                      onClick={() => handleOptionSelect('timeline', option.id)}
                      icon={(option as any).icon}
                      headline={option.name as string}
                      subline={`${t.calculatorUi.multiplyPrefix}${(option as any).multiplier}`}
                      category={'timeline'}
                    />
                  ))}
                </div>
              </LayoutGroup>
            </div>

            {/* Features */}
            <div>
              <h3 className="text-2xl font-semibold mb-6 text-foreground">{t.calculatorUi.features}</h3>
              <LayoutGroup id="features">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {options.features.map((option) => (
                    <OptionCard
                      key={option.id}
                      active={calculator.features.includes(option.id)}
                      onClick={() => handleOptionSelect('features', option.id)}
                      icon={(option as any).icon}
                      headline={option.name as string}
                      subline={`${t.calculatorUi.plusPrefix}${(option as any).price}`}
                      category={'features'}
                      enableSharedActiveBg={false}
                    />
                  ))}
                </div>
              </LayoutGroup>
            </div>

            {/* Design */}
            <div>
              <h3 className="text-2xl font-semibold mb-6 text-foreground">{t.calculatorUi.design}</h3>
              <LayoutGroup id="design">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {options.design.map((option) => (
                    <OptionCard
                      key={option.id}
                      active={calculator.design === option.id}
                      onClick={() => handleOptionSelect('design', option.id)}
                      icon={(option as any).icon}
                      headline={option.name as string}
                      subline={`${t.calculatorUi.multiplyPrefix}${(option as any).multiplier}`}
                      category={'design'}
                    />
                  ))}
                </div>
              </LayoutGroup>
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
                      transition={{ duration: 0.5, delay: 0.1 }}
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
                      transition={{ duration: 0.5, delay: 0.6 }}
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