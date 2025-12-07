
import React, { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Sparkles, BookOpen, Clock, Megaphone } from 'lucide-react';
import { useData } from '../contexts/DataContext';
import PersonaGrid from '../components/PersonaGrid';
import ScrollReveal from '../components/ScrollReveal';
import LiquidBackground from '../components/LiquidBackground';
import { PersonaContent } from '../types';

// Helper to calculate time ago
const timeAgo = (dateStr: string | undefined) => {
    if (!dateStr) return '';
    const date = new Date(dateStr);
    if (isNaN(date.getTime())) return dateStr; // Fallback to raw string if not a valid ISO/Date
    const now = new Date();
    const diff = Math.floor((now.getTime() - date.getTime()) / 1000); // seconds

    if (diff < 60) return 'Just now';
    if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
    if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
    if (diff < 604800) return `${Math.floor(diff / 86400)}d ago`;
    return date.toLocaleDateString();
};

const toRoman = (num: number): string => {
  const lookup = [
    {value: 1000, symbol: 'M'},
    {value: 900, symbol: 'CM'},
    {value: 500, symbol: 'D'},
    {value: 400, symbol: 'CD'},
    {value: 100, symbol: 'C'},
    {value: 90, symbol: 'XC'},
    {value: 50, symbol: 'L'},
    {value: 40, symbol: 'XL'},
    {value: 10, symbol: 'X'},
    {value: 9, symbol: 'IX'},
    {value: 5, symbol: 'V'},
    {value: 4, symbol: 'IV'},
    {value: 1, symbol: 'I'}
  ];
  let roman = '';
  let n = num;
  for (const i of lookup) {
    while (n >= i.value) {
      roman += i.symbol;
      n -= i.value;
    }
  }
  return roman;
};

