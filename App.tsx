
import React, { useEffect, useState, useMemo } from 'react';
import { HashRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar';
import EerieCursor from './components/EerieCursor';
import AdminControls from './components/AdminControls'; 
import Overview from './pages/Overview';
import Personas from './pages/Personas';
import PersonaDetail from './pages/PersonaDetail';
import About from './pages/About';
import AboutProfessional from './pages/AboutProfessional';
import AboutRotaract from './pages/AboutRotaract';
import AboutPersonal from './pages/AboutPersonal';
import Contact from './pages/Contact';
import AdminLogin from './pages/AdminLogin';
import SecretShowoff from './pages/SecretShowoff';
import { DataProvider, useData } from './contexts/DataContext';
import { UserRole } from './types';
import { Linkedin, Github, Instagram, Facebook, Globe } from 'lucide-react';

// Helper to scroll to top on route change
const ScrollToTop = () => {
  const { pathname } = useLocation();
  React.useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
};

const BehanceIcon = ({ size = 18 }: { size?: number }) => (
  <svg viewBox="0 0 24 24" width={size} height={size} fill="currentColor" stroke="none">
    <path d="M22 7h-5v2h5zm-10.3 3.4c-2.3 0-3.9 1.6-3.9 4.2 0 2.6 1.5 4.2 4 4.2 2.3 0 3.6-1.3 3.6-3.8v-.5h-5.4c.1 1.4.9 2.1 2.2 2.1 1 0 1.6-.4 1.8-1.3h1.3c-.2 1.9-1.3 3.1-3.6 3.1zm1.6-3.1h-3.4c.1-1.1.8-1.8 1.8-1.8 1 0 1.6.7 1.6 1.8zm-7.9-1.6c1.9 0 3.2.7 3.2 2.7 0 1.4-.8 2.3-1.8 2.6 1.3.3 2.2 1.2 2.2 2.9 0 2.3-1.6 3.6-4.2 3.6h-7.1v-11.8h7.1zm-2.7 4.7h4.4c1 0 1.5-.5 1.5-1.4 0-1-.5-1.3-1.5-1.3h-4.4v2.7zm0 5.1h4.5c1.1 0 1.7-.5 1.7-1.5 0-1.1-.6-1.6-1.8-1.6h-4.4v3.1z"/>
  </svg>
);

// Social Icon Map
const SOCIAL_ICONS: Record<string, React.ReactNode> = {
  "LinkedIn": <Linkedin size={18} />,
  "GitHub": <Github size={18} />,
  "Instagram": <Instagram size={18} />,
  "Behance": <BehanceIcon size={18} />, 
  "Facebook": <Facebook size={18} />,
  "Website": <Globe size={18} />
};

// Footer component containing the secret admin access
const Footer = () => {
  const { globalContent } = useData();
  const socials = globalContent.contactInfo.socials || [];

  return (
    <footer className="mt-auto py-10 border-t border-soul-fire/10 font-serif relative group/footer bg-obsidian-dark z-20">
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-soul-fire/30 to-transparent"></div>
      
      <div className="w-full max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-6 md:gap-4">
        
        {/* Left: Copyright */}
        <div className="order-3 md:order-1 flex-1 flex flex-col items-center md:items-start text-center md:text-left w-full md:w-auto">
           <div className="text-bone-dark/50 text-xs md:text-sm">
             &copy; {new Date().getFullYear()} {globalContent.siteTitle}.
           </div>
           <div className="text-bone-dark/30 text-[10px] mt-1">All Rights Reserved.</div>
        </div>

        {/* Center: Socials & Logo */}
        <div className="order-1 md:order-2 flex-1 flex flex-col items-center gap-4 w-full md:w-auto">
            <div className="flex items-center gap-2 opacity-70 hover:opacity-100 transition-opacity">
                <img src={globalContent.logoUrl} alt="Small Logo" className="h-8 w-8 grayscale hover:grayscale-0 transition-all object-contain" />
            </div>
            <div className="flex items-center justify-center gap-6 flex-wrap">
               {socials.map((social, idx) => (
                   <a 
                     key={idx} 
                     href={social.url} 
                     target="_blank" 
                     rel="noopener noreferrer"
                     className="text-bone-dark/60 hover:text-soul-fire transition-colors transform hover:scale-110 duration-200"
                     title={social.platform}
                   >
                       {SOCIAL_ICONS[social.platform] || <Globe size={18} />}
                   </a>
               ))}
            </div>
        </div>

        {/* Right: Secret Admin Controls */}
        <div className="order-2 md:order-3 flex-1 flex justify-center md:justify-end items-center w-full md:w-auto">
           <AdminControls />
        </div>
      </div>
    </footer>
  );
};

const FluidBackground = () => {
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      document.documentElement.style.setProperty('--mouse-x', `${e.clientX}px`);
      document.documentElement.style.setProperty('--mouse-y', `${e.clientY}px`);
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return <div className="fluid-bg" />;
};

const AppContent: React.FC = () => {
  const { user } = useData();
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Optimization: Memoize particles so they don't re-render/move on every scroll event
  const particles = useMemo(() => {
    return [...Array(20)].map((_, i) => ({
      key: i,
      width: Math.random() * 4 + 1 + 'px',
      height: Math.random() * 4 + 1 + 'px',
      top: Math.random() * 100 + 'vh',
      left: Math.random() * 100 + '%',
      animation: `rise ${Math.random() * 10 + 10}s linear infinite`,
      animationDelay: `-${Math.random() * 10}s`
    }));
  }, []);

  // --- EXCLUSIVE ROUTE FOR SHOWOFF ---
  if (user?.role === UserRole.SHOWOFF) {
    return (
      <React.Fragment>
        <EerieCursor />
        <SecretShowoff />
      </React.Fragment>
    );
  }

  // --- STANDARD APP ---
  return (
    <Router>
      <div className="min-h-screen bg-obsidian text-bone selection:bg-soul-fire selection:text-obsidian-darkest overflow-x-hidden relative flex flex-col">
        <ScrollToTop />
        <FluidBackground />
        <EerieCursor />
        
        {/* Skeletal / Phoenix Ambient Effects with Parallax */}
        <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
          {/* Rising Ash Particles - Parallax layer 1 (Fast) */}
          <div style={{ transform: `translateY(-${scrollY * 0.2}px)` }}>
            {particles.map((p) => (
              <div 
                  key={p.key}
                  className="absolute bg-soul-fire/10 rounded-full blur-[1px]"
                  style={{
                    width: p.width,
                    height: p.height,
                    top: p.top,
                    left: p.left,
                    animation: p.animation,
                    animationDelay: p.animationDelay
                  }}
              />
            ))}
          </div>
          
          {/* Large Ambient Glows - Parallax layer 2 (Slow) */}
          <div style={{ transform: `translateY(${scrollY * 0.1}px)` }}>
            <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-soul-deep/20 rounded-full blur-[150px] animate-pulse-slow"></div>
            <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] bg-obsidian-light/80 rounded-full blur-[150px]"></div>
          </div>
        </div>

        <Navbar />

        {/* Adjusted top padding to match responsive navbar (h-16 on mobile, h-24 on desktop) */}
        <main className="relative z-10 pt-16 md:pt-24 flex-grow flex flex-col w-full">
          <Routes>
            <Route path="/" element={<Overview />} />
            <Route path="/personas" element={<Personas />} />
            <Route path="/personas/:id" element={<PersonaDetail />} />
            <Route path="/about" element={<About />} />
            <Route path="/about/professional" element={<AboutProfessional />} />
            <Route path="/about/rotaract" element={<AboutRotaract />} />
            <Route path="/about/personal" element={<AboutPersonal />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/admin" element={<AdminLogin />} />
          </Routes>
        </main>
        
        <Footer />
      </div>
    </Router>
  );
};

const App: React.FC = () => {
  return (
    <DataProvider>
      <AppContent />
    </DataProvider>
  );
};

export default App;
