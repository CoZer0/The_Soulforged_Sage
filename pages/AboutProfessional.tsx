

import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Video, Camera, Palette, BrainCircuit, Sparkles, Edit3, Plus, X, Trash2, Code, PenTool, Music, Gamepad2, Coffee, Mountain, Book, Cpu, Globe, Heart, Zap, Mic, Headphones, Dumbbell, Utensils, Briefcase, Box, Layout, Image as ImageIcon, Aperture, Film, GraduationCap } from 'lucide-react';
import { AboutTab, UserRole, AboutContent, CardItem, ExperienceItem, SoftwareItem, EducationItem } from '../types';
import { useData } from '../contexts/DataContext';

// Icon Mapping
const ICON_MAP: Record<string, React.ReactNode> = {
  "Video": <Video className="w-8 h-8" />,
  "Camera": <Camera className="w-8 h-8" />,
  "Palette": <Palette className="w-8 h-8" />,
  "BrainCircuit": <BrainCircuit className="w-8 h-8" />,
  "Code": <Code className="w-8 h-8" />,
  "PenTool": <PenTool className="w-8 h-8" />,
  "Globe": <Globe className="w-8 h-8" />,
  "Cpu": <Cpu className="w-8 h-8" />,
  "Sparkles": <Sparkles className="w-8 h-8" />,
  "Music": <Music className="w-8 h-8" />,
  "Mic": <Mic className="w-8 h-8" />,
  "Box": <Box className="w-8 h-8" />, // 3D/Blender
  "Layout": <Layout className="w-8 h-8" />, // UI/UX
  "Image": <ImageIcon className="w-8 h-8" />, // Photoshop
  "Aperture": <Aperture className="w-8 h-8" />, // After Effects / Photos
  "Film": <Film className="w-8 h-8" />, // Premiere / DaVinci
  "Gamepad2": <Gamepad2 className="w-8 h-8" /> // Unreal/Unity
};

