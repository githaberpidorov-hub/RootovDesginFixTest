import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { GlassCard } from "@/components/ui/glass-card";
import { useToast } from "@/components/ui/use-toast";

export const ContactForm = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: ""
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

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
    <section id="contact-form" className="py-20 px-6">
      <div className="max-w-2xl mx-auto">
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
    </section>
  );
};