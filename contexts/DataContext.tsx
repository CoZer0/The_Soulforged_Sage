
import React, { createContext, useContext, useState, useEffect } from 'react';
import { DataContextType, PersonaContent, PersonaType, GlobalContent, User, UserRole, AboutTab, AboutContent, SocialLink } from '../types';
import { PERSONA_DATA, LOGO_URL, ABOUT_DATA, DEFAULT_CONTACT, DEFAULT_ABOUT_PAGE_CONTENT } from '../constants';

const DataContext = createContext<DataContextType | undefined>(undefined);

export const useData = () => {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
};

// --- USER CONFIGURATION ---
const CREDENTIALS = {
  'Sage': { password: 'Sagereturns', role: UserRole.ADMIN },
  'Showcase': { password: 'TheSage', role: UserRole.SHOWOFF }, // Updated Credentials
};

export const DataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Initialize Persona data
  const [personas, setPersonas] = useState<Record<PersonaType, PersonaContent>>(() => {
    try {
      const saved = localStorage.getItem('soulforge_data');
      if (saved) {
        // Migration: Ensure 'dateAdded' exists on all works/projectItems for sorting updates
        const parsed = JSON.parse(saved);
        Object.keys(parsed).forEach(key => {
            const p = parsed[key as PersonaType];
            if (p.works) {
                p.works.forEach(w => { 
                    if(!w.dateAdded) w.dateAdded = new Date().toISOString();
                    // Ensure video field is valid (even if undefined)
                    if(w.video === undefined) w.video = undefined;
                });
            }
            if (p.projectCategories) {
                p.projectCategories.forEach(c => {
                    c.items.forEach(i => { if(!i.dateAdded) i.dateAdded = new Date().toISOString() });
                });
            }
            if (p.writings) {
                p.writings.forEach(w => {
                    if (w.chapters) {
                        w.chapters.forEach(c => {
                            // Ensure comments array exists on chapters
                            if (!c.comments) c.comments = [];
                        });
                    }
                });
            }
        });
        return parsed;
      }
      return PERSONA_DATA;
    } catch (e) {
      console.error("Failed to load data", e);
      return PERSONA_DATA;
    }
  });

  // Initialize Global Site Data
  const [globalContent, setGlobalContent] = useState<GlobalContent>(() => {
    try {
      const saved = localStorage.getItem('soulforge_global');
      if (saved) {
        const parsed = JSON.parse(saved);
        // Migration: Add contactInfo if missing
        if (!parsed.contactInfo) parsed.contactInfo = DEFAULT_CONTACT;
        
        // Migration: Add aboutPage content if missing
        if (!parsed.aboutPage) parsed.aboutPage = DEFAULT_ABOUT_PAGE_CONTENT;
        
        // Migration: Add Announcement if missing - Enable by default for visibility
        if (!parsed.announcement) {
            parsed.announcement = { enabled: true, text: "System Online. Welcome to the Forge.", link: "" };
        }

        // --- FORCE MIGRATION FOR UPDATED CONTACT DETAILS ---
        if (parsed.contactInfo) {
             const invalidPhones = ["+94 77 123 4567", "+91 9432463935"]; // Old placeholder AND the typo version
             const currentPhone = parsed.contactInfo.phone;
             
             // Check if phone matches any invalid/old version OR if whatsapp is missing
             if (!parsed.contactInfo.whatsapp || invalidPhones.includes(currentPhone)) {
                 parsed.contactInfo.whatsapp = DEFAULT_CONTACT.whatsapp;
                 parsed.contactInfo.phone = DEFAULT_CONTACT.phone;
             }
        }

        // Migration: Fix Social Links if they are still placeholders ('#') or missing specific IDs
        if (parsed.contactInfo && parsed.contactInfo.socials) {
            const defaults = DEFAULT_CONTACT.socials;
            parsed.contactInfo.socials = parsed.contactInfo.socials.map((s: SocialLink) => {
                const def = defaults.find(d => d.platform === s.platform);
                // If current is placeholder/empty OR if it matches the old generic '#' URL
                if (def && (s.url === '#' || s.url === '' || (s.platform === 'Behance' && s.url === '#'))) {
                    return def;
                }
                return s;
            });
        }

        return parsed;
      }
      return {
        logoUrl: LOGO_URL,
        siteTitle: "THE SOULFORGED SAGE",
        contactInfo: DEFAULT_CONTACT,
        aboutPage: DEFAULT_ABOUT_PAGE_CONTENT,
        announcement: { enabled: true, text: "System Online. Welcome to the Forge.", link: "" }
      };
    } catch (e) {
      return {
        logoUrl: LOGO_URL,
        siteTitle: "THE SOULFORGED SAGE",
        contactInfo: DEFAULT_CONTACT,
        aboutPage: DEFAULT_ABOUT_PAGE_CONTENT,
        announcement: { enabled: true, text: "System Online. Welcome to the Forge.", link: "" }
      };
    }
  });

  // Initialize About Page Data
  const [aboutData, setAboutData] = useState<Record<AboutTab, AboutContent>>(() => {
    try {
      const saved = localStorage.getItem('soulforge_about');
      if (saved) {
        const parsed = JSON.parse(saved);
        
        // --- DATA MIGRATION LOGIC ---
        // Ensure new fields exist for users with old cached data
        const defaultRotaract = ABOUT_DATA[AboutTab.ROTARACT];
        const defaultProfessional = ABOUT_DATA[AboutTab.PROFESSIONAL];
        const defaultPersonal = ABOUT_DATA[AboutTab.PERSONAL];
        
        // 1. Check for Roles array (Rotaract)
        if (!parsed[AboutTab.ROTARACT].roles) {
            parsed[AboutTab.ROTARACT].roles = defaultRotaract.roles;
        }
        
        // 2. Check for Logo URL (Rotaract)
        if (parsed[AboutTab.ROTARACT].logoUrl === undefined) {
            parsed[AboutTab.ROTARACT].logoUrl = defaultRotaract.logoUrl;
        }
        
        // 8. Migration: Update Club Logo to new provided Transparent logo
        const newClubLogo = "https://drive.google.com/thumbnail?id=1yUm13kjlWARxcCd0B0ATqqzFMf_oAZAk&sz=w4096";
        const oldWikiLogo = "https://upload.wikimedia.org/wikipedia/commons/thumb/c/ca/Rotaract_Logo.svg/1200px-Rotaract_Logo.svg.png";
        
        // Force update if it matches old wiki logo OR if it differs from the new standard
        if (parsed[AboutTab.ROTARACT].logoUrl === oldWikiLogo || !parsed[AboutTab.ROTARACT].logoUrl.includes('1yUm13kjlWARxcCd0B0ATqqzFMf_oAZAk')) {
             parsed[AboutTab.ROTARACT].logoUrl = newClubLogo;
        }

        // 3. Check for Timeline (Rotaract)
        if (!parsed[AboutTab.ROTARACT].timeline) {
            parsed[AboutTab.ROTARACT].timeline = defaultRotaract.timeline;
        }

        // 4. Check for Cards (Professional)
        if (!parsed[AboutTab.PROFESSIONAL].cards) {
            parsed[AboutTab.PROFESSIONAL].cards = defaultProfessional.cards;
        }

        // 5. Check for Cards (Personal)
        if (!parsed[AboutTab.PERSONAL].cards) {
            parsed[AboutTab.PERSONAL].cards = defaultPersonal.cards;
        }

        // 6. Check for Experience (Professional)
        if (!parsed[AboutTab.PROFESSIONAL].experience) {
            parsed[AboutTab.PROFESSIONAL].experience = defaultProfessional.experience;
        }

        // 7. Check for Software (Professional)
        if (!parsed[AboutTab.PROFESSIONAL].software) {
            parsed[AboutTab.PROFESSIONAL].software = defaultProfessional.software;
        }

        // 9. Check for Education (Professional)
        if (!parsed[AboutTab.PROFESSIONAL].education) {
            parsed[AboutTab.PROFESSIONAL].education = defaultProfessional.education;
        }

        return parsed;
      }
      return ABOUT_DATA;
    } catch (e) {
      return ABOUT_DATA;
    }
  });

  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const savedUser = localStorage.getItem('soulforge_user');
    if (savedUser) {
      try {
        setUser(JSON.parse(savedUser));
      } catch (e) {
        localStorage.removeItem('soulforge_user');
      }
    }
  }, []);

  const updatePersona = (type: PersonaType, newData: PersonaContent) => {
    setPersonas(prev => {
      const updated = { ...prev, [type]: newData };
      try {
        localStorage.setItem('soulforge_data', JSON.stringify(updated));
      } catch (e) {
        console.error("Failed to save to storage - Quota exceeded?", e);
      }
      return updated;
    });
  };

  const updateGlobalContent = (newData: GlobalContent) => {
    if (user?.role !== UserRole.ADMIN) return;

    setGlobalContent(newData);
    try {
      localStorage.setItem('soulforge_global', JSON.stringify(newData));
    } catch (e) {
      console.error("Failed to save global content", e);
    }
  };

  const updateAboutData = (tab: AboutTab, data: AboutContent) => {
    if (user?.role !== UserRole.ADMIN && user?.role !== UserRole.EDITOR) return;

    setAboutData(prev => {
      const updated = { ...prev, [tab]: data };
      try {
        localStorage.setItem('soulforge_about', JSON.stringify(updated));
      } catch (e) {
        console.error("Failed to save about content", e);
      }
      return updated;
    });
  };

  const login = (username: string, password: string) => {
    const entry = CREDENTIALS[username as keyof typeof CREDENTIALS];
    
    if (entry && entry.password === password) {
      const newUser: User = { username, role: entry.role };
      setUser(newUser);
      localStorage.setItem('soulforge_user', JSON.stringify(newUser));
      return true;
    }
    return false;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('soulforge_user');
  };

  const hasPermission = (requiredRole: UserRole): boolean => {
    if (!user) return false;
    if (user.role === UserRole.ADMIN) return true;
    if (user.role === UserRole.EDITOR && requiredRole !== UserRole.ADMIN) return true;
    if (user.role === UserRole.GUEST && requiredRole === UserRole.GUEST) return true;
    return false;
  };

  return (
    <DataContext.Provider value={{ 
      personas, 
      updatePersona, 
      globalContent, 
      updateGlobalContent,
      aboutData,
      updateAboutData,
      user, 
      login, 
      logout,
      hasPermission
    }}>
      {children}
    </DataContext.Provider>
  );
};