const Overview: React.FC = () => {
  const { globalContent, personas } = useData();
  const announcement = globalContent.announcement;

  // --- LATEST UPDATES LOGIC ---
  const updates = useMemo(() => {
    const allUpdates: { 
        id: string; 
        type: 'WRITING' | 'WORK' | 'WHISPER' | 'PROJECT'; 
        title: string; 
        description?: string; 
        date: string; // ISO string for sorting
        link: string;
        personaTitle: string;
    }[] = [];

    (Object.values(personas) as PersonaContent[]).forEach(p => {
        // 1. Writings (Expanded to Chapters)
        if (p.writings) {
            p.writings.forEach(w => {
                if (!w.hidden) {
                    // Check if chapters exist, iterate them as updates
                    if (w.chapters && w.chapters.length > 0) {
                         w.chapters.forEach((chap, cIdx) => {
                             allUpdates.push({
                                 id: `${w.id}-c${cIdx}`,
                                 type: 'WRITING',
                                 title: `Chapter ${toRoman(cIdx + 1)}: ${chap.title}`,
                                 description: `New entry in chronicle "${w.title}"`,
                                 date: new Date(chap.date).toISOString(), // Chapters have their own dates
                                 link: `/personas/${p.id}`,
                                 personaTitle: p.title
                             });
                         });
                    } else {
                        // Fallback for empty writings just in case, though chapters usually drive date
                        allUpdates.push({
                            id: w.id,
                            type: 'WRITING',
                            title: w.title,
                            description: w.excerpt,
                            date: new Date(w.date).toISOString(),
                            link: `/personas/${p.id}`,
                            personaTitle: p.title
                        });
                    }
                }
            });
        }

        // 2. Whispers
        if (p.whispers) {
            p.whispers.forEach(w => {
                if (!w.hidden) {
                    allUpdates.push({
                        id: w.id,
                        type: 'WHISPER',
                        title: 'Echo from the Void',
                        description: w.content,
                        date: new Date(w.date).toISOString(),
                        link: `/personas/${p.id}`,
                        personaTitle: p.title
                    });
                }
            });
        }

        // 3. Works (using dateAdded)
        if (p.works) {
            p.works.forEach((w, idx) => {
                if (!w.hidden && w.dateAdded) {
                     allUpdates.push({
                        id: `work-${idx}`,
                        type: 'WORK',
                        title: w.title,
                        description: `New Artifact: ${w.category}`,
                        date: w.dateAdded,
                        link: `/personas/${p.id}`,
                        personaTitle: p.title
                    });
                }
            });
        }
    });

    // Sort descending by date
    return allUpdates
        .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
        .slice(0, 5); // Take top 5

  }, [personas]);


  return (
    <div className="flex-grow flex flex-col items-center relative w-full">
      
      {/* Interactive Liquid Energy Layer */}
      <LiquidBackground />

      {/* Announcement Banner */}
      {announcement?.enabled && (
          <div className="w-full relative z-20 bg-soul-deep/40 border-b border-soul-fire/30 backdrop-blur-md overflow-hidden group">
              <div className="absolute inset-0 bg-soul-fire/5 animate-pulse-slow"></div>
              <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-center relative">
                  {announcement.link ? (
                      <Link to={announcement.link} className="flex items-center gap-3 text-sm md:text-base font-serif tracking-wide text-soul-fire hover:text-white transition-colors">
                          <Megaphone size={16} className="animate-bounce" />
                          <span className="uppercase">{announcement.text}</span>
                          <ArrowRight size={14} className="opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
                      </Link>
                  ) : (
                      <div className="flex items-center gap-3 text-sm md:text-base font-serif tracking-wide text-soul-fire">
                          <Megaphone size={16} />
                          <span className="uppercase">{announcement.text}</span>
                      </div>
                  )}
              </div>
          </div>
      )}

      {/* Skeletal Circle Decoration */}
      <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] md:w-[600px] md:h-[600px] border border-white/5 rounded-full pointer-events-none opacity-50 z-0"></div>
      <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[225px] h-[225px] md:w-[450px] md:h-[450px] border border-dashed border-soul-fire/10 rounded-full pointer-events-none z-0"></div>

      {/* Hero Section */}
      <div className="min-h-screen flex flex-col items-center justify-center p-4 md:p-6 text-center relative z-10 mb-12 w-full">
        <ScrollReveal width="100%">
          {/* Expanded max-width on large screens to allow title to be single line */}
          <div className="max-w-4xl lg:max-w-7xl mx-auto space-y-6 md:space-y-8 p-8 md:p-12">
            <div className="relative inline-block animate-float">
              <div className="absolute inset-0 bg-soul-fire blur-[40px] md:blur-[60px] opacity-20 rounded-full"></div>
              <img 
                src={globalContent.logoUrl} 
                alt="Main Emblem" 
                className="relative w-32 h-32 md:w-64 md:h-64 mx-auto object-contain drop-shadow-[0_0_25px_rgb(var(--color-soul-fire)/0.4)] filter contrast-125"
              />
            </div>
            
            <div className="px-2">
              <h1 className="text-3xl sm:text-4xl md:text-6xl lg:text-7xl font-serif font-bold text-transparent bg-clip-text bg-gradient-to-b from-white via-bone to-slate-600 tracking-wider mb-2 leading-tight uppercase lg:whitespace-nowrap">
                {globalContent.siteTitle}
              </h1>
              <div className="h-px w-24 md:w-32 mx-auto bg-gradient-to-r from-transparent via-soul-fire to-transparent opacity-50"></div>
            </div>
            
            <p className="text-sm sm:text-lg md:text-2xl text-soul-fire font-light tracking-[0.2em] uppercase opacity-90 font-serif flex flex-col sm:block gap-2">
              <span>Dreamer</span>
              <span className="hidden sm:inline text-bone-dark/30 mx-2">|</span>
              <span>Wanderer</span>
              <span className="hidden sm:inline text-bone-dark/30 mx-2">|</span>
              <span>Creator</span>
            </p>

            <p className="max-w-2xl mx-auto text-bone-dark text-sm md:text-lg leading-relaxed font-sans px-4">
              Welcome to the digital ossuary. Here lies a convergence of disparate identities—Code, Art, Vision, and Memory—forged in obsidian and soulfire. Explore the facets of my work and the philosophy behind the creation.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 md:gap-6 justify-center pt-8 w-full max-w-xs sm:max-w-none mx-auto">
              {/* ENTER THE FORGE (Primary) */}
              <Link 
                to="/personas" 
                className="group relative px-6 md:px-8 py-3 md:py-3 bg-transparent overflow-hidden flex items-center justify-center w-full sm:w-auto"
              >
                <div className="absolute inset-0 border border-bone/20 transition-all duration-300 group-hover:border-soul-fire/50 group-hover:shadow-[0_0_15px_rgb(var(--color-soul-fire)/0.4)]"></div>
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-soul-fire/10 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000 ease-in-out"></div>
                <span className="relative font-serif font-semibold tracking-wider text-bone transition-colors duration-300 group-hover:text-soul-fire flex items-center gap-2 text-sm md:text-base">
                  ENTER THE FORGE <ArrowRight className="w-4 h-4" />
                </span>
                {/* Corner Decorations */}
                <div className="absolute top-0 left-0 w-[2px] h-[2px] bg-bone/50 group-hover:bg-soul-fire transition-colors"></div>
                <div className="absolute top-0 right-0 w-[2px] h-[2px] bg-bone/50 group-hover:bg-soul-fire transition-colors"></div>
                <div className="absolute bottom-0 left-0 w-[2px] h-[2px] bg-bone/50 group-hover:bg-soul-fire transition-colors"></div>
                <div className="absolute bottom-0 right-0 w-[2px] h-[2px] bg-bone/50 group-hover:bg-soul-fire transition-colors"></div>
              </Link>

              {/* THE SAGE (About) */}
              <Link 
                to="/about"
                className="group relative px-6 md:px-8 py-3 md:py-3 bg-transparent overflow-hidden flex items-center justify-center w-full sm:w-auto"
              >
                <div className="absolute inset-0 border border-bone/20 transition-all duration-300 group-hover:border-soul-ice/50 group-hover:shadow-[0_0_15px_rgb(var(--color-soul-ice)/0.4)]"></div>
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-soul-ice/10 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000 ease-in-out"></div>
                <span className="relative font-serif font-semibold tracking-wider text-bone transition-colors duration-300 group-hover:text-soul-ice flex items-center gap-2 text-sm md:text-base">
                  THE SAGE
                </span>
                {/* Corner Decorations */}
                <div className="absolute top-0 left-0 w-[2px] h-[2px] bg-bone/50 group-hover:bg-soul-ice transition-colors"></div>
                <div className="absolute top-0 right-0 w-[2px] h-[2px] bg-bone/50 group-hover:bg-soul-ice transition-colors"></div>
                <div className="absolute bottom-0 left-0 w-[2px] h-[2px] bg-bone/50 group-hover:bg-soul-ice transition-colors"></div>
                <div className="absolute bottom-0 right-0 w-[2px] h-[2px] bg-bone/50 group-hover:bg-soul-ice transition-colors"></div>
              </Link>

              {/* SUMMON ME (Contact) */}
              <Link 
                to="/contact"
                className="group relative px-6 md:px-8 py-3 md:py-3 bg-transparent overflow-hidden flex items-center justify-center w-full sm:w-auto"
              >
                <div className="absolute inset-0 border border-bone/20 transition-all duration-300 group-hover:border-soul-fire/50 group-hover:shadow-[0_0_15px_rgb(var(--color-soul-fire)/0.4)]"></div>
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-soul-fire/10 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000 ease-in-out"></div>
                <span className="relative font-serif font-semibold tracking-wider text-bone transition-colors duration-300 group-hover:text-soul-fire flex items-center gap-2 text-sm md:text-base">
                  SUMMON ME
                </span>
                {/* Corner Decorations */}
                <div className="absolute top-0 left-0 w-[2px] h-[2px] bg-bone/50 group-hover:bg-soul-fire transition-colors"></div>
                <div className="absolute top-0 right-0 w-[2px] h-[2px] bg-bone/50 group-hover:bg-soul-fire transition-colors"></div>
                <div className="absolute bottom-0 left-0 w-[2px] h-[2px] bg-bone/50 group-hover:bg-soul-fire transition-colors"></div>
                <div className="absolute bottom-0 right-0 w-[2px] h-[2px] bg-bone/50 group-hover:bg-soul-fire transition-colors"></div>
              </Link>
            </div>
          </div>
        </ScrollReveal>
      </div>

      {/* --- LATEST UPDATES SECTION --- */}
      {updates.length > 0 && (
          <div className="w-full max-w-5xl px-4 md:px-6 mb-16 relative z-10">
              <ScrollReveal width="100%">
                  <div className="bg-obsidian-light/50 backdrop-blur-md border border-white/5 rounded-xl p-6 md:p-8">
                      <h2 className="text-xl md:text-2xl font-serif text-white mb-6 flex items-center gap-2">
                          <Sparkles className="text-soul-fire w-5 h-5"/> Latest Manifestations
                      </h2>
                      
                      <div className="space-y-4">
                          {updates.map((item, idx) => (
                              <Link 
                                key={idx} 
                                to={item.link} 
                                className="block bg-black/40 border border-white/5 hover:border-soul-fire/40 rounded-lg p-4 transition-all group"
                              >
                                  <div className="flex justify-between items-start">
                                      <div className="space-y-1">
                                          <div className="flex items-center gap-2 text-xs uppercase tracking-widest text-soul-fire/80">
                                              <span>{item.type}</span>
                                              <span className="text-bone-dark/30">•</span>
                                              <span>{item.personaTitle}</span>
                                          </div>
                                          <h3 className="text-bone-light font-bold text-sm md:text-base group-hover:text-white transition-colors">
                                              {item.title}
                                          </h3>
                                          {item.description && (
                                              <p className="text-bone-dark text-xs md:text-sm line-clamp-1 italic opacity-70">
                                                  {item.description}
                                              </p>
                                          )}
                                      </div>
                                      
                                      <div className="flex flex-col items-end gap-1 min-w-[60px]">
                                          <div className="text-[10px] text-bone-dark/50 flex items-center gap-1">
                                             <Clock size={10} /> {timeAgo(item.date)}
                                          </div>
                                          <ArrowRight className="w-4 h-4 text-soul-fire opacity-0 group-hover:opacity-100 -translate-x-2 group-hover:translate-x-0 transition-all" />
                                      </div>
                                  </div>
                              </Link>
                          ))}
                      </div>
                  </div>
              </ScrollReveal>
          </div>
      )}

      {/* Personas Section */}
      <div className="w-full bg-obsidian-dark/50 backdrop-blur-sm py-16 md:py-24 border-t border-white/5 relative z-10">
        <div className="text-center mb-12 md:mb-16 px-4">
            <ScrollReveal width="100%">
              <h2 className="text-3xl md:text-5xl font-serif font-bold text-white mb-4">The Manifestations</h2>
              <div className="h-px w-24 mx-auto bg-soul-fire/50"></div>
              <p className="mt-4 text-bone-dark text-sm md:text-base">Five paths, one destination.</p>
            </ScrollReveal>
        </div>
        
        <ScrollReveal width="100%" delay={200}>
          <PersonaGrid />
        </ScrollReveal>
      </div>

    </div>
  );
};

export default Overview;
