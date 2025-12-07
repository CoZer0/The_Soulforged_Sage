
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Briefcase, Users, Heart, ArrowRight, Edit3, X } from 'lucide-react';
import { useData } from '../contexts/DataContext';
import { UserRole, AboutPageCard } from '../types';

const About: React.FC = () => {
  const { globalContent, updateGlobalContent, user } = useData();
  const pageContent = globalContent.aboutPage;
  const canEdit = user?.role === UserRole.ADMIN || user?.role === UserRole.EDITOR;

  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState(pageContent);

  const saveContent = () => {
      updateGlobalContent({ ...globalContent, aboutPage: editForm });
      setIsEditing(false);
  };

  const updateCard = (key: keyof typeof editForm, field: keyof AboutPageCard, value: string) => {
      setEditForm({
          ...editForm,
          [key]: {
              ...editForm[key],
              [field]: value
          }
      });
  };

  return (
    <div className="flex-grow w-full px-6 md:px-12 py-6 flex flex-col items-center relative">
      
      {canEdit && (
          <button 
              onClick={() => { setEditForm(pageContent); setIsEditing(true); }}
              className="absolute top-6 right-6 z-50 flex items-center gap-2 px-3 py-1 bg-white/5 border border-white/10 rounded text-bone hover:text-soul-fire transition-colors"
          >
              <Edit3 size={16} /> <span className="text-xs uppercase tracking-widest">Edit Layout</span>
          </button>
      )}

      <div className="text-center mb-16 relative animate-float mt-8">
        <h1 className="text-4xl md:text-7xl font-serif font-bold text-white mb-6 relative z-10 tracking-tight">The Man Behind The Myth</h1>
        <div className="h-px w-24 md:w-40 bg-gradient-to-r from-transparent via-soul-fire to-transparent mx-auto"></div>
        <p className="mt-6 text-bone-dark font-serif tracking-[0.2em] uppercase text-xs md:text-sm">Choose a path to explore</p>
      </div>

      <div className="grid md:grid-cols-3 gap-6 md:gap-10 w-full max-w-7xl">
        
        {/* Professional Card */}
        <Link to="/about/professional" className="group relative h-[400px] md:h-[500px] perspective-1000 cursor-none">
          <div className="absolute inset-0 bg-obsidian-light border border-white/5 group-hover:border-soul-fire/50 transition-all duration-500 flex flex-col items-center justify-center p-8 overflow-hidden rounded-sm shadow-2xl">
            <div className="absolute inset-0 bg-gradient-to-t from-soul-deep/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
            
            <div className="mb-8 p-6 rounded-full border border-white/5 bg-black/50 group-hover:scale-110 group-hover:border-soul-fire/30 transition-all duration-500 shadow-[0_0_30px_rgba(0,0,0,0.5)]">
              <Briefcase className="w-10 h-10 text-soul-fire" />
            </div>
            
            <h2 className="text-2xl md:text-3xl font-serif font-bold text-white mb-4 text-center">{pageContent.professional.title}</h2>
            <div className="h-px w-12 bg-soul-fire/30 mb-6 group-hover:w-32 transition-all duration-500"></div>
            <p className="text-bone-dark text-center text-sm md:text-base font-sans leading-relaxed opacity-70 group-hover:opacity-100 transition-opacity max-w-xs">
              {pageContent.professional.description}
            </p>

            <div className="absolute bottom-10 flex items-center gap-2 text-xs font-serif text-soul-fire tracking-widest opacity-0 translate-y-4 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-500">
              <span>ENTER FORGE</span> <ArrowRight size={14} />
            </div>
          </div>
        </Link>

        {/* Rotaract Card */}
        <Link to="/about/rotaract" className="group relative h-[400px] md:h-[500px] perspective-1000 cursor-none">
          <div className="absolute inset-0 bg-obsidian-light border border-white/5 group-hover:border-pink-500/50 transition-all duration-500 flex flex-col items-center justify-center p-8 overflow-hidden rounded-sm shadow-2xl">
            <div className="absolute inset-0 bg-gradient-to-t from-pink-900/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
            
            <div className="mb-8 p-6 rounded-full border border-white/5 bg-black/50 group-hover:scale-110 group-hover:border-pink-500/30 transition-all duration-500 shadow-[0_0_30px_rgba(0,0,0,0.5)]">
              <Users className="w-10 h-10 text-pink-500" />
            </div>
            
            <h2 className="text-2xl md:text-3xl font-serif font-bold text-white mb-4 text-center">{pageContent.rotaract.title}</h2>
            <div className="h-px w-12 bg-pink-500/30 mb-6 group-hover:w-32 transition-all duration-500"></div>
            <p className="text-bone-dark text-center text-sm md:text-base font-sans leading-relaxed opacity-70 group-hover:opacity-100 transition-opacity max-w-xs">
              {pageContent.rotaract.description}
            </p>

            <div className="absolute bottom-10 flex items-center gap-2 text-xs font-serif text-pink-500 tracking-widest opacity-0 translate-y-4 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-500">
              <span>VIEW SERVICE</span> <ArrowRight size={14} />
            </div>
          </div>
        </Link>

        {/* Personal Card */}
        <Link to="/about/personal" className="group relative h-[400px] md:h-[500px] perspective-1000 cursor-none">
          <div className="absolute inset-0 bg-obsidian-light border border-white/5 group-hover:border-emerald-500/50 transition-all duration-500 flex flex-col items-center justify-center p-8 overflow-hidden rounded-sm shadow-2xl">
             <div className="absolute inset-0 bg-gradient-to-t from-emerald-900/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
            
            <div className="mb-8 p-6 rounded-full border border-white/5 bg-black/50 group-hover:scale-110 group-hover:border-emerald-500/30 transition-all duration-500 shadow-[0_0_30px_rgba(0,0,0,0.5)]">
              <Heart className="w-10 h-10 text-emerald-500" />
            </div>
            
            <h2 className="text-2xl md:text-3xl font-serif font-bold text-white mb-4 text-center">{pageContent.personal.title}</h2>
            <div className="h-px w-12 bg-emerald-500/30 mb-6 group-hover:w-32 transition-all duration-500"></div>
            <p className="text-bone-dark text-center text-sm md:text-base font-sans leading-relaxed opacity-70 group-hover:opacity-100 transition-opacity max-w-xs">
              {pageContent.personal.description}
            </p>

            <div className="absolute bottom-10 flex items-center gap-2 text-xs font-serif text-emerald-500 tracking-widest opacity-0 translate-y-4 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-500">
              <span>UNVEIL</span> <ArrowRight size={14} />
            </div>
          </div>
        </Link>
      </div>

       {/* Admin Edit Modal */}
       {isEditing && (
          <div className="fixed inset-0 z-[60] bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
              <div className="bg-obsidian border border-soul-fire/30 p-8 max-w-3xl w-full space-y-6 shadow-2xl rounded-lg max-h-[90vh] overflow-y-auto">
                  <div className="flex justify-between items-center mb-4 border-b border-white/10 pb-2">
                     <h2 className="text-xl font-serif text-white">Edit About Page Layout</h2>
                     <button onClick={() => setIsEditing(false)} className="text-bone-dark hover:text-white"><X size={20}/></button>
                  </div>
                  
                  <div className="grid md:grid-cols-3 gap-6">
                      {/* Professional */}
                      <div className="space-y-2 border border-white/10 p-4 rounded bg-white/5">
                          <label className="text-xs text-soul-fire uppercase font-bold">Professional Card</label>
                          <input 
                             value={editForm.professional.title}
                             onChange={(e) => updateCard('professional', 'title', e.target.value)}
                             className="w-full bg-black border border-white/20 p-2 text-white focus:border-soul-fire outline-none text-sm"
                          />
                          <textarea 
                             value={editForm.professional.description}
                             onChange={(e) => updateCard('professional', 'description', e.target.value)}
                             className="w-full bg-black border border-white/20 p-2 text-white focus:border-soul-fire outline-none text-sm h-32 resize-none"
                          />
                      </div>

                      {/* Rotaract */}
                      <div className="space-y-2 border border-white/10 p-4 rounded bg-white/5">
                          <label className="text-xs text-pink-500 uppercase font-bold">Rotaract Card</label>
                          <input 
                             value={editForm.rotaract.title}
                             onChange={(e) => updateCard('rotaract', 'title', e.target.value)}
                             className="w-full bg-black border border-white/20 p-2 text-white focus:border-pink-500 outline-none text-sm"
                          />
                          <textarea 
                             value={editForm.rotaract.description}
                             onChange={(e) => updateCard('rotaract', 'description', e.target.value)}
                             className="w-full bg-black border border-white/20 p-2 text-white focus:border-pink-500 outline-none text-sm h-32 resize-none"
                          />
                      </div>

                      {/* Personal */}
                      <div className="space-y-2 border border-white/10 p-4 rounded bg-white/5">
                          <label className="text-xs text-emerald-500 uppercase font-bold">Personal Card</label>
                          <input 
                             value={editForm.personal.title}
                             onChange={(e) => updateCard('personal', 'title', e.target.value)}
                             className="w-full bg-black border border-white/20 p-2 text-white focus:border-emerald-500 outline-none text-sm"
                          />
                          <textarea 
                             value={editForm.personal.description}
                             onChange={(e) => updateCard('personal', 'description', e.target.value)}
                             className="w-full bg-black border border-white/20 p-2 text-white focus:border-emerald-500 outline-none text-sm h-32 resize-none"
                          />
                      </div>
                  </div>

                  <div className="flex justify-end gap-3 pt-4">
                      <button type="button" onClick={() => setIsEditing(false)} className="px-4 py-2 text-bone-dark">Cancel</button>
                      <button type="button" onClick={saveContent} className="px-4 py-2 bg-soul-fire text-obsidian font-bold">Save Changes</button>
                  </div>
              </div>
          </div>
      )}
    </div>
  );
};

export default About;
