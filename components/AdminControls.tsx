
import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useData } from '../contexts/DataContext';
import { Ghost, Settings, Save, LogOut, X, UserCircle, Megaphone } from 'lucide-react';
import { UserRole } from '../types';

// Helper to convert Google Drive links to direct image sources
// Using the thumbnail API is significantly more reliable for 'Anyone with link' files than export=view
const processImageUrl = (url: string) => {
    if (!url) return "";
    
    const idMatch = url.match(/(?:\/d\/|id=)([a-zA-Z0-9_-]+)/);
    
    if (idMatch && (url.includes('drive.google.com') || url.includes('docs.google.com'))) {
        const id = idMatch[1];
        // sz=w4096 requests up to 4K resolution
        return `https://drive.google.com/thumbnail?id=${id}&sz=w4096`;
    }
    
    return url;
};

const AdminControls: React.FC = () => {
  const { user, logout, globalContent, updateGlobalContent } = useData();
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  
  // Local state for form editing
  const [editLogo, setEditLogo] = useState(globalContent.logoUrl);
  const [editTitle, setEditTitle] = useState(globalContent.siteTitle);
  const [editAnnouncement, setEditAnnouncement] = useState(globalContent.announcement || { enabled: false, text: "", link: "" });

  useEffect(() => {
      setEditLogo(globalContent.logoUrl);
      setEditTitle(globalContent.siteTitle);
      setEditAnnouncement(globalContent.announcement || { enabled: false, text: "", link: "" });
  }, [globalContent, isOpen]);

  // Click handling state
  const clickTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (clickTimeoutRef.current) {
      // --- DOUBLE CLICK DETECTED ---
      clearTimeout(clickTimeoutRef.current);
      clickTimeoutRef.current = null;
      handleDoubleClick();
    } else {
      // --- FIRST CLICK ---
      // Wait 250ms to see if another click comes
      clickTimeoutRef.current = setTimeout(() => {
        clickTimeoutRef.current = null;
        handleSingleClick();
      }, 250);
    }
  };

  const handleSingleClick = () => {
    // Redirect to Contact / Summon page
    navigate('/contact');
  };

  const handleDoubleClick = () => {
    // If logged in, open dashboard. If not, go to login page.
    if (user) {
      setIsOpen(true);
    } else {
      navigate('/admin');
    }
  };

  const handleSave = () => {
    updateGlobalContent({
      ...globalContent,
      logoUrl: processImageUrl(editLogo),
      siteTitle: editTitle,
      announcement: editAnnouncement
    });
    setIsOpen(false);
  };

  return (
    <>
      {/* Static Icon - To be placed in Footer - HIDDEN ON MOBILE (md:flex) */}
      <button
        onClick={handleClick}
        className={`
          hidden md:flex
          p-2 rounded-full transition-all duration-500 items-center justify-center
          ${user 
            ? 'text-soul-fire opacity-100 hover:bg-soul-fire/10 hover:shadow-[0_0_10px_rgb(var(--color-soul-fire)/0.4)]' 
            : 'text-bone-dark/20 hover:text-bone-dark/50'
          }
        `}
        title={user ? "Double click for Admin" : "Summon"}
      >
        <Ghost size={18} />
      </button>

      {/* Admin Modal / Dashboard (Portal-like behavior) */}
      {isOpen && user && (
        <div className="fixed inset-0 z-[10001] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <div className="w-full max-w-md bg-obsidian border border-soul-fire/30 shadow-[0_0_50px_rgba(0,0,0,0.8)] relative animate-float max-h-[90vh] overflow-y-auto">
            
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-white/10 bg-soul-deep/20 sticky top-0 backdrop-blur-md z-10">
              <div className="flex items-center gap-3">
                <UserCircle className="text-soul-fire" />
                <div>
                  <h2 className="text-lg font-serif font-bold text-white">Control Panel</h2>
                  <p className="text-xs text-bone-dark uppercase tracking-widest">{user.role}</p>
                </div>
              </div>
              <button onClick={() => setIsOpen(false)} className="text-bone-dark hover:text-white">
                <X size={20} />
              </button>
            </div>

            {/* Content */}
            <div className="p-6 space-y-8">
              
              {/* Global Settings - Only for ADMIN */}
              {user.role === UserRole.ADMIN ? (
                <>
                   {/* Site Identity */}
                   <div className="space-y-4">
                       <div className="flex items-center gap-2 text-soul-fire text-xs uppercase tracking-widest border-b border-white/10 pb-2">
                          <Settings size={14} /> Global Identity
                       </div>
                      <div className="space-y-2">
                        <label className="text-xs text-bone-dark">Site Logo URL</label>
                        <input 
                          type="text" 
                          value={editLogo}
                          onChange={(e) => setEditLogo(e.target.value)}
                          placeholder="Supports Google Drive links"
                          className="w-full bg-black border border-white/20 p-3 text-sm text-white focus:border-soul-fire outline-none"
                        />
                      </div>

                      <div className="space-y-2">
                        <label className="text-xs text-bone-dark">Site Title</label>
                        <input 
                          type="text" 
                          value={editTitle}
                          onChange={(e) => setEditTitle(e.target.value)}
                          className="w-full bg-black border border-white/20 p-3 text-sm text-white focus:border-soul-fire outline-none font-serif"
                        />
                      </div>
                   </div>

                   {/* Announcement Banner Settings */}
                   <div className="space-y-4">
                       <div className="flex items-center gap-2 text-soul-fire text-xs uppercase tracking-widest border-b border-white/10 pb-2">
                          <Megaphone size={14} /> Announcement Banner
                       </div>
                       
                       <div className="flex items-center gap-3 bg-white/5 p-3 rounded border border-white/10">
                           <input 
                              type="checkbox"
                              checked={editAnnouncement.enabled}
                              onChange={(e) => setEditAnnouncement({...editAnnouncement, enabled: e.target.checked})}
                              className="w-4 h-4 accent-soul-fire cursor-pointer"
                           />
                           <label className="text-sm text-white cursor-pointer" onClick={() => setEditAnnouncement({...editAnnouncement, enabled: !editAnnouncement.enabled})}>
                               Enable Banner
                           </label>
                       </div>

                       {editAnnouncement.enabled && (
                           <>
                               <div className="space-y-2">
                                    <label className="text-xs text-bone-dark">Message</label>
                                    <textarea 
                                      value={editAnnouncement.text}
                                      onChange={(e) => setEditAnnouncement({...editAnnouncement, text: e.target.value})}
                                      placeholder="Announcement text..."
                                      className="w-full bg-black border border-white/20 p-3 text-sm text-white focus:border-soul-fire outline-none h-20 resize-none"
                                    />
                               </div>
                               <div className="space-y-2">
                                    <label className="text-xs text-bone-dark">Link (Optional)</label>
                                    <input 
                                      type="text" 
                                      value={editAnnouncement.link || ''}
                                      onChange={(e) => setEditAnnouncement({...editAnnouncement, link: e.target.value})}
                                      placeholder="/page or https://..."
                                      className="w-full bg-black border border-white/20 p-3 text-sm text-white focus:border-soul-fire outline-none"
                                    />
                               </div>
                           </>
                       )}
                   </div>
                </>
              ) : (
                <div className="text-center py-6 border border-white/5 bg-white/5">
                  <p className="text-sm text-bone-dark">Global settings are restricted to Sage Access.</p>
                  <p className="text-xs text-bone-dark/50 mt-2">You have access to edit Personas & Writings.</p>
                </div>
              )}
            </div>

            {/* Footer Actions */}
            <div className="p-6 border-t border-white/10 bg-black/20 flex justify-between items-center sticky bottom-0 backdrop-blur-md">
              <button 
                onClick={() => { logout(); setIsOpen(false); navigate('/'); }}
                className="flex items-center gap-2 text-red-500 text-xs hover:text-red-400 transition-colors uppercase tracking-wider"
              >
                <LogOut size={14} /> Logout
              </button>

              {user.role === UserRole.ADMIN && (
                <button 
                  onClick={handleSave}
                  className="px-4 py-2 bg-soul-fire text-obsidian font-bold font-serif text-xs hover:bg-white transition-all flex items-center gap-2"
                >
                  <Save size={14} /> SAVE GLOBAL
                </button>
              )}
            </div>

          </div>
        </div>
      )}
    </>
  );
};

export default AdminControls;
