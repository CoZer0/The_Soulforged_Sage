
import React from 'react';
import PersonaGrid from '../components/PersonaGrid';

const Personas: React.FC = () => {
  return (
    <div className="flex-grow w-full px-6 md:px-12 py-6 flex flex-col">
      <div className="text-center mb-16 mt-8 animate-float">
        <h1 className="text-4xl md:text-6xl font-serif font-bold text-transparent bg-clip-text bg-gradient-to-b from-bone via-slate-300 to-slate-600 mb-4">
          The Manifestations
        </h1>
        <p className="text-soul-fire font-serif tracking-[0.3em] text-sm md:text-base uppercase opacity-80">
          Five Facets. One Soul.
        </p>
      </div>

      <PersonaGrid />
    </div>
  );
};

export default Personas;
