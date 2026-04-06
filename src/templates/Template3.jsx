import React, { useEffect, useState } from 'react';
import MapSection from '../components/MapSection';

const Template3 = ({ event }) => {
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = (e) => {
      // In a preview pane, the scrolling happens on the container, not window.
      // We will just use standard CSS fixed backgrounds for parallax to be safe.
      setScrollY(window.scrollY);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const formatGoogleCalendarDate = (dateString, addHours = 0) => {
    const date = new Date(dateString);
    date.setHours(date.getHours() + addHours);
    const pad = (n) => (n < 10 ? '0' + n : n);
    return `${date.getUTCFullYear()}${pad(date.getUTCMonth() + 1)}${pad(date.getUTCDate())}T${pad(date.getUTCHours())}${pad(date.getUTCMinutes())}${pad(date.getUTCSeconds())}Z`;
  };

  const getGoogleCalendarUrl = () => {
    const start = formatGoogleCalendarDate(event.event_date);
    const end = formatGoogleCalendarDate(event.event_date, 4);
    const title = encodeURIComponent(event.title);
    const details = encodeURIComponent(event.message || '');
    const location = encodeURIComponent(`${event.venue_name || ''} ${event.location || ''}`);
    return `https://calendar.google.com/calendar/render?action=TEMPLATE&dates=${start}/${end}&text=${title}&details=${details}&location=${location}`;
  };

  const getImageUrl = (url) => {
    if (!url) return 'https://images.unsplash.com/photo-1519225421980-715cb0215aed?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80';
    const unsplashMatch = url.match(/unsplash\.com\/photos\/([a-zA-Z0-9_-]+)/);
    if (unsplashMatch && unsplashMatch[1]) {
      return `https://images.unsplash.com/photo-${unsplashMatch[1]}?auto=format&fit=crop&w=1920&q=80`;
    }
    return url;
  };

  const dateObj = new Date(event.event_date);
  const formattedDate = dateObj.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
  const formattedTime = event.time_text || dateObj.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });

  return (
    <div className="bg-white min-h-screen font-sans text-gray-800 smooth-scroll w-full mx-auto relative overflow-x-hidden">
      
      {/* 1. Hero Parallax Section */}
      <section 
        className="relative h-screen w-full flex items-center justify-center bg-fixed bg-center bg-cover"
        style={{ backgroundImage: `url(${getImageUrl(event.photo_url)})` }}
      >
        <div className="absolute inset-0 bg-black/40"></div>
        <div className="relative z-10 text-center px-4 max-w-4xl mx-auto space-y-8 animate-fade-in-up">
           <span className="font-['Montserrat'] text-sm md:text-md tracking-[0.4em] uppercase text-white/80 drop-shadow-lg">
             {event.host_message || "We invite you to celebrate our wedding"}
           </span>
           <h1 className="font-['Great_Vibes'] text-6xl md:text-8xl lg:text-[140px] text-white drop-shadow-2xl">
             {event.title}
           </h1>
           <div className="w-24 h-px bg-white/60 mx-auto mt-8 mb-4"></div>
           <p className="font-['Playfair_Display'] text-xl md:text-3xl text-white drop-shadow-md">
             {formattedDate}
           </p>
        </div>
        
        {/* Scroll indicator */}
        <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2 text-white animate-bounce">
           <svg className="w-8 h-8 opacity-70" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M19 14l-7 7m0 0l-7-7m7 7V3"></path></svg>
        </div>
      </section>

      {/* Navigation Bar (Sticky Mock) */}
      <nav className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-gray-100 py-4 shadow-sm">
         <div className="max-w-6xl mx-auto px-6 flex justify-between items-center">
            <div className="font-['Playfair_Display'] text-xl font-bold tracking-widest text-[#4a4a4a]">S&A</div>
            <div className="space-x-8 hidden md:block">
               <a href="#story" className="text-xs uppercase tracking-widest font-bold text-gray-500 hover:text-black transition">Our Story</a>
               <a href="#details" className="text-xs uppercase tracking-widest font-bold text-gray-500 hover:text-black transition">The Details</a>
            </div>
            <a href={getGoogleCalendarUrl()} target="_blank" rel="noopener noreferrer" className="px-6 py-2 bg-slate-900 text-white text-xs uppercase tracking-widest font-bold rounded-sm hover:bg-slate-700 transition">RSVP / Calendar</a>
         </div>
      </nav>

      {/* 2. Our Story Section */}
      <section id="story" className="py-24 md:py-32 bg-[#faf9f7] px-6">
        <div className="max-w-3xl mx-auto text-center space-y-8">
           <h2 className="font-['Playfair_Display'] text-4xl md:text-5xl text-[#2c2c2c]">Our Story</h2>
           <div className="w-12 h-[2px] bg-[#d4af37] mx-auto"></div>
           <p className="font-['Montserrat'] text-gray-600 leading-relaxed text-lg md:text-xl font-light">
             {event.message || "We met on a rainy Tuesday in the city, taking shelter under the same cafe awning. Two coffees and a three-hour conversation later, we knew this was something special. Over the past five years, we've traveled the world, built a home, and grown together. We are so incredibly excited to take this next step with all of our favorite people by our side."}
           </p>
        </div>
      </section>

      {/* 3. The Details Section (split layout) */}
      <section id="details" className="py-24 md:py-32 bg-white px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="font-['Playfair_Display'] text-4xl md:text-5xl text-[#2c2c2c]">When & Where</h2>
            <div className="w-12 h-[2px] bg-[#d4af37] mx-auto mt-6"></div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-16 md:gap-8 items-center">
             
             {/* Left: Info */}
             <div className="space-y-12 md:pl-12 text-center md:text-left">
                <div>
                   <h4 className="font-['Montserrat'] text-xs font-bold uppercase tracking-[0.2em] text-[#d4af37] mb-2">The Ceremony</h4>
                   <p className="font-['Playfair_Display'] text-2xl text-gray-900 mb-1">{event.venue_name || "The Grand Estate"}</p>
                   <p className="font-['Montserrat'] text-gray-600 text-sm leading-loose">
                      {event.location || "123 Wedding Boulevard\nLos Angeles, CA 90210"}
                   </p>
                </div>
                
                <div>
                   <h4 className="font-['Montserrat'] text-xs font-bold uppercase tracking-[0.2em] text-[#d4af37] mb-2">The Schedule</h4>
                   <p className="font-['Playfair_Display'] text-xl text-gray-900 mb-1">{formattedDate}</p>
                   <p className="font-['Montserrat'] text-gray-600 text-sm">{formattedTime}</p>
                </div>

                <div>
                   <a href={getGoogleCalendarUrl()} target="_blank" rel="noopener noreferrer" className="inline-block mt-4 border border-black px-8 py-3 text-xs uppercase tracking-widest font-bold hover:bg-black hover:text-white transition-all duration-300">
                     Add To Google Calendar
                   </a>
                </div>
             </div>

             {/* Right: Map/Image Placeholder */}
             <div className="bg-gray-100 aspect-square md:aspect-[4/3] relative rounded-t-[100px] rounded-b-[10px] overflow-hidden shadow-lg border-8 border-white">
                <img 
                  src={getImageUrl(event.photo_url)} 
                  alt="Venue / Couple" 
                  className="w-full h-full object-cover saturate-50 hover:saturate-100 transition-all duration-700"
                />
             </div>
          </div>
        </div>
      </section>

      {/* Map Section */}
      <section className="bg-[#faf9f7] py-16">
         <MapSection event={event} />
      </section>

      {/* 4. Footer */}
      <footer className="bg-slate-900 text-white py-16 text-center px-6">
         <h2 className="font-['Great_Vibes'] text-4xl mb-4">{event.footer_text || "We can't wait to celebrate with you!"}</h2>
         <p className="font-['Montserrat'] text-[10px] tracking-widest uppercase text-gray-400">Created with Syntechcraft Event Invites</p>
      </footer>
      
    </div>
  );
};

export default Template3;
