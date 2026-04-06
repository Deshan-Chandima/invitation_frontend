import React from 'react';
import { motion } from 'framer-motion';
import MapSection from '../components/MapSection';

const Template3 = ({ event }) => {
  const formatGoogleCalendarDate = (dateString, addHours = 0) => {
    const date = new Date(dateString);
    date.setHours(date.getHours() + addHours);
    const pad = (n) => (n < 10 ? '0' + n : n);
    return `${date.getUTCFullYear()}${pad(date.getUTCMonth() + 1)}${pad(date.getUTCDate())}T${pad(date.getUTCHours())}${pad(date.getUTCMinutes())}${pad(date.getUTCSeconds())}Z`;
  };

  const getGoogleCalendarUrl = () => {
    const start = formatGoogleCalendarDate(event.event_date);
    const end = formatGoogleCalendarDate(event.event_date, 4);
    const title = encodeURIComponent(event.title || 'Wedding Event');
    const details = encodeURIComponent(event.message || '');
    const location = encodeURIComponent(`${event.venue_name || ''} ${event.location || ''}`);
    return `https://calendar.google.com/calendar/render?action=TEMPLATE&dates=${start}/${end}&text=${title}&details=${details}&location=${location}`;
  };

  const dateObj = new Date(event.event_date);
  const formattedDate = dateObj.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
  const formattedTime = event.time_text || dateObj.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
  
  const dayNum = dateObj.getDate();
  const monthName = dateObj.toLocaleDateString('en-US', { month: 'short' }).toUpperCase();
  const year = dateObj.getFullYear();

  // Animation Variants
  const fadeInUp = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 1, ease: 'easeOut' } }
  };

  const stagger = {
    visible: { transition: { staggerChildren: 0.2 } }
  };

  return (
    <div className="relative min-h-screen w-full font-sans text-gray-900 overflow-x-hidden pt-10 pb-20">
      
      {/* 1. Video Background Overlay */}
      <div className="fixed inset-0 z-0 bg-black">
        <video 
          autoPlay 
          muted 
          loop 
          playsInline 
          className="w-full h-full object-cover opacity-60"
        >
          <source src="/vecteezy_wedding-invitation-background-v3_45166464.mp4" type="video/mp4" />
        </video>
        <div className="absolute inset-0 bg-black/30 backdrop-blur-[2px]"></div>
      </div>

      {/* 2. Main Card Content */}
      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen px-6">
        <motion.div 
          initial="hidden"
          animate="visible"
          variants={stagger}
          className="bg-white/10 backdrop-blur-xl border border-white/30 rounded-3xl p-8 md:p-12 shadow-[0_20px_50px_rgba(0,0,0,0.4)] w-full max-w-md text-center space-y-8 flex flex-col items-center overflow-hidden"
        >
           <motion.div variants={fadeInUp} className="space-y-2">
             <span className="font-['Montserrat'] text-[10px] tracking-[0.4em] uppercase text-white/80">Save The Date</span>
             <div className="w-8 h-px bg-white/40 mx-auto"></div>
           </motion.div>

           {/* Title Section */}
           <motion.div variants={fadeInUp} className="py-4">
              <h1 className="font-['Great_Vibes'] text-6xl md:text-7xl text-white drop-shadow-md leading-tight">
                {event.title || "Samee & Sandaru"}
              </h1>
           </motion.div>

           <motion.div variants={fadeInUp} className="max-w-[280px]">
             <p className="font-['Montserrat'] text-[11px] tracking-widest leading-relaxed text-white/90 uppercase font-light">
               {event.ceremony_message || "We invite you to celebrate our wedding"}
             </p>
           </motion.div>

           {/* Date Block */}
           <motion.div variants={fadeInUp} className="flex items-center justify-center space-x-10 py-6 border-y border-white/20 w-full">
              <div className="flex flex-col items-center">
                 <span className="text-[10px] uppercase tracking-widest text-white/60 mb-1">{monthName}</span>
                 <span className="text-4xl font-['Playfair_Display'] text-white font-bold">{dayNum}</span>
              </div>
              <div className="w-px h-12 bg-white/20"></div>
              <div className="flex flex-col items-center">
                 <span className="text-[10px] uppercase tracking-widest text-white/60 mb-1">Time</span>
                 <span className="text-xl font-['Playfair_Display'] text-white font-bold">{formattedTime}</span>
              </div>
              <div className="w-px h-12 bg-white/20"></div>
              <div className="flex flex-col items-center">
                 <span className="text-[10px] uppercase tracking-widest text-white/60 mb-1">Year</span>
                 <span className="text-xl font-['Playfair_Display'] text-white font-bold">{year}</span>
              </div>
           </motion.div>

           {/* Venue & Location */}
           <motion.div variants={fadeInUp} className="space-y-2 py-4">
              <h3 className="font-['Playfair_Display'] text-2xl text-white font-medium tracking-wide">
                {event.venue_name || "The Grand Estate"}
              </h3>
              <p className="font-['Montserrat'] text-[10px] tracking-widest uppercase text-white/70 max-w-[250px] mx-auto leading-relaxed">
                {event.location || "123 Wedding Boulevard\nLos Angeles, CA 90210"}
              </p>
           </motion.div>

           <motion.div variants={fadeInUp} className="pt-6">
              <a 
                href={getGoogleCalendarUrl()} 
                target="_blank" 
                rel="noopener noreferrer" 
                className="inline-block px-12 py-4 bg-white text-gray-900 font-['Montserrat'] text-xs font-bold uppercase tracking-widest rounded-full shadow-lg hover:bg-gray-100 transition-all duration-300 transform hover:scale-105 active:scale-95"
              >
                Add to Calendar
              </a>
           </motion.div>

           {/* Subtle Message Overlay (Scrolling if long) */}
           <motion.div variants={fadeInUp} className="mt-6">
             <p className="font-['Great_Vibes'] text-2xl text-white/90 drop-shadow-sm">
                {event.footer_text || "reception to follow"}
             </p>
           </motion.div>
        </motion.div>

        {/* Scroll hint if map is enabled */}
        {event.show_map && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1, y: [0, 10, 0] }}
            transition={{ delay: 2, repeat: Infinity, duration: 2 }}
            className="mt-12 text-white/40 flex flex-col items-center"
          >
            <span className="text-[10px] uppercase font-bold tracking-[0.2em] mb-2">View Map</span>
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 14l-7 7m0 0l-7-7m7 7V3"></path></svg>
          </motion.div>
        )}
      </div>

      {/* 3. Detailed Information & Map (Appended below the card) */}
      <div className="relative z-10 w-full flex flex-col items-center mt-12 mb-20 px-6">
         {event.message && (
            <motion.div 
              initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeInUp}
              className="max-w-md w-full bg-white/5 backdrop-blur-md rounded-2xl p-8 mb-12 text-center text-white/90 border border-white/10"
            >
              <h4 className="font-['Playfair_Display'] text-xl mb-6">Our Story</h4>
              <p className="font-['Montserrat'] text-sm leading-relaxed font-light opacity-80">
                {event.message}
              </p>
            </motion.div>
         )}

         {/* Reusable Map Section component will handle display based on show_map */}
         <div className="w-full max-w-4xl opacity-90 brightness-90 saturate-[0.8] contrast-[1.1] hover:brightness-100 transition-all duration-700">
           <MapSection event={event} />
         </div>
      </div>

      {/* Footer Branding */}
      <footer className="relative z-10 py-10 text-center px-6">
         <p className="font-['Montserrat'] text-[8px] tracking-[0.5em] uppercase text-white/40">Created with Syntechcraft</p>
      </footer>
      
    </div>
  );
};

export default Template3;
