import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Добавляет cache-busting параметр к URL для предотвращения кэширования
 */
export function addCacheBusting(url: string, forceRefresh = false): string {
  if (!url) return url;
  
  try {
    const urlObj = new URL(url);
    const now = Date.now();
    
    if (forceRefresh) {
      // Принудительное обновление - используем текущее время
      urlObj.searchParams.set('_cb', now.toString());
    } else {
      // Обычное обновление - используем время из localStorage или текущее время
      const cacheKey = `preview-cache-time-${urlObj.hostname}`;
      const lastUpdate = localStorage.getItem(cacheKey);
      const cacheTime = lastUpdate ? parseInt(lastUpdate) : now;
      
      // Обновляем каждые 24 часа
      if (now - cacheTime > 24 * 60 * 60 * 1000) {
        urlObj.searchParams.set('_cb', now.toString());
        localStorage.setItem(cacheKey, now.toString());
      } else if (urlObj.searchParams.has('_cb')) {
        // Если параметр уже есть, оставляем его
        return url;
      } else {
        urlObj.searchParams.set('_cb', cacheTime.toString());
      }
    }
    
    return urlObj.toString();
  } catch {
    // Если URL невалидный, возвращаем как есть
    return url;
  }
}

/**
 * Нормализует URL для использования в качестве ключа кэша
 */
export function normalizeUrl(url: string): string {
  if (!url) return '';
  try {
    const withProtocol = /^(https?:)?\/\//i.test(url) ? url : `https://${url}`;
    const urlObj = new URL(withProtocol);
    // Убираем cache-busting параметры для нормализации
    urlObj.searchParams.delete('_cb');
    return urlObj.toString();
  } catch {
    return url;
  }
}
