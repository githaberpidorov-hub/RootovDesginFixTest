import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import Navigation from "@/components/Navigation";
import LiquidBackground from "@/components/LiquidBackground";
import GlassButton from "@/components/GlassButton";
import PriceCalculator from "@/components/PriceCalculator";
import OptimizedMotion from "@/components/OptimizedMotion";

const Home = () => {
  const services = [
    {
      title: "Лендинги",
      description: "Продающие страницы с высокой конверсией",
      features: ["Адаптивный дизайн", "SEO оптимизация", "Быстрая загрузка"],
      price: "от $500",
    },
    {
      title: "Корпоративные сайты",
      description: "Представительские сайты для бизнеса",
      features: ["CMS система", "Многоязычность", "Интеграции"],
      price: "от $1,200",
    },
    {
      title: "Интернет-магазины",
      description: "Полнофункциональные eCommerce решения",
      features: ["Каталог товаров", "Корзина", "Платежи"],
      price: "от $2,500",
    },
  ];

  const advantages = [
    {
      title: "Современный дизайн",
      description: "Используем последние тренды в веб-дизайне",
    },
    {
      title: "Быстрая разработка",
      description: "Сдаем проекты в оговоренные сроки",
    },
    {
      title: "Техподдержка",
      description: "Поддерживаем и развиваем ваш сайт",
    },
    {
      title: "SEO готовность",
      description: "Все сайты оптимизированы для поисковиков",
    },
  ];

  return (
    <div className="min-h-screen relative">
      <LiquidBackground />
      <Navigation />
      
      {/* Hero Section */}
      <section className="relative pt-32 pb-20 px-6 overflow-hidden">
        <div className="max-w-6xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
          >
            <h1 className="text-6xl md:text-8xl font-bold mb-8 text-gradient text-glow">
              Создание сайтов
              <br />
              <span className="text-5xl md:text-7xl">под ключ</span>
            </h1>
            
            <p className="text-xl md:text-2xl text-foreground/70 mb-12 max-w-3xl mx-auto leading-relaxed">
              Разрабатываем современные веб-сайты с уникальным дизайном 
              и безупречной функциональностью
            </p>
            
            <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
              <GlassButton size="lg" glow>
                Заказать проект
              </GlassButton>
              <Link to="/portfolio">
                <GlassButton variant="secondary" size="lg">
                  Посмотреть работы
                </GlassButton>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-20 px-6">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-gradient mb-6">
              Наши услуги
            </h2>
            <p className="text-xl text-foreground/70 max-w-2xl mx-auto">
              Полный цикл создания веб-сайтов от идеи до запуска
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {services.map((service, index) => (
              <OptimizedMotion
                key={service.title}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ 
                  duration: 0.8, 
                  ease: [0.16, 1, 0.3, 1],
                  delay: index * 0.2 
                }}
                viewport={{ once: true }}
                whileHover={{ scale: 1.02, y: -5 }}
                transition={{ duration: 0.2, ease: "easeOut" }}
                className="glass-card p-8 group cursor-pointer flex flex-col"
                mobileOptimized={true}
              >
                <h3 className="text-2xl font-bold text-foreground mb-4">
                  {service.title}
                </h3>
                <p className="text-foreground/70 mb-6 leading-relaxed">
                  {service.description}
                </p>
                
                <ul className="space-y-2 mb-6">
                  {service.features.map((feature) => (
                    <li key={feature} className="text-sm text-foreground/60 flex items-center">
                      <div className="w-1.5 h-1.5 rounded-full bg-white/40 mr-3" />
                      {feature}
                    </li>
                  ))}
                </ul>
                
                <div className="flex justify-between items-end mt-auto">
                  <span className="text-2xl font-bold text-gradient">
                    {service.price}
                  </span>
                  <Link to="/portfolio">
                    <GlassButton variant="ghost" size="sm">
                      Подробнее
                    </GlassButton>
                  </Link>
                </div>
              </OptimizedMotion>
            ))}
          </div>
        </div>
      </section>

      {/* Advantages Section */}
      <section className="py-20 px-6">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-gradient mb-6">
              Почему выбирают нас
            </h2>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {advantages.map((advantage, index) => (
              <OptimizedMotion
                key={advantage.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ 
                  duration: 0.6, 
                  ease: [0.16, 1, 0.3, 1],
                  delay: index * 0.1 
                }}
                viewport={{ once: true }}
                className="glass-card p-6 text-center group hover:scale-105 transition-transform duration-200"
                mobileOptimized={true}
              >
                <h3 className="text-xl font-semibold text-foreground mb-3">
                  {advantage.title}
                </h3>
                <p className="text-foreground/60 text-sm leading-relaxed">
                  {advantage.description}
                </p>
              </OptimizedMotion>
            ))}
          </div>
        </div>
      </section>

      {/* Price Calculator Section */}
      <PriceCalculator />

      {/* CTA Section */}
      <section className="py-20 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            viewport={{ once: true }}
            className="glass-card p-12"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-gradient mb-6">
              Готовы начать проект?
            </h2>
            <p className="text-xl text-foreground/70 mb-8 max-w-2xl mx-auto">
              Свяжитесь с нами для обсуждения деталей и получения персонального предложения
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <GlassButton size="lg" glow>
                Связаться с нами
              </GlassButton>
              <Link to="/portfolio">
                <GlassButton variant="secondary" size="lg">
                  Посмотреть портфолио
                </GlassButton>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default Home;