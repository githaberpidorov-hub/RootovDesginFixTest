import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import GlassButton from "./GlassButton";

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

  const options = {
    websiteType: [
      { id: "landing", name: "Лендинг", price: 500 },
      { id: "corporate", name: "Корпоративный сайт", price: 1200 },
      { id: "ecommerce", name: "Интернет-магазин", price: 2500 },
      { id: "portfolio", name: "Портфолио", price: 800 },
      { id: "blog", name: "Блог/СМИ", price: 1000 },
    ],
    complexity: [
      { id: "simple", name: "Простой", multiplier: 1 },
      { id: "medium", name: "Средний", multiplier: 1.5 },
      { id: "complex", name: "Сложный", multiplier: 2.2 },
    ],
    timeline: [
      { id: "urgent", name: "Срочно (1-2 недели)", multiplier: 1.8 },
      { id: "normal", name: "Обычно (3-4 недели)", multiplier: 1 },
      { id: "flexible", name: "Не горит (1-2 месяца)", multiplier: 0.8 },
    ],
    features: [
      { id: "cms", name: "Система управления", price: 300 },
      { id: "seo", name: "SEO оптимизация", price: 400 },
      { id: "analytics", name: "Аналитика", price: 200 },
      { id: "mobile", name: "Мобильная версия", price: 500 },
      { id: "multilang", name: "Многоязычность", price: 600 },
      { id: "integration", name: "Интеграции", price: 800 },
    ],
    design: [
      { id: "template", name: "На основе шаблона", multiplier: 0.7 },
      { id: "custom", name: "Индивидуальный дизайн", multiplier: 1 },
      { id: "premium", name: "Premium дизайн", multiplier: 1.4 },
    ],
  };

  useEffect(() => {
    calculatePrice();
  }, [calculator]);

  const calculatePrice = () => {
    let basePrice = 0;
    let multiplier = 1;
    let additionalFeatures = 0;

    // Base price from website type
    const websiteTypeOption = options.websiteType.find(opt => opt.id === calculator.websiteType);
    if (websiteTypeOption) {
      basePrice = websiteTypeOption.price;
    }

    // Complexity multiplier
    const complexityOption = options.complexity.find(opt => opt.id === calculator.complexity);
    if (complexityOption) {
      multiplier *= complexityOption.multiplier;
    }

    // Timeline multiplier
    const timelineOption = options.timeline.find(opt => opt.id === calculator.timeline);
    if (timelineOption) {
      multiplier *= timelineOption.multiplier;
    }

    // Design multiplier
    const designOption = options.design.find(opt => opt.id === calculator.design);
    if (designOption) {
      multiplier *= designOption.multiplier;
    }

    // Additional features
    calculator.features.forEach(featureId => {
      const feature = options.features.find(opt => opt.id === featureId);
      if (feature) {
        additionalFeatures += feature.price;
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
      setCalculator(prev => ({ ...prev, [category]: value }));
    }
  };

  return (
    <section className="py-20 px-6">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-gradient mb-6">
            Калькулятор стоимости
          </h2>
          <p className="text-xl text-foreground/70 max-w-2xl mx-auto">
            Узнайте примерную стоимость вашего проекта за несколько кликов
          </p>
        </motion.div>

        <div className="glass-card p-8 md:p-12">
          <div className="space-y-12">
            {/* Website Type */}
            <div>
              <h3 className="text-2xl font-semibold mb-6 text-foreground">Тип сайта</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {options.websiteType.map((option) => (
                  <motion.button
                    key={option.id}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => handleOptionSelect('websiteType', option.id)}
                    className={`p-4 rounded-2xl border transition-all duration-300 ${
                      calculator.websiteType === option.id
                        ? 'border-white/30 bg-white/10'
                        : 'border-white/10 hover:border-white/20 hover:bg-white/5'
                    }`}
                  >
                    <div className="text-left">
                      <div className="font-medium text-foreground">{option.name}</div>
                      <div className="text-sm text-foreground/60">от ${option.price}</div>
                    </div>
                  </motion.button>
                ))}
              </div>
            </div>

            {/* Complexity */}
            <div>
              <h3 className="text-2xl font-semibold mb-6 text-foreground">Сложность</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {options.complexity.map((option) => (
                  <motion.button
                    key={option.id}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => handleOptionSelect('complexity', option.id)}
                    className={`p-4 rounded-2xl border transition-all duration-300 ${
                      calculator.complexity === option.id
                        ? 'border-white/30 bg-white/10'
                        : 'border-white/10 hover:border-white/20 hover:bg-white/5'
                    }`}
                  >
                    <div className="text-center">
                      <div className="font-medium text-foreground">{option.name}</div>
                      <div className="text-sm text-foreground/60">×{option.multiplier}</div>
                    </div>
                  </motion.button>
                ))}
              </div>
            </div>

            {/* Timeline */}
            <div>
              <h3 className="text-2xl font-semibold mb-6 text-foreground">Сроки</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {options.timeline.map((option) => (
                  <motion.button
                    key={option.id}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => handleOptionSelect('timeline', option.id)}
                    className={`p-4 rounded-2xl border transition-all duration-300 ${
                      calculator.timeline === option.id
                        ? 'border-white/30 bg-white/10'
                        : 'border-white/10 hover:border-white/20 hover:bg-white/5'
                    }`}
                  >
                    <div className="text-center">
                      <div className="font-medium text-foreground">{option.name}</div>
                      <div className="text-sm text-foreground/60">×{option.multiplier}</div>
                    </div>
                  </motion.button>
                ))}
              </div>
            </div>

            {/* Features */}
            <div>
              <h3 className="text-2xl font-semibold mb-6 text-foreground">Дополнительные функции</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {options.features.map((option) => (
                  <motion.button
                    key={option.id}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => handleOptionSelect('features', option.id)}
                    className={`p-4 rounded-2xl border transition-all duration-300 ${
                      calculator.features.includes(option.id)
                        ? 'border-white/30 bg-white/10'
                        : 'border-white/10 hover:border-white/20 hover:bg-white/5'
                    }`}
                  >
                    <div className="text-left">
                      <div className="font-medium text-foreground">{option.name}</div>
                      <div className="text-sm text-foreground/60">+${option.price}</div>
                    </div>
                  </motion.button>
                ))}
              </div>
            </div>

            {/* Design */}
            <div>
              <h3 className="text-2xl font-semibold mb-6 text-foreground">Дизайн</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {options.design.map((option) => (
                  <motion.button
                    key={option.id}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => handleOptionSelect('design', option.id)}
                    className={`p-4 rounded-2xl border transition-all duration-300 ${
                      calculator.design === option.id
                        ? 'border-white/30 bg-white/10'
                        : 'border-white/10 hover:border-white/20 hover:bg-white/5'
                    }`}
                  >
                    <div className="text-center">
                      <div className="font-medium text-foreground">{option.name}</div>
                      <div className="text-sm text-foreground/60">×{option.multiplier}</div>
                    </div>
                  </motion.button>
                ))}
              </div>
            </div>
          </div>

          {/* Result */}
          <AnimatePresence>
            {showResult && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                className="mt-12 pt-8 border-t border-white/10"
              >
                <div className="text-center">
                  <div className="text-2xl text-foreground/70 mb-2">Примерная стоимость</div>
                  <div className="text-6xl font-bold text-gradient mb-6">
                    ${totalPrice.toLocaleString()}
                  </div>
                  <GlassButton size="lg" glow>
                    Получить консультацию
                  </GlassButton>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
};

export default PriceCalculator;