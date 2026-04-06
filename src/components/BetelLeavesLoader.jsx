import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const BetelLeaf = ({ index, total, isOpen, onOpen }) => {
  // Traditional heart-shaped leaf
  const rotation = isOpen ? (index - (total - 1) / 2) * 45 : (index - (total - 1) / 2) * 5;
  const xOffset = isOpen ? (index - (total - 1) / 2) * 80 : 0;
  const yOffset = isOpen ? -50 : 0;

  return (
    <motion.div
      initial={{ scale: 0, opacity: 0, rotate: 0 }}
      animate={{ 
        scale: 1, 
        opacity: 1, 
        rotate: rotation,
        x: xOffset,
        y: yOffset,
      }}
      transition={{ 
        type: 'spring', 
        damping: 12, 
        stiffness: 100, 
        delay: index * 0.1 
      }}
      onClick={onOpen}
      className="absolute cursor-pointer origin-bottom"
      style={{ zIndex: total - index }}
    >
      <svg width="220" height="280" viewBox="0 0 200 250" fill="none" xmlns="http://www.w3.org/2000/svg" className="drop-shadow-xl hover:brightness-110 transition-all">
        {/* The Leaf Body */}
        <path 
          d="M100 240C100 240 10 180 10 100C10 40 60 10 100 60C140 10 190 40 190 100C190 180 100 240 100 240Z" 
          fill="url(#leafGradient)" 
          stroke="#1e3a1e" 
          strokeWidth="2"
        />
        {/* Veins */}
        <path d="M100 60V230" stroke="#1e3a1e" strokeWidth="1" opacity="0.3"/>
        <path d="M100 120C130 100 170 120 170 140" stroke="#1e3a1e" strokeWidth="1" opacity="0.2"/>
        <path d="M100 120C70 100 30 120 30 140" stroke="#1e3a1e" strokeWidth="1" opacity="0.2"/>
        <path d="M100 160C130 140 160 160 160 180" stroke="#1e3a1e" strokeWidth="1" opacity="0.1"/>
        <path d="M100 160C70 140 40 160 40 180" stroke="#1e3a1e" strokeWidth="1" opacity="0.1"/>
        
        <defs>
          <radialGradient id="leafGradient" cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse" gradientTransform="translate(100 120) rotate(90) scale(150 100)">
            <stop stopColor="#2d5a27" />
            <stop offset="1" stopColor="#1e3a1e" />
          </radialGradient>
        </defs>
      </svg>
    </motion.div>
  );
};

const BetelLeavesLoader = ({ onOpenComplete, event }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isFading, setIsFading] = useState(false);
  const leafCount = 5;

  const handleOpen = () => {
    if (isOpen) return;
    setIsOpen(true);
    // Let the fanning finish, then reveal
    setTimeout(() => setIsFading(true), 1200);
    setTimeout(() => onOpenComplete(), 2000);
  };

  return (
    <div className={`fixed inset-0 z-50 flex items-center justify-center bg-[#fdfaf5] transition-all duration-1000 ${isFading ? 'opacity-0 scale-110 pointer-events-none' : 'opacity-100'}`}>
      
      {/* Background Texture (Traditional Fabric Feel) */}
      <div className="absolute inset-0 opacity-5 bg-[url('https://www.transparenttextures.com/patterns/silk-weave.png')]"></div>

      <div className="relative w-full max-w-lg h-[400px] flex items-center justify-center pt-20">
        
        {/* Background Glow */}
        <div className="absolute w-80 h-80 bg-green-900/10 blur-[100px] rounded-full"></div>

        {/* The Card Behind (Partial Reveal) */}
        <AnimatePresence>
          {isOpen && (
             <motion.div 
               initial={{ opacity: 0, scale: 0.8, y: 50 }}
               animate={{ opacity: 1, scale: 1, y: -20 }}
               className="absolute z-0 bg-white p-8 rounded-xl shadow-2xl border border-gold/20 flex flex-col items-center text-center max-w-[300px]"
             >
                <div className="font-['Great_Vibes'] text-2xl text-green-800 mb-2">{event?.envelope_text || 'Please join us'}</div>
                <div className="w-12 h-px bg-green-200 mb-4"></div>
                <div className="font-['Playfair_Display'] font-bold text-gray-800 tracking-wider">
                  {event?.title}
                </div>
             </motion.div>
          )}
        </AnimatePresence>

        {/* The Sheaf of Leaves */}
        <div className="relative flex items-center justify-center h-full">
           {Array.from({ length: leafCount }).map((_, i) => (
             <BetelLeaf 
               key={i} 
               index={i} 
               total={leafCount} 
               isOpen={isOpen} 
               onOpen={handleOpen} 
             />
           ))}
        </div>

        {/* Floating Instruction */}
        {!isOpen && (
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.6 }}
            className="absolute bottom-10 left-1/2 -translate-x-1/2 text-green-900 font-bold uppercase tracking-[0.4em] text-[10px]"
          >
            Touch to Invite
          </motion.p>
        )}
      </div>
    </div>
  );
};

export default BetelLeavesLoader;