const AboutProfessional: React.FC = () => {
  const { aboutData, updateAboutData, user } = useData();
  const data = aboutData[AboutTab.PROFESSIONAL];
  const canEdit = user?.role === UserRole.ADMIN || user?.role === UserRole.EDITOR;

  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState<AboutContent>(data);
  const [newSkill, setNewSkill] = useState('');

  // Card Editing State
  const [showCardEditor, setShowCardEditor] = useState(false);
  const [activeCard, setActiveCard] = useState<CardItem>({ id: '', title: '', description: '', icon: 'Sparkles' });

  // Software Editing State
  const [showSoftwareEditor, setShowSoftwareEditor] = useState(false);
  const [activeSoftware, setActiveSoftware] = useState<SoftwareItem>({ id: '', name: '', icon: 'Box' });

  // Safety checks
  const safeCards = editForm.cards || [];
  const safeExperience = editForm.experience || [];
  const safeSoftware = editForm.software || [];
  const safeEducation = editForm.education || [];

  const handleSave = () => {
    updateAboutData(AboutTab.PROFESSIONAL, editForm);
    setIsEditing(false);
  };

  const addSkill = () => {
      if (newSkill.trim()) {
          setEditForm({
              ...editForm,
              highlights: [...editForm.highlights, newSkill.trim()]
          });
          setNewSkill('');
      }
  };

  const removeSkill = (index: number) => {
      const newSkills = [...editForm.highlights];
      newSkills.splice(index, 1);
      setEditForm({ ...editForm, highlights: newSkills });
  };

  // --- CARD LOGIC ---
  const handleAddCard = () => {
      setActiveCard({ id: Date.now().toString(), title: '', description: '', icon: 'Sparkles' });
      setShowCardEditor(true);
  };

  const handleEditCard = (card: CardItem) => {
      setActiveCard(card);
      setShowCardEditor(true);
  };

  const handleDeleteCard = (id: string) => {
      setEditForm({
          ...editForm,
          cards: safeCards.filter(c => c.id !== id)
      });
  };

  const saveCard = () => {
      if (!activeCard.title) return;
      const existingIndex = safeCards.findIndex(c => c.id === activeCard.id);
      let newCards = [...safeCards];
      if (existingIndex >= 0) newCards[existingIndex] = activeCard;
      else newCards.push(activeCard);
      setEditForm({ ...editForm, cards: newCards });
      setShowCardEditor(false);
  };

  // --- SOFTWARE LOGIC ---
  const handleAddSoftware = () => {
      setActiveSoftware({ id: Date.now().toString(), name: '', icon: 'Box' });
      setShowSoftwareEditor(true);
  };

  const handleDeleteSoftware = (id: string) => {
      setEditForm({
          ...editForm,
          software: safeSoftware.filter(s => s.id !== id)
      });
  };

  const saveSoftware = () => {
      if (!activeSoftware.name) return;
      const existingIndex = safeSoftware.findIndex(s => s.id === activeSoftware.id);
      let newSoftware = [...safeSoftware];
      if (existingIndex >= 0) newSoftware[existingIndex] = activeSoftware;
      else newSoftware.push(activeSoftware);
      setEditForm({ ...editForm, software: newSoftware });
      setShowSoftwareEditor(false);
  };

  // --- EXPERIENCE HANDLERS ---
  const handleAddExperience = () => {
      setEditForm({
          ...editForm,
          experience: [...safeExperience, { id: Date.now().toString(), role: '', company: '', period: '', description: '' }]
      });
  };

  const handleUpdateExperience = (index: number, field: keyof ExperienceItem, value: string) => {
      const newExp = [...safeExperience];
      newExp[index] = { ...newExp[index], [field]: value };
      setEditForm({ ...editForm, experience: newExp });
  };

  const handleRemoveExperience = (index: number) => {
      const newExp = [...safeExperience];
      newExp.splice(index, 1);
      setEditForm({ ...editForm, experience: newExp });
  };

  // --- EDUCATION HANDLERS ---
  const handleAddEducation = () => {
      setEditForm({
          ...editForm,
          education: [...safeEducation, { id: Date.now().toString(), degree: '', institution: '', period: '', description: '' }]
      });
  };

  const handleUpdateEducation = (index: number, field: keyof EducationItem, value: string) => {
      const newEdu = [...safeEducation];
      newEdu[index] = { ...newEdu[index], [field]: value };
      setEditForm({ ...editForm, education: newEdu });
  };

  const handleRemoveEducation = (index: number) => {
      const newEdu = [...safeEducation];
      newEdu.splice(index, 1);
      setEditForm({ ...editForm, education: newEdu });
  };

  return (
    <div className="flex-grow w-full px-6 md:px-12 py-6 flex flex-col relative">
      
      <div className="flex justify-between items-center mb-8">
        <Link to="/about" className="inline-flex items-center gap-2 text-bone-dark hover:text-soul-fire transition-colors group w-fit">
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          <span className="font-serif tracking-wider text-sm">BACK TO SELECTION</span>
        </Link>
        {canEdit && (
            <button 
                onClick={() => { setEditForm(data); setIsEditing(true); }}
                className="flex items-center gap-2 text-bone hover:text-soul-fire transition-colors px-3 py-1 bg-white/5 border border-white/10 rounded"
            >
                <Edit3 size={16} /> <span className="text-xs uppercase tracking-widest">Edit Page</span>
            </button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 md:gap-x-16 gap-y-12 items-start">
        
        {/* 
            MOBILE ORDER (Grid auto flow with order class): 
            1. Bio
            2. Cards
            3. Experience 
            4. Arsenal
            5. Education (New)
            
            DESKTOP ORDER (Col placement): 
               - Left Col (1): Bio, Arsenal
               - Right Col (2): Cards, Experience, Education
        */}

        {/* SECTION 1: BIO & SKILLS */}
        <div className="space-y-8 md:col-start-1 order-1">
             <div className="relative">
               <h1 className="text-3xl md:text-5xl font-serif font-bold text-white mb-4 leading-tight">
                 Visual Alchemy & <br/>
                 <span className="text-transparent bg-clip-text bg-gradient-to-r from-soul-fire to-soul-ice">Digital Innovation</span>
               </h1>
               <div className="h-1 w-20 bg-soul-fire"></div>
             </div>

             <div className="prose prose-invert prose-lg text-bone-dark font-sans leading-relaxed text-sm md:text-base">
               {data.content.map((p, i) => (
                 <p key={i} className="mb-4">{p}</p>
               ))}
             </div>

             {/* Skill Chips */}
             <div className="flex flex-wrap gap-3 pt-4">
               {data.highlights.map((skill, i) => (
                 <div key={i} className="px-4 py-2 border border-white/10 bg-white/5 rounded-full text-xs md:text-sm font-serif tracking-wide text-soul-ice hover:bg-white/10 hover:border-soul-fire/50 transition-all cursor-default">
                   {skill}
                 </div>
               ))}
             </div>
        </div>

        {/* SECTION 2: CARDS (SERVICE TILES) */}
        <div className="md:col-start-2 order-2">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {data.cards && data.cards.map((card, idx) => (
                    <div key={idx} className="bg-obsidian-light/50 border border-white/5 p-6 hover:border-soul-fire/30 hover:bg-white/5 transition-all group relative overflow-hidden">
                        <div className="mb-4 text-soul-fire group-hover:scale-110 transition-transform relative z-10">
                            {ICON_MAP[card.icon] || <Sparkles className="w-8 h-8"/>}
                        </div>
                        <h3 className="text-xl font-serif text-white mb-2 relative z-10">{card.title}</h3>
                        <p className="text-sm text-bone-dark relative z-10">{card.description}</p>
                    </div>
                ))}
            </div>
        </div>

        {/* SECTION 3: EXPERIENCE (Order 3 ensures it is above Arsenal (4) on mobile) */}
        <div className="md:col-start-2 order-3">
            {data.experience && data.experience.length > 0 && (
                <div className="border-t border-white/10 pt-8">
                    <h2 className="text-2xl font-serif text-white mb-6 flex items-center gap-2">
                        <Briefcase className="text-soul-fire" /> Professional Experience
                    </h2>
                    <div className="space-y-6 relative border-l border-white/10 ml-3 pl-8">
                        {data.experience.map((exp, idx) => (
                            <div key={idx} className="relative">
                                <div className="absolute -left-[39px] top-1 w-5 h-5 rounded-full bg-obsidian border border-soul-fire/50 flex items-center justify-center">
                                    <div className="w-2 h-2 rounded-full bg-soul-fire"></div>
                                </div>
                                <h3 className="text-lg font-serif text-white font-bold">{exp.role}</h3>
                                <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-3 text-sm text-soul-fire/80 mb-2">
                                    <span>{exp.company}</span>
                                    <span className="hidden sm:inline text-white/20">•</span>
                                    <span className="text-white/40">{exp.period}</span>
                                </div>
                                <p className="text-sm text-bone-dark leading-relaxed">{exp.description}</p>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>

        {/* SECTION 5: EDUCATION (Order 5 puts it after Arsenal on mobile, below Experience on Desktop) */}
        <div className="md:col-start-2 order-5">
            {data.education && data.education.length > 0 && (
                <div className="border-t border-white/10 pt-8">
                    <h2 className="text-2xl font-serif text-white mb-6 flex items-center gap-2">
                        <GraduationCap className="text-soul-fire" /> Education
                    </h2>
                    <div className="space-y-6">
                        {data.education.map((edu, idx) => (
                            <div key={idx} className="bg-white/5 p-4 border-l-2 border-soul-fire/50 hover:bg-white/10 transition-colors">
                                <h3 className="text-lg font-serif text-white font-bold">{edu.degree}</h3>
                                <div className="text-sm text-soul-fire mb-1">{edu.institution}</div>
                                <div className="text-xs text-bone-dark/50 mb-2">{edu.period}</div>
                                <p className="text-sm text-bone-dark">{edu.description}</p>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>

        {/* SECTION 4: SOFTWARE ARSENAL (Order 4 puts it last on mobile, Left col on Desktop) */}
        <div className="md:col-start-1 order-4">
           {safeSoftware.length > 0 && (
               <div className="pt-4 border-t border-white/10">
                   <h3 className="text-lg font-serif text-soul-fire mb-6 uppercase tracking-widest flex items-center gap-2">
                       <Cpu size={18}/> The Arsenal
                   </h3>
                   <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 gap-4">
                       {safeSoftware.map((sw) => (
                           <div key={sw.id} className="bg-obsidian-light border border-white/5 p-4 rounded flex flex-col items-center justify-center gap-3 hover:border-soul-fire/40 transition-all group">
                               <div className="text-white group-hover:text-soul-fire transition-colors group-hover:scale-110 duration-300">
                                   {/* Scale down the large mapped icons for this grid */}
                                   {React.cloneElement(ICON_MAP[sw.icon] as React.ReactElement<any> || <Box/>, { size: 24, className: "w-6 h-6" })}
                               </div>
                               <span className="text-xs font-bold text-bone-dark text-center leading-tight">{sw.name}</span>
                           </div>
                       ))}
                   </div>
               </div>
           )}
        </div>

      </div>

      {/* Editing Modal */}
      {isEditing && (
          <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
              <div className="bg-obsidian border border-soul-fire/30 p-8 max-w-5xl w-full space-y-4 shadow-2xl rounded-lg max-h-[90vh] overflow-y-auto">
                  <h2 className="text-xl font-serif text-white mb-4">Edit Professional Bio</h2>
                  
                  <div className="grid md:grid-cols-2 gap-8">
                      {/* Left Column Editors */}
                      <div className="space-y-6">
                        <div>
                            <label className="block text-xs text-soul-fire mb-1 uppercase">Bio Content (Paragraphs)</label>
                            <textarea 
                                value={editForm.content.join('\n\n')} 
                                onChange={e => setEditForm({...editForm, content: e.target.value.split('\n\n').filter(Boolean)})} 
                                className="w-full bg-black border border-white/20 p-3 text-white focus:border-soul-fire outline-none h-48 text-sm"
                            />
                        </div>
                        
                        {/* Skills Editor */}
                        <div>
                            <label className="block text-xs text-soul-fire mb-1 uppercase">Technical Skills (Chips)</label>
                            <div className="flex gap-2 mb-2">
                                <input 
                                    value={newSkill}
                                    onChange={(e) => setNewSkill(e.target.value)}
                                    onKeyDown={(e) => e.key === 'Enter' && addSkill()}
                                    placeholder="Type skill & press Enter"
                                    className="flex-grow bg-black border border-white/20 p-2 text-white focus:border-soul-fire outline-none text-sm"
                                />
                                <button type="button" onClick={addSkill} className="bg-white/10 hover:bg-soul-fire hover:text-black p-2 rounded transition-colors"><Plus size={20}/></button>
                            </div>
                            <div className="flex flex-wrap gap-2 max-h-40 overflow-y-auto p-2 border border-white/5 bg-black/20">
                                {editForm.highlights.map((skill, idx) => (
                                    <div key={idx} className="bg-white/5 border border-white/10 px-3 py-1 rounded-full text-xs text-bone flex items-center gap-2">
                                        {skill}
                                        <button type="button" onClick={() => removeSkill(idx)} className="text-red-400 hover:text-red-500"><X size={12}/></button>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Software Editor Section */}
                        <div>
                            <div className="flex justify-between items-center mb-2">
                                <label className="block text-xs text-soul-fire uppercase">Softwares Known (Arsenal)</label>
                                <button type="button" onClick={handleAddSoftware} className="text-xs bg-soul-fire/10 text-soul-fire px-2 py-1 rounded hover:bg-soul-fire hover:text-black flex items-center gap-1 transition-colors">
                                    <Plus size={12}/> Add Tool
                                </button>
                            </div>
                            <div className="space-y-2 max-h-48 overflow-y-auto pr-2 border border-white/5 p-2 bg-black/20">
                                {safeSoftware.map((sw) => (
                                    <div key={sw.id} className="bg-white/5 p-2 rounded border border-white/10 flex items-center justify-between">
                                        <div className="flex items-center gap-2">
                                            <div className="text-soul-fire">{React.cloneElement(ICON_MAP[sw.icon] as React.ReactElement<any> || <Box/>, { size: 16 })}</div>
                                            <span className="text-sm text-white">{sw.name}</span>
                                        </div>
                                        <button type="button" onClick={() => handleDeleteSoftware(sw.id)} className="text-red-400 hover:text-red-500"><Trash2 size={14}/></button>
                                    </div>
                                ))}
                            </div>
                        </div>
                      </div>
                      
                      {/* Right Column Editors */}
                      <div className="space-y-6">
                           {/* Cards Editor */}
                           <div>
                               <div className="flex justify-between items-center mb-2">
                                   <label className="block text-xs text-soul-fire uppercase">Service Tiles</label>
                                   <button type="button" onClick={handleAddCard} className="text-xs bg-soul-fire/10 text-soul-fire px-2 py-1 rounded hover:bg-soul-fire hover:text-black flex items-center gap-1 transition-colors">
                                       <Plus size={12}/> Add Tile
                                   </button>
                               </div>
                               <div className="space-y-2 max-h-[200px] overflow-y-auto pr-2 border border-white/5 p-2 bg-black/20">
                                   {safeCards.map((card, idx) => (
                                       <div key={idx} className="bg-white/5 p-3 rounded border border-white/10 flex items-center justify-between group">
                                           <div className="flex items-center gap-3">
                                               <div className="text-soul-fire">{ICON_MAP[card.icon] || <Sparkles size={20}/>}</div>
                                               <div>
                                                   <div className="text-white text-sm font-bold">{card.title}</div>
                                                   <div className="text-xs text-bone-dark truncate max-w-[150px]">{card.description}</div>
                                               </div>
                                           </div>
                                           <div className="flex gap-2 opacity-50 group-hover:opacity-100">
                                                <button type="button" onClick={() => handleEditCard(card)} className="text-bone hover:text-white"><Edit3 size={14}/></button>
                                                <button type="button" onClick={() => handleDeleteCard(card.id)} className="text-red-400 hover:text-red-500"><Trash2 size={14}/></button>
                                           </div>
                                       </div>
                                   ))}
                               </div>
                           </div>

                           {/* Experience Editor */}
                           <div>
                               <div className="flex justify-between items-center mb-2">
                                   <label className="block text-xs text-soul-fire uppercase">Work Experience</label>
                                   <button type="button" onClick={handleAddExperience} className="text-xs bg-soul-fire/10 text-soul-fire px-2 py-1 rounded hover:bg-soul-fire hover:text-black flex items-center gap-1 transition-colors">
                                       <Plus size={12}/> Add Job
                                   </button>
                               </div>
                               <div className="space-y-3 max-h-[300px] overflow-y-auto pr-2">
                                  {safeExperience.map((exp, idx) => (
                                      <div key={idx} className="bg-white/5 p-3 rounded border border-white/10 relative group space-y-2">
                                          <div className="grid grid-cols-2 gap-2">
                                              <input placeholder="Role" value={exp.role} onChange={e => handleUpdateExperience(idx, 'role', e.target.value)} className="bg-black/50 border border-white/10 p-2 text-xs text-white focus:border-soul-fire outline-none" />
                                              <input placeholder="Company" value={exp.company} onChange={e => handleUpdateExperience(idx, 'company', e.target.value)} className="bg-black/50 border border-white/10 p-2 text-xs text-white focus:border-soul-fire outline-none" />
                                          </div>
                                          <input placeholder="Period (e.g. 2020-2022)" value={exp.period} onChange={e => handleUpdateExperience(idx, 'period', e.target.value)} className="w-full bg-black/50 border border-white/10 p-2 text-xs text-white focus:border-soul-fire outline-none" />
                                          <textarea placeholder="Description" value={exp.description} onChange={e => handleUpdateExperience(idx, 'description', e.target.value)} className="w-full bg-black/50 border border-white/10 p-2 text-xs text-white focus:border-soul-fire outline-none h-16 resize-none" />
                                          
                                          <button type="button" onClick={() => handleRemoveExperience(idx)} className="absolute top-2 right-2 text-red-400 hover:text-red-500 opacity-50 group-hover:opacity-100">
                                              <Trash2 size={14}/>
                                          </button>
                                      </div>
                                  ))}
                               </div>
                           </div>

                           {/* Education Editor */}
                           <div>
                               <div className="flex justify-between items-center mb-2">
                                   <label className="block text-xs text-soul-fire uppercase">Education</label>
                                   <button type="button" onClick={handleAddEducation} className="text-xs bg-soul-fire/10 text-soul-fire px-2 py-1 rounded hover:bg-soul-fire hover:text-black flex items-center gap-1 transition-colors">
                                       <Plus size={12}/> Add Degree
                                   </button>
                               </div>
                               <div className="space-y-3 max-h-[300px] overflow-y-auto pr-2">
                                  {safeEducation.map((edu, idx) => (
                                      <div key={idx} className="bg-white/5 p-3 rounded border border-white/10 relative group space-y-2">
                                          <div className="grid grid-cols-2 gap-2">
                                              <input placeholder="Degree" value={edu.degree} onChange={e => handleUpdateEducation(idx, 'degree', e.target.value)} className="bg-black/50 border border-white/10 p-2 text-xs text-white focus:border-soul-fire outline-none" />
                                              <input placeholder="Institution" value={edu.institution} onChange={e => handleUpdateEducation(idx, 'institution', e.target.value)} className="bg-black/50 border border-white/10 p-2 text-xs text-white focus:border-soul-fire outline-none" />
                                          </div>
                                          <input placeholder="Period" value={edu.period} onChange={e => handleUpdateEducation(idx, 'period', e.target.value)} className="w-full bg-black/50 border border-white/10 p-2 text-xs text-white focus:border-soul-fire outline-none" />
                                          <textarea placeholder="Description" value={edu.description} onChange={e => handleUpdateEducation(idx, 'description', e.target.value)} className="w-full bg-black/50 border border-white/10 p-2 text-xs text-white focus:border-soul-fire outline-none h-16 resize-none" />
                                          
                                          <button type="button" onClick={() => handleRemoveEducation(idx)} className="absolute top-2 right-2 text-red-400 hover:text-red-500 opacity-50 group-hover:opacity-100">
                                              <Trash2 size={14}/>
                                          </button>
                                      </div>
                                  ))}
                               </div>
                           </div>
                      </div>
                  </div>

                  <div className="flex justify-end gap-4 pt-4 border-t border-white/10">
                      <button type="button" onClick={() => setIsEditing(false)} className="px-4 py-2 text-bone-dark hover:text-white">Cancel</button>
                      <button type="button" onClick={handleSave} className="px-6 py-2 bg-soul-fire text-obsidian font-bold hover:bg-white transition-colors">Save Changes</button>
                  </div>
              </div>
          </div>
      )}

      {/* Card Editor Modal */}
      {showCardEditor && (
          <div className="fixed inset-0 z-[60] bg-black/90 backdrop-blur flex items-center justify-center p-4">
              <div className="bg-obsidian border border-white/20 p-6 max-w-md w-full space-y-4 shadow-2xl rounded-lg">
                  <h3 className="text-lg font-serif text-white">Edit Tile</h3>
                  
                  <div>
                      <label className="text-xs text-soul-fire uppercase">Title</label>
                      <input 
                         value={activeCard.title}
                         onChange={e => setActiveCard({...activeCard, title: e.target.value})}
                         className="w-full bg-black border border-white/10 p-2 text-white outline-none focus:border-soul-fire"
                         placeholder="e.g., Photography"
                      />
                  </div>
                  <div>
                      <label className="text-xs text-soul-fire uppercase">Description</label>
                      <textarea 
                         value={activeCard.description}
                         onChange={e => setActiveCard({...activeCard, description: e.target.value})}
                         className="w-full bg-black border border-white/10 p-2 text-white outline-none focus:border-soul-fire h-20 resize-none"
                         placeholder="Short description..."
                      />
                  </div>
                  <div>
                      <label className="text-xs text-soul-fire uppercase mb-2 block">Select Icon</label>
                      <div className="grid grid-cols-6 gap-2 bg-black/50 p-2 border border-white/10 max-h-40 overflow-y-auto">
                          {Object.keys(ICON_MAP).map(key => (
                              <button 
                                key={key}
                                type="button"
                                onClick={() => setActiveCard({...activeCard, icon: key})}
                                className={`p-2 rounded flex items-center justify-center hover:bg-white/10 transition-colors ${activeCard.icon === key ? 'bg-soul-fire text-obsidian' : 'text-bone-dark'}`}
                                title={key}
                              >
                                  {React.cloneElement(ICON_MAP[key] as React.ReactElement<any>, { size: 20, className: "w-5 h-5" })}
                              </button>
                          ))}
                      </div>
                  </div>

                  <div className="flex justify-end gap-3 pt-4">
                      <button type="button" onClick={() => setShowCardEditor(false)} className="px-4 py-2 text-bone-dark">Cancel</button>
                      <button type="button" onClick={saveCard} className="px-4 py-2 bg-soul-fire text-obsidian font-bold">Save Tile</button>
                  </div>
              </div>
          </div>
      )}

      {/* Software Editor Modal */}
      {showSoftwareEditor && (
          <div className="fixed inset-0 z-[60] bg-black/90 backdrop-blur flex items-center justify-center p-4">
              <div className="bg-obsidian border border-white/20 p-6 max-w-md w-full space-y-4 shadow-2xl rounded-lg">
                  <h3 className="text-lg font-serif text-white">Add Tool to Arsenal</h3>
                  
                  <div>
                      <label className="text-xs text-soul-fire uppercase">Software Name</label>
                      <input 
                         value={activeSoftware.name}
                         onChange={e => setActiveSoftware({...activeSoftware, name: e.target.value})}
                         className="w-full bg-black border border-white/10 p-2 text-white outline-none focus:border-soul-fire"
                         placeholder="e.g., Adobe Photoshop"
                      />
                  </div>
                  
                  <div>
                      <label className="text-xs text-soul-fire uppercase mb-2 block">Select Representative Icon</label>
                      <div className="grid grid-cols-6 gap-2 bg-black/50 p-2 border border-white/10 max-h-40 overflow-y-auto">
                          {Object.keys(ICON_MAP).map(key => (
                              <button 
                                key={key}
                                type="button"
                                onClick={() => setActiveSoftware({...activeSoftware, icon: key})}
                                className={`p-2 rounded flex items-center justify-center hover:bg-white/10 transition-colors ${activeSoftware.icon === key ? 'bg-soul-fire text-obsidian' : 'text-bone-dark'}`}
                                title={key}
                              >
                                  {React.cloneElement(ICON_MAP[key] as React.ReactElement<any>, { size: 20, className: "w-5 h-5" })}
                              </button>
                          ))}
                      </div>
                  </div>

                  <div className="flex justify-end gap-3 pt-4">
                      <button type="button" onClick={() => setShowSoftwareEditor(false)} className="px-4 py-2 text-bone-dark">Cancel</button>
                      <button type="button" onClick={saveSoftware} className="px-4 py-2 bg-soul-fire text-obsidian font-bold">Save Tool</button>
                  </div>
              </div>
          </div>
      )}

    </div>
  );
};

export default AboutProfessional;
