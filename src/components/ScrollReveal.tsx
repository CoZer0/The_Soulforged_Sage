import React, { useEffect, useRef, useState } from 'react';

interface ScrollRevealProps {
  children: React.ReactNode;
  width?: 'fit-content' | '100%';
  delay?: number; // delay in ms
  className?: string;
}

const ScrollReveal: React.FC<ScrollRevealProps> = ({ 
  children, 
  width = 'fit-content', 
  delay = 0,
  className = ""
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.unobserve(entry.target);
        }
      },
      {
        threshold: 0.1,
        rootMargin: "0px 0px -50px 0px"
      }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => {
      if (ref.current) {
        observer.unobserve(ref.current);
      }
    };
  }, []);

  return (
    <div
      ref={ref}
      style={{ 
          width, 
          transitionDelay: `${delay}ms`,
          transitionDuration: '1000ms',
      }}
      className={`transform transition-all ease-out will-change-transform ${
        isVisible 
          ? 'opacity-100 translate-y-0 filter blur-0' 
          : 'opacity-0 translate-y-16 filter blur-[2px]'
      } ${className}`}
    >
      {children}
    </div>
  );
};

export default ScrollReveal;