
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Sparkles, Edit3, Plus, X, Trash2, Mountain, Gamepad2, Book, Coffee, Music, Mic, Headphones, Dumbbell, Utensils, Zap, Heart, Ghost } from 'lucide-react';
import { AboutTab, UserRole, AboutContent, CardItem } from '../types';
import { useData } from '../contexts/DataContext';

// Icon Mapping for Personal
const ICON_MAP: Record<string, React.ReactNode> = {
  "Mountain": <Mountain className="w-8 h-8" />,
  "Gamepad2": <Gamepad2 className="w-8 h-8" />,
  "Book": <Book className="w-8 h-8" />,
  "Coffee": <Coffee className="w-8 h-8" />,
  "Music": <Music className="w-8 h-8" />,
  "Utensils": <Utensils className="w-8 h-8" />,
  "Zap": <Zap className="w-8 h-8" />,
  "Heart": <Heart className="w-8 h-8" />,
  "Sparkles": <Sparkles className="w-8 h-8" />,
  "Headphones": <Headphones className="w-8 h-8" />,
  "Dumbbell": <Dumbbell className="w-8 h-8" />,
  "Mic": <Mic className="w-8 h-8" />,
  "Ghost": <Ghost className="w-8 h-8" />
};

const AboutPersonal: React.FC = () => {
  const { aboutData, updateAboutData, user } = useData();
  const data = aboutData[AboutTab.PERSONAL];
  const canEdit = user?.role === UserRole.ADMIN || user?.role === UserRole.EDITOR;

  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState<AboutContent>(data);
  const [newHobby, setNewHobby] = useState('');

  // Card Editing State
  const [showCardEditor, setShowCardEditor] = useState(false);
  const [activeCard, setActiveCard] = useState<CardItem>({ id: '', title: '', description: '', icon: 'Sparkles' });

  const safeCards = editForm.cards || [];

  const handleSave = () => {
    updateAboutData(AboutTab.PERSONAL, editForm);
    setIsEditing(false);
  };

  const addHobby = () => {
    if (newHobby.trim()) {
        setEditForm({
            ...editForm,
            highlights: [...editForm.highlights, newHobby.trim()]
        });
        setNewHobby('');
    }
  };

  const removeHobby = (index: number) => {
    const newHobbies = [...editForm.highlights];
    newHobbies.splice(index, 1);
    setEditForm({ ...editForm, highlights: newHobbies });
  };

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
      if (existingIndex >= 0) {
          newCards[existingIndex] = activeCard;
      } else {
          newCards.push(activeCard);
      }

      setEditForm({ ...editForm, cards: newCards });
      setShowCardEditor(false);
  };

  return (
    <div className="flex-grow w-full px-6 md:px-12 py-6 flex flex-col relative">
      
      <div className="flex justify-between items-center mb-8">
        <Link to="/about" className="inline-flex items-center gap-2 text-bone-dark hover:text-emerald-500 transition-colors group w-fit">
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            <span className="font-serif tracking-wider text-sm">BACK TO SELECTION</span>
        </Link>
        {canEdit && (
            <button 
                onClick={() => { setEditForm(data); setIsEditing(true); }}
                className="flex items-center gap-2 text-bone hover:text-emerald-500 transition-colors px-3 py-1 bg-white/5 border border-white/10 rounded"
            >
                <Edit3 size={16} /> <span className="text-xs uppercase tracking-widest">Edit Page</span>
            </button>
        )}
      </div>

      <div className="text-center mb-16">
         <h1 className="text-4xl md:text-6xl font-serif font-bold text-transparent bg-clip-text bg-gradient-to-b from-white to-emerald-900 mb-4">
           Behind The Veil
         </h1>
         <div className="h-px w-32 bg-emerald-500/50 mx-auto"></div>
      </div>

      <div className="grid md:grid-cols-2 gap-12 mb-16">
         <div className="order-1 relative">
            <div className="absolute inset-0 bg-emerald-500/10 blur-[60px] rounded-full animate-pulse-slow"></div>
            <div className="relative z-10 bg-black/40 backdrop-blur-sm border border-white/10 p-8 rounded-2xl space-y-6">
               <h3 className="text-emerald-400 font-serif tracking-widest uppercase text-sm">Sanctuary</h3>
               {data.content.map((p, i) => (
                 <p key={i} className="text-bone font-sans leading-relaxed opacity-90">{p}</p>
               ))}
               
               {/* Hobbies Chips - Kept for quick tags */}
               <div className="flex flex-wrap gap-2 pt-4">
                 {data.highlights.map((hobby, i) => (
                   <span key={i} className="px-3 py-1 rounded-full border border-emerald-500/30 text-emerald-300 text-xs bg-emerald-900/10">
                     {hobby}
                   </span>
                 ))}
               </div>
            </div>
         </div>

         <div className="order-2">
            <h3 className="text-emerald-400 font-serif tracking-widest uppercase text-sm mb-4 text-center md:text-left">Passions & Pursuits</h3>
            <div className="grid grid-cols-2 gap-4">
               {data.cards && data.cards.map((card, idx) => (
                   <div key={idx} className="bg-emerald-900/10 border border-emerald-500/20 p-6 flex flex-col items-center justify-center gap-4 hover:bg-emerald-900/20 transition-all group rounded-lg hover:border-emerald-500/50 relative overflow-hidden text-center">
                       <div className="text-emerald-500 group-hover:scale-110 transition-transform opacity-80 group-hover:opacity-100 relative z-10">
                           {ICON_MAP[card.icon] || <Sparkles className="w-8 h-8"/>}
                       </div>
                       <div className="relative z-10">
                           <h4 className="font-serif text-white text-sm tracking-wide mb-1">{card.title}</h4>
                           <p className="text-xs text-bone-dark/70">{card.description}</p>
                       </div>
                   </div>
               ))}
            </div>
         </div>
      </div>

       {/* Editing Modal */}
       {isEditing && (
          <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
              <div className="bg-obsidian border border-emerald-500/30 p-8 max-w-4xl w-full space-y-4 shadow-2xl rounded-lg max-h-[90vh] overflow-y-auto">
                  <h2 className="text-xl font-serif text-white mb-4">Edit Personal Bio</h2>
                  
                  <div className="grid md:grid-cols-2 gap-8">
                      <div className="space-y-4">
                        <div>
                            <label className="block text-xs text-emerald-500 mb-1 uppercase">Bio Content (Paragraphs)</label>
                            <textarea 
                                value={editForm.content.join('\n\n')} 
                                onChange={e => setEditForm({...editForm, content: e.target.value.split('\n\n').filter(Boolean)})} 
                                className="w-full bg-black border border-white/20 p-3 text-white focus:border-emerald-500 outline-none h-48 text-sm"
                            />
                        </div>
                        
                        <div>
                            <label className="block text-xs text-emerald-500 mb-1 uppercase">Quick Tags (Chips)</label>
                            <div className="flex gap-2 mb-2">
                                <input 
                                    value={newHobby}
                                    onChange={(e) => setNewHobby(e.target.value)}
                                    onKeyDown={(e) => e.key === 'Enter' && addHobby()}
                                    placeholder="Type hobby & press Enter"
                                    className="flex-grow bg-black border border-white/20 p-2 text-white focus:border-emerald-500 outline-none text-sm"
                                />
                                <button type="button" onClick={addHobby} className="bg-white/10 hover:bg-emerald-500 hover:text-black p-2 rounded transition-colors"><Plus size={20}/></button>
                            </div>
                            
                            <div className="flex flex-wrap gap-2 max-h-40 overflow-y-auto p-2 border border-white/5 bg-black/20">
                                {editForm.highlights.map((hobby, idx) => (
                                    <div key={idx} className="bg-white/5 border border-white/10 px-3 py-1 rounded-full text-xs text-bone flex items-center gap-2">
                                        {hobby}
                                        <button type="button" onClick={() => removeHobby(idx)} className="text-red-400 hover:text-red-500"><X size={12}/></button>
                                    </div>
                                ))}
                            </div>
                        </div>
                      </div>
                      
                      {/* Cards Editor */}
                      <div className="space-y-4">
                           <div className="flex justify-between items-center">
                               <label className="block text-xs text-emerald-500 uppercase">Hobby Tiles</label>
                               <button type="button" onClick={handleAddCard} className="text-xs bg-emerald-500/10 text-emerald-500 px-2 py-1 rounded hover:bg-emerald-500 hover:text-black flex items-center gap-1 transition-colors">
                                   <Plus size={12}/> Add Tile
                               </button>
                           </div>
                           <div className="space-y-2 max-h-[400px] overflow-y-auto pr-2">
                               {safeCards.map((card, idx) => (
                                   <div key={idx} className="bg-white/5 p-3 rounded border border-white/10 flex items-center justify-between group">
                                       <div className="flex items-center gap-3">
                                           <div className="text-emerald-500">{ICON_MAP[card.icon] || <Sparkles size={20}/>}</div>
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
                  </div>

                  <div className="flex justify-end gap-4 pt-4 border-t border-white/10">
                      <button type="button" onClick={() => setIsEditing(false)} className="px-4 py-2 text-bone-dark hover:text-white">Cancel</button>
                      <button type="button" onClick={handleSave} className="px-6 py-2 bg-emerald-600 text-white font-bold hover:bg-emerald-500 transition-colors">Save Changes</button>
                  </div>
              </div>
          </div>
      )}

      {/* Card Editor Modal */}
      {showCardEditor && (
          <div className="fixed inset-0 z-[60] bg-black/90 backdrop-blur flex items-center justify-center p-4">
              <div className="bg-obsidian border border-white/20 p-6 max-w-md w-full space-y-4 shadow-2xl rounded-lg">
                  <h3 className="text-lg font-serif text-white">Edit Hobby Tile</h3>
                  
                  <div>
                      <label className="text-xs text-emerald-500 uppercase">Title</label>
                      <input 
                         value={activeCard.title}
                         onChange={e => setActiveCard({...activeCard, title: e.target.value})}
                         className="w-full bg-black border border-white/10 p-2 text-white outline-none focus:border-emerald-500"
                         placeholder="e.g., Gaming"
                      />
                  </div>
                  <div>
                      <label className="text-xs text-emerald-500 uppercase">Description (Optional)</label>
                      <textarea 
                         value={activeCard.description}
                         onChange={e => setActiveCard({...activeCard, description: e.target.value})}
                         className="w-full bg-black border border-white/10 p-2 text-white outline-none focus:border-emerald-500 h-20 resize-none"
                         placeholder="Short description..."
                      />
                  </div>
                  <div>
                      <label className="text-xs text-emerald-500 uppercase mb-2 block">Select Icon</label>
                      <div className="grid grid-cols-6 gap-2 bg-black/50 p-2 border border-white/10 max-h-40 overflow-y-auto">
                          {Object.keys(ICON_MAP).map(key => (
                              <button 
                                key={key}
                                type="button"
                                onClick={() => setActiveCard({...activeCard, icon: key})}
                                className={`p-2 rounded flex items-center justify-center hover:bg-white/10 transition-colors ${activeCard.icon === key ? 'bg-emerald-500 text-obsidian' : 'text-bone-dark'}`}
                                title={key}
                              >
                                  {React.cloneElement(ICON_MAP[key] as React.ReactElement<any>, { size: 20, className: "w-5 h-5" })}
                              </button>
                          ))}
                      </div>
                  </div>

                  <div className="flex justify-end gap-3 pt-4">
                      <button type="button" onClick={() => setShowCardEditor(false)} className="px-4 py-2 text-bone-dark">Cancel</button>
                      <button type="button" onClick={saveCard} className="px-4 py-2 bg-emerald-500 text-obsidian font-bold">Save Tile</button>
                  </div>
              </div>
          </div>
      )}

    </div>
  );
};

export default AboutPersonal;
