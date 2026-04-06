import React from 'react';
import MapSection from '../components/MapSection';

const Template2 = ({ event }) => {
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

  const dateObj = new Date(event.event_date);
  const dayName = dateObj.toLocaleDateString('en-US', { day: '2-digit' });
  const monthName = dateObj.toLocaleDateString('en-US', { month: 'short' }).toLowerCase();
  const year = dateObj.getFullYear();
  const time = dateObj.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false });

  // Helper to handle Unsplash landing page URLs
  const getImageUrl = (url) => {
    if (!url) return 'https://images.unsplash.com/photo-1583939003579-730e3918a45a?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80';
    
    // Check if it's an Unsplash landing page URL (e.g. unsplash.com/photos/ID)
    const unsplashMatch = url.match(/unsplash\.com\/photos\/([a-zA-Z0-9_-]+)/);
    if (unsplashMatch && unsplashMatch[1]) {
      return `https://images.unsplash.com/photo-${unsplashMatch[1]}?auto=format&fit=crop&w=800&q=80`;
    }
    return url;
  };

  return (
    <div className="min-h-screen bg-[#f9f7f4] flex items-center justify-center py-10 px-4">
      {/* Main Card */}
      <div className="relative bg-white max-w-md w-full shadow-2xl rounded-t-[100px] rounded-b-[20px] overflow-hidden border-[1px] border-gray-100 flex flex-col items-center text-center">
        
        {/* Photo Section */}
        <div className="w-full h-[350px] relative">
          <img 
            src={getImageUrl(event.photo_url)} 
            alt="Couple" 
            className="w-full h-full object-cover"
          />
          {/* Subtle floral overlay if needed, or just clear photo */}
          <div className="absolute inset-0 bg-gradient-to-b from-transparent to-white/20"></div>
        </div>

        {/* Content Section */}
        <div className="px-8 py-10 w-full relative">
          {/* Frame Outline (mimicking the image) */}
          <div className="absolute inset-x-6 inset-y-6 border-[2px] border-[#c5a059] rounded-t-[60px] rounded-b-[10px] pointer-events-none opacity-60"></div>
          
          <div className="relative z-10 space-y-6">
            <div className="space-y-1">
              <p className="font-['Montserrat'] text-[10px] tracking-[0.2em] text-gray-500 uppercase">Invite You to Celebrate</p>
              <h2 className="font-['Playfair_Display'] text-lg tracking-[0.3em] font-bold text-[#a67c52] uppercase">Save the Date</h2>
            </div>

            <div className="py-2">
              <h1 className="font-['Great_Vibes'] text-5xl text-[#5c4a33] drop-shadow-sm">
                {event.title}
              </h1>
            </div>

            {/* Divider */}
            <div className="flex items-center justify-center py-2">
               <div className="h-[1px] w-12 bg-[#c5a059]"></div>
               <div className="mx-3 text-[#c5a059]">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z"/></svg>
               </div>
               <div className="h-[1px] w-12 bg-[#c5a059]"></div>
            </div>

            {/* Date Block */}
            <div className="flex items-center justify-center space-x-6">
              <div className="text-right">
                <p className="font-['Montserrat'] text-xl font-bold text-[#5c4a33]">{time}</p>
                <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">at.</p>
              </div>
              <div className="h-10 w-[1px] bg-gray-200"></div>
              <div>
                <p className="font-['Playfair_Display'] text-2xl font-bold text-[#5c4a33]">{dayName}</p>
                <p className="text-[12px] text-[#a67c52] font-bold uppercase tracking-tight">{monthName}</p>
              </div>
              <div className="h-10 w-[1px] bg-gray-200"></div>
              <div className="text-left">
                <p className="font-['Montserrat'] text-xl font-bold text-[#5c4a33]">{year}</p>
                <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">Th.</p>
              </div>
            </div>

            {/* Location */}
            <div className="pt-4 space-y-1">
              <h3 className="font-['Playfair_Display'] text-[14px] font-bold text-[#5c4a33] tracking-[0.1em] uppercase">
                {event.venue_name || 'Saint Mery Church'}
              </h3>
              <p className="font-['Montserrat'] text-[10px] text-gray-500 tracking-wider">
                {event.location || '123 Kayu Manis Utara Street'}
              </p>
            </div>
            
            {/* Button */}
            <div className="pt-6">
              <a 
                href={getGoogleCalendarUrl()} 
                target="_blank" 
                rel="noopener noreferrer"
                className="inline-block px-10 py-3 bg-[#a67c52] text-white font-['Montserrat'] text-[11px] font-bold uppercase tracking-widest rounded shadow-lg hover:bg-[#8e6a46] transition-colors"
              >
                Add to Calendar
              </a>
            </div>
          </div>
        </div>
      </div>
      
      {/* Map Section */}
      <div className="w-full max-w-md bg-[#f9f7f4] pt-10 pb-20">
         <MapSection event={event} />
      </div>
    </div>
  );
};

export default Template2;
