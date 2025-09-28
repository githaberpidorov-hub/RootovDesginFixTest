// Обновлено: изменена надпись с "Демо" на "Сайт" в шаблонах
export type LanguageCode = "RU" | "ENG" | "UK";

export interface Translations {
  // Navigation
  nav: {
    home: string;
    portfolio: string;
  };
  
  // Common
  common: {
    loading: string;
    error: string;
    success: string;
    cancel: string;
    save: string;
    edit: string;
    delete: string;
    add: string;
    close: string;
    back: string;
    next: string;
    submit: string;
    order: string;
    demo: string;
    more: string;
    contact: string;
  };

  // Home page
  home: {
    hero: {
      title: string;
      subtitle: string;
      description: string;
      orderProject: string;
      viewWorks: string;
    };
    services: {
      title: string;
      description: string;
      landing: {
        title: string;
        description: string;
        features: string[];
        price: string;
      };
      corporate: {
        title: string;
        description: string;
        features: string[];
        price: string;
      };
      ecommerce: {
        title: string;
        description: string;
        features: string[];
        price: string;
      };
    };
    advantages: {
      title: string;
      modernDesign: {
        title: string;
        description: string;
      };
      fastDevelopment: {
        title: string;
        description: string;
      };
      support: {
        title: string;
        description: string;
      };
      seoReady: {
        title: string;
        description: string;
      };
    };
    cta: {
      title: string;
      description: string;
      contactUs: string;
      viewPortfolio: string;
    };
  };

  // Portfolio page
  portfolio: {
    title: string;
    description: string;
    categories: {
      all: string;
      landing: string;
      corporate: string;
      ecommerce: string;
      portfolio: string;
    };
    noProjects: string;
    cta: {
      title: string;
      description: string;
      orderCustom: string;
    };
  };

  // Request page
  request: {
    title: string;
    description: string;
    form: {
      template: {
        label: string;
        placeholder: string;
        notSelected: string;
      };
      phone: {
        label: string;
        placeholder: string;
      };
      telegram: {
        label: string;
        placeholder: string;
      };
      description: {
        label: string;
        placeholder: string;
      };
      submit: string;
      submitting: string;
    };
    notifications?: {
      submittedSuccess: string;
      submittedError: string;
      phoneRequired: string;
    };
  };

  // Admin page
  admin: {
    title: string;
    languageSelector: string;
    login: {
      title: string;
      username: string;
      password: string;
      submit: string;
      success: string;
      error: string;
    };
    tabs: {
      templates: string;
      calculator: string;
      telegram: string;
    };
    templates: {
      title: string;
      add: string;
      edit: string;
      delete: string;
      form: {
        title: string;
        category: string;
        description: string;
        price: string;
        demoUrl: string;
        technologies: string;
        addTech: string;
        save: string;
        cancel: string;
        currentLanguage: string;
      };
      categories: {
        landing: string;
        corporate: string;
        ecommerce: string;
        portfolio: string;
      };
    };
    calculator: {
      title: string;
      websiteType: string;
      complexity: string;
      timeline: string;
      features: string;
      design: string;
      save: string;
      reset: string;
      currentLanguage: string;
    };
    telegram: {
      title: string;
      botToken: string;
      username: string;
      chatId: string;
      save: string;
      reset: string;
    };
  };

  // Frontend Calculator UI
  calculatorUi: {
    title: string;
    subtitle: string;
    filled: string;
    websiteType: string;
    complexity: string;
    timeline: string;
    features: string;
    design: string;
    estimatedPrice: string;
    consultCta: string;
    fromPrefix: string; // e.g., "from $"
    multiplyPrefix: string; // e.g., "×"
    plusPrefix: string; // e.g., "+$"
  };

  // Footer
  footer: {
    company: string;
    rights: string;
  };
}

