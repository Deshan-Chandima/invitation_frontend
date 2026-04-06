import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const EnvelopePremium = ({ onOpenComplete, event }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isDrawn, setIsDrawn] = useState(false);

  const handleOpen = () => {
    setIsOpen(true);
    // Draw the card after the flap opens
    setTimeout(() => setIsDrawn(true), 600);
    // Complete the sequence after the card scales
    setTimeout(() => onOpenComplete(), 2800);
  };

  const sealLetter = event?.title ? event.title.charAt(0).toUpperCase() : 'S';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#fdfaf5] overflow-hidden">
      
      {/* 3D Scene Container */}
      <div className="relative perspective-[2000px] w-full h-full flex items-center justify-center">
        
        {/* The Envelope Body */}
        <motion.div 
          initial={{ scale: 0.9, y: 20, opacity: 0 }}
          animate={{ scale: 1, y: 0, opacity: 1 }}
          transition={{ type: 'spring', damping: 20, stiffness: 100 }}
          className={`relative w-[340px] h-[230px] md:w-[480px] md:h-[320px] transition-all duration-[1200ms] ease-in-out ${isDrawn ? 'translate-y-[40vh] opacity-0 scale-95' : ''}`}
        >
          
          {/* 1. Inside Pocket (The very back) */}
          <div className="absolute inset-0 bg-[#dac6a8] rounded-lg shadow-inner overflow-hidden border border-[#c1ad8b]">
             <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/linen-paper.png')] opacity-20"></div>
             {/* Deep gradient shadow inside pocket */}
             <div className={`absolute top-0 inset-x-0 h-16 bg-gradient-to-b from-black/20 to-transparent transition-opacity duration-700 ${isOpen ? 'opacity-100' : 'opacity-0'}`}></div>
          </div>

          {/* 2. THE CARD (Slides out) */}
          <motion.div 
            initial={{ y: 0, scale: 1 }}
            animate={isDrawn ? { y: -800, scale: 2.2, rotate: -2 } : { y: isOpen ? -40 : 0 }}
            transition={{ 
              y: { duration: 1.5, ease: [0.65, 0, 0.35, 1] },
              scale: { duration: 1.5, ease: [0.65, 0, 0.35, 1] }
            }}
            className="absolute inset-[5%] bg-white shadow-lg rounded-sm border border-gray-100 flex flex-col items-center justify-center p-8 text-center z-10"
          >
             <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/linen-paper.png')] opacity-10"></div>
             
             {/* Editable Text Section */}
             <motion.div 
               animate={{ opacity: isDrawn ? 0 : 1 }}
               className="space-y-4"
             >
                <p className="font-['Great_Vibes'] text-xl md:text-2xl text-[#b08d57] mb-2">
                   {event?.envelope_text || 'Please join us'}
                </p>
                <div className="w-12 h-px bg-[#d4af37] mx-auto opacity-40"></div>
                <h2 className="font-['Playfair_Display'] text-lg md:text-xl font-bold text-gray-800 tracking-widest uppercase">
                   {event?.title || 'Kasun & Kavya'}
                </h2>
                <p className="font-['Montserrat'] text-[10px] tracking-[0.2em] text-gray-400 mt-2">
                   {event?.event_date ? new Date(event.event_date).toLocaleDateString(undefined, { month: 'long', day: 'numeric', year: 'numeric' }) : ''}
                </p>
             </motion.div>
          </motion.div>

          {/* 3. Front Flaps (Static sides/bottom) */}
          <div className="absolute inset-0 z-20 pointer-events-none drop-shadow-2xl flex items-center justify-center">
             {/* Left Flap */}
             <div 
               className="absolute top-0 left-0 w-full h-full bg-[#f2eae1] shadow-lg"
               style={{ clipPath: 'polygon(0 0, 50% 50%, 0 100%)' }}
             ></div>
             {/* Right Flap */}
             <div 
               className="absolute top-0 right-0 w-full h-full bg-[#f2eae1] shadow-lg"
               style={{ clipPath: 'polygon(100% 0, 50% 50%, 100% 100%)' }}
             ></div>
             {/* Bottom Flap */}
             <div 
               className="absolute bottom-0 left-0 w-full h-full bg-[#eee5db] shadow-xl"
               style={{ clipPath: 'polygon(0 100%, 50% 45%, 100% 100%)' }}
             ></div>
          </div>

          {/* 4. Top Flap (Animated 3D Hinge) */}
          <motion.div 
            initial={{ rotateX: 0 }}
            animate={{ rotateX: isOpen ? 175 : 0 }}
            transition={{ type: 'spring', damping: 15, stiffness: 60 }}
            style={{ transformOrigin: 'top center', transformStyle: 'preserve-3d' }}
            className="absolute top-0 left-0 w-full h-full z-40 cursor-pointer"
          >
            {/* Front of Flap (Face Down) */}
            <div 
              className="absolute inset-0 bg-[#f7f0e6] shadow-md backface-hidden"
              style={{ clipPath: 'polygon(0 0, 50% 55%, 100% 0)' }}
            >
               <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/linen-paper.png')] opacity-10"></div>
            </div>
            
            {/* Back of Flap (Inside face when open) */}
            <div 
              className="absolute inset-0 bg-[#decbb3] shadow-inner backface-hidden"
              style={{ clipPath: 'polygon(0 0, 50% 55%, 100% 0)', transform: 'rotateX(180deg)' }}
            >
               <div className="absolute inset-x-0 bottom-0 h-4 bg-gradient-to-t from-black/5 to-transparent"></div>
            </div>
          </motion.div>

          {/* 5. The Wax Seal (Button) */}
          <AnimatePresence>
            {!isOpen && (
              <motion.div 
                onClick={handleOpen}
                exit={{ opacity: 0, scale: 1.5, filter: 'blur(10px)' }}
                transition={{ duration: 0.4 }}
                className="absolute top-[48%] left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50 flex items-center justify-center cursor-pointer group"
              >
                 {/* Glowing Aura */}
                 <div className="absolute w-20 h-20 bg-[#8b0000] rounded-full blur-xl opacity-20 group-hover:opacity-40 animate-pulse"></div>
                 
                 {/* The Seal */}
                 <div className="relative w-16 h-16 md:w-20 md:h-20 bg-[#a31a1a] rounded-full flex items-center justify-center shadow-[inset_-3px_-6px_10px_rgba(0,0,0,0.5),0_10px_20px_rgba(0,0,0,0.4)] border-2 border-[#8b0000] group-hover:scale-105 transition-transform">
                    <div className="absolute inset-1 rounded-full border-[3px] border-[#c0392b] opacity-40 scale-[0.98]"></div>
                    <span className="font-['Great_Vibes'] text-3xl md:text-4xl text-[#f5d9a6] font-bold drop-shadow-lg">
                      {sealLetter}
                    </span>
                 </div>
                 
                 <p className="absolute -bottom-10 whitespace-nowrap text-[#a69681] text-[11px] font-bold uppercase tracking-[0.3em] opacity-60 group-hover:opacity-100 transition shadow-sm">Tap to Open</p>
              </motion.div>
            )}
          </AnimatePresence>

        </motion.div>

      </div>
    </div>
  );
};

export default EnvelopePremium;
