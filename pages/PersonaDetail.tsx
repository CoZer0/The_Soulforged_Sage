
import React, { useState, useEffect, useRef } from 'react';
import { useParams, Navigate, Link } from 'react-router-dom';
import { PersonaType, PersonaWriting, PersonaWork, PersonaContent, UserRole, ProjectCategory, ProjectItem, AbyssWhisper, Chapter, Comment } from '../types';
import { ArrowLeft, PenTool, Camera, Palette, Film, BookOpen, Edit3, Eye, EyeOff, Trash2, Plus, Save, X, Image as ImageIcon, Wand2, Lock, MessageSquare, ChevronDown, ChevronUp, Book, ChevronLeft, ChevronRight, Send, Reply, Play, Maximize2, Volume2, VolumeX } from 'lucide-react';
import { GoogleGenAI } from "@google/genai";
import { useData } from '../contexts/DataContext';

// Helper for standardized date format
const getCurrentDate = () => new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });

const getLatestContentDate = (writing: PersonaWriting): string => {
    let latestDate = new Date(writing.date);
    if (writing.chapters && writing.chapters.length > 0) {
        writing.chapters.forEach(chapter => {
            const cDate = new Date(chapter.date);
            if (!isNaN(cDate.getTime()) && cDate > latestDate) {
                latestDate = cDate;
            }
        });
    }
    return latestDate.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
};

const processImageUrl = (url: string) => {
    if (!url) return "";
    const idMatch = url.match(/(?:\/d\/|id=)([a-zA-Z0-9_-]+)/);
    if (idMatch && (url.includes('drive.google.com') || url.includes('docs.google.com'))) {
        const id = idMatch[1];
        return `https://drive.google.com/thumbnail?id=${id}&sz=w4096`;
    }
    return url;
};

