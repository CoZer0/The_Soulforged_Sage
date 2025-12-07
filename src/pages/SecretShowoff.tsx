
import React from 'react';
import { useData } from '../contexts/DataContext';
import { LogOut } from 'lucide-react';
import LiquidBackground from '../components/LiquidBackground';

const SecretShowoff: React.FC = () => {
  const { globalContent, logout } = useData();

  return (
    <div className="fixed inset-0 bg-black text-white z-[99999] overflow-hidden flex items-center justify-center font-serif">
      
      {/* Interactive Liquid Energy Layer - Matches Overview */}
      <LiquidBackground />

      {/* Skeletal Circle Decorations - Matches Overview (Rotation Removed) */}
      <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] md:w-[600px] md:h-[600px] border border-white/5 rounded-full pointer-events-none opacity-50 z-0"></div>
      <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[225px] h-[225px] md:w-[450px] md:h-[450px] border border-dashed border-soul-fire/10 rounded-full pointer-events-none z-0"></div>

      {/* Ambient Particles */}
      <div className="absolute inset-0 pointer-events-none z-20">
         {[...Array(15)].map((_, i) => (
            <div key={i} 
                className="absolute rounded-full bg-cyan-100/20 blur-[1px] animate-float"
                style={{
                    width: Math.random() * 3 + 1 + 'px',
                    height: Math.random() * 3 + 1 + 'px',
                    top: Math.random() * 100 + '%',
                    left: Math.random() * 100 + '%',
                    animationDuration: (Math.random() * 10 + 10) + 's'
                }}
            />
         ))}
      </div>

      {/* Center Content */}
      <div className="relative z-30 flex flex-col items-center justify-center space-y-12 animate-in fade-in zoom-in duration-[2000ms]">
        
        <div className="relative group cursor-none animate-float perspective-[1000px]">
            {/* Glowing Aura - Matches Overview Style */}
            <div className="absolute inset-0 bg-soul-fire blur-[50px] opacity-30 rounded-full"></div>
            
            {/* Static Logo (Rotation Removed) */}
            <img 
                src={globalContent.logoUrl} 
                alt={globalContent.siteTitle} 
                className="relative w-40 h-40 md:w-64 md:h-64 object-contain z-10 drop-shadow-[0_0_35px_rgb(var(--color-soul-fire)/0.6)] filter contrast-125"
            />
        </div>
        
        <div className="text-center space-y-4 relative">
            <h1 className="text-3xl md:text-6xl font-bold tracking-[0.15em] text-transparent bg-clip-text bg-gradient-to-b from-white to-slate-600 uppercase drop-shadow-2xl">
                {globalContent.siteTitle}
            </h1>
            
            <div className="flex items-center justify-center gap-4">
                <div className="h-px w-12 md:w-24 bg-gradient-to-r from-transparent to-cyan-900"></div>
                <div className="w-2 h-2 rotate-45 border border-cyan-800"></div>
                <div className="h-px w-12 md:w-24 bg-gradient-to-l from-transparent to-cyan-900"></div>
            </div>

            <p className="text-xs md:text-sm text-cyan-100/40 tracking-[0.5em] uppercase font-light">
                Witness The Void
            </p>
        </div>
      </div>

      {/* Subtle Exit */}
      <button 
        onClick={logout} 
        className="absolute bottom-8 right-8 text-white/20 hover:text-red-500/80 transition-colors p-4 z-50"
        title="Escape"
      >
        <LogOut size={20} />
      </button>
    </div>
  );
};

export default SecretShowoff;