const translations: Record<LanguageCode, Translations> = {
  RU: {
    nav: {
      home: "Главная",
      portfolio: "Шаблоны",
    },
    common: {
      loading: "Загрузка...",
      error: "Ошибка",
      success: "Успешно",
      cancel: "Отмена",
      save: "Сохранить",
      edit: "Редактировать",
      delete: "Удалить",
      add: "Добавить",
      close: "Закрыть",
      back: "Назад",
      next: "Далее",
      submit: "Отправить",
      order: "Заказать",
      demo: "Демо",
      more: "Подробнее",
      contact: "Связаться с нами",
    },
    home: {
      hero: {
        title: "Создание сайтов",
        subtitle: "под ключ",
        description: "Разрабатываем современные веб-сайты с уникальным дизайном и безупречной функциональностью",
        orderProject: "Заказать проект",
        viewWorks: "Посмотреть работы",
      },
      services: {
        title: "Наши услуги",
        description: "Полный цикл создания веб-сайтов от идеи до запуска",
        landing: {
          title: "Лендинги",
          description: "Продающие страницы с высокой конверсией",
          features: ["Адаптивный дизайн", "SEO оптимизация", "Быстрая загрузка"],
          price: "от $500",
        },
        corporate: {
          title: "Корпоративные сайты",
          description: "Представительские сайты для бизнеса",
          features: ["CMS система", "Многоязычность", "Интеграции"],
          price: "от $1,200",
        },
        ecommerce: {
          title: "Интернет-магазины",
          description: "Полнофункциональные eCommerce решения",
          features: ["Каталог товаров", "Корзина", "Платежи"],
          price: "от $2,500",
        },
      },
      advantages: {
        title: "Почему выбирают нас",
        modernDesign: {
          title: "Современный дизайн",
          description: "Используем последние тренды в веб-дизайне",
        },
        fastDevelopment: {
          title: "Быстрая разработка",
          description: "Сдаем проекты в оговоренные сроки",
        },
        support: {
          title: "Техподдержка",
          description: "Поддерживаем и развиваем ваш сайт",
        },
        seoReady: {
          title: "SEO готовность",
          description: "Все сайты оптимизированы для поисковиков",
        },
      },
      cta: {
        title: "Готовы начать проект?",
        description: "Свяжитесь с нами для обсуждения деталей и получения персонального предложения",
        contactUs: "Связаться с нами",
        viewPortfolio: "Посмотреть портфолио",
      },
    },
    portfolio: {
      title: "Наши работы",
      description: "Портфолио выполненных проектов — от лендингов до сложных веб-приложений",
      categories: {
        all: "Все проекты",
        landing: "Лендинги",
        corporate: "Корпоративные",
        ecommerce: "E-commerce",
        portfolio: "Портфолио",
      },
      noProjects: "В этой категории пока нет проектов",
      cta: {
        title: "Не нашли подходящий проект?",
        description: "Мы создадим уникальный дизайн специально для ваших задач и требований",
        orderCustom: "Заказать индивидуальный проект",
      },
    },
    request: {
      title: "Оставить заявку",
      description: "Выберите шаблон (необязательно) и оставьте контакты. Мы свяжемся для обсуждения деталей.",
      form: {
        template: {
          label: "Шаблон (необязательно)",
          placeholder: "— Не выбирать —",
          notSelected: "— Не выбирать —",
        },
        phone: {
          label: "Номер телефона *",
          placeholder: "+380 99 123 45 67",
        },
        telegram: {
          label: "Telegram (необязательно)",
          placeholder: "@username",
        },
        description: {
          label: "Описание (необязательно)",
          placeholder: "Расскажите о задаче, желаемых функциях и сроках",
        },
        submit: "Отправить заявку",
        submitting: "Отправка…",
      },
      notifications: {
        submittedSuccess: "Мы скоро свяжемся с вами",
        submittedError: "Не удалось отправить заявку",
        phoneRequired: "Введите номер телефона",
      },
    },
    admin: {
      title: "Админ-панель",
      languageSelector: "Язык редактирования",
      login: {
        title: "Админ-панель",
        username: "Логин",
        password: "Пароль",
        submit: "Войти",
        success: "Добро пожаловать в админ-панель!",
        error: "Неверный логин или пароль",
      },
      tabs: {
        templates: "Шаблоны",
        calculator: "Калькулятор",
        telegram: "Telegram",
      },
      templates: {
        title: "Шаблоны",
        add: "Добавить шаблон",
        edit: "Редактировать шаблон",
        delete: "Удалить",
        form: {
          title: "Название *",
          category: "Категория",
          description: "Описание *",
          price: "Цена *",
          demoUrl: "Demo URL",
          technologies: "Технологии",
          addTech: "Добавить технологию",
          save: "Сохранить",
          cancel: "Отмена",
          back: "Назад",
          currentLanguage: "Редактируете на языке",
        },
        categories: {
          landing: "Лендинги",
          corporate: "Корпоративные",
          ecommerce: "E-commerce",
          portfolio: "Портфолио",
        },
      },
      calculator: {
        title: "Калькулятор — конфигурация",
        websiteType: "Тип сайта",
        complexity: "Сложность",
        timeline: "Сроки",
        features: "Доп. функции",
        design: "Дизайн",
        save: "Сохранить калькулятор",
        reset: "Сбросить",
        currentLanguage: "Редактируете на языке",
      },
      telegram: {
        title: "Telegram — настройки",
        botToken: "Bot Token",
        username: "Username (для справки)",
        chatId: "Chat ID получателя",
        save: "Сохранить",
        reset: "Сбросить",
      },
    },
    calculatorUi: {
      title: "Калькулятор стоимости",
      subtitle: "Подберите конфигурацию — увидите ориентировочную цену и сможете оставить заявку",
      filled: "Заполнено",
      websiteType: "Тип сайта",
      complexity: "Сложность",
      timeline: "Сроки",
      features: "Дополнительные функции",
      design: "Дизайн",
      estimatedPrice: "Примерная стоимость",
      consultCta: "Получить консультацию",
      fromPrefix: "от $",
      multiplyPrefix: "×",
      plusPrefix: "+$",
    },
    footer: {
      company: "© 2025 Rootov Design LLC.",
      rights: "Все права защищены.",
    },
  },
  ENG: {
    nav: {
      home: "Home",
      portfolio: "Templates",
    },
    common: {
      loading: "Loading...",
      error: "Error",
      success: "Success",
      cancel: "Cancel",
      save: "Save",
      edit: "Edit",
      delete: "Delete",
      add: "Add",
      close: "Close",
      back: "Back",
      next: "Next",
      submit: "Submit",
      order: "Order",
      demo: "Demo",
      more: "More",
      contact: "Contact Us",
    },
    home: {
      hero: {
        title: "Website Design",
        subtitle: "Turnkey Solutions",
        description: "We develop modern websites with unique design and flawless functionality",
        orderProject: "Order Project",
        viewWorks: "View Works",
      },
      services: {
        title: "Our Services",
        description: "Complete website development cycle from idea to launch",
        landing: {
          title: "Landing Pages",
          description: "High-converting sales pages",
          features: ["Responsive Design", "SEO Optimization", "Fast Loading"],
          price: "from $500",
        },
        corporate: {
          title: "Corporate Websites",
          description: "Business representative websites",
          features: ["CMS System", "Multilingual", "Integrations"],
          price: "from $1,200",
        },
        ecommerce: {
          title: "E-commerce",
          description: "Full-featured eCommerce solutions",
          features: ["Product Catalog", "Shopping Cart", "Payments"],
          price: "from $2,500",
        },
      },
      advantages: {
        title: "Why Choose Us",
        modernDesign: {
          title: "Modern Design",
          description: "We use the latest trends in web design",
        },
        fastDevelopment: {
          title: "Fast Development",
          description: "We deliver projects on time",
        },
        support: {
          title: "Technical Support",
          description: "We maintain and develop your website",
        },
        seoReady: {
          title: "SEO Ready",
          description: "All websites are optimized for search engines",
        },
      },
      cta: {
        title: "Ready to Start Your Project?",
        description: "Contact us to discuss details and get a personalized offer",
        contactUs: "Contact Us",
        viewPortfolio: "View Portfolio",
      },
    },
    portfolio: {
      title: "Our Works",
      description: "Portfolio of completed projects — from landing pages to complex web applications",
      categories: {
        all: "All Projects",
        landing: "Landing Pages",
        corporate: "Corporate",
        ecommerce: "E-commerce",
        portfolio: "Portfolio",
      },
      noProjects: "No projects in this category yet",
      cta: {
        title: "Didn't Find a Suitable Project?",
        description: "We will create a unique design specifically for your tasks and requirements",
        orderCustom: "Order Custom Project",
      },
    },
    request: {
      title: "Submit Request",
      description: "Choose a template (optional) and leave your contacts. We will contact you to discuss details.",
      form: {
        template: {
          label: "Template (optional)",
          placeholder: "— Don't choose —",
          notSelected: "— Don't choose —",
        },
        phone: {
          label: "Phone Number *",
          placeholder: "+1 234 567 8900",
        },
        telegram: {
          label: "Telegram (optional)",
          placeholder: "@username",
        },
        description: {
          label: "Description (optional)",
          placeholder: "Tell us about the task, desired functions and deadlines",
        },
        submit: "Submit Request",
        submitting: "Submitting…",
      },
      notifications: {
        submittedSuccess: "We will contact you soon",
        submittedError: "Failed to submit request",
        phoneRequired: "Please enter your phone number",
      },
    },
    admin: {
      title: "Admin Panel",
      languageSelector: "Editing Language",
      login: {
        title: "Admin Panel",
        username: "Username",
        password: "Password",
        submit: "Login",
        success: "Welcome to admin panel!",
        error: "Invalid username or password",
      },
      tabs: {
        templates: "Templates",
        calculator: "Calculator",
        telegram: "Telegram",
      },
      templates: {
        title: "Templates",
        add: "Add Template",
        edit: "Edit Template",
        delete: "Delete",
        form: {
          title: "Title *",
          category: "Category",
          description: "Description *",
          price: "Price *",
          demoUrl: "Demo URL",
          technologies: "Technologies",
          addTech: "Add Technology",
          save: "Save",
          cancel: "Cancel",
          back: "Back",
          currentLanguage: "Editing in language",
        },
        categories: {
          landing: "Landing Pages",
          corporate: "Corporate",
          ecommerce: "E-commerce",
          portfolio: "Portfolio",
        },
      },
      calculator: {
        title: "Calculator — Configuration",
        websiteType: "Website Type",
        complexity: "Complexity",
        timeline: "Timeline",
        features: "Additional Features",
        design: "Design",
        save: "Save Calculator",
        reset: "Reset",
        currentLanguage: "Editing in language",
      },
      telegram: {
        title: "Telegram — Settings",
        botToken: "Bot Token",
        username: "Username (for reference)",
        chatId: "Recipient Chat ID",
        save: "Save",
        reset: "Reset",
      },
    },
    calculatorUi: {
      title: "Price Calculator",
      subtitle: "Configure options — see an estimated price and send a request",
      filled: "Completed",
      websiteType: "Website Type",
      complexity: "Complexity",
      timeline: "Timeline",
      features: "Additional Features",
      design: "Design",
      estimatedPrice: "Estimated Price",
      consultCta: "Get a Consultation",
      fromPrefix: "from $",
      multiplyPrefix: "×",
      plusPrefix: "+$",
    },
    footer: {
      company: "© 2025 Rootov Design LLC.",
      rights: "All rights reserved.",
    },
  },
  UK: {
    nav: {
      home: "Головна",
      portfolio: "Шаблони",
    },
    common: {
      loading: "Завантаження...",
      error: "Помилка",
      success: "Успішно",
      cancel: "Скасувати",
      save: "Зберегти",
      edit: "Редагувати",
      delete: "Видалити",
      add: "Додати",
      close: "Закрити",
      back: "Назад",
      next: "Далі",
      submit: "Відправити",
      order: "Замовити",
      demo: "Демо",
      more: "Детальніше",
      contact: "Зв'язатися з нами",
    },
    home: {
      hero: {
        title: "Створення сайтів",
        subtitle: "під ключ",
        description: "Розробляємо сучасні веб-сайти з унікальним дизайном та бездоганною функціональністю",
        orderProject: "Замовити проект",
        viewWorks: "Подивитися роботи",
      },
      services: {
        title: "Наші послуги",
        description: "Повний цикл створення веб-сайтів від ідеї до запуску",
        landing: {
          title: "Лендінги",
          description: "Продаючі сторінки з високою конверсією",
          features: ["Адаптивний дизайн", "SEO оптимізація", "Швидке завантаження"],
          price: "від $500",
        },
        corporate: {
          title: "Корпоративні сайти",
          description: "Представницькі сайти для бізнесу",
          features: ["CMS система", "Багатомовність", "Інтеграції"],
          price: "від $1,200",
        },
        ecommerce: {
          title: "Інтернет-магазини",
          description: "Повнофункціональні eCommerce рішення",
          features: ["Каталог товарів", "Кошик", "Платежі"],
          price: "від $2,500",
        },
      },
      advantages: {
        title: "Чому обирають нас",
        modernDesign: {
          title: "Сучасний дизайн",
          description: "Використовуємо останні тренди у веб-дизайні",
        },
        fastDevelopment: {
          title: "Швидка розробка",
          description: "Здаємо проекти в обумовлені терміни",
        },
        support: {
          title: "Техпідтримка",
          description: "Підтримуємо та розвиваємо ваш сайт",
        },
        seoReady: {
          title: "SEO готовність",
          description: "Всі сайти оптимізовані для пошуковиків",
        },
      },
      cta: {
        title: "Готові розпочати проект?",
        description: "Зв'яжіться з нами для обговорення деталей та отримання персональної пропозиції",
        contactUs: "Зв'язатися з нами",
        viewPortfolio: "Подивитися портфоліо",
      },
    },
    portfolio: {
      title: "Наші роботи",
      description: "Портфоліо виконаних проектів — від лендінгів до складних веб-додатків",
      categories: {
        all: "Всі проекти",
        landing: "Лендінги",
        corporate: "Корпоративні",
        ecommerce: "E-commerce",
        portfolio: "Портфоліо",
      },
      noProjects: "У цій категорії поки немає проектів",
      cta: {
        title: "Не знайшли підходящий проект?",
        description: "Ми створимо унікальний дизайн спеціально для ваших завдань та вимог",
        orderCustom: "Замовити індивідуальний проект",
      },
    },
    request: {
      title: "Залишити заявку",
      description: "Оберіть шаблон (необов'язково) та залиште контакти. Ми зв'яжемося для обговорення деталей.",
      form: {
        template: {
          label: "Шаблон (необов'язково)",
          placeholder: "— Не обирати —",
          notSelected: "— Не обирати —",
        },
        phone: {
          label: "Номер телефону *",
          placeholder: "+380 99 123 45 67",
        },
        telegram: {
          label: "Telegram (необов'язково)",
          placeholder: "@username",
        },
        description: {
          label: "Опис (необов'язково)",
          placeholder: "Розкажіть про завдання, бажані функції та терміни",
        },
        submit: "Відправити заявку",
        submitting: "Відправка…",
      },
      notifications: {
        submittedSuccess: "Ми скоро з вами зв'яжемося",
        submittedError: "Не вдалося відправити заявку",
        phoneRequired: "Введіть номер телефону",
      },
    },
    admin: {
      title: "Адмін-панель",
      languageSelector: "Мова редагування",
      login: {
        title: "Адмін-панель",
        username: "Логін",
        password: "Пароль",
        submit: "Увійти",
        success: "Ласкаво просимо в адмін-панель!",
        error: "Невірний логін або пароль",
      },
      tabs: {
        templates: "Шаблони",
        calculator: "Калькулятор",
        telegram: "Telegram",
      },
      templates: {
        title: "Шаблони",
        add: "Додати шаблон",
        edit: "Редагувати шаблон",
        delete: "Видалити",
        form: {
          title: "Назва *",
          category: "Категорія",
          description: "Опис *",
          price: "Ціна *",
          demoUrl: "Demo URL",
          technologies: "Технології",
          addTech: "Додати технологію",
          save: "Зберегти",
          cancel: "Скасувати",
          back: "Назад",
          currentLanguage: "Редагуєте мовою",
        },
        categories: {
          landing: "Лендінги",
          corporate: "Корпоративні",
          ecommerce: "E-commerce",
          portfolio: "Портфоліо",
        },
      },
      calculator: {
        title: "Калькулятор — конфігурація",
        websiteType: "Тип сайту",
        complexity: "Складність",
        timeline: "Терміни",
        features: "Дод. функції",
        design: "Дизайн",
        save: "Зберегти калькулятор",
        reset: "Скинути",
        currentLanguage: "Редагуєте мовою",
      },
      telegram: {
        title: "Telegram — налаштування",
        botToken: "Bot Token",
        username: "Username (для довідки)",
        chatId: "Chat ID отримувача",
        save: "Зберегти",
        reset: "Скинути",
      },
    },
    calculatorUi: {
      title: "Калькулятор вартості",
      subtitle: "Підберіть конфігурацію — побачите орієнтовну ціну та зможете залишити заявку",
      filled: "Заповнено",
      websiteType: "Тип сайту",
      complexity: "Складність",
      timeline: "Терміни",
      features: "Додаткові функції",
      design: "Дизайн",
      estimatedPrice: "Орієнтовна вартість",
      consultCta: "Отримати консультацію",
      fromPrefix: "від $",
      multiplyPrefix: "×",
      plusPrefix: "+$",
    },
    footer: {
      company: "© 2025 Rootov Design LLC.",
      rights: "Всі права захищені.",
    },
  },
};

export const getTranslations = (language: LanguageCode): Translations => {
  return translations[language] || translations.RU;
};

export const getAvailableLanguages = (): { code: LanguageCode; label: string }[] => [
  { code: "RU", label: "RU" },
  { code: "ENG", label: "ENG" },
  { code: "UK", label: "UA" },
];

// Функция для получения отображаемого названия языка
export const getLanguageLabel = (code: LanguageCode): string => {
  const language = getAvailableLanguages().find(lang => lang.code === code);
  return language?.label || code;
};