const getDirectVideoUrl = (url: string) => {
    if (!url) return "";
    const idMatch = url.match(/(?:\/d\/|id=)([a-zA-Z0-9_-]+)/);
    if (idMatch && (url.includes('drive.google.com') || url.includes('docs.google.com'))) {
        return `https://drive.google.com/uc?export=download&id=${idMatch[1]}`;
    }
    return url;
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

// Recursive helper to add a reply to the comment tree
const addReplyToTree = (comments: Comment[], parentId: string, newReply: Comment): Comment[] => {
    return comments.map(c => {
        if (c.id === parentId) {
            return { ...c, replies: [...(c.replies || []), newReply] };
        }
        if (c.replies) {
            return { ...c, replies: addReplyToTree(c.replies, parentId, newReply) };
        }
        return c;
    });
};

// Recursive helper to delete a comment from the tree
const deleteCommentFromTree = (comments: Comment[], targetId: string): Comment[] => {
    const filtered = comments.filter(c => c.id !== targetId);
    return filtered.map(c => ({
        ...c,
        replies: c.replies ? deleteCommentFromTree(c.replies, targetId) : undefined
    }));
};

// --- NEW COMPONENT: MEDIA CARD (Handles Image/Video + Hover Play) ---
interface MediaCardProps {
    item: { title: string; description: string; image?: string; video?: string; hidden?: boolean };
    onClick: () => void;
}
const MediaCard: React.FC<MediaCardProps> = ({ item, onClick }) => {
    const videoRef = useRef<HTMLVideoElement>(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const [videoError, setVideoError] = useState(false);
    const [isMuted, setIsMuted] = useState(false);

    const handleMouseEnter = async () => {
        if (item.video && videoRef.current && !videoError) {
            try {
                // Attempt to play with audio first
                videoRef.current.muted = false;
                setIsMuted(false);
                await videoRef.current.play();
                setIsPlaying(true);
            } catch (err) {
                // If autoplay with audio is blocked, fallback to muted
                if (videoRef.current) {
                    try {
                        videoRef.current.muted = true;
                        setIsMuted(true);
                        await videoRef.current.play();
                        setIsPlaying(true);
                    } catch (e) {
                         console.error("Video playback failed", e);
                         setVideoError(true);
                         setIsPlaying(false);
                    }
                }
            }
        }
    };

    const handleMouseLeave = () => {
        if (item.video && videoRef.current) {
            videoRef.current.pause();
            videoRef.current.currentTime = 0;
            setIsPlaying(false);
        }
    };

    return (
        <div 
            className="w-full h-full relative overflow-hidden bg-obsidian-dark group cursor-pointer"
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            onClick={(e) => { e.preventDefault(); onClick(); }}
        >
            {item.video && !videoError ? (
                <>
                    <video 
                        ref={videoRef}
                        src={getDirectVideoUrl(item.video)}
                        className={`w-full h-full object-cover transition-opacity duration-300 ${isPlaying ? 'opacity-100' : 'opacity-0'}`}
                        playsInline
                        loop
                        onError={() => setVideoError(true)}
                    />
                    {/* Fallback/Poster Image when not playing */}
                    <img 
                        src={item.image} 
                        alt={item.title} 
                        referrerPolicy="no-referrer" 
                        className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-300 ${isPlaying ? 'opacity-0' : 'opacity-100'}`} 
                    />
                    {/* Indicators */}
                    {!isPlaying && (
                        <div className="absolute inset-0 flex items-center justify-center bg-black/10 pointer-events-none">
                            <div className="bg-black/50 p-3 rounded-full border border-white/20 backdrop-blur-sm shadow-xl">
                                <Play size={24} className="text-white fill-white ml-1" />
                            </div>
                        </div>
                    )}
                    {isPlaying && isMuted && (
                         <div className="absolute bottom-2 right-2 bg-black/60 p-1.5 rounded-full backdrop-blur pointer-events-none">
                             <VolumeX size={14} className="text-white" />
                         </div>
                    )}
                    {isPlaying && !isMuted && (
                         <div className="absolute bottom-2 right-2 bg-black/60 p-1.5 rounded-full backdrop-blur pointer-events-none">
                             <Volume2 size={14} className="text-white" />
                         </div>
                    )}
                </>
            ) : (
                <img 
                    src={item.image} 
                    alt={item.title} 
                    referrerPolicy="no-referrer" 
                    className="w-full h-auto block transition-transform duration-700 group-hover:scale-105" 
                />
            )}
            
            {item.hidden && <div className="absolute top-2 right-2 bg-red-900 text-white text-[10px] px-2 py-1 uppercase font-bold flex items-center gap-1 rounded z-10"><Lock size={10} /> Hidden</div>}
        </div>
    );
};


const PersonaDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { personas, user, updatePersona } = useData();
  
  const personaEntry = (Object.entries(personas) as [PersonaType, typeof personas[PersonaType]][])
    .find(([, data]) => data.id === id);

  if (!personaEntry) {
    return <Navigate to="/personas" replace />;
  }

  const [type, data] = personaEntry;
  const [displayImage, setDisplayImage] = useState(data.image);
  const [isGenerating, setIsGenerating] = useState(false);
  const [showImageInput, setShowImageInput] = useState(false);
  const [manualImageUrl, setManualImageUrl] = useState("");

  // --- PERMISSIONS ---
  const isAdmin = user?.role === UserRole.ADMIN;
  const isEditor = user?.role === UserRole.EDITOR;
  const canEditContent = isAdmin || isEditor;
  const canManageSystem = isAdmin;

  // --- UI STATES ---
  const [expandedWritingId, setExpandedWritingId] = useState<string | null>(null);
  const [activeChapterIndex, setActiveChapterIndex] = useState<number>(0);
  const [collapsedCategories, setCollapsedCategories] = useState<Set<number>>(new Set());
  
  // Lightbox State
  const [lightboxItem, setLightboxItem] = useState<{ type: 'IMAGE' | 'VIDEO', src: string, title: string, description: string } | null>(null);

  // Whispers View State
  const [viewAllWhispers, setViewAllWhispers] = useState(false);

  // Comments State
  const [commentAuthor, setCommentAuthor] = useState('');
  const [commentText, setCommentText] = useState('');
  
  // Reply State
  const [replyingToId, setReplyingToId] = useState<string | null>(null);
  const [replyAuthor, setReplyAuthor] = useState('');
  const [replyText, setReplyText] = useState('');
  
  const chapterContentRef = useRef<HTMLDivElement>(null);

  // --- EDITING STATES ---
  const [isEditingMeta, setIsEditingMeta] = useState(false);
  const [activeWorkEditor, setActiveWorkEditor] = useState<{ item: PersonaWork, index: number } | 'NEW' | null>(null);
  const [activeWritingEditor, setActiveWritingEditor] = useState<{ item: PersonaWriting, index: number } | 'NEW' | null>(null);
  const [activeCategoryEditor, setActiveCategoryEditor] = useState<{ item: ProjectCategory, index: number } | 'NEW' | null>(null);
  const [activeProjectItemEditor, setActiveProjectItemEditor] = useState<{ categoryIndex: number, item: ProjectItem, itemIndex: number } | 'NEW' | null>(null);
  const [newProjectItemCatIndex, setNewProjectItemCatIndex] = useState<number | null>(null);
  const [activeWhisperEditor, setActiveWhisperEditor] = useState<{ item: AbyssWhisper, index: number } | 'NEW' | null>(null);

  const [metaForm, setMetaForm] = useState({
    title: data.title,
    subtitle: data.subtitle,
    description: data.description,
    quote: data.quote,
    hidden: data.hidden || false,
    skills: data.skills || []
  });

  const [skillsInput, setSkillsInput] = useState(data.skills ? data.skills.join(', ') : '');

  useEffect(() => {
    setDisplayImage(data.image);
    setMetaForm({
        title: data.title,
        subtitle: data.subtitle,
        description: data.description,
        quote: data.quote,
        hidden: data.hidden || false,
        skills: data.skills || []
    });
    setSkillsInput(data.skills ? data.skills.join(', ') : '');
  }, [data]);

  // --- HANDLERS ---
  
  // (Generation & Meta handlers kept same as before)
  const handleGenerateBanner = async () => {
    if (isGenerating || !canEditContent) return;
    setIsGenerating(true);
    try {
        const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
        const prompt = `Abstract, mystical, ethereal digital art representing a character archetype named "${data.title}" - "${data.subtitle}". Description: ${data.description}. Aesthetic: Dark, moody, obsidian black with glowing cyan and soul-fire blue accents, magical, cinematic lighting, high detail, 8k resolution, concept art style. No text.`;
        
        const response = await ai.models.generateImages({
            model: 'imagen-4.0-generate-001',
            prompt: prompt,
            config: {
                numberOfImages: 1,
                aspectRatio: '16:9',
                outputMimeType: 'image/jpeg',
            },
        });

        if (response.generatedImages?.[0]?.image?.imageBytes) {
            const base64Image = response.generatedImages[0].image.imageBytes;
            const newImage = `data:image/jpeg;base64,${base64Image}`;
            setDisplayImage(newImage);
            updatePersona(type, { ...data, image: newImage });
        }
    } catch (error) {
        console.error("Generation failed", error);
    } finally {
        setIsGenerating(false);
    }
  };

  const handleManualImageUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    if(manualImageUrl && canEditContent) {
      const processedUrl = processImageUrl(manualImageUrl);
      setDisplayImage(processedUrl);
      updatePersona(type, { ...data, image: processedUrl });
      setShowImageInput(false);
      setManualImageUrl("");
    }
  };

  const saveMeta = () => {
      const skillsArray = skillsInput.split(',').map(s => s.trim()).filter(Boolean);
      updatePersona(type, { ...data, ...metaForm, skills: skillsArray });
      setIsEditingMeta(false);
  };

  const toggleVisibility = () => {
      if (!canManageSystem) return;
      const newHidden = !data.hidden;
      updatePersona(type, { ...data, hidden: newHidden });
  };

  const toggleWritingExpansion = (id: string) => {
    if (expandedWritingId === id) {
        setExpandedWritingId(null);
    } else {
        setExpandedWritingId(id);
        setActiveChapterIndex(0);
        setCommentAuthor('');
        setCommentText('');
        setReplyingToId(null);
    }
  };
  
  const handleChapterNavigation = (newIndex: number) => {
      setActiveChapterIndex(newIndex);
      if (chapterContentRef.current) {
          chapterContentRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
      setReplyingToId(null);
  };

  const toggleCategoryCollapse = (index: number) => {
    const newSet = new Set(collapsedCategories);
    if (newSet.has(index)) newSet.delete(index);
    else newSet.add(index);
    setCollapsedCategories(newSet);
  };

  // --- WHISPERS LOGIC ---
  const displayedWhispers = data.whispers ? data.whispers.slice(0, 6) : [];

  // --- COMMENT HANDLERS (CHAPTER LEVEL) ---
  const handleAddComment = (writingId: string) => {
      if (!commentAuthor.trim() || !commentText.trim()) return;
      
      const newWritings = data.writings ? [...data.writings] : [];
      const writingIndex = newWritings.findIndex(w => w.id === writingId);
      
      if (writingIndex !== -1) {
          const writing = { ...newWritings[writingIndex] };
          if (writing.chapters && writing.chapters[activeChapterIndex]) {
              const chapter = { ...writing.chapters[activeChapterIndex] };
              const comments = chapter.comments ? [...chapter.comments] : [];
              comments.push({ id: Date.now().toString(), author: commentAuthor, text: commentText, date: getCurrentDate() });
              chapter.comments = comments;
              
              writing.chapters = [...writing.chapters];
              writing.chapters[activeChapterIndex] = chapter;
              
              newWritings[writingIndex] = writing;
              updatePersona(type, { ...data, writings: newWritings });
              setCommentText(''); 
          }
      }
  };

  const handleReplySubmit = (writingId: string, parentId: string) => {
      if (!replyAuthor.trim() || !replyText.trim()) return;
      
      const newWritings = data.writings ? [...data.writings] : [];
      const writingIndex = newWritings.findIndex(w => w.id === writingId);
      
      if (writingIndex !== -1) {
          const writing = { ...newWritings[writingIndex] };
          if (writing.chapters && writing.chapters[activeChapterIndex]) {
               const chapter = { ...writing.chapters[activeChapterIndex] };
               const currentComments = chapter.comments || [];
               const newReply: Comment = { id: Date.now().toString(), author: replyAuthor, text: replyText, date: getCurrentDate() };
               const updatedComments = addReplyToTree(currentComments, parentId, newReply);
               
               chapter.comments = updatedComments;
               writing.chapters = [...writing.chapters];
               writing.chapters[activeChapterIndex] = chapter;
               
               newWritings[writingIndex] = writing;
               updatePersona(type, { ...data, writings: newWritings });
               setReplyingToId(null);
               setReplyText('');
          }
      }
  };

  const handleDeleteComment = (writingId: string, commentId: string) => {
      const newWritings = data.writings ? [...data.writings] : [];
      const writingIndex = newWritings.findIndex(w => w.id === writingId);
      
      if (writingIndex !== -1) {
          const writing = { ...newWritings[writingIndex] };
          if (writing.chapters && writing.chapters[activeChapterIndex]) {
              const chapter = { ...writing.chapters[activeChapterIndex] };
              if (chapter.comments) {
                  chapter.comments = deleteCommentFromTree(chapter.comments, commentId);
                  writing.chapters = [...writing.chapters];
                  writing.chapters[activeChapterIndex] = chapter;
                  
                  newWritings[writingIndex] = writing;
                  updatePersona(type, { ...data, writings: newWritings });
              }
          }
      }
  };

  const renderComments = (comments: Comment[], writingId: string, depth = 0) => {
      return comments.map(comment => (
          <div key={comment.id} className={`group relative ${depth > 0 ? 'ml-4 md:ml-8 border-l border-white/10 pl-4 mt-2' : 'mt-4'}`}>
              <div className="bg-white/5 border border-white/5 rounded p-4">
                  <div className="flex justify-between items-start mb-2">
                      <div className="flex items-center gap-2">
                          <div className="w-6 h-6 rounded-full bg-soul-fire/20 flex items-center justify-center text-xs text-soul-fire font-bold">
                              {comment.author.charAt(0).toUpperCase()}
                          </div>
                          <span className="text-soul-fire font-bold text-sm">{comment.author}</span>
                      </div>
                      <span className="text-[10px] text-bone-dark uppercase">{comment.date}</span>
                  </div>
                  <p className="text-bone-dark text-sm pl-8 leading-relaxed mb-2">{comment.text}</p>
                  
                  <div className="flex justify-end gap-2">
                     <button 
                        onClick={() => {
                            if (replyingToId === comment.id) {
                                setReplyingToId(null);
                            } else {
                                setReplyingToId(comment.id);
                                setReplyAuthor('');
                                setReplyText('');
                            }
                        }}
                        className="text-xs flex items-center gap-1 text-bone-dark hover:text-soul-fire transition-colors"
                     >
                        <Reply size={12} /> Reply
                     </button>
                  </div>
                  {canManageSystem && (
                      <button onClick={() => handleDeleteComment(writingId, comment.id)} className="absolute top-2 right-2 text-red-500 opacity-0 group-hover:opacity-100 transition-opacity p-1 hover:bg-red-900/20 rounded" title="Delete Comment">
                          <Trash2 size={12} />
                      </button>
                  )}
              </div>
              {replyingToId === comment.id && (
                   <div className="mt-2 ml-4 md:ml-8 bg-black/40 border border-soul-fire/20 p-3 rounded animate-in fade-in slide-in-from-top-2">
                       <div className="flex flex-col gap-2">
                           <input value={replyAuthor} onChange={(e) => setReplyAuthor(e.target.value)} placeholder="Your Name" className="w-full bg-black border border-white/10 p-2 text-white text-xs focus:border-soul-fire outline-none" autoFocus />
                           <textarea value={replyText} onChange={(e) => setReplyText(e.target.value)} placeholder={`Replying to ${comment.author}...`} className="w-full bg-black border border-white/10 p-2 text-white text-xs focus:border-soul-fire outline-none resize-none h-16" />
                           <div className="flex justify-end gap-2">
                               <button onClick={() => setReplyingToId(null)} className="text-xs text-bone-dark hover:text-white px-2 py-1">Cancel</button>
                               <button onClick={() => handleReplySubmit(writingId, comment.id)} disabled={!replyAuthor.trim() || !replyText.trim()} className="text-xs bg-soul-fire text-obsidian px-3 py-1 font-bold hover:bg-white transition-colors disabled:opacity-50">Send Reply</button>
                           </div>
                       </div>
                   </div>
              )}
              {comment.replies && comment.replies.length > 0 && <div className="mt-2">{renderComments(comment.replies, writingId, depth + 1)}</div>}
          </div>
      ));
  };

  // CRUD Handlers (same as before)
  const saveWork = (work: PersonaWork) => {
      const newWorks = data.works ? [...data.works] : [];
      if (activeWorkEditor === 'NEW') {
          newWorks.unshift({ ...work, dateAdded: new Date().toISOString() });
      } else if (activeWorkEditor && typeof activeWorkEditor !== 'string') {
          newWorks[activeWorkEditor.index] = work;
      }
      updatePersona(type, { ...data, works: newWorks });
      setActiveWorkEditor(null);
  };
  const deleteWork = (index: number) => {
      const newWorks = data.works ? [...data.works] : [];
      if (index >= 0 && index < newWorks.length) {
          newWorks.splice(index, 1);
          updatePersona(type, { ...data, works: newWorks });
      }
  };
  const toggleWorkVisibility = (index: number) => {
      const newWorks = data.works ? [...data.works] : [];
      if (index >= 0 && index < newWorks.length) {
          newWorks[index] = { ...newWorks[index], hidden: !newWorks[index].hidden };
          updatePersona(type, { ...data, works: newWorks });
      }
  };
  const saveWriting = (writing: PersonaWriting) => {
      const newWritings = data.writings ? [...data.writings] : [];
      if (activeWritingEditor === 'NEW') newWritings.unshift(writing);
      else if (activeWritingEditor && typeof activeWritingEditor !== 'string') newWritings[activeWritingEditor.index] = writing;
      updatePersona(type, { ...data, writings: newWritings });
      setActiveWritingEditor(null);
  };
  const deleteWriting = (index: number) => {
      const newWritings = data.writings ? [...data.writings] : [];
      if (index >= 0 && index < newWritings.length) {
          newWritings.splice(index, 1);
          updatePersona(type, { ...data, writings: newWritings });
      }
  };
  const toggleWritingVisibility = (index: number) => {
      const newWritings = data.writings ? [...data.writings] : [];
      if (index >= 0 && index < newWritings.length) {
          newWritings[index] = { ...newWritings[index], hidden: !newWritings[index].hidden };
          updatePersona(type, { ...data, writings: newWritings });
      }
  };
  const saveCategory = (cat: ProjectCategory) => {
     const newCats = data.projectCategories ? [...data.projectCategories] : [];
     if (activeCategoryEditor === 'NEW') newCats.unshift(cat);
     else if (activeCategoryEditor && typeof activeCategoryEditor !== 'string') newCats[activeCategoryEditor.index] = cat;
     updatePersona(type, { ...data, projectCategories: newCats });
     setActiveCategoryEditor(null);
  };
  const deleteCategory = (index: number) => {
      const newCats = data.projectCategories ? [...data.projectCategories] : [];
      if (index >= 0 && index < newCats.length) {
          newCats.splice(index, 1);
          updatePersona(type, { ...data, projectCategories: newCats });
      }
  };
  const toggleCategoryVisibility = (index: number) => {
     const newCats = data.projectCategories ? [...data.projectCategories] : [];
     if (index >= 0 && index < newCats.length) {
         newCats[index] = { ...newCats[index], hidden: !newCats[index].hidden };
         updatePersona(type, { ...data, projectCategories: newCats });
     }
  };
  const saveProjectItem = (item: ProjectItem) => {
      const newCats = data.projectCategories ? [...data.projectCategories] : [];
      if (activeProjectItemEditor === 'NEW') {
          if (newProjectItemCatIndex === null || !newCats[newProjectItemCatIndex]) return;
          const targetCat = { ...newCats[newProjectItemCatIndex] };
          targetCat.items = targetCat.items ? [...targetCat.items] : [];
          targetCat.items.unshift({ ...item, dateAdded: new Date().toISOString() });
          newCats[newProjectItemCatIndex] = targetCat;
      } else if (activeProjectItemEditor && typeof activeProjectItemEditor !== 'string') {
          const { categoryIndex, itemIndex } = activeProjectItemEditor;
          if (!newCats[categoryIndex]) return;
          const targetCat = { ...newCats[categoryIndex] };
          targetCat.items = targetCat.items ? [...targetCat.items] : [];
          if (itemIndex >= 0 && itemIndex < targetCat.items.length) {
              targetCat.items[itemIndex] = item;
              newCats[categoryIndex] = targetCat;
          }
      }
      updatePersona(type, { ...data, projectCategories: newCats });
      setActiveProjectItemEditor(null);
      setNewProjectItemCatIndex(null);
  };
  const deleteProjectItem = (catIndex: number, itemIndex: number) => {
     const newCats = data.projectCategories ? [...data.projectCategories] : [];
     if (!newCats[catIndex]) return; 
     const targetCat = { ...newCats[catIndex] };
     targetCat.items = targetCat.items ? [...targetCat.items] : [];
     if (itemIndex >= 0 && itemIndex < targetCat.items.length) {
         targetCat.items.splice(itemIndex, 1);
         newCats[catIndex] = targetCat;
         updatePersona(type, { ...data, projectCategories: newCats });
     }
  };
  const toggleProjectItemVisibility = (catIndex: number, itemIndex: number) => {
      const newCats = data.projectCategories ? [...data.projectCategories] : [];
      if (!newCats[catIndex]) return;
      const targetCat = { ...newCats[catIndex] };
      targetCat.items = targetCat.items ? [...targetCat.items] : [];
      if (itemIndex >= 0 && itemIndex < targetCat.items.length) {
          const item = { ...targetCat.items[itemIndex] };
          item.hidden = !item.hidden;
          targetCat.items[itemIndex] = item;
          newCats[catIndex] = targetCat;
          updatePersona(type, { ...data, projectCategories: newCats });
      }
  };
  const saveWhisper = (whisper: AbyssWhisper) => {
      const newWhispers = data.whispers ? [...data.whispers] : [];
      if (activeWhisperEditor === 'NEW') newWhispers.unshift(whisper);
      else if (activeWhisperEditor && typeof activeWhisperEditor !== 'string') newWhispers[activeWhisperEditor.index] = whisper;
      updatePersona(type, { ...data, whispers: newWhispers });
      setActiveWhisperEditor(null);
  };
  const deleteWhisper = (index: number) => {
      const newWhispers = data.whispers ? [...data.whispers] : [];
      if (index >= 0 && index < newWhispers.length) {
          newWhispers.splice(index, 1);
          updatePersona(type, { ...data, whispers: newWhispers });
      }
  };
  const toggleWhisperVisibility = (index: number) => {
      const newWhispers = data.whispers ? [...data.whispers] : [];
      if (index >= 0 && index < newWhispers.length) {
          newWhispers[index] = { ...newWhispers[index], hidden: !newWhispers[index].hidden };
          updatePersona(type, { ...data, whispers: newWhispers });
      }
  };

  const getIcon = (type: PersonaType) => {
    switch (type) {
      case PersonaType.DREAM_WEAVER: return <PenTool className="w-10 h-10 md:w-14 md:h-14" />;
      case PersonaType.STILLWANDERER: return <Camera className="w-10 h-10 md:w-14 md:h-14" />;
      case PersonaType.GLYPHSMITH: return <Palette className="w-10 h-10 md:w-14 md:h-14" />;
      case PersonaType.FRAME_WEAVER: return <Film className="w-10 h-10 md:w-14 md:h-14" />;
      case PersonaType.ABYSS: return <BookOpen className="w-10 h-10 md:w-14 md:h-14" />;
      default: return null;
    }
  };

  // --- SUBPAGE VIEW FOR WHISPERS ---
  if (viewAllWhispers && data.whispers) {
      return (
          <div className="flex-grow w-full px-4 md:px-12 py-6 flex flex-col relative animate-in fade-in slide-in-from-right-10 duration-500">
               <div className="flex justify-between items-center mb-8">
                  <button onClick={() => setViewAllWhispers(false)} className="inline-flex items-center gap-2 text-bone-dark hover:text-soul-fire transition-colors group">
                      <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                      <span className="font-serif tracking-wider text-xs md:text-sm">BACK TO PERSONA</span>
                  </button>
                  <h2 className="text-xl md:text-2xl font-serif text-white text-center absolute left-1/2 -translate-x-1/2">All Echoes from the Void</h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {data.whispers.map((whisper, idx) => (
                       (!whisper.hidden || canManageSystem) && (
                           <div key={idx} className={`bg-obsidian-light p-6 border ${whisper.hidden ? 'border-red-900/50' : 'border-white/5'} rounded-lg relative group hover:border-soul-fire/30 transition-all`}>
                               <p className="text-bone font-serif italic leading-relaxed mb-4">"{whisper.content}"</p>
                               <div className="text-xs text-soul-fire/60 uppercase tracking-wider">{whisper.date}</div>
                               {whisper.hidden && <div className="absolute top-4 right-4 text-red-500"><Lock size={14} /></div>}
                           </div>
                       )
                  ))}
              </div>
          </div>
      );
  }

  // --- MAIN RENDER ---
  return (
    <div className="flex-grow w-full px-4 md:px-12 py-6 flex flex-col relative">
      
      {/* Top Navigation */}
      <div className="flex justify-between items-center mb-6">
        <Link to="/personas" className="inline-flex items-center gap-2 text-bone-dark hover:text-soul-fire transition-colors group">
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            <span className="font-serif tracking-wider text-xs md:text-sm">RETURN TO OVERVIEW</span>
        </Link>

        {canManageSystem && (
            <div className="flex items-center gap-2 bg-obsidian-light border border-white/10 p-1 rounded-lg">
                 <button type="button" onClick={() => setIsEditingMeta(true)} className="p-2 text-bone hover:text-soul-fire transition-colors" title="Edit Persona Metadata"><Edit3 size={16} /></button>
                 <div className="w-px h-4 bg-white/10"></div>
                 <button type="button" onClick={toggleVisibility} className={`p-2 transition-colors ${data.hidden ? 'text-red-500' : 'text-soul-fire'}`} title={data.hidden ? "Hidden" : "Visible"}>{data.hidden ? <EyeOff size={16} /> : <Eye size={16} />}</button>
            </div>
        )}
      </div>

      {/* MAIN BANNER AREA */}
      <div className="relative w-full h-[300px] md:h-[400px] rounded-2xl overflow-hidden mb-12 group shadow-[0_0_50px_rgba(0,0,0,0.5)] border border-white/10">
          
          {canEditContent && (
              <div className="absolute top-4 right-4 z-30 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button type="button" onClick={() => setShowImageInput(!showImageInput)} className="p-2 bg-black/80 text-white rounded-full hover:bg-soul-fire hover:text-black transition-colors backdrop-blur-md border border-white/10"><ImageIcon size={18} /></button>
                  <button type="button" onClick={handleGenerateBanner} disabled={isGenerating} className="p-2 bg-black/80 text-white rounded-full hover:bg-soul-fire hover:text-black transition-colors backdrop-blur-md border border-white/10 disabled:opacity-50"><Wand2 size={18} className={isGenerating ? 'animate-spin' : ''} /></button>
              </div>
          )}

          {showImageInput && (
              <div className="absolute top-0 left-0 w-full bg-black/90 p-4 z-40 border-b border-soul-fire flex justify-center">
                  <form onSubmit={handleManualImageUpdate} className="flex gap-2 w-full max-w-2xl">
                      <input type="text" value={manualImageUrl} onChange={(e) => setManualImageUrl(e.target.value)} placeholder="Image URL (Drive links supported)..." className="flex-grow bg-transparent border-b border-white/30 text-white text-sm py-2 outline-none focus:border-soul-fire" />
                      <button type="submit" className="text-soul-fire hover:text-white"><Save size={18} /></button>
                      <button type="button" onClick={() => setShowImageInput(false)} className="text-red-500 hover:text-red-400"><X size={18} /></button>
                  </form>
              </div>
          )}

          <img 
            src={displayImage} 
            alt={data.title} 
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover transition-transform duration-[2s] group-hover:scale-[1.01]" 
          />
          <div className="absolute inset-0 bg-gradient-to-t from-obsidian via-obsidian/40 to-transparent opacity-90 pointer-events-none"></div>

          <div className="absolute bottom-0 left-0 p-6 md:p-10 w-full flex flex-col justify-end items-start pointer-events-none">
             <div className="animate-in slide-in-from-bottom-10 duration-1000 pointer-events-auto">
                 <div className="text-soul-fire mb-2 md:mb-4 filter drop-shadow-[0_0_10px_rgb(var(--color-soul-fire)/0.5)] p-2 md:p-3 bg-white/5 rounded-full w-fit border border-white/10 backdrop-blur-sm scale-75 md:scale-100 origin-left">
                    {getIcon(type)}
                 </div>
                 <h1 className="text-2xl sm:text-4xl md:text-6xl font-serif font-bold text-white mb-1 md:mb-2 leading-tight drop-shadow-lg tracking-tight">{data.title}</h1>
                 <p className="text-xs sm:text-sm md:text-base font-bold text-soul-fire uppercase tracking-[0.2em] md:tracking-[0.3em] border-l-2 md:border-l-4 border-soul-fire pl-3 md:pl-4">{data.subtitle}</p>
             </div>
          </div>
      </div>

      <div className="max-w-4xl mx-auto mb-12 md:mb-20 space-y-8 md:space-y-10">
           <div className="prose prose-invert prose-lg mx-auto text-center px-2">
               <p className="text-xl md:text-3xl text-bone leading-relaxed font-serif italic opacity-90 relative inline-block">
                  <span className="absolute -top-2 -left-4 md:-top-4 md:-left-6 text-4xl md:text-6xl text-soul-fire/20 font-serif">"</span>
                  {data.quote}
                  <span className="absolute -bottom-6 -right-4 md:-bottom-8 md:-right-6 text-4xl md:text-6xl text-soul-fire/20 font-serif transform rotate-180">"</span>
               </p>
           </div>
           <div className="h-px w-24 bg-gradient-to-r from-transparent via-soul-fire/50 to-transparent mx-auto"></div>
           <p className="text-bone-dark font-sans leading-relaxed md:leading-loose text-base md:text-lg text-justify md:text-center px-2 md:px-4">{data.description}</p>
           <div className="flex flex-wrap gap-2 md:gap-3 justify-center">
                {data.skills.map((skill, i) => (
                    <span key={i} className="px-3 py-1 md:px-5 md:py-2 bg-white/5 border border-white/10 rounded-full text-xs md:text-sm font-serif text-soul-ice hover:border-soul-fire/50 transition-colors cursor-default">{skill}</span>
                ))}
            </div>
      </div>

      {/* --- CONTENT SECTIONS --- */}
      
      {/* Works Gallery */}
      {data.works && (
          <div className="space-y-8 border-t border-white/10 pt-16">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <h2 className="text-2xl md:text-3xl font-serif text-white">Selected Works</h2>
                  {canEditContent && <button type="button" onClick={() => setActiveWorkEditor('NEW')} className="flex items-center gap-2 px-4 py-2 bg-white/5 hover:bg-soul-fire hover:text-obsidian transition-colors border border-white/10 rounded text-sm w-fit"><Plus size={16} /> Add Work</button>}
              </div>
              <div className="columns-1 md:columns-2 lg:columns-3 gap-6 space-y-6">
                  {data.works.map((work, idx) => (
                      (!work.hidden || canManageSystem) && (
                          <div key={idx} className={`break-inside-avoid group relative bg-obsidian-light border ${work.hidden ? 'border-red-900/50 opacity-70' : 'border-white/10'} hover:border-soul-fire/50 transition-all overflow-hidden flex flex-col rounded-lg`}>
                              {/* Media Container using new MediaCard component */}
                              <div className="w-full aspect-video md:aspect-auto">
                                 <MediaCard 
                                    item={work} 
                                    onClick={() => setLightboxItem({ type: work.video ? 'VIDEO' : 'IMAGE', src: work.video || work.image || '', title: work.title, description: work.description })}
                                 />
                              </div>

                              {canEditContent && (
                                  <div className="absolute top-2 left-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity bg-black/90 p-1 rounded z-[100] border border-white/10">
                                      <button type="button" onClick={(e) => { e.preventDefault(); e.stopPropagation(); setActiveWorkEditor({ item: work, index: idx }); }} className="p-2 text-bone hover:text-soul-fire cursor-pointer"><Edit3 size={14} className="pointer-events-none" /></button>
                                      {canManageSystem && (
                                          <>
                                              <button type="button" onClick={(e) => { e.preventDefault(); e.stopPropagation(); toggleWorkVisibility(idx); }} className="p-2 text-bone hover:text-soul-fire cursor-pointer">{work.hidden ? <EyeOff size={14} className="pointer-events-none" /> : <Eye size={14} className="pointer-events-none" />}</button>
                                              <button type="button" onClick={(e) => { e.preventDefault(); e.stopPropagation(); deleteWork(idx); }} className="p-2 text-red-400 hover:text-red-500 cursor-pointer"><Trash2 size={14} className="pointer-events-none" /></button>
                                          </>
                                      )}
                                  </div>
                              )}
                              <div className="p-6 flex-grow bg-white/5 relative z-20 pointer-events-none">
                                  <div className="text-xs text-soul-fire uppercase tracking-wider mb-2">{work.category}</div>
                                  <h3 className="text-xl font-serif text-white mb-2">{work.title}</h3>
                                  <p className="text-sm text-bone-dark line-clamp-2">{work.description}</p>
                              </div>
                          </div>
                      )
                  ))}
              </div>
          </div>
      )}

      {/* DREAM WEAVER PROJECTS */}
      {data.projectCategories && (
          <div className="space-y-16 border-t border-white/10 pt-16">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <h2 className="text-2xl md:text-3xl font-serif text-white">The Architect's Dimensions</h2>
                  {canEditContent && <button type="button" onClick={() => setActiveCategoryEditor('NEW')} className="flex items-center gap-2 px-4 py-2 bg-white/5 hover:bg-soul-fire hover:text-obsidian transition-colors border border-white/10 rounded text-sm w-fit"><Plus size={16} /> Add Dimension</button>}
              </div>
              {data.projectCategories.map((cat, catIdx) => (
                  (!cat.hidden || canManageSystem) && (
                  <div key={catIdx} className={`space-y-6 ${cat.hidden ? 'opacity-60 border-l-2 border-red-900 pl-4' : ''}`}>
                      <div className="relative rounded-xl overflow-hidden group bg-obsidian-light border border-white/10 hover:border-soul-fire/30 transition-colors">
                           <div className="absolute inset-0 h-full">
                               <img src={cat.bannerImage} alt={cat.title} referrerPolicy="no-referrer" className="w-full h-full object-cover opacity-30 group-hover:opacity-40 transition-opacity" />
                               <div className="absolute inset-0 bg-gradient-to-r from-obsidian via-obsidian/90 to-transparent"></div>
                           </div>
                           <div className="relative z-10 p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                               <div className="flex-1 cursor-pointer" onClick={() => toggleCategoryCollapse(catIdx)}>
                                    <div className="flex items-center gap-3 mb-2">
                                        <h3 className="text-xl md:text-2xl font-serif font-bold text-white">{cat.title}</h3>
                                        {collapsedCategories.has(catIdx) ? <ChevronDown className="text-soul-fire" size={20}/> : <ChevronUp className="text-soul-fire" size={20}/>}
                                    </div>
                                    <p className="text-bone-dark text-sm max-w-2xl">{cat.description}</p>
                               </div>
                               {canEditContent && (
                                  <div className="flex gap-2 bg-black/50 backdrop-blur p-2 rounded border border-white/10 relative z-20 z-[100]">
                                      <button type="button" onClick={(e) => { e.preventDefault(); e.stopPropagation(); setActiveCategoryEditor({item: cat, index: catIdx}); }} className="text-bone hover:text-soul-fire cursor-pointer"><Edit3 size={18} className="pointer-events-none"/></button>
                                      <button type="button" onClick={(e) => { e.preventDefault(); e.stopPropagation(); setNewProjectItemCatIndex(catIdx); setActiveProjectItemEditor('NEW'); }} className="text-bone hover:text-soul-fire cursor-pointer" title="Add Item to Category"><Plus size={18} className="pointer-events-none"/></button>
                                      {canManageSystem && (
                                          <>
                                            <button type="button" onClick={(e) => { e.preventDefault(); e.stopPropagation(); toggleCategoryVisibility(catIdx); }} className="text-bone hover:text-soul-fire cursor-pointer">{cat.hidden ? <EyeOff size={18} className="pointer-events-none"/> : <Eye size={18} className="pointer-events-none"/>}</button>
                                            <button type="button" onClick={(e) => { e.preventDefault(); e.stopPropagation(); deleteCategory(catIdx); }} className="text-red-400 hover:text-red-500 cursor-pointer"><Trash2 size={18} className="pointer-events-none"/></button>
                                          </>
                                      )}
                                  </div>
                               )}
                           </div>
                           {cat.hidden && <div className="absolute top-2 right-2 bg-red-900/80 text-white px-2 py-1 text-[10px] font-bold uppercase rounded"><Lock size={10}/> Hidden</div>}
                      </div>
                      {!collapsedCategories.has(catIdx) && cat.items && (
                          <div className="columns-1 md:columns-2 lg:columns-3 gap-6 space-y-6 animate-float">
                              {cat.items.map((item, itemIdx) => (
                                  (!item.hidden || canManageSystem) && (
                                  <div key={itemIdx} className={`break-inside-avoid bg-white/5 border ${item.hidden ? 'border-red-900/50' : 'border-white/5'} rounded-lg overflow-hidden group/item relative flex flex-col`}>
                                      <div className="w-full relative overflow-hidden cursor-pointer" onClick={() => setLightboxItem({ type: 'IMAGE', src: item.image, title: item.title, description: item.description })}>
                                          <img src={item.image} alt={item.title} referrerPolicy="no-referrer" className="w-full h-auto block transition-transform duration-700 group-hover/item:scale-105" />
                                          <div className="absolute inset-0 bg-black/60 opacity-0 group-hover/item:opacity-100 transition-opacity flex flex-col justify-center items-center p-4 text-center pointer-events-none">
                                              <Maximize2 className="w-8 h-8 text-soul-fire mb-2" />
                                              <p className="text-sm text-bone">{item.description}</p>
                                          </div>
                                          {item.hidden && <div className="absolute top-2 right-2 bg-red-900 text-white text-[10px] px-2 py-1 uppercase font-bold flex items-center gap-1 rounded z-10"><Lock size={10} /> Hidden</div>}
                                      </div>
                                      <div className="p-4 flex justify-between items-center bg-obsidian-light flex-grow relative">
                                          <h4 className="text-lg font-serif text-white">{item.title}</h4>
                                          {canEditContent && (
                                              <div className="flex gap-2 opacity-0 group-hover/item:opacity-100 transition-opacity relative z-[100]">
                                                  <button type="button" onClick={(e) => { e.preventDefault(); e.stopPropagation(); setActiveProjectItemEditor({ categoryIndex: catIdx, item: item, itemIndex: itemIdx }); }} className="text-bone hover:text-soul-fire cursor-pointer"><Edit3 size={14} className="pointer-events-none" /></button>
                                                  {canManageSystem && (
                                                      <>
                                                        <button type="button" onClick={(e) => { e.preventDefault(); e.stopPropagation(); toggleProjectItemVisibility(catIdx, itemIdx); }} className="text-bone hover:text-soul-fire cursor-pointer">{item.hidden ? <EyeOff size={14} className="pointer-events-none"/> : <Eye size={14} className="pointer-events-none"/>}</button>
                                                        <button type="button" onClick={(e) => { e.preventDefault(); e.stopPropagation(); deleteProjectItem(catIdx, itemIdx); }} className="text-red-400 hover:text-red-500 cursor-pointer"><Trash2 size={14} className="pointer-events-none" /></button>
                                                      </>
                                                  )}
                                              </div>
                                          )}
                                      </div>
                                  </div>
                                  )
                              ))}
                          </div>
                      )}
                  </div>
                  )
              ))}
          </div>
      )}

      {/* ABYSS WHISPERS */}
      {data.whispers && (
          <div className="space-y-8 border-t border-white/10 pt-16">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <h2 className="text-2xl md:text-3xl font-serif text-white flex items-center gap-3"><MessageSquare className="text-soul-fire"/> Echoes from the Void</h2>
                  <div className="flex gap-3">
                    <button onClick={() => setViewAllWhispers(true)} className="px-4 py-2 border border-white/10 text-xs text-bone hover:text-white hover:border-soul-fire transition-colors uppercase tracking-wider">
                        View All Echoes
                    </button>
                    {canEditContent && <button type="button" onClick={() => setActiveWhisperEditor('NEW')} className="flex items-center gap-2 px-4 py-2 bg-white/5 hover:bg-soul-fire hover:text-obsidian transition-colors border border-white/10 rounded text-sm"><Plus size={16} /> New Echo</button>}
                  </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  {/* Logic: Show first 2 on mobile, first 6 on desktop. Remaining shown on subpage. */}
                  {displayedWhispers.map((whisper, idx) => (
                       (!whisper.hidden || canManageSystem) && (
                           <div key={idx} className={`bg-obsidian-light p-6 border ${whisper.hidden ? 'border-red-900/50' : 'border-white/5'} rounded-lg relative group hover:border-soul-fire/30 transition-all ${idx >= 2 ? 'hidden md:block' : ''}`}>
                               <p className="text-bone font-serif italic leading-relaxed mb-4">"{whisper.content}"</p>
                               <div className="text-xs text-soul-fire/60 uppercase tracking-wider">{whisper.date}</div>
                               {whisper.hidden && <div className="absolute top-4 right-4 text-red-500"><Lock size={14} /></div>}
                               {canEditContent && (
                                  <div className="absolute bottom-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity bg-black/50 p-1 rounded z-[100]">
                                      <button type="button" onClick={(e) => { e.preventDefault(); e.stopPropagation(); setActiveWhisperEditor({ item: whisper, index: idx }); }} className="text-bone hover:text-soul-fire cursor-pointer"><Edit3 size={14} className="pointer-events-none" /></button>
                                      {canManageSystem && (
                                          <>
                                              <button type="button" onClick={(e) => { e.preventDefault(); e.stopPropagation(); toggleWhisperVisibility(idx); }} className="text-bone hover:text-soul-fire cursor-pointer">{whisper.hidden ? <EyeOff size={14} className="pointer-events-none"/> : <Eye size={14} className="pointer-events-none"/>}</button>
                                              <button type="button" onClick={(e) => { e.preventDefault(); e.stopPropagation(); deleteWhisper(idx); }} className="text-red-400 hover:text-red-500 cursor-pointer"><Trash2 size={14} className="pointer-events-none" /></button>
                                          </>
                                      )}
                                  </div>
                               )}
                           </div>
                       )
                  ))}
              </div>
          </div>
      )}

      {/* CHRONICLES (WRITINGS) */}
      {data.writings && (
           <div className="space-y-8 border-t border-white/10 pt-16">
               <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <h2 className="text-2xl md:text-3xl font-serif text-white flex items-center gap-3"><BookOpen className="text-soul-fire"/> The Chronicles</h2>
                  {canEditContent && <button type="button" onClick={() => setActiveWritingEditor('NEW')} className="flex items-center gap-2 px-4 py-2 bg-white/5 hover:bg-soul-fire hover:text-obsidian transition-colors border border-white/10 rounded text-sm w-fit"><Plus size={16} /> New Chronicle</button>}
              </div>

              <div className="space-y-6">
                  {data.writings.map((writing, idx) => (
                      (!writing.hidden || canManageSystem) && (
                          <div key={idx} className={`bg-obsidian-light border ${writing.hidden ? 'border-red-900/50 opacity-70' : 'border-white/5'} transition-all group relative overflow-hidden`}>
                              {canEditContent && (
                                  <div className="absolute top-2 right-2 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity bg-black/80 p-1 rounded border border-white/10 z-[100]">
                                      <button type="button" onClick={(e) => { e.preventDefault(); e.stopPropagation(); setActiveWritingEditor({ item: writing, index: idx }); }} className="p-2 text-bone hover:text-soul-fire cursor-pointer" title="Edit Chronicle & Chapters"><Edit3 size={14} className="pointer-events-none" /></button>
                                      {canManageSystem && (
                                          <>
                                              <button type="button" onClick={(e) => { e.preventDefault(); e.stopPropagation(); toggleWritingVisibility(idx); }} className="p-2 text-bone hover:text-soul-fire cursor-pointer">{writing.hidden ? <EyeOff size={14} className="pointer-events-none" /> : <Eye size={14} className="pointer-events-none" />}</button>
                                              <button type="button" onClick={(e) => { e.preventDefault(); e.stopPropagation(); deleteWriting(idx); }} className="p-2 text-red-400 hover:text-red-500 cursor-pointer"><Trash2 size={14} className="pointer-events-none" /></button>
                                          </>
                                      )}
                                  </div>
                              )}
                              <div className="p-6 md:p-8 border-b border-white/5">
                                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
                                      <h3 className="text-2xl font-serif text-white group-hover:text-soul-fire transition-colors">{writing.title}</h3>
                                      <span className="text-sm text-bone-dark font-mono border border-white/10 px-3 py-1 rounded flex items-center gap-2 w-fit">
                                         <span className="text-soul-fire/50 text-[10px] uppercase">Updated</span>
                                         {getLatestContentDate(writing)}
                                      </span>
                                  </div>
                                  <p className="text-bone-dark/80 leading-relaxed mb-6 text-base md:text-lg">{writing.excerpt}</p>
                                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                                      <div className="flex flex-wrap gap-2">
                                          {writing.tags.map(tag => (
                                              <span key={tag} className="text-[10px] uppercase tracking-wider text-soul-fire/70 border border-soul-fire/20 px-2 py-1 rounded">{tag}</span>
                                          ))}
                                      </div>
                                      <button type="button" onClick={() => toggleWritingExpansion(writing.id)} className="flex items-center gap-2 text-soul-fire font-serif text-sm hover:text-white transition-colors uppercase tracking-wider self-start sm:self-auto">
                                        {expandedWritingId === writing.id ? <><BookOpen size={16}/> Close Chronicles</> : <><Book size={16}/> Read Chapters ({writing.chapters.length})</>}
                                      </button>
                                  </div>
                              </div>
                              {expandedWritingId === writing.id && (
                                  <div className="bg-black/30 border-t border-white/5 p-4 md:p-6 transition-all duration-500">
                                      {writing.chapters.length === 0 ? (
                                          <p className="text-bone-dark italic text-center py-8">The pages are blank...</p>
                                      ) : (
                                          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 md:gap-8">
                                              <div className="md:col-span-4 space-y-1 border-b md:border-b-0 md:border-r border-white/10 pb-4 md:pb-0 md:pr-4 max-h-[30vh] md:max-h-[60vh] overflow-y-auto">
                                                 <h4 className="text-xs font-bold text-soul-fire uppercase tracking-widest mb-4 px-2 sticky top-0 bg-obsidian-light/90 backdrop-blur p-2 z-10">Table of Contents</h4>
                                                 {writing.chapters.map((chapter, cIdx) => (
                                                     <button type="button" key={chapter.id} onClick={() => handleChapterNavigation(cIdx)} className={`w-full text-left px-4 py-3 text-sm font-serif transition-all duration-300 border-l-2 ${activeChapterIndex === cIdx ? 'bg-white/5 border-soul-fire text-white' : 'border-transparent text-bone-dark hover:text-bone hover:border-white/20'}`}>
                                                         <div className="flex justify-between items-center"><span className="line-clamp-1">{toRoman(cIdx + 1)}. {chapter.title}</span></div>
                                                     </button>
                                                 ))}
                                              </div>
                                              <div className="md:col-span-8 min-h-[400px] pl-0 md:pl-2" ref={chapterContentRef}>
                                                  {(() => {
                                                       const activeChapter = writing.chapters[activeChapterIndex] || writing.chapters[0];
                                                       if (!activeChapter) return null;
                                                       
                                                       // Use chapter specific comments now
                                                       const currentComments = activeChapter.comments || [];

                                                       return (
                                                           <div className="animate-in fade-in duration-500">
                                                               <div className="mb-6 border-b border-white/5 pb-4">
                                                                   <div className="flex flex-col md:flex-row justify-between md:items-end mb-2 gap-2">
                                                                       <h3 className="text-xl md:text-2xl font-serif text-white">{activeChapter.title}</h3>
                                                                       <span className="text-xs text-bone-dark font-mono">{activeChapter.date}</span>
                                                                   </div>
                                                               </div>
                                                               <div className="prose prose-invert prose-bone max-w-none font-sans leading-loose text-base md:text-lg opacity-90">
                                                                   {activeChapter.content.split('\n').map((line, lIdx) => (
                                                                       <p key={lIdx} className="mb-4">{line}</p>
                                                                   ))}
                                                               </div>
                                                               
                                                               {/* Chapter Navigation */}
                                                               <div className="flex justify-between items-center mt-12 pt-8 border-t border-white/5">
                                                                  {activeChapterIndex > 0 ? (
                                                                      <button type="button" onClick={() => handleChapterNavigation(activeChapterIndex - 1)} className="flex flex-col items-start group text-left max-w-[45%]">
                                                                          <span className="flex items-center gap-1 text-xs text-soul-fire uppercase tracking-widest mb-1 opacity-70 group-hover:opacity-100 group-hover:-translate-x-1 transition-all"><ChevronLeft size={14} /> Previous</span>
                                                                          <span className="text-sm text-bone group-hover:text-white font-serif line-clamp-1 border-b border-transparent group-hover:border-soul-fire/50 transition-colors">{writing.chapters[activeChapterIndex - 1].title}</span>
                                                                      </button>
                                                                  ) : <div />}
                                                                  {activeChapterIndex < writing.chapters.length - 1 ? (
                                                                      <button type="button" onClick={() => handleChapterNavigation(activeChapterIndex + 1)} className="flex flex-col items-end group text-right max-w-[45%]">
                                                                          <span className="flex items-center gap-1 text-xs text-soul-fire uppercase tracking-widest mb-1 opacity-70 group-hover:opacity-100 group-hover:translate-x-1 transition-all">Next <ChevronRight size={14} /></span>
                                                                          <span className="text-sm text-bone group-hover:text-white font-serif line-clamp-1 border-b border-transparent group-hover:border-soul-fire/50 transition-colors">{writing.chapters[activeChapterIndex + 1].title}</span>
                                                                      </button>
                                                                  ) : <div />}
                                                              </div>

                                                               {/* Chapter Specific Comments */}
                                                               <div className="mt-12 bg-black/20 p-6 rounded border border-white/5">
                                                                   <h4 className="font-serif text-white text-lg mb-6 flex items-center gap-2"><MessageSquare className="w-5 h-5 text-soul-fire" /> Thoughts on this Chapter ({currentComments.length})</h4>
                                                                   <div className="space-y-4 mb-8">
                                                                       {currentComments.length === 0 && <div className="text-bone-dark/40 italic text-sm text-center py-4">No thoughts recorded yet...</div>}
                                                                       {currentComments.length > 0 && renderComments(currentComments, writing.id)}
                                                                   </div>
                                                                   <div className="bg-black/20 border border-white/5 rounded p-4 md:p-6">
                                                                       <h5 className="text-xs uppercase text-soul-fire tracking-wider mb-4">Leave a Note</h5>
                                                                       <div className="flex flex-col gap-4">
                                                                           <div className="flex flex-col md:flex-row gap-4">
                                                                               <div className="md:w-1/3">
                                                                                   <label className="text-[10px] uppercase text-soul-fire mb-1 block tracking-wider opacity-70">Identity</label>
                                                                                   <input value={commentAuthor} onChange={(e) => setCommentAuthor(e.target.value)} placeholder="Your Name / Alias" className="w-full bg-obsidian-dark border border-white/10 p-2 text-white text-sm focus:border-soul-fire outline-none rounded-none placeholder-white/20" />
                                                                               </div>
                                                                           </div>
                                                                           <div>
                                                                               <label className="text-[10px] uppercase text-soul-fire mb-1 block tracking-wider opacity-70">The Message</label>
                                                                               <textarea value={commentText} onChange={(e) => setCommentText(e.target.value)} placeholder="Leave your echo in the void..." className="w-full bg-obsidian-dark border border-white/10 p-3 text-white text-sm focus:border-soul-fire outline-none rounded-none h-24 placeholder-white/20 resize-none" />
                                                                           </div>
                                                                           <div className="flex justify-end">
                                                                               <button onClick={() => handleAddComment(writing.id)} disabled={!commentAuthor.trim() || !commentText.trim()} className="flex items-center gap-2 px-4 py-2 bg-soul-fire/10 border border-soul-fire/30 text-soul-fire hover:bg-soul-fire hover:text-obsidian transition-all disabled:opacity-50 disabled:cursor-not-allowed text-sm font-serif"><Send size={14} /> Transmit Echo</button>
                                                                           </div>
                                                                       </div>
                                                                   </div>
                                                               </div>
                                                           </div>
                                                       );
                                                  })()}
                                              </div>
                                          </div>
                                      )}
                                      <div className="flex justify-center pt-8 mt-8">
                                          <button type="button" onClick={() => setExpandedWritingId(null)} className="text-bone-dark hover:text-soul-fire text-sm flex items-center gap-2"><ChevronUp size={14}/> Close Chronicle</button>
                                      </div>
                                  </div>
                              )}
                              {writing.hidden && <div className="absolute top-6 right-6 text-red-500 text-xs uppercase font-bold flex items-center gap-1 z-10"><Lock size={12} /> Hidden</div>}
                          </div>
                      )
                  ))}
              </div>
           </div>
      )}

      {/* --- LIGHTBOX MODAL --- */}
      {lightboxItem && (
          <div 
              className="fixed inset-0 z-[9999] bg-black/95 backdrop-blur-md flex flex-col items-center justify-center p-4 cursor-zoom-out" 
              onClick={() => setLightboxItem(null)}
          >
              {/* Back / Close Button */}
              <button 
                className="absolute top-4 left-4 md:top-8 md:left-8 text-white hover:text-soul-fire transition-colors flex items-center gap-2 z-[10000] group bg-black/60 p-3 rounded-lg backdrop-blur border border-white/10 hover:border-soul-fire cursor-pointer" 
                onClick={(e) => { e.stopPropagation(); setLightboxItem(null); }}
              >
                  <ArrowLeft size={24} className="group-hover:-translate-x-1 transition-transform" /> 
                  <span className="font-serif tracking-widest text-sm font-bold">BACK</span>
              </button>
              
              {/* Inner Container */}
              <div 
                className="max-w-7xl w-full flex flex-col md:flex-row items-center gap-8 relative cursor-auto"
                onClick={(e) => { 
                   // Allow bubbling to close unless clicked on interactive parts
                   // Actually, it's safer to let it bubble if it's the gap, 
                   // but stop if it's the content. We handle stopping on content below.
                }}
              >
                  {/* Image/Video Container */}
                  <div className="flex-grow flex items-center justify-center max-h-[70vh] md:max-h-[85vh] w-full">
                      {lightboxItem.type === 'VIDEO' ? (
                          <video 
                              src={getDirectVideoUrl(lightboxItem.src)} 
                              controls 
                              autoPlay 
                              playsInline
                              className="max-h-[70vh] md:max-h-[85vh] max-w-full rounded border border-white/10 shadow-[0_0_50px_rgba(0,0,0,0.5)] pointer-events-auto"
                              onClick={(e) => e.stopPropagation()}
                          />
                      ) : (
                          <img 
                              src={lightboxItem.src} 
                              alt={lightboxItem.title} 
                              className="max-h-[70vh] md:max-h-[85vh] max-w-full rounded border border-white/10 shadow-[0_0_50px_rgba(0,0,0,0.5)] object-contain pointer-events-auto" 
                              referrerPolicy="no-referrer"
                              onClick={(e) => e.stopPropagation()}
                          />
                      )}
                  </div>
                  {/* Description Side Panel */}
                  <div 
                    className="w-full md:w-80 flex-shrink-0 bg-white/5 p-6 rounded border border-white/10 backdrop-blur-sm max-h-[30vh] md:max-h-[85vh] overflow-y-auto pointer-events-auto cursor-text"
                    onClick={(e) => e.stopPropagation()}
                  >
                      <h3 className="text-xl md:text-2xl font-serif text-white mb-4 border-b border-soul-fire/30 pb-2">{lightboxItem.title}</h3>
                      <p className="text-bone-dark leading-relaxed text-sm whitespace-pre-line">{lightboxItem.description}</p>
                  </div>
              </div>
          </div>
      )}


      {/* --- MODALS (EDITORS) --- */}
      {isEditingMeta && (
          <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
              <div className="bg-obsidian border border-soul-fire/30 p-8 max-w-lg w-full space-y-4 shadow-2xl rounded-lg max-h-[90vh] overflow-y-auto">
                  <h2 className="text-xl font-serif text-white mb-4">Edit Persona Identity</h2>
                  <div><label className="block text-xs text-soul-fire mb-1 uppercase">Title</label><input value={metaForm.title} onChange={e => setMetaForm({...metaForm, title: e.target.value})} className="w-full bg-black border border-white/20 p-2 text-white focus:border-soul-fire outline-none"/></div>
                  <div><label className="block text-xs text-soul-fire mb-1 uppercase">Subtitle</label><input value={metaForm.subtitle} onChange={e => setMetaForm({...metaForm, subtitle: e.target.value})} className="w-full bg-black border border-white/20 p-2 text-white focus:border-soul-fire outline-none"/></div>
                  <div><label className="block text-xs text-soul-fire mb-1 uppercase">Skills / Tags (Comma separated)</label><input value={skillsInput} onChange={e => setSkillsInput(e.target.value)} className="w-full bg-black border border-white/20 p-2 text-white focus:border-soul-fire outline-none"/></div>
                  <div><label className="block text-xs text-soul-fire mb-1 uppercase">Quote</label><textarea value={metaForm.quote} onChange={e => setMetaForm({...metaForm, quote: e.target.value})} className="w-full bg-black border border-white/20 p-2 text-white focus:border-soul-fire outline-none h-24"/></div>
                  <div><label className="block text-xs text-soul-fire mb-1 uppercase">Description</label><textarea value={metaForm.description} onChange={e => setMetaForm({...metaForm, description: e.target.value})} className="w-full bg-black border border-white/20 p-2 text-white focus:border-soul-fire outline-none h-32"/></div>
                  <div className="flex justify-end gap-4 pt-4"><button type="button" onClick={() => setIsEditingMeta(false)} className="px-4 py-2 text-bone-dark hover:text-white">Cancel</button><button type="button" onClick={saveMeta} className="px-6 py-2 bg-soul-fire text-obsidian font-bold hover:bg-white transition-colors">Save Changes</button></div>
              </div>
          </div>
      )}

      {activeWorkEditor && <WorkForm initialData={activeWorkEditor === 'NEW' ? undefined : activeWorkEditor.item} onSave={saveWork} onCancel={() => setActiveWorkEditor(null)} />}
      {activeWritingEditor && <WritingForm initialData={activeWritingEditor === 'NEW' ? undefined : activeWritingEditor.item} onSave={saveWriting} onCancel={() => setActiveWritingEditor(null)} />}
      {activeCategoryEditor && <CategoryForm initialData={activeCategoryEditor === 'NEW' ? undefined : activeCategoryEditor.item} onSave={saveCategory} onCancel={() => setActiveCategoryEditor(null)} />}
      {activeProjectItemEditor && <ProjectItemForm initialData={activeProjectItemEditor === 'NEW' ? undefined : activeProjectItemEditor.item} onSave={saveProjectItem} onCancel={() => { setActiveProjectItemEditor(null); setNewProjectItemCatIndex(null); }} />}
      {activeWhisperEditor && <WhisperForm initialData={activeWhisperEditor === 'NEW' ? undefined : activeWhisperEditor.item} onSave={saveWhisper} onCancel={() => setActiveWhisperEditor(null)} />}
    </div>
  );
};

const WorkForm: React.FC<{ initialData?: PersonaWork, onSave: (w: PersonaWork) => void, onCancel: () => void }> = ({ initialData, onSave, onCancel }) => {
    const [form, setForm] = useState<PersonaWork>(initialData || { title: '', category: '', description: '', image: '', video: '', hidden: false });
    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        if (name === 'image') setForm({ ...form, image: processImageUrl(value) });
        else if (name === 'video') setForm({ ...form, video: value });
        else setForm({ ...form, [name]: value });
    };
    return (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-obsidian border border-white/20 p-6 max-w-md w-full space-y-4 shadow-2xl">
              <h3 className="text-lg font-serif text-white">{initialData ? 'Edit Artifact' : 'Forging New Artifact'}</h3>
              <input name="title" placeholder="Title" className="w-full bg-black border border-white/10 p-2 text-white" value={form.title} onChange={handleChange} />
              <input name="category" placeholder="Category" className="w-full bg-black border border-white/10 p-2 text-white" value={form.category} onChange={handleChange} />
              
              <div className="space-y-1">
                 <label className="text-[10px] text-soul-fire uppercase">Cover Image</label>
                 <input name="image" placeholder="Image URL (Drive links supported)" className="w-full bg-black border border-white/10 p-2 text-white text-xs" value={form.image} onChange={handleChange} />
              </div>
              
              <div className="space-y-1">
                 <label className="text-[10px] text-soul-fire uppercase">Video URL (Optional)</label>
                 <input name="video" placeholder="Direct Video URL or Drive Link" className="w-full bg-black border border-white/10 p-2 text-white text-xs" value={form.video || ''} onChange={handleChange} />
              </div>

              <textarea name="description" placeholder="Description" className="w-full bg-black border border-white/10 p-2 text-white h-24" value={form.description} onChange={handleChange} />
              <div className="flex justify-end gap-3"><button type="button" onClick={onCancel} className="px-4 py-2 text-sm text-bone-dark">Cancel</button><button type="button" onClick={() => onSave(form)} className="px-4 py-2 bg-soul-fire text-obsidian font-bold text-sm">Save Artifact</button></div>
          </div>
        </div>
    );
};

// ... (Rest of subcomponents: WritingForm, CategoryForm, ProjectItemForm, WhisperForm remain exactly the same as previously, just need to ensure they are rendered below)
const WritingForm: React.FC<{ initialData?: PersonaWriting, onSave: (w: PersonaWriting) => void, onCancel: () => void }> = ({ initialData, onSave, onCancel }) => {
    const [form, setForm] = useState<PersonaWriting>(initialData || { id: Date.now().toString(), title: '', date: getCurrentDate(), excerpt: '', tags: [], chapters: [], hidden: false });
    const [tagsInput, setTagsInput] = useState(form.tags.join(', '));
    const [view, setView] = useState<'MAIN' | 'CHAPTERS'>('MAIN');
    const [editChapter, setEditChapter] = useState<Chapter | null>(null);
    const [editChapterIndex, setEditChapterIndex] = useState<number | null>(null);
    const handleSubmit = () => { onSave({ ...form, date: getCurrentDate(), tags: tagsInput.split(',').map(t => t.trim()).filter(Boolean) }); };
    const handleSaveChapter = () => {
        if (!editChapter) return;
        const newChapters = [...form.chapters];
        const chapterToSave = { ...editChapter, date: getCurrentDate() };
        if (editChapterIndex !== null) newChapters[editChapterIndex] = chapterToSave;
        else newChapters.push(chapterToSave);
        setForm({ ...form, chapters: newChapters, date: getCurrentDate() });
        setEditChapter(null); setEditChapterIndex(null);
    };
    const handleDeleteChapter = (idx: number) => { const newChapters = [...form.chapters]; newChapters.splice(idx, 1); setForm({ ...form, chapters: newChapters, date: getCurrentDate() }); };

    if (editChapter) {
        return (
           <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-obsidian border border-white/20 p-6 max-w-3xl w-full space-y-4 shadow-2xl max-h-[90vh] overflow-y-auto">
                <div className="flex justify-between items-center border-b border-white/10 pb-4">
                    <h3 className="text-lg font-serif text-white flex items-center gap-2"><BookOpen size={18}/> {editChapterIndex !== null ? 'Edit Chapter' : 'New Chapter'}</h3>
                    <button type="button" onClick={() => setEditChapter(null)} className="text-bone-dark hover:text-white"><X size={20}/></button>
                </div>
                <div><label className="text-xs text-soul-fire uppercase">Title</label><input placeholder="Chapter Title" className="w-full bg-black border border-white/10 p-2 text-white" value={editChapter.title} onChange={e => setEditChapter({...editChapter, title: e.target.value})} /></div>
                <div><label className="text-xs text-soul-fire uppercase">Content</label><textarea placeholder="Write your story here..." className="w-full bg-black border border-white/10 p-4 text-white h-64 font-sans leading-relaxed" value={editChapter.content} onChange={e => setEditChapter({...editChapter, content: e.target.value})} /></div>
                <div className="flex justify-end gap-3 pt-4"><button type="button" onClick={() => setEditChapter(null)} className="px-4 py-2 text-sm text-bone-dark">Discard</button><button type="button" onClick={handleSaveChapter} className="px-4 py-2 bg-soul-fire text-obsidian font-bold text-sm">Save Chapter</button></div>
            </div>
           </div>
        );
    }
    return (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-obsidian border border-white/20 max-w-2xl w-full shadow-2xl flex flex-col max-h-[90vh] overflow-hidden">
            <div className="flex border-b border-white/10">
                <button type="button" onClick={() => setView('MAIN')} className={`flex-1 py-4 font-serif text-sm uppercase tracking-widest ${view === 'MAIN' ? 'bg-white/5 text-soul-fire' : 'text-bone-dark hover:text-white'}`}>Metadata</button>
                <button type="button" onClick={() => setView('CHAPTERS')} className={`flex-1 py-4 font-serif text-sm uppercase tracking-widest ${view === 'CHAPTERS' ? 'bg-white/5 text-soul-fire' : 'text-bone-dark hover:text-white'}`}>Chapters ({form.chapters.length})</button>
            </div>
            <div className="p-6 overflow-y-auto flex-1 space-y-4">
                {view === 'MAIN' ? (
                    <>
                        <input placeholder="Title" className="w-full bg-black border border-white/10 p-2 text-white font-serif text-lg" value={form.title} onChange={e => setForm({...form, title: e.target.value})} />
                        <input placeholder="Tags (comma separated)" className="w-full bg-black border border-white/10 p-2 text-white" value={tagsInput} onChange={e => setTagsInput(e.target.value)} />
                        <textarea placeholder="Excerpt / Summary" className="w-full bg-black border border-white/10 p-2 text-white h-32" value={form.excerpt} onChange={e => setForm({...form, excerpt: e.target.value})} />
                    </>
                ) : (
                    <div className="space-y-4">
                        <div className="flex justify-between items-center mb-4">
                            <p className="text-xs text-bone-dark uppercase tracking-wider">Table of Contents</p>
                            <button type="button" onClick={() => { setEditChapter({id: Date.now().toString(), title: '', date: getCurrentDate(), content: '', comments: []}); setEditChapterIndex(null); }} className="text-xs bg-white/5 hover:bg-soul-fire hover:text-obsidian px-3 py-1 rounded border border-white/10 transition-colors">+ Add Chapter</button>
                        </div>
                        {form.chapters.length === 0 ? (
                            <div className="text-center py-8 text-bone-dark/50 italic border border-dashed border-white/10">No chapters yet. Start writing...</div>
                        ) : (
                            <div className="space-y-2">
                                {form.chapters.map((ch, idx) => (
                                    <div key={idx} className="flex items-center justify-between p-3 bg-black border border-white/10 rounded hover:border-soul-fire/30 group">
                                        <div className="flex items-center gap-3"><span className="text-bone-dark font-mono text-xs">{toRoman(idx + 1)}.</span><span className="text-white font-serif">{ch.title}</span></div>
                                        <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity"><button type="button" onClick={() => { setEditChapter(ch); setEditChapterIndex(idx); }} className="text-bone hover:text-soul-fire"><Edit3 size={14}/></button><button type="button" onClick={() => handleDeleteChapter(idx)} className="text-red-400 hover:text-red-500"><Trash2 size={14}/></button></div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                )}
            </div>
            <div className="flex justify-between p-4 border-t border-white/10 bg-black/20"><button type="button" onClick={onCancel} className="px-4 py-2 text-sm text-bone-dark">Cancel</button><button type="button" onClick={handleSubmit} className="px-4 py-2 bg-soul-fire text-obsidian font-bold text-sm">Save Chronicle</button></div>
          </div>
        </div>
    );
};

const CategoryForm: React.FC<{ initialData?: ProjectCategory, onSave: (c: ProjectCategory) => void, onCancel: () => void }> = ({ initialData, onSave, onCancel }) => {
    const [form, setForm] = useState<ProjectCategory>(initialData || { title: '', bannerImage: '', description: '', items: [], hidden: false });
    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        if (name === 'bannerImage') setForm({ ...form, bannerImage: processImageUrl(value) });
        else setForm({ ...form, [name]: value });
    };
    return (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
        <div className="bg-obsidian border border-white/20 p-6 max-w-lg w-full space-y-4 shadow-2xl">
            <h3 className="text-lg font-serif text-white">{initialData ? 'Edit Dimension' : 'Create New Dimension'}</h3>
            <input name="title" placeholder="Title" className="w-full bg-black border border-white/10 p-2 text-white" value={form.title} onChange={handleChange} />
            <input name="bannerImage" placeholder="Banner Image URL (Drive supported)" className="w-full bg-black border border-white/10 p-2 text-white" value={form.bannerImage} onChange={handleChange} />
            <textarea name="description" placeholder="Description" className="w-full bg-black border border-white/10 p-2 text-white h-24" value={form.description} onChange={handleChange} />
            <div className="flex justify-end gap-3"><button type="button" onClick={onCancel} className="px-4 py-2 text-sm text-bone-dark">Cancel</button><button type="button" onClick={() => onSave(form)} className="px-4 py-2 bg-soul-fire text-obsidian font-bold text-sm">Save Dimension</button></div>
        </div>
        </div>
    );
};

const ProjectItemForm: React.FC<{ initialData?: ProjectItem, onSave: (i: ProjectItem) => void, onCancel: () => void }> = ({ initialData, onSave, onCancel }) => {
    const [form, setForm] = useState<ProjectItem>(initialData || { title: '', description: '', image: '', hidden: false });
    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        if (name === 'image') setForm({ ...form, image: processImageUrl(value) });
        else setForm({ ...form, [name]: value });
    };
    return (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
        <div className="bg-obsidian border border-white/20 p-6 max-w-md w-full space-y-4 shadow-2xl">
            <h3 className="text-lg font-serif text-white">{initialData ? 'Edit Projection' : 'New Projection'}</h3>
            <input name="title" placeholder="Title" className="w-full bg-black border border-white/10 p-2 text-white" value={form.title} onChange={handleChange} />
            <input name="image" placeholder="Image URL (Drive supported)" className="w-full bg-black border border-white/10 p-2 text-white" value={form.image} onChange={handleChange} />
            <textarea name="description" placeholder="Description" className="w-full bg-black border border-white/10 p-2 text-white h-24" value={form.description} onChange={handleChange} />
            <div className="flex justify-end gap-3"><button type="button" onClick={onCancel} className="px-4 py-2 text-sm text-bone-dark">Cancel</button><button type="button" onClick={() => onSave(form)} className="px-4 py-2 bg-soul-fire text-obsidian font-bold text-sm">Save Projection</button></div>
        </div>
        </div>
    );
};

const WhisperForm: React.FC<{ initialData?: AbyssWhisper, onSave: (w: AbyssWhisper) => void, onCancel: () => void }> = ({ initialData, onSave, onCancel }) => {
    const [form, setForm] = useState<AbyssWhisper>(initialData || { id: Date.now().toString(), content: '', date: getCurrentDate(), hidden: false });
    return (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
        <div className="bg-obsidian border border-white/20 p-6 max-w-md w-full space-y-4 shadow-2xl">
            <h3 className="text-lg font-serif text-white">{initialData ? 'Edit Echo' : 'Whisper into the Void'}</h3>
            <textarea placeholder="Content" className="w-full bg-black border border-white/10 p-2 text-white h-32" value={form.content} onChange={e => setForm({...form, content: e.target.value})} />
            <div className="flex justify-end gap-3">
                <button type="button" onClick={onCancel} className="px-4 py-2 text-sm text-bone-dark">Cancel</button>
                <button type="button" onClick={() => onSave({ ...form, date: getCurrentDate() })} className="px-4 py-2 bg-soul-fire text-obsidian font-bold text-sm">Save Echo</button>
            </div>
        </div>
        </div>
    );
};

export default PersonaDetail;
