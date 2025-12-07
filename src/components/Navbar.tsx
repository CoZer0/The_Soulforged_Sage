
import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { NAV_LINKS } from '../constants';
import { Menu, X } from 'lucide-react';
import { useData } from '../contexts/DataContext';

const Navbar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const { globalContent } = useData(); // Use dynamic data

  const isActive = (path: string) => {
    if (path === '/') return location.pathname === '/';
    return location.pathname.startsWith(path);
  };

  return (
    <nav className="fixed w-full z-50 top-0 left-0 bg-obsidian-glass backdrop-blur-md border-b border-white/5 transition-all duration-300 h-16 md:h-24">
      <div className="w-full px-4 sm:px-6 lg:px-12 h-full">
        <div className="flex items-center justify-between h-full">
          
          {/* Logo Area - Now Dynamic */}
          <Link to="/" className="flex-shrink-0 flex items-center gap-2 md:gap-3 cursor-none group">
            <div className="relative">
              <div className="absolute inset-0 bg-soul-fire blur-lg opacity-20 group-hover:opacity-40 transition-opacity"></div>
              <img 
                src={globalContent.logoUrl} 
                alt={globalContent.siteTitle} 
                className="relative h-8 w-8 md:h-12 md:w-12 object-contain filter contrast-125 drop-shadow-[0_0_5px_rgb(var(--color-soul-fire)/0.4)]"
              />
            </div>
            <span className="font-serif text-base md:text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-soul-fire to-bone tracking-widest group-hover:text-soul-ice transition-colors">
              {globalContent.siteTitle}
            </span>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-10">
              {NAV_LINKS.map((link) => (
                <Link
                  key={link.name}
                  to={link.path}
                  className={`relative px-1 py-2 text-sm font-medium transition-all duration-300 font-serif tracking-widest uppercase
                    ${isActive(link.path) 
                      ? 'text-soul-fire drop-shadow-[0_0_8px_rgb(var(--color-soul-fire)/0.6)]' 
                      : 'text-bone-dark hover:text-bone hover:drop-shadow-[0_0_5px_rgba(255,255,255,0.3)]'
                    }
                  `}
                >
                  {link.name}
                  <span className={`absolute bottom-0 left-0 w-full h-[1px] bg-soul-fire transform transition-transform duration-300 origin-left
                    ${isActive(link.path) ? 'scale-x-100' : 'scale-x-0'}
                  `}></span>
                </Link>
              ))}
            </div>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-soul-fire hover:text-white p-2 transition-colors"
            >
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {isOpen && (
        <div className="md:hidden bg-obsidian-light border-b border-soul-fire/20 absolute w-full top-16 left-0">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.name}
                to={link.path}
                onClick={() => setIsOpen(false)}
                className={`block px-3 py-4 rounded-md text-base font-medium font-serif border-b border-white/5 last:border-0
                  ${isActive(link.path)
                    ? 'text-soul-fire bg-white/5'
                    : 'text-bone-dark hover:text-white hover:bg-white/5'
                  }
                `}
              >
                {link.name}
              </Link>
            ))}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
