import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import Navigation from "@/components/Navigation";
import LiquidBackground from "@/components/LiquidBackground";
import GlassButton from "@/components/GlassButton";
import PriceCalculator from "@/components/PriceCalculator";
import OptimizedMotion from "@/components/OptimizedMotion";
import { useLanguage } from "@/hooks/use-language";

const Home = () => {
  const { t } = useLanguage();
  
  const services = [
    {
      title: t.home.services.landing.title,
      description: t.home.services.landing.description,
      features: t.home.services.landing.features,
      price: t.home.services.landing.price,
    },
    {
      title: t.home.services.corporate.title,
      description: t.home.services.corporate.description,
      features: t.home.services.corporate.features,
      price: t.home.services.corporate.price,
    },
    {
      title: t.home.services.ecommerce.title,
      description: t.home.services.ecommerce.description,
      features: t.home.services.ecommerce.features,
      price: t.home.services.ecommerce.price,
    },
  ];

  const advantages = [
    {
      title: t.home.advantages.modernDesign.title,
      description: t.home.advantages.modernDesign.description,
    },
    {
      title: t.home.advantages.fastDevelopment.title,
      description: t.home.advantages.fastDevelopment.description,
    },
    {
      title: t.home.advantages.support.title,
      description: t.home.advantages.support.description,
    },
    {
      title: t.home.advantages.seoReady.title,
      description: t.home.advantages.seoReady.description,
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
            <h1 className={`text-7xl md:text-8xl font-bold mb-12 text-gradient text-glow ${t.home.hero.title.includes('Website') ? 'leading-none' : 'leading-tight'}`}>
              {t.home.hero.title}
              <br />
              <span className={`text-6xl md:text-7xl block pb-2 ${t.home.hero.title.includes('Website') ? 'mt-2 md:mt-6' : 'mt-1 md:mt-6'}`}>{t.home.hero.subtitle}</span>
            </h1>
            
            <p className="text-xl md:text-2xl text-foreground/70 mb-12 max-w-3xl mx-auto leading-relaxed">
              {t.home.hero.description}
            </p>
            
            <div className="flex flex-col sm:flex-row gap-6 justify-center items-center w-full max-w-sm mx-auto sm:max-w-none">
              <a href="/request" className="w-4/5 sm:w-auto">
                <GlassButton size="lg" glow className="w-full sm:w-auto">
                  {t.home.hero.orderProject}
                </GlassButton>
              </a>
              <Link to="/portfolio" className="w-4/5 sm:w-auto">
                <GlassButton variant="secondary" size="lg" className="w-full sm:w-auto">
                  {t.home.hero.viewWorks}
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
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-gradient mb-6 leading-[1.15] pb-2">
              {t.home.services.title}
            </h2>
            <p className="text-xl text-foreground/70 max-w-2xl mx-auto">
              {t.home.services.description}
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {services.map((service, index) => (
              <OptimizedMotion
                key={service.title}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ 
                  duration: 0.6, 
                  ease: [0.16, 1, 0.3, 1]
                }}
                viewport={{ once: true }}
                whileHover={{ scale: 1.02, y: -5 }}
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
                  <Link 
                    to="/portfolio" 
                    onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                  >
                    <GlassButton variant="ghost" size="sm">
                      {t.common.more}
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
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-gradient mb-6 leading-[1.15] pb-2">
              {t.home.advantages.title}
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
                  ease: [0.16, 1, 0.3, 1]
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
      <section className="py-12 px-6 -mt-8">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            viewport={{ once: true }}
            className="glass-card p-12"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-gradient mb-6 leading-[1.15] pb-2">
              {t.home.cta.title}
            </h2>
            <p className="text-xl text-foreground/70 mb-8 max-w-2xl mx-auto">
              {t.home.cta.description}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center w-full max-w-sm mx-auto sm:max-w-none">
              <a href="/request" className="w-4/5 sm:w-auto">
                <GlassButton size="lg" glow className="w-full sm:w-auto">
                  {t.home.cta.contactUs}
                </GlassButton>
              </a>
              <Link 
                to="/portfolio" 
                onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                className="w-4/5 sm:w-auto"
              >
                <GlassButton variant="secondary" size="lg" className="w-full sm:w-auto">
                  {t.home.cta.viewPortfolio}
                </GlassButton>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="-mt-4 pb-8 px-6">
        <div className="max-w-6xl mx-auto text-center">
          <p className="text-foreground/60 text-sm">
            <span className="block sm:inline">{t.footer.company}</span>
            <span className="block sm:inline sm:ml-1">{t.footer.rights}</span>
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Home;