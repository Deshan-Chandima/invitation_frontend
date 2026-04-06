import React, { useState, useEffect } from 'react';

const EnvelopeOverlay = ({ onOpenComplete, event }) => {
  const [stage, setStage] = useState('sealed'); // 'sealed' | 'opening_flap' | 'drawing_card' | 'done'

  const handleOpenClick = () => {
    if (stage !== 'sealed') return;
    
    // Stage 1: Break seal smoothly
    setStage('opening_flap');
    
    // Stage 2: Flap is opening. Wait for it to finish, then slide card up and scale to camera.
    setTimeout(() => {
      setStage('drawing_card');
    }, 800); // Increased wait time to let the flap finish its beautiful fold

    // Stage 3: Card is hitting camera. Fade out the wrapper slowly for a gorgeous seam.
    setTimeout(() => {
      setStage('done');
    }, 2200); 

    // Stage 4: Unmount entirely.
    setTimeout(() => {
      onOpenComplete();
    }, 3200); 
  };

  // Safe fallback if event isn't loaded
  const sealLetter = event?.title ? event.title.charAt(0).toUpperCase() : 'S';

  return (
    <div className={`fixed inset-0 z-50 flex items-center justify-center bg-[#fdfaf5] transition-opacity duration-1000 env-perspective ${stage === 'done' ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}>
      
      {/* 3D Engine CSS */}
      <style>{`
        .env-perspective { perspective: 2500px; }
        .preserve-3d { transform-style: preserve-3d; }
        
        .flap-container {
          position: absolute;
          top: 0; left: 0; width: 100%; height: 160px;
          transform-origin: top;
          transition: transform 0.8s cubic-bezier(0.34, 1.56, 0.64, 1);
          z-index: 40;
        }
        
        .flap-container.is-open {
          transform: rotateX(175deg); /* Flips back beautifully */
          z-index: 10;
        }

        /* Using real physical planes (not border tricks) so the browser renders 3D backfaces perfectly */
        .flap-front, .flap-back {
          position: absolute;
          inset: 0;
          clip-path: polygon(0 0, 50% 100%, 100% 0);
          backface-visibility: hidden;
        }

        .flap-front {
          background-color: #f2eadf;
          z-index: 2;
          filter: drop-shadow(0px 8px 10px rgba(0,0,0,0.15));
        }

        .flap-back {
          background-color: #e2d1b7;
          transform: rotateX(180deg); /* This is the inside! */
          z-index: 1;
        }

        /* The drawn paper starts deep inside the envelope */
        .dummy-paper {
          position: absolute;
          bottom: 2%; left: 3%; right: 3%; top: 5%;
          background: #ffffff;
          border-radius: 8px 8px 0 0;
          box-shadow: 0 -5px 15px rgba(0,0,0,0.05);
          transition: transform 1.4s cubic-bezier(0.7, 0, 0.3, 1), opacity 1s ease-in-out;
          transform-origin: bottom center;
          display: flex;
          flex-direction: column;
          align-items: center;
          padding-top: 40px;
          z-index: 15; 
        }

        .dummy-paper.draw-out {
          /* Slide out, scale massively, and fade slightly at the end to seamlessly reveal real page */
          transform: translateY(-80vh) scale(5);
        }

      `}</style>

      {/* Container holding the envelope */}
      <div 
        className={`relative w-[400px] h-[250px] transition-transform duration-[1400ms] ${
          stage === 'drawing_card' ? 'translate-y-[20vh] opacity-0' : 'translate-y-0 opacity-100'
        }`}
      >
        {/* Envelope Inside Pocket View */}
        <div className="absolute inset-0 bg-[#d8c3a5] rounded-md shadow-2xl overflow-hidden">
           <div className={`absolute top-0 w-full h-[60px] bg-gradient-to-b from-black/20 to-transparent transition-opacity duration-1000 ${stage !== 'sealed' ? 'opacity-100' : 'opacity-0'}`}></div>
        </div>

        {/* --- DUMMY PAPER --- */}
        <div className={`dummy-paper ${stage === 'drawing_card' || stage === 'done' ? 'draw-out' : ''}`}>
           {/* Attempt to mimic the real invite dynamically so the reveal is seamless */}
           <h2 className="font-['Great_Vibes'] text-xl text-gray-800 opacity-30">{event?.title || 'Invitation'}</h2>
           <div className="w-[50%] h-[2px] bg-[#d4af37] mx-auto mt-4 rounded-full opacity-60"></div>
           <div className="w-[60%] h-[2px] bg-gray-200 mx-auto mt-4 rounded-full opacity-60"></div>
        </div>

        {/* --- FRONT FLAPS (z=20) (Static borders are ok here because they don't rotate) --- */}
        <div className="absolute inset-0 z-20 pointer-events-none drop-shadow-lg overflow-hidden rounded-md">
           {/* Left Flap */}
           <div className="absolute top-0 left-0 w-0 h-0 border-t-[125px] border-b-[125px] border-l-[200px] border-transparent border-l-[#ebe0d1]"></div>
           {/* Right Flap */}
           <div className="absolute top-0 right-0 w-0 h-0 border-t-[125px] border-b-[125px] border-r-[200px] border-transparent border-r-[#ebe0d1]"></div>
           {/* Bottom Flap */}
           <div className="absolute bottom-0 left-0 w-0 h-0 border-l-[200px] border-r-[200px] border-b-[140px] border-transparent border-b-[#fcf2e3]"></div>
        </div>

        {/* --- TOP FLAP (Animated Hinged 3D) --- */}
        <div className={`flap-container preserve-3d ${stage !== 'sealed' ? 'is-open' : ''}`}>
           <div className="flap-back"></div>
           <div className="flap-front">
              {/* Crease line illusion */}
              <div className="absolute bottom-[0px] left-1/2 transform -translate-x-1/2 w-8 h-px bg-[#d3c7b6]"></div>
           </div>
        </div>

        {/* --- WAX SEAL --- */}
        <div 
          onClick={handleOpenClick}
          className="absolute top-[140px] left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50 flex items-center justify-center cursor-pointer group"
          role="button"
          aria-label="Open Invitation"
        >
           {/* Seal Wrapper for Smooth Out-Animation */}
           <div className={`relative flex items-center justify-center transition-all duration-700 ease-out ${
             stage !== 'sealed' ? 'opacity-0 scale-[1.5] pointer-events-none blur-sm' : 'opacity-100 scale-100'
           }`}>
             <div className="absolute w-20 h-20 bg-[#610000] rounded-full blur-md opacity-30 group-hover:opacity-50 group-hover:scale-125 transition-all duration-500"></div>
             
             <div className="relative w-[70px] h-[70px] bg-[#8a1111] rounded-full flex items-center justify-center shadow-[inset_-3px_-6px_12px_rgba(0,0,0,0.4),0_5px_15px_rgba(0,0,0,0.6)] border border-[#520000] group-hover:scale-105 transition-transform duration-300">
               <div className="absolute inset-0 rounded-full border-[2px] border-dashed border-[#a31a1a] opacity-70 scale-[0.88]"></div>
               <span className="font-['Great_Vibes'] text-3xl text-[#e8cc9b] font-bold drop-shadow-[1px_2px_3px_rgba(0,0,0,0.8)]">
                 {sealLetter}
               </span>
             </div>
             
             <p className={`absolute -bottom-10 whitespace-nowrap text-[#8c7d69] text-[11px] font-bold uppercase tracking-widest opacity-80 transition duration-300 ${stage !== 'sealed' ? 'opacity-0' : 'group-hover:opacity-100'}`}>Tap to Open</p>
           </div>
        </div>

      </div>
    </div>
  );
};

export default EnvelopeOverlay;
