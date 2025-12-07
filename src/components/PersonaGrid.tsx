
import React from 'react';
import { Link } from 'react-router-dom';
import { PERSONA_DATA } from '../constants';
import { PersonaType, UserRole } from '../types';
import { Hexagon, PenTool, Camera, Palette, Film, BookOpen, ArrowRight, EyeOff } from 'lucide-react';
import { useData } from '../contexts/DataContext';

const PersonaGrid: React.FC = () => {
  const { personas, user } = useData();
  const isAdmin = user?.role === UserRole.ADMIN;

  const getIcon = (type: PersonaType) => {
    switch (type) {
      case PersonaType.DREAM_WEAVER: return <PenTool className="w-6 h-6 md:w-8 md:h-8" />;
      case PersonaType.STILLWANDERER: return <Camera className="w-6 h-6 md:w-8 md:h-8" />;
      case PersonaType.GLYPHSMITH: return <Palette className="w-6 h-6 md:w-8 md:h-8" />;
      case PersonaType.FRAME_WEAVER: return <Film className="w-6 h-6 md:w-8 md:h-8" />;
      case PersonaType.ABYSS: return <BookOpen className="w-6 h-6 md:w-8 md:h-8" />;
      default: return <Hexagon className="w-6 h-6 md:w-8 md:h-8" />;
    }
  };

  // Sort personas to keep order consistent (using constant key order)
  const personaList = (Object.keys(PERSONA_DATA) as PersonaType[])
    .map(key => ({ type: key, data: personas[key] }));

  return (
    <div className="columns-1 md:columns-2 lg:columns-3 xl:columns-4 gap-6 md:gap-8 px-4 w-full space-y-6 md:space-y-8">
        {personaList.map(({ type, data }, index) => {
          // VISIBILITY LOGIC:
          // If hidden and NOT admin, do not render.
          // If hidden and IS admin, render with opacity and indicator.
          if (data.hidden && !isAdmin) return null;

          return (
            <Link 
              to={`/personas/${data.id}`} 
              key={data.id}
              className={`break-inside-avoid group relative block perspective-1000 cursor-none overflow-hidden rounded-lg 
                ${data.hidden ? 'opacity-50 hover:opacity-75 border border-red-500/50' : ''}
              `}
            >
              {/* Admin Hidden Indicator */}
              {data.hidden && (
                <div className="absolute top-2 right-2 z-50 bg-red-900/90 text-white px-3 py-1 text-[10px] font-bold uppercase tracking-widest rounded flex items-center gap-1 shadow-lg">
                   <EyeOff size={12} /> Hidden
                </div>
              )}

              {/* Card Container */}
              <div className="relative bg-obsidian-light border border-white/10 hover:border-soul-fire/50 transition-all duration-500 ease-out transform group-hover:-translate-y-2 group-hover:shadow-[0_0_30px_rgb(var(--color-soul-fire)/0.15)] flex flex-col">
                
                {/* Background Image - Natural Height logic using padding hack or just letting it flow. 
                    Here we let content flow naturally. */}
                <div className="relative w-full">
                  <img 
                    src={data.image} 
                    alt={data.title}
                    referrerPolicy="no-referrer"
                    className="w-full h-auto block opacity-60 grayscale group-hover:opacity-80 group-hover:grayscale-0 transition-all duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-b from-obsidian-light/10 via-transparent to-obsidian-light group-hover:from-obsidian-light/5 group-hover:to-obsidian-light/90 transition-all duration-500"></div>
                  
                  {/* Icon Overlay on top of image */}
                  <div className="absolute top-0 left-0 p-6 w-full flex items-start justify-between">
                    <div className="text-soul-fire opacity-80 group-hover:opacity-100 group-hover:scale-110 transition-all duration-500 drop-shadow-[0_0_8px_rgb(var(--color-soul-fire)/0.5)] bg-black/50 p-2 rounded-full backdrop-blur-sm border border-white/5">
                        {getIcon(type)}
                    </div>
                    <span className="text-xs font-serif text-bone-dark/70 bg-black/50 px-2 py-1 rounded backdrop-blur-sm">0{index + 1}</span>
                  </div>
                </div>

                {/* Content Footer */}
                <div className="p-6 md:p-8 bg-obsidian-light relative z-10">
                   <div className="transform translate-y-0 transition-transform duration-500">
                     <h2 className="text-xl md:text-2xl font-serif font-bold text-white mb-1 drop-shadow-md">
                       {data.title}
                     </h2>
                     <p className="text-[10px] md:text-xs font-bold text-soul-fire uppercase tracking-widest mb-3 opacity-90">
                       {data.subtitle}
                     </p>
                     <div className="h-px w-12 bg-soul-fire/50 mb-4 group-hover:w-full transition-all duration-700"></div>
                     <p className="text-bone-dark text-xs md:text-sm leading-relaxed line-clamp-4 font-sans group-hover:text-bone transition-colors drop-shadow-sm">
                       {data.description}
                     </p>
                   </div>

                   <div className="flex items-center gap-2 text-sm font-serif text-soul-fire mt-4 md:mt-6 opacity-0 -translate-x-4 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-500">
                     <span>ENTER REALM</span>
                     <ArrowRight className="w-4 h-4" />
                   </div>
                </div>
              </div>
            </Link>
          );
        })}
      </div>
  );
};

export default PersonaGrid;
