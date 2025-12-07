import React, { useEffect, useRef } from 'react';

const LiquidBackground: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const lastPosRef = useRef<{ x: number, y: number } | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d', { willReadFrequently: true });
    if (!ctx) return;

    // Configuration
    const scale = 0.2; 
    
    let width = 0;
    let height = 0;
    
    let currentGrid: Float32Array;
    let nextGrid: Float32Array;

    const init = () => {
      width = Math.max(1, Math.ceil(window.innerWidth * scale));
      height = Math.max(1, Math.ceil(window.innerHeight * scale));
      
      canvas.width = width;
      canvas.height = height;
      
      currentGrid = new Float32Array(width * height);
      nextGrid = new Float32Array(width * height);
    };

    init();

    const addEnergy = (x: number, y: number) => {
       if (!currentGrid) return;
       
       const cx = Math.floor(x * scale);
       const cy = Math.floor(y * scale);
       const radius = 4; // Slightly larger for "energy" feel
       const intensity = 35.0; 
       const rSq = radius * radius;

       const minX = Math.max(0, cx - radius);
       const maxX = Math.min(width - 1, cx + radius);
       const minY = Math.max(0, cy - radius);
       const maxY = Math.min(height - 1, cy + radius);

       for(let py = minY; py <= maxY; py++) {
         for(let px = minX; px <= maxX; px++) {
            const distSq = (px - cx) ** 2 + (py - cy) ** 2;
            if (distSq <= rSq) {
               const idx = py * width + px;
               const falloff = 1 - Math.sqrt(distSq)/radius;
               // Accumulate energy but cap it to prevent blowing out
               currentGrid[idx] = Math.min(currentGrid[idx] + intensity * falloff, 150.0);
            }
         }
       }
    };

    const handleInput = (x: number, y: number) => {
        if (lastPosRef.current) {
            const dx = x - lastPosRef.current.x;
            const dy = y - lastPosRef.current.y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            
            const steps = Math.max(1, Math.ceil(distance / 5));

            for (let i = 1; i <= steps; i++) {
                const t = i / steps;
                const lx = lastPosRef.current.x + dx * t;
                const ly = lastPosRef.current.y + dy * t;
                addEnergy(lx, ly);
            }
        } else {
            addEnergy(x, y);
        }
        lastPosRef.current = { x, y };
    };

    const onMouseMove = (e: MouseEvent) => handleInput(e.clientX, e.clientY);
    const onTouchMove = (e: TouchEvent) => {
       if(e.touches[0]) handleInput(e.touches[0].clientX, e.touches[0].clientY);
    };
    
    const onEnd = () => { lastPosRef.current = null; };

    window.addEventListener('resize', init);
    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('touchmove', onTouchMove, { passive: true });
    window.addEventListener('mouseup', onEnd);
    window.addEventListener('touchend', onEnd);

    let animationId: number;

    // Cyan/Blue Base Colors (Reverted from Gold)
    const R_BASE = 34;
    const G_BASE = 211;
    const B_BASE = 238;
    
    // Slightly lower decay for a lingering energy trail
    const DECAY_DIVISOR = 10.0; 

    const loop = () => {
       if (!ctx || width === 0 || height === 0 || !currentGrid || !nextGrid) {
           animationId = requestAnimationFrame(loop);
           return;
       }

       const imgData = ctx.createImageData(width, height);
       const data = imgData.data;
       
       for (let y = 1; y < height - 1; y++) {
         let i = y * width + 1;
         const endI = y * width + width - 1;
         
         while(i < endI) {
            const val = currentGrid[i];
            
            // Neighbors
            const n = currentGrid[i - width];
            const s = currentGrid[i + width];
            const w = currentGrid[i - 1];
            const e = currentGrid[i + 1];
            
            // Diagonals
            const nw = currentGrid[i - width - 1];
            const ne = currentGrid[i - width + 1];
            const sw = currentGrid[i + width - 1];
            const se = currentGrid[i + width + 1];

            // Diffusion calculation
            const sum = val + n + s + w + e + (nw + ne + sw + se) * 0.707;
            const newVal = sum / DECAY_DIVISOR;
            
            nextGrid[i] = newVal;

            if (newVal > 0.5) {
                const pIdx = i * 4;
                // Intensity logic to shift from Cyan to White-Hot at center
                const intensity = Math.min(newVal / 30, 1);
                
                data[pIdx] = Math.min(255, R_BASE + (255 - R_BASE) * intensity);
                data[pIdx + 1] = Math.min(255, G_BASE + (255 - G_BASE) * intensity);
                data[pIdx + 2] = Math.min(255, B_BASE + (255 - B_BASE) * intensity);
                
                // Alpha based on energy value
                data[pIdx + 3] = Math.min(255, newVal * 40);
            }
            
            i++;
         }
       }

       const temp = currentGrid;
       currentGrid = nextGrid;
       nextGrid = temp;
       
       ctx.putImageData(imgData, 0, 0);
       animationId = requestAnimationFrame(loop);
    };

    loop();

    return () => {
        window.removeEventListener('resize', init);
        window.removeEventListener('mousemove', onMouseMove);
        window.removeEventListener('touchmove', onTouchMove);
        window.removeEventListener('mouseup', onEnd);
        window.removeEventListener('touchend', onEnd);
        cancelAnimationFrame(animationId);
    };
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none z-0">
        <canvas 
            ref={canvasRef} 
            className="w-full h-full opacity-60" 
            style={{ filter: 'blur(8px)', mixBlendMode: 'screen' }} 
        />
    </div>
  );
};

export default LiquidBackground;