import { useState, memo } from "react";
import { motion } from "framer-motion";

interface OptionCardProps {
  optionId: string;
  category: string;
  headline: string;
  subline?: string;
  isActive: boolean;
  onClick: () => void;
}

const OptionCard = memo(({
  optionId,
  category,
  headline,
  subline,
  isActive,
  onClick,
}: OptionCardProps) => {
  const [isClicking, setIsClicking] = useState(false);

  const handleClick = () => {
    setIsClicking(true);
    setTimeout(() => setIsClicking(false), 80);
    onClick();
  };

  return (
    <motion.button
      onClick={handleClick}
      className="relative p-4 rounded-2xl border border-white/10 bg-white/5 overflow-hidden group"
      animate={{
        scale: isClicking ? 0.95 : (isActive ? 1.02 : 1),
        borderColor: isActive ? "rgba(255, 255, 255, 0.3)" : "rgba(255, 255, 255, 0.1)",
        backgroundColor: isActive ? "rgba(255, 255, 255, 0.1)" : "rgba(255, 255, 255, 0.05)",
        boxShadow: isActive ? "0 12px 40px rgba(0,0,0,0.35)" : "0 6px 24px rgba(0,0,0,0.28)"
      }}
      transition={{
        duration: isClicking ? 0.15 : 0.3,
        ease: "easeOut"
      }}
      style={{ willChange: 'transform, background, box-shadow, border-color' }}
    >
      {/* Плавное выделение - появляется постепенно */}
      <motion.div
        className="absolute inset-0 rounded-2xl"
        animate={{
          opacity: isActive ? 1 : 0,
          scale: isActive ? 1 : 0.95
        }}
        transition={{
          duration: isClicking ? 0.15 : 0.3,
          ease: "easeOut"
        }}
        style={{
          background: 'linear-gradient(135deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0.05) 100%)'
        }}
      />

      {/* Акцентное кольцо */}
      <motion.div
        className="absolute inset-0 rounded-2xl pointer-events-none"
        animate={{
          opacity: isActive ? 1 : 0
        }}
        transition={{
          duration: isClicking ? 0.15 : 0.3,
          ease: "easeOut"
        }}
        style={{
          background: 'radial-gradient(60% 60% at 20% 0%, rgba(255,255,255,0.15) 0%, rgba(255,255,255,0) 60%)'
        }}
      />

      {/* Контент */}
      <div className="relative z-10 flex items-center gap-3 text-left">
        {/* Заполненный шар с Glow эффектом */}
        <motion.div
          className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0 relative"
          animate={{
            scale: isClicking ? 0.98 : (isActive ? 1.05 : 1),
            opacity: isActive ? 1 : 0.7,
          }}
          transition={{
            duration: isClicking ? 0.08 : 0.3,
            ease: "easeOut"
          }}
        >
          {/* Внешнее свечение */}
          <motion.div
            className="absolute inset-0 rounded-xl"
            animate={{
              opacity: isActive ? 0.6 : 0.2,
              scale: isActive ? 1.3 : 1,
            }}
            transition={{
              duration: isClicking ? 0.08 : 0.4,
              ease: "easeOut"
            }}
            style={{
              background: `
                radial-gradient(circle at 50% 50%, 
                  hsl(var(--primary) / 0.3) 0%, 
                  hsl(var(--primary) / 0.1) 50%, 
                  transparent 80%
                )
              `,
              filter: 'blur(3px)',
            }}
          />
          
          {/* Среднее свечение */}
          <motion.div
            className="absolute inset-0 rounded-xl"
            animate={{
              opacity: isActive ? 0.8 : 0.3,
              scale: isActive ? 1.2 : 1,
            }}
            transition={{
              duration: isClicking ? 0.08 : 0.4,
              ease: "easeOut"
            }}
            style={{
              background: `
                radial-gradient(circle at 50% 50%, 
                  hsl(var(--primary) / 0.4) 0%, 
                  hsl(var(--primary) / 0.2) 60%, 
                  transparent 90%
                )
              `,
              filter: 'blur(1.5px)',
            }}
          />
          
          {/* Тень справа снизу */}
          <motion.div
            className="absolute inset-0 rounded-xl"
            animate={{
              opacity: isActive ? 0.4 : 0.2,
              scale: isActive ? 1.05 : 1,
            }}
            transition={{
              duration: isClicking ? 0.08 : 0.3,
              ease: "easeOut"
            }}
            style={{
              background: `
                radial-gradient(ellipse at 70% 70%, 
                  rgba(0, 0, 0, 0.3) 0%, 
                  rgba(0, 0, 0, 0.1) 50%, 
                  transparent 80%
                )
              `,
              transform: 'translate(1px, 1px)',
            }}
          />
          
          {/* Основной шар */}
          <motion.div
            className="absolute inset-0 rounded-xl"
            animate={{
              opacity: isActive ? 1 : 0.8,
              scale: isActive ? 1.05 : 1,
            }}
            transition={{
              duration: isClicking ? 0.08 : 0.3,
              ease: "easeOut"
            }}
            style={{
              background: `
                radial-gradient(circle at 30% 30%, 
                  hsl(var(--primary) / 0.9) 0%, 
                  hsl(var(--primary) / 0.7) 40%, 
                  hsl(var(--primary) / 0.5) 70%,
                  hsl(var(--primary) / 0.3) 100%
                )
              `,
              boxShadow: `
                inset 0 1px 2px rgba(255, 255, 255, 0.3),
                inset 0 -1px 2px rgba(0, 0, 0, 0.2),
                0 2px 4px rgba(0, 0, 0, 0.1)
              `,
            }}
          />
          
          {/* Блик сверху слева */}
          <motion.div
            className="absolute inset-0 rounded-xl"
            animate={{
              opacity: isActive ? 0.8 : 0.6,
              scale: isActive ? 1.05 : 1,
            }}
            transition={{
              duration: isClicking ? 0.08 : 0.3,
              ease: "easeOut"
            }}
            style={{
              background: `
                radial-gradient(ellipse at 25% 25%, 
                  rgba(255, 255, 255, 0.4) 0%, 
                  rgba(255, 255, 255, 0.2) 30%, 
                  transparent 60%
                )
              `,
            }}
          />
          
          {/* Пульсирующее свечение */}
          <motion.div
            className="absolute inset-0 rounded-xl"
            animate={{
              opacity: isActive ? [0.3, 0.6, 0.3] : 0,
              scale: isActive ? [1.1, 1.2, 1.1] : 1,
            }}
            transition={{
              duration: isActive ? 2 : 0.3,
              ease: "easeInOut",
              repeat: isActive ? Infinity : 0,
            }}
            style={{
              background: `
                radial-gradient(circle at 50% 50%, 
                  hsl(var(--primary) / 0.5) 0%, 
                  transparent 70%
                )
              `,
              filter: 'blur(2px)',
            }}
          />
        </motion.div>

        {/* Текст */}
        <div>
          <motion.div
            className="font-medium text-foreground"
            animate={{
              y: isActive ? -0.2 : 0,
              opacity: 1
            }}
            transition={{
              duration: isClicking ? 0.08 : 0.3,
              ease: "easeOut"
            }}
          >
            {headline}
          </motion.div>
          {subline && (
            <motion.div
              className="text-sm text-foreground/60"
              animate={{
                opacity: isActive ? 1 : 0.85
              }}
              transition={{
                duration: isClicking ? 0.15 : 0.3,
                ease: "easeOut"
              }}
            >
              {subline}
            </motion.div>
          )}
        </div>
      </div>
    </motion.button>
  );
});

OptionCard.displayName = 'OptionCard';

export default OptionCard;
