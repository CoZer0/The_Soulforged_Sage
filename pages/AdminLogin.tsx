
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useData } from '../contexts/DataContext';
import { Shield, AlertTriangle, Unlock, User } from 'lucide-react';

const AdminLogin: React.FC = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login, user, logout } = useData();
  const navigate = useNavigate();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (login(username, password)) {
      navigate('/');
    } else {
      setError('Authentication Failed. Invalid glyphs.');
    }
  };

  if (user) {
    return (
      <div className="flex-grow flex flex-col items-center justify-center p-6">
        <div className="max-w-md w-full bg-obsidian-light/50 border border-soul-fire p-8 text-center relative overflow-hidden">
            <div className="absolute inset-0 bg-soul-fire/10 animate-pulse-slow"></div>
            <Unlock className="w-16 h-16 text-soul-fire mx-auto mb-4" />
            <h2 className="text-2xl font-serif text-white mb-2">Access Granted</h2>
            <p className="text-bone-dark mb-2">Welcome back, <span className="text-soul-fire font-bold">{user.username}</span>.</p>
            <p className="text-xs text-bone-dark/50 uppercase tracking-widest mb-6">Role: {user.role}</p>
            
            <div className="flex gap-4 justify-center relative z-10">
                <button 
                    onClick={() => navigate('/personas')}
                    className="px-6 py-2 bg-soul-fire text-obsidian font-bold hover:bg-white transition-colors"
                >
                    Enter Forge
                </button>
                <button 
                    onClick={logout}
                    className="px-6 py-2 border border-red-500 text-red-500 hover:bg-red-500/10 transition-colors"
                >
                    End Session
                </button>
            </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-grow flex items-center justify-center p-6">
      <div className="max-w-md w-full bg-black border border-white/10 p-8 shadow-[0_0_50px_rgba(0,0,0,0.8)] relative overflow-hidden">
        
        <div className="text-center mb-8">
           <Shield className="w-12 h-12 text-bone-dark mx-auto mb-4" />
           <h1 className="text-2xl font-serif font-bold text-white tracking-widest">SYSTEM RESTRICTED</h1>
           <p className="text-xs text-soul-fire uppercase tracking-[0.2em] mt-2">Identify Yourself</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-6 relative z-10">
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-serif text-bone-dark mb-2 uppercase">Identity</label>
              <input 
                type="text" 
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full bg-obsidian-dark border-b border-white/20 px-4 py-3 text-white focus:border-soul-fire outline-none transition-colors"
                placeholder="Username"
              />
            </div>
            <div>
              <label className="block text-xs font-serif text-bone-dark mb-2 uppercase">Passphrase</label>
              <input 
                type="password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-obsidian-dark border-b border-white/20 px-4 py-3 text-white focus:border-soul-fire outline-none transition-colors"
                placeholder="Key"
              />
            </div>
          </div>

          {error && (
            <div className="flex items-center gap-2 text-red-500 text-xs bg-red-950/20 p-3 border border-red-900">
               <AlertTriangle size={14} />
               {error}
            </div>
          )}

          <button 
            type="submit"
            className="w-full py-3 bg-white/5 border border-white/10 text-white font-serif tracking-wider hover:bg-soul-fire hover:text-obsidian hover:border-soul-fire transition-all duration-300"
          >
            AUTHENTICATE
          </button>
        </form>
        
        <p className="text-[10px] text-center text-bone-dark/30 mt-6 font-mono">
            SECURE CONNECTION ESTABLISHED
        </p>
      </div>
    </div>
  );
};

export default AdminLogin;
