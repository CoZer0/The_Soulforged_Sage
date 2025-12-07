import React, { useRef, useState } from 'react';

interface TiltContainerProps {
  children: React.ReactNode;
  className?: string;
  intensity?: number; // How much it tilts
  perspective?: number; // Depth
}

const TiltContainer: React.FC<TiltContainerProps> = ({ 
  children, 
  className = "", 
  intensity = 10,
  perspective = 1000 
}) => {
  const ref = useRef<HTMLDivElement>(null);
  const [transform, setTransform] = useState(`perspective(${perspective}px) rotateX(0deg) rotateY(0deg) scale(1)`);
  const [shadow, setShadow] = useState("");

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!ref.current) return;
    const { left, top, width, height } = ref.current.getBoundingClientRect();
    
    // Calculate mouse position relative to center (from -1 to 1)
    const x = (e.clientX - (left + width / 2)) / (width / 2);
    const y = (e.clientY - (top + height / 2)) / (height / 2);

    // Tilt math: Moving mouse UP (negative y) should rotate X upwards (positive) to look 'at' mouse, 
    // or downwards (negative) to tilt away. 
    // Standard tilt effect: Mouse Top-Left -> Tilt Top-Left away or towards?
    // Let's make it follow the mouse (tipping towards cursor)
    const rotateX = -y * intensity; 
    const rotateY = x * intensity;

    setTransform(`perspective(${perspective}px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.02)`);
    
    // Dynamic shadow moving opposite to light source (cursor)
    const shadowX = -x * 20;
    const shadowY = -y * 20;
    setShadow(`${shadowX}px ${shadowY}px 30px rgba(0,0,0,0.4)`);
  };

  const handleMouseLeave = () => {
    setTransform(`perspective(${perspective}px) rotateX(0deg) rotateY(0deg) scale(1)`);
    setShadow("");
  };

  return (
    <div
      ref={ref}
      className={`transition-all duration-300 ease-out will-change-transform ${className}`}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{ transform, boxShadow: shadow }}
    >
      {children}
    </div>
  );
};

export default TiltContainer;