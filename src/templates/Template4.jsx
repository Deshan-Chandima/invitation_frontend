import React from 'react';
import { motion } from 'framer-motion';
import MapSection from '../components/MapSection';

const Template4 = ({ event }) => {
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

  const getImageUrl = (url) => {
    if (!url) return 'https://images.unsplash.com/photo-1606800052052-a08af7148866?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80';
    const unsplashMatch = url.match(/unsplash\.com\/photos\/([a-zA-Z0-9_-]+)/);
    if (unsplashMatch && unsplashMatch[1]) {
      return `https://images.unsplash.com/photo-${unsplashMatch[1]}?auto=format&fit=crop&w=1920&q=80`;
    }
    return url;
  };

  const dateObj = new Date(event.event_date);
  const formattedDate = dateObj.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
  const formattedTime = event.time_text || dateObj.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });

  // Framer Motion Animation Variants
  const fadeUp = {
    hidden: { opacity: 0, y: 50 },
    visible: { opacity: 1, y: 0, transition: { duration: 1, ease: 'easeOut' } }
  };

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.2 }
    }
  };

  return (
    <div className="bg-[#f2efe9] min-h-screen font-sans text-gray-800 smooth-scroll w-full mx-auto relative overflow-hidden">
      
      {/* Navbar overlay */}
      <motion.nav 
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 1, delay: 0.5 }}
        className="absolute top-0 w-full z-50 px-6 py-8 flex justify-between items-center pointer-events-none"
      >
        <div className="font-['Playfair_Display'] text-2xl text-white font-bold tracking-widest drop-shadow-md">
          {event.title ? event.title.split(' ')[0][0] + '&' + (event.title.split(' ')[2]?.[0] || 'A') : 'S&A'}
        </div>
        <div className="pointer-events-auto">
          <a href={getGoogleCalendarUrl()} target="_blank" rel="noopener noreferrer" className="px-6 py-2 border border-white/50 text-white text-xs uppercase tracking-widest hover:bg-white hover:text-black transition duration-300 rounded-sm glassmorphism">
            RSVP
          </a>
        </div>
      </motion.nav>

      {/* 1. Hero Cinematic Section */}
      <section className="relative h-screen w-full flex items-center justify-center overflow-hidden bg-black">
        {/* Slow zoom image using animate instead of scroll down dependencies to work in preview frames */}
        <motion.div 
          initial={{ scale: 1.1 }}
          animate={{ scale: 1 }}
          transition={{ duration: 10, ease: 'easeOut' }}
          className="absolute inset-0 z-0"
        >
          <img 
            src={getImageUrl(event.photo_url)} 
            alt="Hero Background" 
            className="w-full h-full object-cover opacity-60"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-black/60"></div>
        </motion.div>

        <motion.div 
          variants={staggerContainer}
          initial="hidden"
          animate="visible"
          className="relative z-10 text-center px-4 max-w-5xl mx-auto space-y-6"
        >
          <motion.div variants={fadeUp} className="font-['Montserrat'] text-xs md:text-sm tracking-[0.5em] uppercase text-white/90 drop-shadow-md">
            {event.host_message || "TOGETHER WITH THEIR FAMILIES"}
          </motion.div>
          
          <motion.h1 variants={fadeUp} className="font-['Playfair_Display'] text-7xl md:text-9xl text-white drop-shadow-2xl font-medium tracking-tight">
            {event.title || "Samee & Sandu"}
          </motion.h1>

          <motion.div variants={fadeUp} className="pt-8">
            <span className="inline-block px-10 py-3 border-y border-white/50 font-['Montserrat'] text-sm tracking-widest text-white/90">
              {formattedDate}
            </span>
          </motion.div>
        </motion.div>
        
        {/* Animated scroll down indicator */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1, y: [0, 10, 0] }}
          transition={{ opacity: { delay: 2, duration: 1 }, y: { repeat: Infinity, duration: 2, ease: "easeInOut" } }}
          className="absolute bottom-12 left-1/2 transform -translate-x-1/2 text-white/70 flex flex-col items-center"
        >
          <span className="font-['Montserrat'] text-[9px] uppercase tracking-widest mb-2 font-bold">Scroll</span>
          <div className="w-[1px] h-12 bg-gradient-to-b from-white/70 to-transparent"></div>
        </motion.div>
      </section>

      {/* 2. Our Story Sections (Floating / Asymmetrical) */}
      <section className="py-24 md:py-32 bg-[#f2efe9] px-6 relative">
        <div className="absolute top-0 right-0 w-64 h-64 bg-[#e8e4db] rounded-full blur-3xl opacity-50 transform translate-x-1/2 -translate-y-1/2"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-[#e1dcd1] rounded-full blur-3xl opacity-50 transform -translate-x-1/2 translate-y-1/2"></div>

        <div className="max-w-5xl mx-auto z-10 relative">
           <motion.div 
             initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.3 }}
             variants={fadeUp}
             className="text-center mb-16"
           >
             <h2 className="font-['Great_Vibes'] text-5xl md:text-6xl text-[#6b705c] font-light">The Beginning</h2>
           </motion.div>

           <div className="flex flex-col md:flex-row items-center gap-16">
              <motion.div 
                initial={{ opacity: 0, x: -50 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 1, ease: 'easeOut' }}
                viewport={{ once: true, amount: 0.3 }}
                className="w-full md:w-1/2"
              >
                <div className="relative p-2 md:p-4 bg-white/50 backdrop-blur-md rounded-tr-[100px] rounded-bl-[100px] shadow-xl">
                  <img 
                    src={getImageUrl(event.photo_url)} 
                    alt="Couple" 
                    className="w-full aspect-[3/4] object-cover rounded-tr-[90px] rounded-bl-[90px] filter sepia-[0.1]"
                  />
                </div>
              </motion.div>

              <motion.div 
                initial={{ opacity: 0, x: 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 1, ease: 'easeOut', delay: 0.2 }}
                viewport={{ once: true, amount: 0.3 }}
                className="w-full md:w-1/2 space-y-6 text-center md:text-left"
              >
                <h3 className="font-['Playfair_Display'] text-3xl text-gray-800 tracking-wide">
                  {event.ceremony_message || "We decided on forever"}
                </h3>
                <p className="font-['Montserrat'] text-gray-600 text-sm md:text-base leading-loose font-light">
                  {event.message || "Welcome to our beautifully animated story. From the first time we met, our journey has been an incredible sequence of events leading right up to this moment. We invite you to join us in witnessing our vows and celebrating the start of our new chapter together."}
                </p>
              </motion.div>
           </div>
        </div>
      </section>

      {/* 3. The Details (Glassmorphism overlap) */}
      <section className="py-24 md:py-32 relative bg-[#4a5342]">
        {/* Background Image overlapping */}
        <div className="absolute inset-0">
          <img src={getImageUrl(event.photo_url)} alt="Venue" className="w-full h-full object-cover opacity-20" />
          <div className="absolute inset-0 bg-[#4a5342] bg-opacity-80 mix-blend-multiply"></div>
        </div>

        <motion.div 
          initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.2 }}
          variants={staggerContainer}
          className="relative z-10 max-w-4xl mx-auto px-6"
        >
          <div className="bg-white/10 backdrop-blur-xl border border-white/20 p-10 md:p-16 rounded-xl shadow-2xl text-center flex flex-col items-center">
            <motion.h2 variants={fadeUp} className="font-['Playfair_Display'] text-4xl md:text-5xl text-white tracking-widest uppercase mb-12">
              When & Where
            </motion.h2>

            <div className="flex flex-col md:flex-row gap-12 md:gap-24 text-white text-center w-full justify-center">
               <motion.div variants={fadeUp} className="space-y-4">
                  <div className="w-10 h-10 mx-auto border border-white/50 rounded-full flex items-center justify-center mb-4">
                    <svg className="w-4 h-4 text-white/80" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
                  </div>
                  <h4 className="font-['Montserrat'] text-[10px] tracking-widest uppercase text-white/60">Date & Time</h4>
                  <p className="font-['Playfair_Display'] text-2xl">{formattedDate}</p>
                  <p className="font-['Montserrat'] text-sm tracking-wider font-light text-white/80">{formattedTime}</p>
               </motion.div>

               <motion.div variants={fadeUp} className="w-[1px] bg-white/20 hidden md:block"></motion.div>
               <motion.div variants={fadeUp} className="h-[1px] w-full bg-white/20 md:hidden"></motion.div>

               <motion.div variants={fadeUp} className="space-y-4">
                  <div className="w-10 h-10 mx-auto border border-white/50 rounded-full flex items-center justify-center mb-4">
                    <svg className="w-4 h-4 text-white/80" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>
                  </div>
                  <h4 className="font-['Montserrat'] text-[10px] tracking-widest uppercase text-white/60">Location</h4>
                  <p className="font-['Playfair_Display'] text-2xl">{event.venue_name || 'The Venue'}</p>
                  <p className="font-['Montserrat'] text-sm tracking-wider font-light text-white/80">{event.location || '123 Avenue'}</p>
               </motion.div>
            </div>

            <motion.div variants={fadeUp} className="mt-16">
              <a 
                href={getGoogleCalendarUrl()} 
                target="_blank" 
                rel="noopener noreferrer"
                className="inline-block bg-white text-[#4a5342] font-['Montserrat'] text-[11px] font-bold uppercase tracking-widest px-10 py-4 rounded hover:bg-[#e8e4db] transition-colors shadow-lg"
              >
                Add to Calendar
              </a>
            </motion.div>
          </div>
        </motion.div>
      </section>

      {/* Map Section */}
      <MapSection event={event} />

      {/* 4. Footer */}
      <footer className="bg-[#1a1c17] py-20 text-center px-6 border-t border-white/10">
         <motion.div 
           initial={{ opacity: 0, y: 30 }}
           whileInView={{ opacity: 1, y: 0 }}
           transition={{ duration: 1 }}
           viewport={{ once: true }}
         >
           <h2 className="font-['Playfair_Display'] text-4xl md:text-5xl text-white/90 mb-4 tracking-wide">
             {event.footer_text || "We can't wait to celebrate with you!"}
           </h2>
           <div className="w-12 h-[1px] bg-[#d4af37] mx-auto my-6"></div>
           <p className="font-['Montserrat'] text-[10px] tracking-[0.2em] uppercase text-white/50">Created with Syntechcraft Event Invites</p>
         </motion.div>
      </footer>
      
    </div>
  );
};

export default Template4;
