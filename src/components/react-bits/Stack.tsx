import { useEffect, useRef, useState } from 'react';
import { cn } from '@/lib/utils';

interface StackItem {
  id: number | string;
  content: React.ReactNode;
}

interface StackProps {
  items: StackItem[];
  offset?: number;
  scaleFactor?: number;
  className?: string;
}

export const Stack = ({ 
  items, 
  offset = 20, 
  scaleFactor = 0.05,
  className = '' 
}: StackProps) => {
  const [scrollY, setScrollY] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      if (containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect();
        const viewportHeight = window.innerHeight;
        const elementTop = rect.top;
        const elementHeight = rect.height;
        
        // Calculate scroll progress (0 to 1)
        const scrollProgress = Math.max(
          0,
          Math.min(
            1,
            (viewportHeight - elementTop) / (viewportHeight + elementHeight)
          )
        );
        
        setScrollY(scrollProgress);
      }
    };

    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div ref={containerRef} className={cn('relative', className)}>
      {items.map((item, index) => {
        const scale = 1 - (items.length - 1 - index) * scaleFactor;
        const translateY = (items.length - 1 - index) * offset * (1 - scrollY * 0.5);
        
        return (
          <div
            key={item.id}
            className="relative mb-8 last:mb-0"
            style={{
              transform: `translateY(${translateY}px) scale(${scale})`,
              transformOrigin: 'top center',
              transition: 'transform 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
              zIndex: index
            }}
          >
            {item.content}
          </div>
        );
      })}
    </div>
  );
};
