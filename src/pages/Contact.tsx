
import React, { useState, useRef } from 'react';
import { Mail, Linkedin, Github, MapPin, Send, CheckCircle, AlertCircle, Loader, Phone, Instagram, Facebook, Globe, Edit3, X, Plus, Trash2, MessageCircle } from 'lucide-react';
import emailjs from '@emailjs/browser';
import { useData } from '../contexts/DataContext';
import { UserRole, ContactDetails, SocialLink } from '../types';

// --- EMAILJS CONFIGURATION ---
const SERVICE_ID = 'service_ykl7bvu';   
const TEMPLATE_ID = 'template_w7lybma'; 
const PUBLIC_KEY = '-MF-vNYmFOTMZA0nL';   

const BehanceIcon = ({ size = 20 }: { size?: number }) => (
  <svg viewBox="0 0 24 24" width={size} height={size} fill="currentColor" stroke="none">
    <path d="M22 7h-5v2h5zm-10.3 3.4c-2.3 0-3.9 1.6-3.9 4.2 0 2.6 1.5 4.2 4 4.2 2.3 0 3.6-1.3 3.6-3.8v-.5h-5.4c.1 1.4.9 2.1 2.2 2.1 1 0 1.6-.4 1.8-1.3h1.3c-.2 1.9-1.3 3.1-3.6 3.1zm1.6-3.1h-3.4c.1-1.1.8-1.8 1.8-1.8 1 0 1.6.7 1.6 1.8zm-7.9-1.6c1.9 0 3.2.7 3.2 2.7 0 1.4-.8 2.3-1.8 2.6 1.3.3 2.2 1.2 2.2 2.9 0 2.3-1.6 3.6-4.2 3.6h-7.1v-11.8h7.1zm-2.7 4.7h4.4c1 0 1.5-.5 1.5-1.4 0-1-.5-1.3-1.5-1.3h-4.4v2.7zm0 5.1h4.5c1.1 0 1.7-.5 1.7-1.5 0-1.1-.6-1.6-1.8-1.6h-4.4v3.1z"/>
  </svg>
);

const SOCIAL_ICONS: Record<string, React.ReactNode> = {
  "LinkedIn": <Linkedin size={20} />,
  "GitHub": <Github size={20} />,
  "Instagram": <Instagram size={20} />,
  "Behance": <BehanceIcon size={20} />,
  "Facebook": <Facebook size={20} />,
  "Website": <Globe size={20} />
};

