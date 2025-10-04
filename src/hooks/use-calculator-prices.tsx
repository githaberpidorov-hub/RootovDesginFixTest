import { useState, useEffect } from 'react';
import { useLanguage } from './use-language';

interface CalculatorPrice {
  id: string;
  name: string;
  price: number;
  multiplier: number;
  priceType: 'fixed' | 'multiplier';
}

interface CalculatorPrices {
  landing: CalculatorPrice | null;
  corporate: CalculatorPrice | null;
  ecommerce: CalculatorPrice | null;
}

export const useCalculatorPrices = () => {
  const [prices, setPrices] = useState<CalculatorPrices>({
    landing: null,
    corporate: null,
    ecommerce: null,
  });
  const [loading, setLoading] = useState(true);
  const { language } = useLanguage();

  useEffect(() => {
    const loadPrices = async () => {
      try {
        setLoading(true);
        
        // Загружаем конфиг калькулятора по выбранному языку
        const res = await fetch(`/api/calculator?language=${language}`);
        const j = await res.json();
        
        if (res.ok && j?.ok && j.config) {
          const cfg = j.config as Record<string, any>;
          
          // Получаем данные о типах сайтов
          const dbKey = `websitetype_${String(language).toLowerCase()}`;
          const websiteTypeData = cfg[dbKey];
          
          if (websiteTypeData) {
            const normalizeGroup = (group: any) => {
              if (!group) return [];
              const entries = Array.isArray(group)
                ? (group as any[]).map((val, idx) => [String(val?.id ?? idx), val] as const)
                : Object.entries(group as Record<string, any>);
              return entries.map(([id, value]) => ({ 
                id, 
                name: value?.label || value?.name || id, 
                price: Number(value?.price || 0),
                multiplier: Number(value?.multiplier || 1),
                priceType: value?.priceType || 'fixed'
              }));
            };

            const websiteTypes = normalizeGroup(websiteTypeData);
            
            setPrices({
              landing: websiteTypes.find(t => t.id === 'landing') || null,
              corporate: websiteTypes.find(t => t.id === 'corporate') || null,
              ecommerce: websiteTypes.find(t => t.id === 'ecommerce') || null,
            });
          }
        }
      } catch (error) {
        console.error('Failed to load calculator prices:', error);
        
        // Fallback на дефолтные цены из калькулятора
        setPrices({
          landing: { id: 'landing', name: 'Лендинг', price: 500, multiplier: 1, priceType: 'fixed' },
          corporate: { id: 'corporate', name: 'Корпоративный сайт', price: 1200, multiplier: 1, priceType: 'fixed' },
          ecommerce: { id: 'ecommerce', name: 'Интернет-магазин', price: 2500, multiplier: 1, priceType: 'fixed' },
        });
      } finally {
        setLoading(false);
      }
    };

    loadPrices();
  }, [language]);

  // Функция для форматирования цены
  const formatPrice = (price: number, prefix: string = 'от $'): string => {
    return `${prefix}${price}`;
  };

  return {
    prices,
    loading,
    formatPrice,
  };
};
