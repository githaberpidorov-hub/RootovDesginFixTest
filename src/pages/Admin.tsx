import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Navigation from "@/components/Navigation";
import LiquidBackground from "@/components/LiquidBackground";
import GlassButton from "@/components/GlassButton";
import { useToast } from "@/hooks/use-toast";

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

interface LoginForm {
  username: string;
  password: string;
}

const Admin = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loginForm, setLoginForm] = useState<LoginForm>({ username: "", password: "" });
  const [templates, setTemplates] = useState<Template[]>([]);
  const [isAddingTemplate, setIsAddingTemplate] = useState(false);
  const [editingTemplate, setEditingTemplate] = useState<Template | null>(null);
  const [newTemplate, setNewTemplate] = useState<Partial<Template>>({
    title: "",
    description: "",
    category: "landing",
    image: "",
    technologies: [],
    demoUrl: "",
    price: "",
  });
  const [techInput, setTechInput] = useState("");
  const { toast } = useToast();

  const categories = [
    { id: "landing", name: "Лендинги" },
    { id: "corporate", name: "Корпоративные" },
    { id: "ecommerce", name: "E-commerce" },
    { id: "portfolio", name: "Портфолио" },
  ];

  useEffect(() => {
    // Проверяем аутентификацию при загрузке
    const authStatus = localStorage.getItem('admin-auth');
    if (authStatus === 'true') {
      setIsAuthenticated(true);
      loadTemplates();
    }
  }, []);

  const loadTemplates = () => {
    const savedTemplates = localStorage.getItem('portfolio-templates');
    if (savedTemplates) {
      setTemplates(JSON.parse(savedTemplates));
    }
  };

  const saveTemplates = (updatedTemplates: Template[]) => {
    localStorage.setItem('portfolio-templates', JSON.stringify(updatedTemplates));
    setTemplates(updatedTemplates);
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (loginForm.username === "admin" && loginForm.password === "admin") {
      setIsAuthenticated(true);
      localStorage.setItem('admin-auth', 'true');
      loadTemplates();
      toast({
        title: "Успешный вход",
        description: "Добро пожаловать в админ-панель!",
      });
    } else {
      toast({
        title: "Ошибка входа",
        description: "Неверный логин ли пароль",
        variant: "destructive",
      });
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    localStorage.removeItem('admin-auth');
    setLoginForm({ username: "", password: "" });
    toast({
      title: "Выход выполнен",
      description: "До свидания!",
    });
  };

  const addTechnology = () => {
    if (techInput.trim()) {
      const currentTech = (editingTemplate ? editingTemplate.technologies : newTemplate.technologies) || [];
      const updatedTech = [...currentTech, techInput.trim()];
      
      if (editingTemplate) {
        setEditingTemplate({ ...editingTemplate, technologies: updatedTech });
      } else {
        setNewTemplate({ ...newTemplate, technologies: updatedTech });
      }
      setTechInput("");
    }
  };

  const removeTechnology = (index: number) => {
    if (editingTemplate) {
      const updatedTech = editingTemplate.technologies.filter((_, i) => i !== index);
      setEditingTemplate({ ...editingTemplate, technologies: updatedTech });
    } else {
      const updatedTech = (newTemplate.technologies || []).filter((_, i) => i !== index);
      setNewTemplate({ ...newTemplate, technologies: updatedTech });
    }
  };

  const handleSaveTemplate = () => {
    const templateData = editingTemplate || newTemplate;
    
    if (!templateData.title || !templateData.description || !templateData.price) {
      toast({
        title: "Ошибка",
        description: "Заполните все обязательные поля",
        variant: "destructive",
      });
      return;
    }

    if (editingTemplate) {
      // Редактирование существующего шаблона
      const updatedTemplates = templates.map(t => 
        t.id === editingTemplate.id ? editingTemplate : t
      );
      saveTemplates(updatedTemplates);
      setEditingTemplate(null);
      toast({
        title: "Шаблон обновлен",
        description: "Изменения сохранены успешно",
      });
    } else {
      // Добавление нового шаблона
      const template: Template = {
        id: Date.now().toString(),
        title: templateData.title!,
        description: templateData.description!,
        category: templateData.category!,
        image: templateData.image || "/api/placeholder/600/400",
        technologies: templateData.technologies || [],
        demoUrl: templateData.demoUrl,
        price: templateData.price!,
      };
      
      const updatedTemplates = [...templates, template];
      saveTemplates(updatedTemplates);
      setNewTemplate({
        title: "",
        description: "",
        category: "landing",
        image: "",
        technologies: [],
        demoUrl: "",
        price: "",
      });
      setIsAddingTemplate(false);
      toast({
        title: "Шаблон добавлен",
        description: "Новый шаблон успешно создан",
      });
    }
  };

  const handleDeleteTemplate = (id: string) => {
    const updatedTemplates = templates.filter(t => t.id !== id);
    saveTemplates(updatedTemplates);
    toast({
      title: "Шаблон удален",
      description: "Шаблон успешно удален из портфолио",
    });
  };

  const cancelEdit = () => {
    setEditingTemplate(null);
    setIsAddingTemplate(false);
    setNewTemplate({
      title: "",
      description: "",
      category: "landing",
      image: "",
      technologies: [],
      demoUrl: "",
      price: "",
    });
    setTechInput("");
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen relative flex items-center justify-center">
        <LiquidBackground />
        
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="glass-card p-8 w-full max-w-md"
        >
          <h1 className="text-3xl font-bold text-gradient text-center mb-8">
            Админ-панель
          </h1>
          
          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <label className="block text-foreground/80 mb-2 font-medium">Логин</label>
              <input
                type="text"
                value={loginForm.username}
                onChange={(e) => setLoginForm({ ...loginForm, username: e.target.value })}
                className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-foreground placeholder-foreground/50 focus:outline-none focus:border-white/30 transition-colors"
                placeholder="admin"
                required
              />
            </div>
            
            <div>
              <label className="block text-foreground/80 mb-2 font-medium">Пароль</label>
              <input
                type="password"
                value={loginForm.password}
                onChange={(e) => setLoginForm({ ...loginForm, password: e.target.value })}
                className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-foreground placeholder-foreground/50 focus:outline-none focus:border-white/30 transition-colors"
                placeholder="admin"
                required
              />
            </div>
            
            <GlassButton type="submit" className="w-full" glow>
              Войти
            </GlassButton>
          </form>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen relative">
      <LiquidBackground />
      <Navigation />
      
      <div className="pt-32 pb-20 px-6">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="flex justify-between items-center mb-12"
          >
            <h1 className="text-4xl md:text-5xl font-bold text-gradient">
              Управление портфолио
            </h1>
            <div className="flex gap-4">
              <GlassButton onClick={() => setIsAddingTemplate(true)}>
                Добавить шаблон
              </GlassButton>
              <GlassButton variant="secondary" onClick={handleLogout}>
                Выйти
              </GlassButton>
            </div>
          </motion.div>

          {/* Add/Edit Template Form */}
          <AnimatePresence>
            {(isAddingTemplate || editingTemplate) && (
              <motion.div
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -50 }}
                transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                className="glass-card p-8 mb-12"
              >
                <h2 className="text-2xl font-bold text-gradient mb-6">
                  {editingTemplate ? "Редактировать шаблон" : "Добавить новый шаблон"}
                </h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-foreground/80 mb-2 font-medium">Название *</label>
                    <input
                      type="text"
                      value={editingTemplate ? editingTemplate.title : newTemplate.title}
                      onChange={(e) => {
                        if (editingTemplate) {
                          setEditingTemplate({ ...editingTemplate, title: e.target.value });
                        } else {
                          setNewTemplate({ ...newTemplate, title: e.target.value });
                        }
                      }}
                      className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-foreground focus:outline-none focus:border-white/30"
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="block text-foreground/80 mb-2 font-medium">Категория</label>
                    <select
                      value={editingTemplate ? editingTemplate.category : newTemplate.category}
                      onChange={(e) => {
                        if (editingTemplate) {
                          setEditingTemplate({ ...editingTemplate, category: e.target.value });
                        } else {
                          setNewTemplate({ ...newTemplate, category: e.target.value });
                        }
                      }}
                      className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-foreground focus:outline-none focus:border-white/30"
                    >
                      {categories.map(cat => (
                        <option key={cat.id} value={cat.id} className="bg-background">
                          {cat.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  
                  <div className="md:col-span-2">
                    <label className="block text-foreground/80 mb-2 font-medium">Описание *</label>
                    <textarea
                      value={editingTemplate ? editingTemplate.description : newTemplate.description}
                      onChange={(e) => {
                        if (editingTemplate) {
                          setEditingTemplate({ ...editingTemplate, description: e.target.value });
                        } else {
                          setNewTemplate({ ...newTemplate, description: e.target.value });
                        }
                      }}
                      rows={3}
                      className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-foreground focus:outline-none focus:border-white/30 resize-none"
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="block text-foreground/80 mb-2 font-medium">Цена *</label>
                    <input
                      type="text"
                      value={editingTemplate ? editingTemplate.price : newTemplate.price}
                      onChange={(e) => {
                        if (editingTemplate) {
                          setEditingTemplate({ ...editingTemplate, price: e.target.value });
                        } else {
                          setNewTemplate({ ...newTemplate, price: e.target.value });
                        }
                      }}
                      className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-foreground focus:outline-none focus:border-white/30"
                      placeholder="$1,200"
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="block text-foreground/80 mb-2 font-medium">Demo URL</label>
                    <input
                      type="url"
                      value={editingTemplate ? editingTemplate.demoUrl || "" : newTemplate.demoUrl}
                      onChange={(e) => {
                        if (editingTemplate) {
                          setEditingTemplate({ ...editingTemplate, demoUrl: e.target.value });
                        } else {
                          setNewTemplate({ ...newTemplate, demoUrl: e.target.value });
                        }
                      }}
                      className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-foreground focus:outline-none focus:border-white/30"
                      placeholder="https://example.com"
                    />
                  </div>
                  
                  <div className="md:col-span-2">
                    <label className="block text-foreground/80 mb-2 font-medium">Технологии</label>
                    <div className="flex gap-2 mb-3">
                      <input
                        type="text"
                        value={techInput}
                        onChange={(e) => setTechInput(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTechnology())}
                        className="flex-1 px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-foreground focus:outline-none focus:border-white/30"
                        placeholder="Добавить технологию"
                      />
                      <GlassButton variant="ghost" onClick={addTechnology}>
                        Добавить
                      </GlassButton>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {(editingTemplate ? editingTemplate.technologies : newTemplate.technologies || []).map((tech, index) => (
                        <span
                          key={index}
                          className="px-3 py-1 rounded-lg bg-white/10 border border-white/20 text-sm text-foreground flex items-center gap-2"
                        >
                          {tech}
                          <button
                            onClick={() => removeTechnology(index)}
                            className="text-foreground/60 hover:text-foreground"
                          >
                            ×
                          </button>
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
                
                <div className="flex gap-4 mt-8">
                  <GlassButton onClick={handleSaveTemplate} glow>
                    {editingTemplate ? "Сохранить изменения" : "Добавить шаблон"}
                  </GlassButton>
                  <GlassButton variant="secondary" onClick={cancelEdit}>
                    Отмена
                  </GlassButton>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Templates List */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}
          >
            <h2 className="text-2xl font-bold text-foreground mb-6">
              Шаблоны ({templates.length})
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {templates.map((template) => (
                <motion.div
                  key={template.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                  className="glass-card p-6"
                >
                  <h3 className="text-xl font-bold text-foreground mb-2">
                    {template.title}
                  </h3>
                  <p className="text-foreground/70 text-sm mb-3">
                    {template.description}
                  </p>
                  <div className="text-sm text-foreground/60 mb-4">
                    Категория: {categories.find(cat => cat.id === template.category)?.name}
                  </div>
                  <div className="text-lg font-bold text-gradient mb-4">
                    {template.price}
                  </div>
                  
                  <div className="flex gap-2">
                    <GlassButton
                      variant="ghost"
                      size="sm"
                      onClick={() => setEditingTemplate(template)}
                    >
                      Редактировать
                    </GlassButton>
                    <GlassButton
                      variant="secondary"
                      size="sm"
                      onClick={() => handleDeleteTemplate(template.id)}
                    >
                      Удалить
                    </GlassButton>
                  </div>
                </motion.div>
              ))}
            </div>
            
            {templates.length === 0 && (
              <div className="text-center py-12">
                <p className="text-xl text-foreground/60">
                  Пока нет добавленных шаблонов
                </p>
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Admin;