const Contact: React.FC = () => {
  const { globalContent, user, updateGlobalContent } = useData();
  const contactInfo = globalContent.contactInfo;
  const canEdit = user?.role === UserRole.ADMIN;

  const form = useRef<HTMLFormElement>(null);
  const [status, setStatus] = useState<'idle' | 'sending' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');
  const [copied, setCopied] = useState(false);

  // Edit State
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState<ContactDetails>(contactInfo);

  const handleCopyEmail = () => {
    navigator.clipboard.writeText(contactInfo.email);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const sendEmail = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.current) return;

    setStatus('sending');
    setErrorMessage('');

    const formData = new FormData(form.current);
    
    // Explicitly mapping input names to EmailJS template variables using get()
    // This ensures we get the string value directly
    const templateParams = {
        user_name: formData.get('from_name') as string || 'Traveler',
        user_email: formData.get('from_email') as string || 'No Email',
        message: formData.get('message') as string || '',
        reply_to: formData.get('from_email') as string
    };

    emailjs.send(SERVICE_ID, TEMPLATE_ID, templateParams, PUBLIC_KEY)
      .then(() => {
          setStatus('success');
          if (form.current) form.current.reset();
      }, (error) => {
          console.error(error);
          setErrorMessage("The summoning failed. The ether is turbulent.");
          setStatus('error');
      });
  };

  const saveContactInfo = () => {
      updateGlobalContent({ ...globalContent, contactInfo: editForm });
      setIsEditing(false);
  };

  const updateSocial = (index: number, field: keyof SocialLink, value: string) => {
      const newSocials = [...editForm.socials];
      newSocials[index] = { ...newSocials[index], [field]: value };
      setEditForm({ ...editForm, socials: newSocials });
  };

  const addSocial = () => {
      setEditForm({
          ...editForm,
          socials: [...editForm.socials, { platform: 'Website', url: '' }]
      });
  };

  const removeSocial = (index: number) => {
      const newSocials = [...editForm.socials];
      newSocials.splice(index, 1);
      setEditForm({ ...editForm, socials: newSocials });
  };

  // Helper to format whatsapp link
  const getWhatsAppLink = (number: string | undefined) => {
      if (!number) return "#";
      const cleanNum = number.replace(/[^\d]/g, '');
      return `https://wa.me/${cleanNum}`;
  };

  return (
    <div className="flex-grow flex items-center justify-center p-6 md:p-12 lg:p-16 relative min-h-[calc(100vh-6rem)]">
      {/* Admin Edit Button */}
      {canEdit && (
          <button 
              onClick={() => { setEditForm(contactInfo); setIsEditing(true); }}
              className="absolute top-24 right-6 z-50 flex items-center gap-2 px-3 py-1 bg-white/5 border border-white/10 rounded text-bone hover:text-soul-fire transition-colors"
          >
              <Edit3 size={16} /> <span className="text-xs uppercase tracking-widest">Edit Contact</span>
          </button>
      )}

      {/* Optimized max-width for better breathing room */}
      <div className="max-w-6xl w-full grid md:grid-cols-2 bg-obsidian-light/30 backdrop-blur-md border border-white/10 shadow-[0_0_50px_rgba(0,0,0,0.8)] relative overflow-hidden group rounded-xl">
        
        {/* Border Effect */}
        <div className="absolute inset-0 border border-soul-fire/20 opacity-50 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none rounded-xl"></div>
        
        {/* Left: Info - Improved spacing & alignment */}
        <div className="p-12 md:p-16 lg:p-20 bg-gradient-to-br from-obsidian to-obsidian-light flex flex-col justify-center relative order-2 md:order-1 gap-12">
           <div className="absolute top-0 right-0 w-64 h-64 bg-soul-fire/10 blur-[80px] rounded-full -translate-y-1/2 translate-x-1/2"></div>
           
           <div className="relative z-10 space-y-12">
             <div className="space-y-6">
               <h2 className="text-4xl md:text-5xl lg:text-6xl font-serif font-bold text-white">Summon The Sage</h2>
               <div className="h-1 w-20 bg-soul-fire"></div>
               <p className="text-bone-dark font-sans text-lg leading-relaxed max-w-lg">
                 Whether you seek a dream weaver or a glyphsmith, I am ready to listen. Cast your summoning ritual to send a message instantly through the ether.
               </p>
             </div>

             <div className="space-y-8">
               <div className="flex items-center gap-6 text-bone group/item cursor-none">
                 <button 
                    onClick={handleCopyEmail}
                    className="p-4 border border-white/10 bg-black/50 group-hover/item:border-soul-fire group-hover/item:text-soul-fire transition-all relative rounded-sm"
                    title="Copy Email"
                 >
                   {copied ? <CheckCircle size={24} /> : <Mail size={24} />}
                 </button>
                 <div className="flex flex-col">
                    <span className="text-xs text-soul-fire/50 uppercase tracking-widest mb-1">Email Address</span>
                    <span className="group-hover/item:text-white transition-colors text-lg md:text-xl select-all break-all">{contactInfo.email}</span>
                 </div>
               </div>
               
               {contactInfo.phone && (
                   <div className="flex items-center gap-6 text-bone group/item cursor-none">
                     <div className="p-4 border border-white/10 bg-black/50 group-hover/item:border-soul-fire group-hover/item:text-soul-fire transition-all rounded-sm">
                       <Phone size={24} />
                     </div>
                     <div className="flex flex-col">
                        <span className="text-xs text-soul-fire/50 uppercase tracking-widest mb-1">Direct Line</span>
                        <span className="group-hover/item:text-white transition-colors text-lg md:text-xl">{contactInfo.phone}</span>
                     </div>
                   </div>
               )}

               <div className="flex items-center gap-6 text-bone group/item cursor-none">
                 <div className="p-4 border border-white/10 bg-black/50 group-hover/item:border-soul-fire group-hover/item:text-soul-fire transition-all rounded-sm">
                   <MapPin size={24} />
                 </div>
                 <div className="flex flex-col">
                    <span className="text-xs text-soul-fire/50 uppercase tracking-widest mb-1">Current Location</span>
                    <span className="group-hover/item:text-white transition-colors text-lg md:text-xl">{contactInfo.location}</span>
                 </div>
               </div>
             </div>
           </div>

           {/* WhatsApp & Socials */}
           <div className="relative z-10 pt-10 border-t border-white/5 space-y-6">
             {contactInfo.whatsapp && (
                 <a 
                    href={getWhatsAppLink(contactInfo.whatsapp)} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 text-emerald-400 hover:text-emerald-300 transition-colors group/wa w-fit"
                 >
                     <div className="p-2 border border-emerald-500/30 bg-emerald-900/10 rounded-full group-hover/wa:bg-emerald-500 group-hover/wa:text-black transition-all">
                        <MessageCircle size={20} />
                     </div>
                     <span className="text-sm font-serif tracking-widest uppercase">Chat on WhatsApp</span>
                 </a>
             )}

             <div className="flex gap-4 flex-wrap">
               {contactInfo.socials.map((social, idx) => (
                   <a 
                    key={idx}
                    href={social.url} 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="p-4 border border-white/10 bg-black/50 text-bone-dark hover:text-soul-fire hover:border-soul-fire hover:shadow-[0_0_15px_rgb(var(--color-soul-fire)/0.3)] transition-all rounded-full group/icon"
                    title={social.platform}
                   >
                     <div className="group-hover/icon:scale-110 transition-transform">
                        {SOCIAL_ICONS[social.platform] || <Globe size={24} />}
                     </div>
                   </a>
               ))}
             </div>
           </div>
        </div>

        {/* Right: Form - Improved Breathing Room */}
        <div className="p-12 md:p-16 lg:p-20 bg-black/20 order-1 md:order-2 border-b md:border-b-0 md:border-l border-white/5 relative flex flex-col justify-center">
          
          {status === 'success' ? (
              <div className="h-full flex flex-col items-center justify-center text-center space-y-10 animate-float">
                  <div className="w-28 h-28 rounded-full bg-soul-fire/10 flex items-center justify-center border border-soul-fire/50 shadow-[0_0_40px_rgb(var(--color-soul-fire)/0.3)]">
                      <CheckCircle className="w-14 h-14 text-soul-fire" />
                  </div>
                  <div className="space-y-4">
                      <h3 className="text-4xl font-serif text-white">Summoning Complete</h3>
                      <p className="text-bone-dark text-lg">Your message has traversed the void and reached the Sage.</p>
                  </div>
                  <button 
                    onClick={() => setStatus('idle')}
                    className="px-10 py-4 border border-white/10 text-sm font-serif hover:border-soul-fire hover:text-soul-fire transition-colors tracking-widest uppercase"
                  >
                    Cast Another
                  </button>
              </div>
          ) : (
            <form ref={form} onSubmit={sendEmail} className="space-y-12 relative">
                {status === 'sending' && (
                    <div className="absolute inset-0 bg-black/60 backdrop-blur-sm z-20 flex items-center justify-center flex-col gap-4 rounded-lg">
                        <Loader className="w-12 h-12 text-soul-fire animate-spin" />
                        <span className="text-soul-fire font-serif text-sm tracking-[0.2em] animate-pulse">TRANSMITTING...</span>
                    </div>
                )}

                <div className="group/input">
                    <label className="block text-xs font-serif text-soul-fire mb-4 uppercase tracking-[0.2em] opacity-70 group-focus-within/input:opacity-100 transition-opacity">Summoner Name</label>
                    <input 
                        type="text" 
                        name="from_name"
                        className="w-full bg-obsidian border-b border-white/20 px-4 py-4 text-lg text-white focus:outline-none focus:border-soul-fire transition-all placeholder-white/10 rounded-none"
                        placeholder="Traveler"
                        required
                    />
                </div>
                
                <div className="group/input">
                    <label className="block text-xs font-serif text-soul-fire mb-4 uppercase tracking-[0.2em] opacity-70 group-focus-within/input:opacity-100 transition-opacity">Contact Glyphs</label>
                    <input 
                        type="email" 
                        name="from_email"
                        className="w-full bg-obsidian border-b border-white/20 px-4 py-4 text-lg text-white focus:outline-none focus:border-soul-fire transition-all placeholder-white/10 rounded-none"
                        placeholder="email@domain.com"
                        required
                    />
                </div>
                
                <div className="group/input">
                    <label className="block text-xs font-serif text-soul-fire mb-4 uppercase tracking-[0.2em] opacity-70 group-focus-within/input:opacity-100 transition-opacity">The Incantation</label>
                    <textarea 
                        rows={6}
                        name="message"
                        className="w-full bg-obsidian border-b border-white/20 px-4 py-4 text-lg text-white focus:outline-none focus:border-soul-fire transition-all placeholder-white/10 rounded-none resize-none"
                        placeholder="Unveil your thoughts..."
                        required
                    ></textarea>
                </div>

                {status === 'error' && (
                    <div className="flex items-center gap-3 text-red-400 text-sm border border-red-900/50 bg-red-900/10 p-4 rounded-sm">
                        <AlertCircle size={18} />
                        <span>{errorMessage}</span>
                    </div>
                )}

                <div className="text-xs text-bone-dark italic opacity-40 pt-2">
                    * Secure transmission via EmailJS.
                </div>

                <button 
                    type="submit" 
                    disabled={status === 'sending'}
                    className="w-full py-5 bg-white/5 border border-soul-fire/30 text-soul-fire font-serif font-bold tracking-[0.15em] hover:bg-soul-fire hover:text-obsidian-darkest hover:shadow-[0_0_25px_rgb(var(--color-soul-fire)/0.6)] transition-all duration-300 flex items-center justify-center gap-3 group/btn text-lg disabled:opacity-50 disabled:cursor-not-allowed mt-8"
                >
                    <span>CAST SUMMONING</span>
                    <Send className="w-5 h-5 group-hover/btn:translate-x-1 transition-transform" />
                </button>
            </form>
          )}
        </div>
      </div>

       {/* Admin Edit Modal */}
       {isEditing && (
          <div className="fixed inset-0 z-[60] bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
              <div className="bg-obsidian border border-soul-fire/30 p-8 max-w-lg w-full space-y-4 shadow-2xl rounded-lg max-h-[90vh] overflow-y-auto">
                  <div className="flex justify-between items-center mb-4 border-b border-white/10 pb-2">
                     <h2 className="text-xl font-serif text-white">Edit Contact Details</h2>
                     <button onClick={() => setIsEditing(false)} className="text-bone-dark hover:text-white"><X size={20}/></button>
                  </div>
                  
                  <div className="space-y-4">
                      <div>
                          <label className="text-xs text-soul-fire uppercase block mb-1">Email</label>
                          <input 
                             value={editForm.email}
                             onChange={(e) => setEditForm({...editForm, email: e.target.value})}
                             className="w-full bg-black border border-white/20 p-2 text-white focus:border-soul-fire outline-none"
                          />
                      </div>
                      <div>
                          <label className="text-xs text-soul-fire uppercase block mb-1">Mobile Number</label>
                          <input 
                             value={editForm.phone}
                             onChange={(e) => setEditForm({...editForm, phone: e.target.value})}
                             className="w-full bg-black border border-white/20 p-2 text-white focus:border-soul-fire outline-none"
                          />
                      </div>
                      <div>
                          <label className="text-xs text-emerald-500 uppercase block mb-1">WhatsApp Number</label>
                          <input 
                             value={editForm.whatsapp || ''}
                             onChange={(e) => setEditForm({...editForm, whatsapp: e.target.value})}
                             placeholder="+91 9342463935"
                             className="w-full bg-black border border-white/20 p-2 text-white focus:border-emerald-500 outline-none"
                          />
                      </div>
                      <div>
                          <label className="text-xs text-soul-fire uppercase block mb-1">Location</label>
                          <input 
                             value={editForm.location}
                             onChange={(e) => setEditForm({...editForm, location: e.target.value})}
                             className="w-full bg-black border border-white/20 p-2 text-white focus:border-soul-fire outline-none"
                          />
                      </div>
                  </div>

                  <div className="space-y-4 pt-4 border-t border-white/10">
                      <div className="flex justify-between items-center">
                          <label className="text-xs text-soul-fire uppercase block">Social Links</label>
                          <button type="button" onClick={addSocial} className="text-xs bg-white/10 px-2 py-1 rounded text-white hover:bg-soul-fire hover:text-black flex items-center gap-1"><Plus size={12}/> Add</button>
                      </div>
                      
                      <div className="space-y-2 max-h-[200px] overflow-y-auto pr-2">
                          {editForm.socials.map((social, idx) => (
                              <div key={idx} className="flex gap-2">
                                  <select 
                                    value={social.platform}
                                    onChange={(e) => updateSocial(idx, 'platform', e.target.value)}
                                    className="bg-black border border-white/20 text-white text-xs p-2 w-1/3 outline-none"
                                  >
                                      {Object.keys(SOCIAL_ICONS).map(k => <option key={k} value={k}>{k}</option>)}
                                  </select>
                                  <input 
                                     value={social.url}
                                     onChange={(e) => updateSocial(idx, 'url', e.target.value)}
                                     placeholder="URL"
                                     className="bg-black border border-white/20 text-white text-xs p-2 flex-grow outline-none"
                                  />
                                  <button type="button" onClick={() => removeSocial(idx)} className="text-red-400 hover:text-red-500"><Trash2 size={16}/></button>
                              </div>
                          ))}
                      </div>
                  </div>

                  <div className="flex justify-end gap-3 pt-4">
                      <button type="button" onClick={() => setIsEditing(false)} className="px-4 py-2 text-bone-dark">Cancel</button>
                      <button type="button" onClick={saveContactInfo} className="px-4 py-2 bg-soul-fire text-obsidian font-bold">Save Changes</button>
                  </div>
              </div>
          </div>
      )}
    </div>
  );
};

export default Contact;
