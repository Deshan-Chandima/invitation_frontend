import React, { useRef, useState, useEffect } from 'react';
import Lottie from 'lottie-react';
import envelopeAnimationData from '../assets/envelope.json';

const EnvelopeLottie = ({ onOpenComplete }) => {
  const lottieRef = useRef();
  const [isPlaying, setIsPlaying] = useState(false);
  const [isFadingOut, setIsFadingOut] = useState(false);
  const [isValidLottie, setIsValidLottie] = useState(true);

  // Safety check to ensure the user actually pasted valid code into envelope.json
  useEffect(() => {
    if (!envelopeAnimationData || Object.keys(envelopeAnimationData).length === 0) {
      setIsValidLottie(false);
    }
  }, []);

  const handleOpenClick = () => {
    if (isPlaying || !isValidLottie) return;
    setIsPlaying(true);
    
    // Play the animation from the start
    if (lottieRef.current) {
      lottieRef.current.play();
    }
  };

  const handleAnimationComplete = () => {
    // When the envelope animation finishes, start fading out the overlay wrapper
    setIsFadingOut(true);
    
    // Once faded out, unmount completely to reveal the real invitation!
    setTimeout(() => {
      onOpenComplete();
    }, 800); // 800ms fade transition
  };

  return (
    <div className={`fixed inset-0 z-50 flex items-center justify-center bg-white transition-opacity duration-700 ease-in-out ${isFadingOut ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}>
      
      {!isValidLottie ? (
        <div className="bg-white p-8 rounded-xl shadow-xl text-center max-w-sm border border-red-100">
           <h3 className="text-xl font-bold text-red-600 mb-2">Awaiting Lottie Code!</h3>
           <p className="text-gray-600 text-sm">Please paste your downloaded Lottie JSON code into <code>src/assets/envelope.json</code> to see your premium envelope.</p>
           <button onClick={() => onOpenComplete()} className="mt-4 px-6 py-2 bg-gray-900 text-white rounded-md text-sm font-bold uppercase tracking-widest hover:bg-gray-800 transition">Skip For Now</button>
        </div>
      ) : (
        <div 
          onClick={handleOpenClick} 
          className="relative w-full max-w-2xl cursor-pointer group flex flex-col items-center justify-center"
        >
          {/* We turn off autoplay and loop. It waits for the user to click. */}
          <Lottie 
            lottieRef={lottieRef}
            animationData={envelopeAnimationData}
            loop={false}
            autoplay={false}
            onComplete={handleAnimationComplete}
            className="w-full h-auto transition-transform duration-300 group-hover:scale-[1.02]"
          />
          
          {!isPlaying && (
            <p className="absolute bottom-[-20px] text-[#8c7d69] text-xs font-bold uppercase tracking-widest animate-pulse pointer-events-none">Tap to Open</p>
          )}
        </div>
      )}
      
    </div>
  );
};

export default EnvelopeLottie;
