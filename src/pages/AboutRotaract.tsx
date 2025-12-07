
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Award, Globe, Users, HeartHandshake, Edit3, Plus, Trash2, X, Calendar, ChevronRight } from 'lucide-react';
import { AboutTab, UserRole, AboutContent, RoleItem, TimelineItem } from '../types';
import { useData } from '../contexts/DataContext';

const AboutRotaract: React.FC = () => {
  const { aboutData, updateAboutData, user } = useData();
  const data = aboutData[AboutTab.ROTARACT];
  const canEdit = user?.role === UserRole.ADMIN || user?.role === UserRole.EDITOR;

  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState<AboutContent>(data);
  const [newTag, setNewTag] = useState('');

  // Helpers
  const safeRoles = editForm.roles || [];
  const safeTimeline = editForm.timeline || [];

  const handleSave = () => {
    updateAboutData(AboutTab.ROTARACT, editForm);
    setIsEditing(false);
  };

  // --- ROLE HANDLERS ---
  const handleAddRole = () => {
    setEditForm({
      ...editForm,
      roles: [...safeRoles, { title: '', organization: '', period: '' }]
    });
  };

  const handleUpdateRole = (index: number, field: keyof RoleItem, value: string) => {
    const newRoles = [...safeRoles];
    newRoles[index] = { ...newRoles[index], [field]: value };
    setEditForm({ ...editForm, roles: newRoles });
  };

  const handleRemoveRole = (index: number) => {
    const newRoles = [...safeRoles];
    newRoles.splice(index, 1);
    setEditForm({ ...editForm, roles: newRoles });
  };

  // --- TIMELINE HANDLERS ---
  const handleAddTimelineItem = () => {
      const currentYear = new Date().getFullYear();
      const yearRange = `${currentYear}-${(currentYear + 1).toString().slice(-2)}`;
      
      setEditForm({
          ...editForm,
          timeline: [...safeTimeline, { id: Date.now().toString(), year: yearRange, title: '', description: '' }]
      });
  };

  const handleUpdateTimelineItem = (index: number, field: keyof TimelineItem, value: string) => {
      const newTimeline = [...safeTimeline];
      newTimeline[index] = { ...newTimeline[index], [field]: value };
      setEditForm({ ...editForm, timeline: newTimeline });
  };

  const handleRemoveTimelineItem = (index: number) => {
      const newTimeline = [...safeTimeline];
      newTimeline.splice(index, 1);
      setEditForm({ ...editForm, timeline: newTimeline });
  };

  // --- TAG HANDLERS ---
  const addTag = () => {
    if (newTag.trim()) {
        setEditForm({
            ...editForm,
            highlights: [...(editForm.highlights || []), newTag.trim()]
        });
        setNewTag('');
    }
  };

  const removeTag = (index: number) => {
    const newTags = [...(editForm.highlights || [])];
    newTags.splice(index, 1);
    setEditForm({ ...editForm, highlights: newTags });
  };


  const processImageUrl = (url: string) => {
    if (!url) return "";
    const idMatch = url.match(/(?:\/d\/|id=)([a-zA-Z0-9_-]+)/);
    if (idMatch && (url.includes('drive.google.com') || url.includes('docs.google.com'))) {
        return `https://drive.google.com/thumbnail?id=${idMatch[1]}&sz=w4096`;
    }
    return url;
  };

  // Sort logic that handles "2021-22" by parsing the first 4 digits
  const getStartYear = (yearStr: string) => {
      const match = yearStr.match(/^\d{4}/);
      return match ? parseInt(match[0]) : 0;
  };

  return (
    <div className="flex-grow w-full px-6 md:px-12 py-6 flex flex-col relative">
      
      <div className="flex justify-between items-center mb-8">
        <Link to="/about" className="inline-flex items-center gap-2 text-bone-dark hover:text-pink-500 transition-colors group w-fit">
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            <span className="font-serif tracking-wider text-sm">BACK TO SELECTION</span>
        </Link>
        {canEdit && (
            <button 
                onClick={() => { setEditForm(data); setIsEditing(true); }}
                className="flex items-center gap-2 text-bone hover:text-pink-500 transition-colors px-3 py-1 bg-white/5 border border-white/10 rounded"
            >
                <Edit3 size={16} /> <span className="text-xs uppercase tracking-widest">Edit Page</span>
            </button>
        )}
      </div>

      <div className="relative bg-obsidian-light/30 border border-white/10 rounded-xl overflow-hidden p-6 md:p-8 lg:p-16 mb-12">
         {/* Ambient Background */}
         <div className="absolute top-0 right-0 w-[300px] h-[300px] md:w-[500px] md:h-[500px] bg-pink-600/10 blur-[80px] md:blur-[120px] rounded-full pointer-events-none -translate-y-1/2 translate-x-1/3"></div>
         
         {/* Logos Header - Optimized for Tablet & sizes */}
         <div className="flex flex-col md:flex-row items-center justify-center gap-4 md:gap-6 lg:gap-12 mb-8 md:mb-12 relative z-10 opacity-90 w-full">
            
            {/* Rotary Logo (Left) */}
            <img 
              src="https://drive.google.com/thumbnail?id=1nkYIY5ZxtQjEf6WE1WC66JH4SXrbeGQk&sz=w4096" 
              alt="Rotary International" 
              className="h-10 md:h-14 lg:h-20 w-auto object-contain hover:opacity-100 transition-opacity"
            />

            <div className="hidden md:block w-px h-8 md:h-10 lg:h-16 bg-white/20"></div>

            {/* Rotaract Logo (Right) */}
            <img 
              src="https://drive.google.com/thumbnail?id=1yWxfc1sOl2Gbw3HIZkajLINqf1TSeqKo&sz=w4096" 
              alt="Rotaract" 
              className="h-10 md:h-14 lg:h-20 w-auto object-contain hover:opacity-100 transition-opacity" 
            />
            
            {/* Club Logo */}
            {data.logoUrl && (
                <>
                  <div className="hidden md:block w-px h-8 md:h-10 lg:h-16 bg-white/20"></div>
                  <img 
                    src={data.logoUrl} 
                    alt="Club Logo" 
                    className="h-14 md:h-20 lg:h-24 w-auto object-contain hover:opacity-100 transition-opacity"
                  />
                </>
            )}
         </div>

         <div className="text-center max-w-3xl mx-auto relative z-10">
            <h1 className="text-2xl md:text-4xl lg:text-5xl font-serif font-bold text-white mb-4 md:mb-6">Service Above Self</h1>
            <p className="text-sm md:text-lg lg:text-xl text-bone-dark leading-relaxed font-light">
              "We connect passionate people with diverse perspectives to exchange ideas, forge lifelong friendships, and, above all, take action to change the world."
            </p>
         </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-12">
        
        {/* LEFT COLUMN: TIMELINE (The Journey) */}
        <div className="md:col-span-7 space-y-8">
          <h2 className="text-2xl font-serif font-bold text-pink-500 tracking-wide border-b border-pink-500/20 pb-2">The Rotaract Journey</h2>
          
          {data.timeline && data.timeline.length > 0 ? (
              <div className="relative pl-4 space-y-12">
                  {/* Vertical Line */}
                  <div className="absolute left-[27px] top-2 bottom-0 w-px bg-gradient-to-b from-pink-500 via-pink-900/50 to-transparent"></div>
                  
                  {data.timeline.sort((a,b) => getStartYear(b.year) - getStartYear(a.year)).map((item, idx) => (
                      <div key={idx} className="relative flex gap-8 items-start group">
                          {/* Node */}
                          <div className="relative z-10 flex-shrink-0 w-6 h-6 rounded-full bg-obsidian border border-pink-500 shadow-[0_0_10px_rgba(236,72,153,0.4)] group-hover:bg-pink-500 transition-colors mt-1 flex items-center justify-center">
                             <div className="w-2 h-2 rounded-full bg-white opacity-0 group-hover:opacity-100 transition-opacity"></div>
                          </div>
                          
                          {/* Content */}
                          <div className="space-y-2 group-hover:translate-x-1 transition-transform">
                              <div className="flex items-center gap-3">
                                  <span className="text-2xl font-serif text-pink-500 font-bold opacity-80">{item.year}</span>
                                  <div className="h-px w-8 bg-pink-500/30"></div>
                                  <h3 className="text-xl text-white font-bold">{item.title}</h3>
                              </div>
                              <p className="text-bone-dark leading-relaxed text-sm md:text-base border-l-2 border-white/5 pl-4 py-1">
                                  {item.description}
                              </p>
                          </div>
                      </div>
                  ))}
              </div>
          ) : (
             <div className="space-y-6 text-bone leading-relaxed font-sans text-sm md:text-base">
                {data.content.map((p, i) => (
                   <p key={i} className="border-l-2 border-pink-500/30 pl-6 py-1">{p}</p>
                 ))}
             </div>
          )}
        </div>

        {/* RIGHT COLUMN: ROLES */}
        <div className="md:col-span-5 space-y-6">
           <h2 className="text-2xl font-serif font-bold text-pink-500 tracking-wide border-b border-pink-500/20 pb-2">Impact & Roles</h2>
           
           {/* Tags / Highlights Display */}
           {data.highlights && data.highlights.length > 0 && (
             <div className="flex flex-wrap gap-2 mb-6">
               {data.highlights.map((tag, i) => (
                 <span key={i} className="px-3 py-1 rounded border border-pink-500/30 text-pink-300 text-xs bg-pink-900/10 uppercase tracking-wide">
                   {tag}
                 </span>
               ))}
             </div>
           )}

           <div className="space-y-4">
             {safeRoles.map((role, i) => (
                <div key={i} className="bg-white/5 p-4 rounded border border-white/5 hover:border-pink-500/50 transition-all group relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-3 opacity-10 group-hover:opacity-20 transition-opacity">
                        <Award className="w-12 h-12 text-pink-500" />
                    </div>
                    <div className="relative z-10">
                        <div className="flex justify-between items-start mb-1">
                            <h3 className="font-serif text-white font-bold tracking-wide">{role.title}</h3>
                            {role.period && <span className="text-[10px] text-bone-dark font-mono border border-white/10 px-2 py-1 rounded bg-black/30">{role.period}</span>}
                        </div>
                        <div className="text-pink-400 text-sm font-sans">{role.organization}</div>
                    </div>
                </div>
             ))}
           </div>

           {/* Quote Card */}
           <div className="mt-8 p-6 bg-pink-900/10 border border-pink-500/20 rounded italic text-pink-200/80 text-center font-serif text-sm">
             "Rotaract is not just about what we do, but who we become while doing it."
           </div>
        </div>
      </div>

       {/* Editing Modal */}
       {isEditing && (
          <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
              <div className="bg-obsidian border border-pink-500/30 p-8 max-w-4xl w-full space-y-6 shadow-2xl rounded-lg max-h-[90vh] overflow-y-auto">
                  <div className="flex justify-between items-center border-b border-pink-500/20 pb-4">
                      <h2 className="text-xl font-serif text-white">Edit Rotaract Journey</h2>
                      <button onClick={() => setIsEditing(false)} className="text-bone-dark hover:text-white"><X size={24}/></button>
                  </div>
                  
                  <div className="grid md:grid-cols-2 gap-8">
                      {/* LEFT: Timeline Editor */}
                      <div className="space-y-4">
                          <div className="flex justify-between items-center mb-2">
                             <label className="block text-xs text-pink-500 uppercase font-bold">Year-Wise Journey</label>
                             <button type="button" onClick={handleAddTimelineItem} className="text-xs bg-pink-600/20 text-pink-400 px-2 py-1 rounded hover:bg-pink-600 hover:text-white transition-colors flex items-center gap-1">
                                <Plus size={12}/> Add Year Range
                             </button>
                          </div>
                          <div className="space-y-3 max-h-[400px] overflow-y-auto pr-2">
                              {safeTimeline.map((item, idx) => (
                                  <div key={idx} className="bg-white/5 p-3 rounded border border-white/10 relative group">
                                      <div className="grid grid-cols-4 gap-2 mb-2">
                                          <input 
                                              placeholder="2021-22"
                                              value={item.year}
                                              onChange={(e) => handleUpdateTimelineItem(idx, 'year', e.target.value)}
                                              className="col-span-1 bg-black/50 border border-white/10 p-2 text-xs text-white focus:border-pink-500 outline-none"
                                          />
                                          <input 
                                              placeholder="Title"
                                              value={item.title}
                                              onChange={(e) => handleUpdateTimelineItem(idx, 'title', e.target.value)}
                                              className="col-span-3 bg-black/50 border border-white/10 p-2 text-xs text-white focus:border-pink-500 outline-none"
                                          />
                                      </div>
                                      <textarea 
                                          placeholder="Description of activities..."
                                          value={item.description}
                                          onChange={(e) => handleUpdateTimelineItem(idx, 'description', e.target.value)}
                                          className="w-full bg-black/50 border border-white/10 p-2 text-xs text-white focus:border-pink-500 outline-none h-20 resize-none"
                                      />
                                      <button type="button" onClick={() => handleRemoveTimelineItem(idx)} className="absolute top-2 right-2 text-red-400 hover:text-red-500 opacity-50 group-hover:opacity-100">
                                          <Trash2 size={14}/>
                                      </button>
                                  </div>
                              ))}
                          </div>
                      </div>

                      {/* RIGHT: Roles & General Info */}
                      <div className="space-y-6">
                          <div>
                            <label className="block text-xs text-pink-500 mb-1 uppercase">Club Logo URL</label>
                            <input 
                                value={editForm.logoUrl || ''} 
                                onChange={e => setEditForm({...editForm, logoUrl: processImageUrl(e.target.value)})} 
                                placeholder="https://drive.google.com/..."
                                className="w-full bg-black border border-white/20 p-3 text-white focus:border-pink-500 outline-none text-sm"
                            />
                          </div>

                          {/* Highlights / Tags Editor */}
                          <div>
                            <label className="block text-xs text-pink-500 mb-1 uppercase">Achievements / Tags</label>
                            <div className="flex gap-2 mb-2">
                                <input 
                                    value={newTag}
                                    onChange={(e) => setNewTag(e.target.value)}
                                    onKeyDown={(e) => e.key === 'Enter' && addTag()}
                                    placeholder="Type & Enter"
                                    className="flex-grow bg-black border border-white/20 p-2 text-white focus:border-pink-500 outline-none text-xs"
                                />
                                <button type="button" onClick={addTag} className="bg-white/10 hover:bg-pink-500 hover:text-black p-2 rounded transition-colors"><Plus size={16}/></button>
                            </div>
                            <div className="flex flex-wrap gap-2 max-h-24 overflow-y-auto p-2 border border-white/5 bg-black/20">
                                {(editForm.highlights || []).map((tag, idx) => (
                                    <div key={idx} className="bg-white/5 border border-white/10 px-2 py-1 rounded text-xs text-bone flex items-center gap-2">
                                        {tag}
                                        <button type="button" onClick={() => removeTag(idx)} className="text-red-400 hover:text-red-500"><X size={12}/></button>
                                    </div>
                                ))}
                            </div>
                          </div>

                          {/* Fallback Content (Hidden if Timeline exists, but editable) */}
                          <div className="opacity-50 hover:opacity-100 transition-opacity">
                            <label className="block text-xs text-pink-500 mb-1 uppercase">Fallback Bio (Used if no timeline)</label>
                            <textarea 
                                value={editForm.content.join('\n\n')} 
                                onChange={e => setEditForm({...editForm, content: e.target.value.split('\n\n').filter(Boolean)})} 
                                className="w-full bg-black border border-white/20 p-3 text-white focus:border-pink-500 outline-none h-24 text-xs"
                            />
                          </div>
                          
                          <div>
                            <div className="flex justify-between items-end mb-2">
                                 <label className="block text-xs text-pink-500 uppercase">Roles</label>
                                 <button type="button" onClick={handleAddRole} className="text-xs bg-pink-600/20 text-pink-400 px-2 py-1 rounded hover:bg-pink-600 hover:text-white transition-colors flex items-center gap-1">
                                    <Plus size={12}/> Add Role
                                 </button>
                            </div>
                            
                            <div className="space-y-3 max-h-60 overflow-y-auto pr-2">
                                {safeRoles.map((role, idx) => (
                                    <div key={idx} className="grid grid-cols-12 gap-2 bg-white/5 p-3 rounded border border-white/10 items-center">
                                        <div className="col-span-4">
                                            <input 
                                                placeholder="Role Title"
                                                value={role.title}
                                                onChange={(e) => handleUpdateRole(idx, 'title', e.target.value)}
                                                className="w-full bg-black/50 border border-white/10 p-2 text-xs text-white focus:border-pink-500 outline-none"
                                            />
                                        </div>
                                        <div className="col-span-4">
                                            <input 
                                                placeholder="Club / Org"
                                                value={role.organization}
                                                onChange={(e) => handleUpdateRole(idx, 'organization', e.target.value)}
                                                className="w-full bg-black/50 border border-white/10 p-2 text-xs text-white focus:border-pink-500 outline-none"
                                            />
                                        </div>
                                        <div className="col-span-3">
                                            <input 
                                                placeholder="Year"
                                                value={role.period}
                                                onChange={(e) => handleUpdateRole(idx, 'period', e.target.value)}
                                                className="w-full bg-black/50 border border-white/10 p-2 text-xs text-white focus:border-pink-500 outline-none"
                                            />
                                        </div>
                                        <div className="col-span-1 flex justify-center">
                                            <button type="button" onClick={() => handleRemoveRole(idx)} className="text-red-400 hover:text-red-500">
                                                <Trash2 size={16}/>
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                          </div>
                      </div>
                  </div>

                  <div className="flex justify-end gap-4 pt-4 border-t border-white/10">
                      <button type="button" onClick={() => setIsEditing(false)} className="px-4 py-2 text-bone-dark hover:text-white">Cancel</button>
                      <button type="button" onClick={handleSave} className="px-6 py-2 bg-pink-600 text-white font-bold hover:bg-pink-500 transition-colors">Save Changes</button>
                  </div>
              </div>
          </div>
      )}
    </div>
  );
};

export default AboutRotaract;
