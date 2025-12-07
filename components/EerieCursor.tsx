
import React, { useEffect, useState, useRef } from 'react';

const EerieCursor: React.FC = () => {
  const [position, setPosition] = useState({ x: -100, y: -100 });
  const [isHovering, setIsHovering] = useState(false);
  
  const ghostRef = useRef<HTMLDivElement>(null);
  const mouseRef = useRef({ x: -100, y: -100 });
  const ghostPos = useRef({ x: -100, y: -100 });

  useEffect(() => {
    const updatePosition = (e: MouseEvent) => {
      mouseRef.current = { x: e.clientX, y: e.clientY };
      setPosition({ x: e.clientX, y: e.clientY });
    };

    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (
        target.tagName === 'A' || 
        target.tagName === 'BUTTON' || 
        target.closest('a') || 
        target.closest('button') || 
        target.tagName === 'INPUT' ||
        target.tagName === 'TEXTAREA' ||
        target.classList.contains('cursor-none')
      ) {
        setIsHovering(true);
      } else {
        setIsHovering(false);
      }
    };

    window.addEventListener('mousemove', updatePosition);
    window.addEventListener('mouseover', handleMouseOver);

    let animationFrameId: number;
    const animateGhost = () => {
      const dx = mouseRef.current.x - ghostPos.current.x;
      const dy = mouseRef.current.y - ghostPos.current.y;
      
      if (Math.abs(dx) > 2000 || Math.abs(dy) > 2000) {
         ghostPos.current.x = mouseRef.current.x;
         ghostPos.current.y = mouseRef.current.y;
      } else {
         // Faster lag follow
         ghostPos.current.x += dx * 0.15; 
         ghostPos.current.y += dy * 0.15;
      }

      if (ghostRef.current) {
        ghostRef.current.style.transform = `translate(${ghostPos.current.x}px, ${ghostPos.current.y}px)`;
      }
      
      animationFrameId = requestAnimationFrame(animateGhost);
    };
    animateGhost();

    return () => {
      window.removeEventListener('mousemove', updatePosition);
      window.removeEventListener('mouseover', handleMouseOver);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <>
      {/* GHOST LAYER */}
      <div
        ref={ghostRef}
        className="pointer-events-none fixed top-0 left-0 z-[9998] -translate-x-1/2 -translate-y-1/2 mix-blend-screen will-change-transform"
        style={{ left: 0, top: 0 }}
      >
         <div className={`
            absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2
            rounded-full bg-cyan-500/30 blur-xl
            transition-all duration-300 ease-out
            ${isHovering ? 'w-32 h-32 opacity-40' : 'w-16 h-16 opacity-50'}
         `}></div>

         <div className={`
            absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2
            rounded-full bg-cyan-900/40 blur-[50px]
            animate-pulse-slow
            transition-all duration-500 ease-in-out
            ${isHovering ? 'w-80 h-80 opacity-40' : 'w-40 h-40 opacity-30'}
         `}></div>
      </div>

      {/* MAIN CURSOR LAYER */}
      <div
        className="pointer-events-none fixed top-0 left-0 z-[9999] -translate-x-1/2 -translate-y-1/2 mix-blend-screen will-change-[left,top]"
        style={{
          left: `${position.x}px`,
          top: `${position.y}px`,
        }}
      >
        <div 
          className={`relative flex items-center justify-center transition-all duration-200 ease-out
            ${isHovering ? 'h-4 w-4' : 'h-2 w-2'} 
          `}
        >
          <div className={`absolute rounded-full bg-white shadow-[0_0_20px_rgba(255,255,255,1)] transition-all duration-300 ${isHovering ? 'h-2.5 w-2.5' : 'h-1.5 w-1.5'}`} />
          <div className={`absolute rounded-full bg-cyan-400 opacity-80 blur-md transition-all duration-300 ${isHovering ? 'h-10 w-10' : 'h-5 w-5'}`} />
          <div className="absolute rounded-full bg-cyan-400/30 blur-lg animate-[ping_3s_cubic-bezier(0,0,0.2,1)_infinite] h-full w-full scale-[2]"></div>
        </div>
      </div>
    </>
  );
};

export default EerieCursor;
