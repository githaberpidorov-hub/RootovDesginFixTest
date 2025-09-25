import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { GlassCard } from "@/components/ui/glass-card";
import { useToast } from "@/components/ui/use-toast";

export const HeroSection = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: ""
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const scrollToForm = () => {
    document.getElementById('contact-form')?.scrollIntoView({ 
      behavior: 'smooth' 
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const message = `
🔔 Новая заявка с сайта!

👤 Имя: ${formData.name}
📧 Email: ${formData.email}
💬 Сообщение: ${formData.message}

⏰ Время: ${new Date().toLocaleString('ru-RU')}
      `;

      const telegramUrl = `https://api.telegram.org/bot6533628325:AAH003jyZkBTUJYMZCqPXfyvMuxm6lqfzwY/sendMessage`;
      
      const response = await fetch(telegramUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          chat_id: '6793841885',
          text: message,
          parse_mode: 'HTML'
        })
      });

      if (response.ok) {
        toast({
          title: "Заявка отправлена!",
          description: "Мы свяжемся с вами в ближайшее время.",
        });
        setFormData({ name: "", email: "", message: "" });
      } else {
        throw new Error('Ошибка отправки');
      }
    } catch (error) {
      toast({
        title: "Ошибка отправки",
        description: "Попробуйте еще раз или свяжитесь с нами напрямую.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="relative min-h-screen flex flex-col items-center justify-start px-6 pt-40 pb-20 overflow-hidden">
      {/* Enhanced 3D animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Large morphing glass shapes */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 shape-3d shape-morph opacity-30" />
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 shape-3d rounded-3xl opacity-25" style={{ animationDelay: '5s' }} />
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] shape-3d shape-morph opacity-20" style={{ animationDelay: '10s' }} />
        
        {/* Floating glass cubes */}
        <div className="absolute top-1/4 right-1/6 w-24 h-24 shape-3d rounded-2xl opacity-40" style={{ animationDelay: '2s' }} />
        <div className="absolute bottom-1/3 left-1/5 w-32 h-32 shape-3d rounded-3xl opacity-35" style={{ animationDelay: '7s' }} />
        <div className="absolute top-2/3 right-1/5 w-20 h-20 shape-3d rounded-full opacity-45" style={{ animationDelay: '12s' }} />
        
        {/* Ambient glow effects */}
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-mesh opacity-50" />
        <div className="absolute top-1/4 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-white/5 rounded-full blur-3xl animate-glow" />
      </div>

      <div className="relative z-10 text-center max-w-6xl mx-auto w-full">
        {/* Hero Title Section */}
        <GlassCard className="p-12 md:p-16 lg:p-20 mb-80 animate-fade-in">
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-extralight mb-8 text-white leading-tight">
            Liquid Glass
            <br />
            <span className="font-medium text-white/90">Experience</span>
          </h1>
          
          <p className="text-xl md:text-2xl text-muted-foreground mb-12 max-w-3xl mx-auto leading-relaxed">
            Революционный подход к дизайну. Прозрачность, элегантность и функциональность в идеальной гармонии.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
            <Button 
              variant="hero" 
              size="lg"
              onClick={scrollToForm}
              className="text-lg px-12 py-4"
            >
              Подать заявку
            </Button>
            <Button 
              variant="glass" 
              size="lg"
              className="text-lg px-12 py-4"
            >
              Узнать больше
            </Button>
          </div>
        </GlassCard>

        {/* Contact Form Section */}
        <div id="contact-form" className="max-w-2xl mx-auto">
          <GlassCard className="p-8 md:p-12">
            <div className="text-center mb-10">
              <h2 className="text-4xl md:text-5xl font-light mb-4 bg-gradient-primary bg-clip-text text-transparent">
                Подать заявку
              </h2>
              <p className="text-muted-foreground text-lg">
                Расскажите нам о своем проекте
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <label htmlFor="name" className="text-sm font-medium text-foreground">
                  Имя
                </label>
                <Input
                  id="name"
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="glass-card border-glass-border/50 bg-glass/30 text-foreground placeholder:text-muted-foreground"
                  placeholder="Ваше имя"
                  required
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="email" className="text-sm font-medium text-foreground">
                  Email
                </label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="glass-card border-glass-border/50 bg-glass/30 text-foreground placeholder:text-muted-foreground"
                  placeholder="your@email.com"
                  required
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="message" className="text-sm font-medium text-foreground">
                  Сообщение
                </label>
                <Textarea
                  id="message"
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  className="glass-card border-glass-border/50 bg-glass/30 text-foreground placeholder:text-muted-foreground min-h-[120px]"
                  placeholder="Расскажите о вашем проекте..."
                  required
                />
              </div>

              <Button
                type="submit"
                variant="hero"
                size="lg"
                disabled={isSubmitting}
                className="w-full text-lg py-4"
              >
                {isSubmitting ? "Отправка..." : "Отправить заявку"}
              </Button>
            </form>
          </GlassCard>
        </div>
      </div>
    </section>
  );
};