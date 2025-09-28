import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import Navigation from "@/components/Navigation";
import LiquidBackground from "@/components/LiquidBackground";
import GlassButton from "@/components/GlassButton";
import { useToast } from "@/hooks/use-toast";
import { useLanguage } from "@/hooks/use-language";
import { getAvailableLanguages, getLanguageLabel, LanguageCode } from "@/lib/i18n";

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
  const navigate = useNavigate();
  const { t, language: currentLanguage } = useLanguage();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [activeTab, setActiveTab] = useState<'templates' | 'calculator' | 'telegram' | 'security'>('templates');
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
  const [tgConfig, setTgConfig] = useState({ botToken: '', username: '', chatId: '' });
  const [adminCreds, setAdminCreds] = useState<{ username: string; password: string; confirm: string }>({ username: 'admin', password: '', confirm: '' });
  
  // Language selector for admin editing
  const [adminEditingLanguage, setAdminEditingLanguage] = useState<LanguageCode>('RU');
  const availableLanguages = getAvailableLanguages();

  // Calculator config (editable)
  type CalcOptions = {
    websiteType: { id: string; name: string; price: number; multiplier: number; priceType: 'fixed' | 'multiplier' }[];
    complexity: { id: string; name: string; price: number; multiplier: number; priceType: 'fixed' | 'multiplier' }[];
    timeline: { id: string; name: string; price: number; multiplier: number; priceType: 'fixed' | 'multiplier' }[];
    features: { id: string; name: string; price: number; multiplier: number; priceType: 'fixed' | 'multiplier' }[];
    design: { id: string; name: string; price: number; multiplier: number; priceType: 'fixed' | 'multiplier' }[];
  };
  const [calcOptions, setCalcOptions] = useState<CalcOptions>({
    websiteType: [
      { id: "landing", name: "Лендинг", price: 500, multiplier: 1, priceType: 'fixed' },
      { id: "corporate", name: "Корпоративный сайт", price: 1200, multiplier: 1, priceType: 'fixed' },
      { id: "ecommerce", name: "Интернет-магазин", price: 2500, multiplier: 1, priceType: 'fixed' },
      { id: "portfolio", name: "Портфолио", price: 800, multiplier: 1, priceType: 'fixed' },
      { id: "blog", name: "Блог/СМИ", price: 1000, multiplier: 1, priceType: 'fixed' },
    ],
    complexity: [
      { id: "simple", name: "Простой", price: 0, multiplier: 1, priceType: 'multiplier' },
      { id: "medium", name: "Средний", price: 0, multiplier: 1.5, priceType: 'multiplier' },
      { id: "complex", name: "Сложный", price: 0, multiplier: 2.2, priceType: 'multiplier' },
    ],
    timeline: [
      { id: "urgent", name: "Срочно (1-2 недели)", price: 0, multiplier: 1.8, priceType: 'multiplier' },
      { id: "normal", name: "Обычно (3-4 недели)", price: 0, multiplier: 1, priceType: 'multiplier' },
      { id: "flexible", name: "Не горит (1-2 месяца)", price: 0, multiplier: 0.8, priceType: 'multiplier' },
    ],
    features: [
      { id: "cms", name: "Система управления", price: 300, multiplier: 1, priceType: 'fixed' },
      { id: "seo", name: "SEO оптимизация", price: 400, multiplier: 1, priceType: 'fixed' },
      { id: "analytics", name: "Аналитика", price: 200, multiplier: 1, priceType: 'fixed' },
      { id: "mobile", name: "Мобильная версия", price: 500, multiplier: 1, priceType: 'fixed' },
      { id: "multilang", name: "Многоязычность", price: 600, multiplier: 1, priceType: 'fixed' },
      { id: "integration", name: "Интеграции", price: 800, multiplier: 1, priceType: 'fixed' },
    ],
    design: [
      { id: "template", name: "На основе шаблона", price: 0, multiplier: 0.7, priceType: 'multiplier' },
      { id: "custom", name: "Индивидуальный дизайн", price: 0, multiplier: 1, priceType: 'multiplier' },
      { id: "premium", name: "Premium дизайн", price: 0, multiplier: 1.4, priceType: 'multiplier' },
    ],
  });

  // Состояние для управления разделами калькулятора
  const [calculatorSections, setCalculatorSections] = useState([
    { key: 'websiteType', label: 'Тип сайта', icon: '' },
    { key: 'complexity', label: 'Сложность', icon: '' },
    { key: 'timeline', label: 'Сроки', icon: '' },
    { key: 'features', label: 'Дополнительные функции', icon: '' },
    { key: 'design', label: 'Дизайн', icon: '' },
  ]);

  const categories = [
    { id: "landing", name: t.admin.templates.categories.landing },
    { id: "corporate", name: t.admin.templates.categories.corporate },
    { id: "ecommerce", name: t.admin.templates.categories.ecommerce },
    { id: "portfolio", name: t.admin.templates.categories.portfolio },
  ];

  useEffect(() => {
    // Проверяем аутентификацию при загрузке
    const authStatus = localStorage.getItem('admin-auth');
    if (authStatus === 'true') {
      setIsAuthenticated(true);
      // Загружаем все данные сразу
      loadAllData();
    }
  }, []);

  // Отдельный эффект для перезагрузки при смене языка
  useEffect(() => {
    if (isAuthenticated) {
      loadAllData();
    }
  }, [adminEditingLanguage, isAuthenticated]);

  const loadAllData = async () => {
    try {
      // Загружаем шаблоны
      await loadTemplates();
      
      // Загружаем конфигурацию калькулятора
      await loadCalculatorConfig();
      
      // Загружаем остальные настройки
      const settingsResponse = await fetch('/api/settings');
      const settingsData = await settingsResponse.json();
      
          if (settingsData?.telegram) {
            setTgConfig({ 
              botToken: settingsData.telegram.botToken || '', 
              username: settingsData.telegram.username || '', 
              chatId: settingsData.telegram.chatId || '' 
            });
          }
          if (settingsData?.admin) {
            setAdminCreds(c => ({ ...c, username: settingsData.admin.username || c.username }));
          }
    } catch (error) {
      console.warn('Failed to load data from API:', error);
    }
  };

  const loadTemplates = async () => {
    try {
      // Загружаем список шаблонов для выбранного языка редактирования
      const response = await fetch(`/api/templates?language=${adminEditingLanguage}`);
      const data = await response.json();
      
      if (data.ok && Array.isArray(data.templates)) {
        setTemplates(data.templates);
      }
    } catch (error) {
      console.warn('Failed to load templates from API:', error);
    }
  };

  // Перезагружаем шаблоны при смене языка редактирования в админке
  useEffect(() => {
    if (!isAuthenticated) return;
    loadTemplates();
  }, [adminEditingLanguage, isAuthenticated]);

  const loadCalculatorConfig = async () => {
    try {
      const response = await fetch(`/api/calculator?language=${adminEditingLanguage}`);
      const data = await response.json();

      if (data.ok && data.config) {
        const config = data.config;
        console.log('=== DEBUG: Loading from API ===');
        console.log('Config:', JSON.stringify(config, null, 2));
        
        // Загружаем разделы, если они есть в конфиге
        let sectionsToUse = calculatorSections;
        if (config.sections) {
          setCalculatorSections(config.sections);
          sectionsToUse = config.sections;
        }

        const normalizeGroup = (group: any, defaultPriceType: 'fixed' | 'multiplier' = 'fixed') => {
          console.log('=== DEBUG: normalizeGroup ===');
          console.log('Input group:', group);
          console.log('Is array:', Array.isArray(group));
          
          if (!group) return [] as Array<{ id: string; name: string; price: number; multiplier: number; priceType: 'fixed' | 'multiplier' }>;
          
          let entries: Array<[string, any]>;
          if (Array.isArray(group)) {
            // Если это массив, сортируем по полю order если оно есть
            const sortedGroup = [...group].sort((a, b) => {
              const orderA = a?.order ?? 0;
              const orderB = b?.order ?? 0;
              return orderA - orderB;
            });
            console.log('Sorted group:', sortedGroup);
            entries = sortedGroup.map((val, idx) => [String(val?.id ?? idx), val] as const);
          } else {
            entries = Object.entries(group as Record<string, any>);
          }
        
          const result = entries.map(([id, value]) => ({ 
            id, 
            name: value?.label || value?.name || id, 
            price: Number(value?.price || 0),
            multiplier: Number(value?.multiplier || 1),
            priceType: value?.priceType || defaultPriceType
          }));
          
          console.log('Normalize result:', result);
          return result;
        };

        // Загружаем данные для всех разделов
        const newCalcOptions: any = {};
        sectionsToUse.forEach(section => {
          const sectionKey = section.key;
          // Исправляем регистр для websiteType -> websitetype
          const dbKey = sectionKey === 'websiteType' 
            ? `websitetype_${adminEditingLanguage.toLowerCase()}`
            : `${sectionKey}_${adminEditingLanguage.toLowerCase()}`;
          const sectionData = config[dbKey];
          newCalcOptions[sectionKey] = normalizeGroup(sectionData, 'fixed');
        });

        setCalcOptions(newCalcOptions);
      }
    } catch (error) {
      console.warn('Failed to load calculator config from API:', error);
    }
  };

  const saveCalculatorConfig = async () => {
    try {
      const configData: any = {
        language: adminEditingLanguage,
        sections: calculatorSections
      };

      // Динамически создаем конфигурацию для каждого раздела
      calculatorSections.forEach(section => {
        const sectionKey = section.key;
        const sectionData = (calcOptions as any)[sectionKey] || [];
        // Сохраняем как массив, чтобы сохранить порядок
        configData[sectionKey] = sectionData.map((opt: any, index: number) => ({ 
          id: String(opt.id),
          label: opt.name, 
          price: Number(opt.price || 0),
          multiplier: Number(opt.multiplier || 1),
          priceType: opt.priceType || 'fixed',
          order: index // Добавляем поле порядка
        }));
      });

      // Временное логирование для отладки
      console.log('=== DEBUG: Sending to API ===');
      console.log('configData:', JSON.stringify(configData, null, 2));
      
      const response = await fetch('/api/calculator', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(configData)
      });

      if (response.ok) {
        toast({
          title: t.common.success,
          description: "Конфигурация калькулятора сохранена",
        });
        // Перезагружаем конфигурацию после сохранения
        await loadCalculatorConfig();
      } else {
        const errorData = await response.json();
        throw new Error(`Failed to save calculator config: ${errorData.error || 'Unknown error'}`);
      }
    } catch (error) {
      console.error('Error saving calculator config:', error);
      toast({
        title: t.common.error,
        description: `Ошибка при сохранении конфигурации калькулятора: ${error instanceof Error ? error.message : 'Неизвестная ошибка'}`,
        variant: "destructive",
      });
    }
  };

  const saveTemplates = async (updatedTemplates: Template[]) => {
    try {
      // Для каждого шаблона отправляем отдельный запрос
      const promises = updatedTemplates.map(template => {
        const templateData = {
          title_ru: template.title,
          title_eng: template.title,
          title_uk: template.title,
          description_ru: template.description,
          description_eng: template.description,
          description_uk: template.description,
          category: template.category,
          image: template.image,
          technologies: template.technologies,
          demoUrl: template.demoUrl,
          price: template.price,
        };

        if (template.id && template.id !== 'new') {
          // Обновляем существующий
          return fetch(`/api/templates?id=${template.id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(templateData)
          });
        } else {
          // Создаем новый
          return fetch('/api/templates', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(templateData)
          });
        }
      });

      await Promise.all(promises);
      setTemplates(updatedTemplates);
      toast({ title: t.common.success, description: 'Шаблоны обновлены' });
    } catch (e:any) {
      toast({ title: t.common.error, description: String(e?.message||e||'Неизвестная ошибка'), variant:'destructive' });
    }
  };

  const saveCalculator = async (updated: CalcOptions) => {
    try {
      const payload = { 
        ...updated, 
        language: t.language 
      };
      
      console.log('Saving calculator:', payload);
      console.log('Language:', t.language);
      
      // Используем правильный API для калькулятора с передачей языка
      const r = await fetch('/api/calculator', { 
        method: 'POST', 
        headers: { 'Content-Type': 'application/json' }, 
        body: JSON.stringify(payload) 
      });
      
      console.log('Calculator response status:', r.status);
      const j = await r.json().catch(()=>({ ok:false, error:'Ошибка парсинга ответа' }));
      console.log('Calculator response data:', j);
      
      if (!r.ok || !j?.ok) {
        throw new Error(j?.error || `Ошибка сервера (${r.status})`);
      }
      setCalcOptions(updated);
      toast({ title: 'Сохранено', description: 'Настройки калькулятора обновлены' });
    } catch (e:any) {
      console.error('Calculator save error:', e);
      toast({ title: 'Не удалось сохранить', description: String(e?.message||e||'Неизвестная ошибка'), variant:'destructive' });
    }
  };

  // Автосохранение калькулятора с небольшой задержкой
  useEffect(() => {
    if (!isAuthenticated) return;
    const timer = setTimeout(async () => {
      try {
        const autoSaveData: any = {
          language: adminEditingLanguage,
          sections: calculatorSections
        };

        // Динамически создаем конфигурацию для каждого раздела
        calculatorSections.forEach(section => {
          const sectionKey = section.key;
          const sectionData = (calcOptions as any)[sectionKey] || [];
          autoSaveData[sectionKey] = Object.fromEntries(
            sectionData.map((opt: any) => [String(opt.id), { 
              label: opt.name, 
              price: Number(opt.price || 0),
              multiplier: Number(opt.multiplier || 1),
              priceType: opt.priceType || 'fixed'
            }])
          );
        });

        const r = await fetch('/api/calculator', { 
          method: 'POST', 
          headers: { 'Content-Type': 'application/json' }, 
          body: JSON.stringify(autoSaveData) 
        });
        if (!r.ok) {
          const j = await r.json().catch(()=>({}));
          throw new Error(j?.error || `Ошибка сохранения (${r.status})`);
        }
      } catch (e:any) {
        // Тихо логируем, чтобы не спамить тостами при наборе
        console.warn('Auto-save calculator failed:', e?.message||e);
      }
    }, 600);
    return () => clearTimeout(timer);
  }, [calcOptions, isAuthenticated, adminEditingLanguage]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const r = await fetch('/api/auth', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(loginForm) });
      const j = await r.json().catch(()=>({ ok:false }));
      if (!r.ok || !j?.ok) throw new Error(j?.error || 'Invalid credentials');
      setIsAuthenticated(true);
      localStorage.setItem('admin-auth', 'true');
      // После успешного входа – загружаем все данные
      await loadAllData();
      toast({ title: t.common.success, description: t.admin.login.success });
    } catch (err:any) {
      toast({ title: t.common.error, description: t.admin.login.error, variant: 'destructive' });
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
    navigate('/');
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

  const handleSaveTemplate = async () => {
    const templateData = editingTemplate || newTemplate;
    
    if (!templateData.title || !templateData.description || !templateData.price) {
      toast({
        title: t.common.error,
        description: "Заполните все обязательные поля",
        variant: "destructive",
      });
      return;
    }

    try {
      const templatePayload = {
        title: templateData.title!,
        description: templateData.description!,
        category: templateData.category!,
        image: templateData.image || "/api/placeholder/600/400",
        technologies: templateData.technologies || [],
        demoUrl: templateData.demoUrl,
        price: templateData.price!,
      };

      console.log('Saving template:', templatePayload);
      console.log('Language:', adminEditingLanguage);

      if (editingTemplate) {
        // Редактирование существующего шаблона
        console.log('Updating template with ID:', editingTemplate.id);
        const response = await fetch(`/api/templates?id=${editingTemplate.id}&language=${adminEditingLanguage}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(templatePayload)
        });
        
        console.log('Update response status:', response.status);
        const responseData = await response.json();
        console.log('Update response data:', responseData);
        
        if (response.ok) {
          await loadTemplates();
          setEditingTemplate(null);
          toast({
            title: t.common.success,
            description: "Шаблон обновлен",
          });
        } else {
          throw new Error(responseData.error || 'Failed to update template');
        }
      } else {
        // Добавление нового шаблона
        console.log('Creating new template');
        const response = await fetch(`/api/templates?language=${adminEditingLanguage}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(templatePayload)
        });
        
        console.log('Create response status:', response.status);
        const responseData = await response.json();
        console.log('Create response data:', responseData);
        
        if (response.ok) {
          await loadTemplates();
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
            title: t.common.success,
            description: "Шаблон добавлен",
          });
        } else {
          throw new Error(responseData.error || 'Failed to create template');
        }
      }
    } catch (error) {
      console.error('Template save error:', error);
      toast({
        title: t.common.error,
        description: `Не удалось сохранить шаблон: ${error instanceof Error ? error.message : 'Неизвестная ошибка'}`,
        variant: "destructive",
      });
    }
  };

  const handleDeleteTemplate = async (id: string) => {
    try {
      const response = await fetch(`/api/templates?id=${id}`, {
        method: 'DELETE'
      });
      
      if (response.ok) {
        await loadTemplates();
        toast({
          title: t.common.success,
          description: "Шаблон удален",
        });
      } else {
        throw new Error('Failed to delete template');
      }
    } catch (error) {
      toast({
        title: t.common.error,
        description: "Не удалось удалить шаблон",
        variant: "destructive",
      });
    }
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
            {t.admin.login.title}
          </h1>
          
          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <label className="block text-foreground/80 mb-2 font-medium">{t.admin.login.username}</label>
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
              <label className="block text-foreground/80 mb-2 font-medium">{t.admin.login.password}</label>
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
              {t.admin.login.submit}
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
          {/* Header + Tabs */}
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between mb-12"
          >
            <div>
              <h1 className="text-4xl md:text-5xl font-bold text-gradient mb-4">
                {t.admin.title}
              </h1>
              {/* Language Selector */}
              <div className="flex items-center gap-3">
                <span className="text-sm text-foreground/70">{t.admin.languageSelector}:</span>
                <div className="flex gap-2">
                  {availableLanguages.map((lang) => (
                    <button
                      key={lang.code}
                      onClick={() => setAdminEditingLanguage(lang.code)}
                      className={`px-3 py-1 rounded-lg text-sm transition-colors ${
                        adminEditingLanguage === lang.code
                          ? 'bg-white/20 text-white border-white/30'
                          : 'bg-white/5 text-foreground/70 border-white/10 hover:bg-white/10'
                      }`}
                      style={{
                        ...(adminEditingLanguage === lang.code ? {
                          // Активная кнопка - темная на светлых темах
                          '--active-bg': 'var(--theme-active-bg, rgba(255, 255, 255, 0.2))',
                          '--active-text': 'var(--theme-active-text, white)',
                          '--active-border': 'var(--theme-active-border, rgba(255, 255, 255, 0.3))',
                          backgroundColor: 'var(--active-bg)',
                          color: 'var(--active-text)',
                          borderColor: 'var(--active-border)'
                        } : {
                          // Неактивная кнопка
                          '--inactive-bg': 'var(--theme-inactive-bg, rgba(255, 255, 255, 0.05))',
                          '--inactive-text': 'var(--theme-inactive-text, rgba(255, 255, 255, 0.7))',
                          '--inactive-border': 'var(--theme-inactive-border, rgba(255, 255, 255, 0.1))',
                          backgroundColor: 'var(--inactive-bg)',
                          color: 'var(--inactive-text)',
                          borderColor: 'var(--inactive-border)'
                        })
                      }}
                    >
                      {lang.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
            <div className="flex gap-4">
              <GlassButton onClick={() => setIsAddingTemplate(true)}>
                {t.admin.templates.add}
              </GlassButton>
              <GlassButton variant="secondary" onClick={handleLogout}>
                Выйти
              </GlassButton>
            </div>
          </motion.div>

          <div className="flex gap-2 mb-10">
            <button onClick={() => setActiveTab('templates')} className={`px-4 py-2 rounded-xl border ${activeTab==='templates' ? 'border-white/30 bg-white/10' : 'border-white/10 hover:border-white/20'}`}>{t.admin.tabs.templates}</button>
            <button onClick={() => setActiveTab('calculator')} className={`px-4 py-2 rounded-xl border ${activeTab==='calculator' ? 'border-white/30 bg-white/10' : 'border-white/10 hover:border-white/20'}`}>{t.admin.tabs.calculator}</button>
            <button onClick={() => setActiveTab('telegram')} className={`px-4 py-2 rounded-xl border ${activeTab==='telegram' ? 'border-white/30 bg-white/10' : 'border-white/10 hover:border-white/20'}`}>{t.admin.tabs.telegram}</button>
            <button onClick={() => setActiveTab('security')} className={`px-4 py-2 rounded-xl border ${activeTab==='security' ? 'border-white/30 bg-white/10' : 'border-white/10 hover:border-white/20'}`}>{(t as any)?.admin?.tabs?.security || 'Безопасность'}</button>
          </div>

          {/* Add/Edit Template Form */}
          <AnimatePresence>
            {activeTab==='templates' && (isAddingTemplate || editingTemplate) && (
              <motion.div
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -50 }}
                transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                className="glass-card p-8 mb-12"
              >
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold text-gradient">
                    {editingTemplate ? t.admin.templates.edit : t.admin.templates.add}
                  </h2>
                  {editingTemplate && (
                    <GlassButton variant="ghost" onClick={cancelEdit}>
                      {t.admin.templates.form.back}
                    </GlassButton>
                  )}
                </div>
                <div className="text-sm text-foreground/60 bg-white/5 px-3 py-1 rounded-lg inline-block mb-4">
                  {t.admin.templates.form.currentLanguage}: {getLanguageLabel(adminEditingLanguage)}
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-foreground/80 mb-2 font-medium">{t.admin.templates.form.title}</label>
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
                    <label className="block text-foreground/80 mb-2 font-medium">{t.admin.templates.form.category}</label>
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
                    <label className="block text-foreground/80 mb-2 font-medium">{t.admin.templates.form.description}</label>
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
                    <label className="block text-foreground/80 mb-2 font-medium">{t.admin.templates.form.price}</label>
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
                    <label className="block text-foreground/80 mb-2 font-medium">{t.admin.templates.form.demoUrl}</label>
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
                    <label className="block text-foreground/80 mb-2 font-medium">{t.admin.templates.form.technologies}</label>
                    <div className="flex gap-2 mb-3">
                      <input
                        type="text"
                        value={techInput}
                        onChange={(e) => setTechInput(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTechnology())}
                        className="flex-1 px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-foreground focus:outline-none focus:border-white/30"
                        placeholder={t.admin.templates.form.addTech}
                      />
                      <GlassButton variant="ghost" onClick={addTechnology}>
                        {t.common.add}
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
                    {editingTemplate ? t.admin.templates.form.save : t.admin.templates.add}
                  </GlassButton>
                  <GlassButton variant="secondary" onClick={cancelEdit}>
                    {t.common.cancel}
                  </GlassButton>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Templates List */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          >
            {activeTab==='templates' && (
              <>
                <h2 className="text-2xl font-bold text-foreground mb-6">{t.admin.templates.title} ({templates.length})</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {templates.map((template) => (
                    <motion.div key={template.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }} className="glass-card p-6">
                      <h3 className="text-xl font-bold text-foreground mb-2">{template.title}</h3>
                      <p className="text-foreground/70 text-sm mb-3">{template.description}</p>
                      <div className="text-sm text-foreground/60 mb-4">Категория: {categories.find(cat => cat.id === template.category)?.name}</div>
                      <div className="text-lg font-bold text-gradient mb-4">{template.price}</div>
                      <div className="flex gap-2">
                        <GlassButton variant="ghost" size="sm" onClick={() => setEditingTemplate(template)}>{t.common.edit}</GlassButton>
                        <GlassButton variant="secondary" size="sm" onClick={() => handleDeleteTemplate(template.id)}>{t.common.delete}</GlassButton>
                      </div>
                    </motion.div>
                  ))}
                </div>
                {templates.length === 0 && (
                  <div className="text-center py-12"><p className="text-xl text-foreground/60">Пока нет добавленных шаблонов</p></div>
                )}
              </>
            )}
          </motion.div>

          {activeTab==='calculator' && (
            <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }} className="glass-card p-8">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gradient">{t.admin.calculator.title}</h2>
                <div className="text-sm text-foreground/60 bg-white/5 px-3 py-1 rounded-lg">
                  {t.admin.calculator.currentLanguage}: {getLanguageLabel(adminEditingLanguage)}
                </div>
              </div>

              {/* Управление разделами калькулятора */}
              <div className="mb-8 p-6 bg-white/5 rounded-xl border border-white/10">
                <h3 className="text-xl font-semibold text-foreground mb-4">Управление разделами калькулятора</h3>
                
                {/* Список существующих разделов */}
                <div className="space-y-3 mb-6">
                  {calculatorSections.map((section, idx) => (
                    <div key={section.key} className="flex items-center gap-3 p-3 rounded-lg bg-white/5 border border-white/10 group">
                      {/* Drag handle */}
                      <div className="cursor-move text-foreground/40 hover:text-foreground/70 transition-colors" title="Перетащите для изменения порядка">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                          <path d="M8 6h8v2H8V6zm0 4h8v2H8v-2zm0 4h8v2H8v-2z"/>
                        </svg>
                      </div>
                      
                      {/* Order controls */}
                      <div className="flex flex-col gap-1">
                        <button 
                          onClick={() => {
                            if (idx > 0) {
                              setCalculatorSections(prev => {
                                const newSections = [...prev];
                                [newSections[idx], newSections[idx - 1]] = [newSections[idx - 1], newSections[idx]];
                                return newSections;
                              });
                            }
                          }}
                          disabled={idx === 0}
                          className="w-6 h-4 text-xs bg-white/10 hover:bg-white/20 disabled:opacity-30 disabled:cursor-not-allowed rounded flex items-center justify-center"
                          title="Переместить вверх"
                        >
                          ↑
                        </button>
                        <button 
                          onClick={() => {
                            if (idx < calculatorSections.length - 1) {
                              setCalculatorSections(prev => {
                                const newSections = [...prev];
                                [newSections[idx], newSections[idx + 1]] = [newSections[idx + 1], newSections[idx]];
                                return newSections;
                              });
                            }
                          }}
                          disabled={idx === calculatorSections.length - 1}
                          className="w-6 h-4 text-xs bg-white/10 hover:bg-white/20 disabled:opacity-30 disabled:cursor-not-allowed rounded flex items-center justify-center"
                          title="Переместить вниз"
                        >
                          ↓
                        </button>
                      </div>

                      {section.icon && <span className="text-lg">{section.icon}</span>}
                      <input 
                        className="flex-1 px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-foreground" 
                        value={section.label} 
                        onChange={(e) => {
                          setCalculatorSections(prev => prev.map((s, i) => 
                            i === idx ? { ...s, label: e.target.value } : s
                          ));
                        }}
                      />
                      <input 
                        className="w-20 px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-foreground" 
                        value={section.icon} 
                        onChange={(e) => {
                          setCalculatorSections(prev => prev.map((s, i) => 
                            i === idx ? { ...s, icon: e.target.value } : s
                          ));
                        }}
                        placeholder="🎯"
                      />
                      <button 
                        onClick={() => {
                          if (calculatorSections.length > 1) {
                            setCalculatorSections(prev => prev.filter((_, i) => i !== idx));
                            // Удаляем раздел из calcOptions
                            setCalcOptions(prev => {
                              const next = { ...prev } as any;
                              delete next[section.key];
                              return next;
                            });
                          }
                        }}
                        disabled={calculatorSections.length <= 1}
                        className="w-8 h-8 text-xs bg-red-500/20 hover:bg-red-500/30 disabled:opacity-30 disabled:cursor-not-allowed rounded flex items-center justify-center text-red-400"
                        title="Удалить раздел"
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>

                {/* Добавление нового раздела */}
                <div className="flex gap-2">
                  <input 
                    id="new-section-key" 
                    placeholder="Ключ раздела (например: customSection)" 
                    className="flex-1 px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-foreground" 
                  />
                  <input 
                    id="new-section-label" 
                    placeholder="Название раздела" 
                    className="flex-1 px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-foreground" 
                  />
                  <input 
                    id="new-section-icon" 
                    placeholder="🎯" 
                    className="w-20 px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-foreground" 
                  />
                  <GlassButton 
                    variant="ghost" 
                    size="sm" 
                    onClick={() => {
                      const keyEl = document.getElementById('new-section-key') as HTMLInputElement;
                      const labelEl = document.getElementById('new-section-label') as HTMLInputElement;
                      const iconEl = document.getElementById('new-section-icon') as HTMLInputElement;
                      
                      if (!keyEl.value || !labelEl.value) return;
                      
                      const newKey = keyEl.value;
                      const newLabel = labelEl.value;
                      const newIcon = iconEl.value || '🎯';
                      
                      // Проверяем, что ключ уникален
                      if (calculatorSections.some(s => s.key === newKey)) {
                        toast({
                          title: 'Ошибка',
                          description: 'Раздел с таким ключом уже существует',
                          variant: 'destructive'
                        });
                        return;
                      }
                      
                      // Добавляем новый раздел
                      setCalculatorSections(prev => [...prev, { key: newKey, label: newLabel, icon: newIcon }]);
                      
                      // Добавляем пустой массив в calcOptions
                      setCalcOptions(prev => ({
                        ...prev,
                        [newKey]: []
                      }));
                      
                      // Очищаем поля
                      keyEl.value = '';
                      labelEl.value = '';
                      iconEl.value = '';
                      
                      toast({
                        title: 'Успех',
                        description: 'Новый раздел добавлен'
                      });
                    }}
                  >
                    Добавить раздел
                  </GlassButton>
                </div>
              </div>
              {calculatorSections.map((section) => {
                const groupKey = section.key as keyof CalcOptions;
                const groupLabel = section.label;
                return (
                <div key={groupKey} className="mb-8">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-xl font-semibold text-foreground">{groupLabel}</h3>
                    <div className="flex gap-2">
                      <input id={`new-${groupKey}-id`} placeholder="id" className="w-28 px-3 py-2 rounded-lg bg-white/5 border border-white/10" />
                      <input id={`new-${groupKey}-name`} placeholder="Название" className="w-44 px-3 py-2 rounded-lg bg-white/5 border border-white/10" />
                      <select id={`new-${groupKey}-type`} className="w-32 px-3 py-2 rounded-lg bg-white/5 border border-white/10">
                        <option value="fixed">Фиксированная</option>
                        <option value="multiplier">Множитель</option>
                      </select>
                      <input id={`new-${groupKey}-value`} type="number" step="0.1" placeholder="Значение" className="w-28 px-3 py-2 rounded-lg bg-white/5 border border-white/10" />
                      <GlassButton variant="ghost" size="sm" onClick={() => {
                        const idEl = document.getElementById(`new-${groupKey}-id`) as HTMLInputElement;
                        const nameEl = document.getElementById(`new-${groupKey}-name`) as HTMLInputElement;
                        const typeEl = document.getElementById(`new-${groupKey}-type`) as HTMLSelectElement;
                        const valueEl = document.getElementById(`new-${groupKey}-value`) as HTMLInputElement;
                        if (!idEl.value || !nameEl.value || !valueEl.value) return;
                        
                        const priceType = typeEl.value as 'fixed' | 'multiplier';
                        const value = Number(valueEl.value);
                        
                        setCalcOptions(prev => {
                          const next = { ...prev } as any;
                          if (priceType === 'fixed') {
                            next[groupKey] = [...next[groupKey], { 
                              id: idEl.value, 
                              name: nameEl.value, 
                              price: value,
                              priceType: 'fixed',
                              multiplier: 1
                            }];
                          } else {
                            next[groupKey] = [...next[groupKey], { 
                              id: idEl.value, 
                              name: nameEl.value, 
                              multiplier: value,
                              priceType: 'multiplier',
                              price: 0
                            }];
                          }
                          return next;
                        });
                        idEl.value = '';
                        nameEl.value = '';
                        valueEl.value = '';
                      }}>Добавить</GlassButton>
                    </div>
                  </div>
                  <div className="space-y-2">
                    {(calcOptions as any)[groupKey].map((item: any, idx: number) => (
                      <div key={item.id} className="flex items-center gap-3 p-3 rounded-xl bg-white/5 border border-white/10 group">
                        {/* Drag handle */}
                        <div className="cursor-move text-foreground/40 hover:text-foreground/70 transition-colors" title="Перетащите для изменения порядка">
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M8 6h8v2H8V6zm0 4h8v2H8v-2zm0 4h8v2H8v-2z"/>
                          </svg>
                        </div>
                        
                        {/* Order controls */}
                        <div className="flex flex-col gap-1">
                          <button 
                            onClick={() => {
                              if (idx > 0) {
                                setCalcOptions(prev => {
                                  const next = { ...prev } as any;
                                  const items = [...next[groupKey]];
                                  [items[idx], items[idx - 1]] = [items[idx - 1], items[idx]];
                                  next[groupKey] = items;
                                  return next;
                                });
                              }
                            }}
                            disabled={idx === 0}
                            className="w-6 h-4 text-xs bg-white/10 hover:bg-white/20 disabled:opacity-30 disabled:cursor-not-allowed rounded flex items-center justify-center"
                            title="Переместить вверх"
                          >
                            ↑
                          </button>
                          <button 
                            onClick={() => {
                              if (idx < (calcOptions as any)[groupKey].length - 1) {
                                setCalcOptions(prev => {
                                  const next = { ...prev } as any;
                                  const items = [...next[groupKey]];
                                  [items[idx], items[idx + 1]] = [items[idx + 1], items[idx]];
                                  next[groupKey] = items;
                                  return next;
                                });
                              }
                            }}
                            disabled={idx === (calcOptions as any)[groupKey].length - 1}
                            className="w-6 h-4 text-xs bg-white/10 hover:bg-white/20 disabled:opacity-30 disabled:cursor-not-allowed rounded flex items-center justify-center"
                            title="Переместить вниз"
                          >
                            ↓
                          </button>
                        </div>

                        <input className="w-36 px-3 py-2 rounded-lg bg-white/5 border border-white/10" value={item.id} onChange={(e)=>{
                          setCalcOptions(prev=>{ const next = { ...prev } as any; next[groupKey][idx].id = e.target.value; return next; });
                        }} />
                        <input className="flex-1 px-3 py-2 rounded-lg bg-white/5 border border-white/10" value={item.name} onChange={(e)=>{
                          setCalcOptions(prev=>{ const next = { ...prev } as any; next[groupKey][idx].name = e.target.value; return next; });
                        }} />
                        <select className="w-32 px-3 py-2 rounded-lg bg-white/5 border border-white/10" value={item.priceType || 'fixed'} onChange={(e)=>{
                          const newPriceType = e.target.value as 'fixed' | 'multiplier';
                          setCalcOptions(prev=>{ 
                            const next = { ...prev } as any; 
                            next[groupKey][idx].priceType = newPriceType;
                            // Сбрасываем значения при смене типа
                            if (newPriceType === 'fixed') {
                              next[groupKey][idx].multiplier = 1;
                            } else {
                              next[groupKey][idx].price = 0;
                            }
                            return next; 
                          });
                        }}>
                          <option value="fixed">Фиксированная</option>
                          <option value="multiplier">Множитель</option>
                        </select>
                        {item.priceType === 'fixed' ? (
                          <input type="number" className="w-32 px-3 py-2 rounded-lg bg-white/5 border border-white/10" value={item.price} onChange={(e)=>{
                            setCalcOptions(prev=>{ const next = { ...prev } as any; next[groupKey][idx].price = Number(e.target.value); return next; });
                          }} />
                        ) : (
                          <input type="number" step="0.1" className="w-32 px-3 py-2 rounded-lg bg-white/5 border border-white/10" value={item.multiplier} onChange={(e)=>{
                            setCalcOptions(prev=>{ const next = { ...prev } as any; next[groupKey][idx].multiplier = Number(e.target.value); return next; });
                          }} />
                        )}
                        <GlassButton variant="secondary" size="sm" onClick={()=>{
                          setCalcOptions(prev=>{ const next = { ...prev } as any; next[groupKey] = next[groupKey].filter((_: any, i: number)=> i!==idx); return next; });
                        }}>Удалить</GlassButton>
                      </div>
                    ))}
                  </div>
                </div>
                );
              })}
              <div className="flex gap-3">
                      <GlassButton glow onClick={saveCalculatorConfig}>{t.admin.calculator.save}</GlassButton>
                      <GlassButton variant="secondary" onClick={()=>{ localStorage.removeItem('calculator-options'); toast({ title: 'Сброшено', description: 'Возвращены настройки по умолчанию' }); }}>{t.admin.calculator.reset}</GlassButton>
              </div>
            </motion.div>
          )}

          {activeTab==='telegram' && (
            <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }} className="glass-card p-8">
              <h2 className="text-2xl font-bold text-gradient mb-6">{t.admin.telegram.title}</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="md:col-span-2">
                  <label className="block text-foreground/80 mb-2 font-medium">{t.admin.telegram.botToken}</label>
                  <input className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-foreground" value={tgConfig.botToken} onChange={(e)=> setTgConfig(prev=> ({...prev, botToken: e.target.value}))} placeholder="12345:ABCDEF..." />
                </div>
                <div>
                  <label className="block text-foreground/80 mb-2 font-medium">{t.admin.telegram.username}</label>
                  <input className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-foreground" value={tgConfig.username} onChange={(e)=> setTgConfig(prev=> ({...prev, username: e.target.value}))} placeholder="@your_bot" />
                </div>
                <div>
                  <label className="block text-foreground/80 mb-2 font-medium">{t.admin.telegram.chatId}</label>
                  <input className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-foreground" value={tgConfig.chatId} onChange={(e)=> setTgConfig(prev=> ({...prev, chatId: e.target.value}))} placeholder="6793841885" />
                </div>
              </div>
              <div className="flex gap-3 mt-6">
                <GlassButton glow onClick={async ()=>{ await fetch('/api/settings', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ telegram: tgConfig }) }); toast({ title: 'Сохранено', description: 'Telegram настройки обновлены' }); }}>{t.admin.telegram.save}</GlassButton>
                <GlassButton variant="secondary" onClick={async ()=>{ setTgConfig({ botToken: '', username: '', chatId: '' }); await fetch('/api/settings', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ telegram: { botToken: '', username: '', chatId: '' } }) }); toast({ title: 'Сброшено' }); }}>{t.admin.telegram.reset}</GlassButton>
              </div>
              <div className="text-sm text-foreground/60 mt-4">Данные хранятся в общей базе (сервер).</div>
            </motion.div>
          )}

          {activeTab==='security' && (
            <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }} className="glass-card p-8">
              <h2 className="text-2xl font-bold text-gradient mb-6">Безопасность — Доступ к админке</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-foreground/80 mb-2 font-medium">Логин (username)</label>
                  <input className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-foreground" value={adminCreds.username} onChange={(e)=> setAdminCreds(prev=> ({...prev, username: e.target.value}))} placeholder="admin" />
                </div>
                <div>
                  <label className="block text-foreground/80 mb-2 font-medium">Новый пароль</label>
                  <input type="password" className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-foreground" value={adminCreds.password} onChange={(e)=> setAdminCreds(prev=> ({...prev, password: e.target.value}))} placeholder="••••••••" />
                </div>
                <div>
                  <label className="block text-foreground/80 mb-2 font-medium">Подтверждение пароля</label>
                  <input type="password" className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-foreground" value={adminCreds.confirm} onChange={(e)=> setAdminCreds(prev=> ({...prev, confirm: e.target.value}))} placeholder="••••••••" />
                </div>
              </div>
              <div className="flex gap-3 mt-6">
                <GlassButton glow onClick={async ()=>{
                  if (adminCreds.password && adminCreds.password !== adminCreds.confirm) { toast({ title: t.common.error, description: 'Пароли не совпадают', variant: 'destructive' }); return; }
                  const payload: any = { admin: { username: adminCreds.username } };
                  if (adminCreds.password) payload.admin.password = adminCreds.password;
                  const r = await fetch('/api/settings', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
                  const j = await r.json().catch(()=>({}));
                  if (!r.ok || !j?.ok) { toast({ title: t.common.error, description: j?.error || 'Не удалось сохранить', variant:'destructive' }); return; }
                  setAdminCreds(prev=> ({ ...prev, password: '', confirm: '' }));
                  toast({ title: t.common.success, description: 'Данные доступа обновлены' });
                }}>Сохранить доступ</GlassButton>
                <GlassButton variant="secondary" onClick={()=> setAdminCreds(prev=> ({ ...prev, password: '', confirm: '' }))}>Сбросить поля</GlassButton>
              </div>
              <div className="text-sm text-foreground/60 mt-4">Логин хранится открыто, пароль — как SHA‑256 хэш в таблице настроек.</div>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Admin;