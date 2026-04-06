import React from 'react';
import MapSection from '../components/MapSection';

const Template1 = ({ event }) => {
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
  const dayOfWeek = dateObj.toLocaleDateString('en-US', { weekday: 'short' }).toUpperCase();
  const month = dateObj.toLocaleDateString('en-US', { month: 'short' }).toUpperCase();
  const dateNum = dateObj.getDate();
  const year = dateObj.getFullYear();
  const names = event.title || '';
  const parsedNames = names.replace(/ AND | and | & /gi, '\nAND\n');

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#eae3d9] py-8 px-4 sm:px-8 overflow-y-auto">
      <div className="relative bg-white max-w-2xl w-full mx-auto shadow-[0_10px_40px_-10px_rgba(0,0,0,0.15)] aspect-[3/4] sm:aspect-auto sm:min-h-[900px] flex flex-col items-center p-8 sm:p-16 text-center text-gray-800 box-border overflow-hidden"
           style={{ backgroundImage: "url('/floral-border.png')", backgroundSize: 'cover', backgroundPosition: 'center', backgroundRepeat: 'no-repeat' }}>
        <div className="absolute inset-4 sm:inset-6 border-[0.5px] border-[#a49884]/40 pointer-events-none"></div>
        <div className="relative z-10 flex flex-col items-center justify-center w-full h-full my-auto space-y-8 mt-12 sm:mt-16">
          <div className="max-w-[280px]">
            <p className="font-['Montserrat'] text-[9px] sm:text-[11px] tracking-[0.25em] uppercase leading-relaxed text-[#5c5c5c]">{event.host_message || 'TOGETHER WITH THEIR FAMILIES'}</p>
          </div>
          <div className="my-6 w-full text-[#4a4238]">
            <h1 className="font-['Great_Vibes'] text-4xl sm:text-6xl whitespace-pre-wrap leading-[1.2] drop-shadow-sm font-normal">
              {parsedNames.split('\n').map((line, idx) => (
                <React.Fragment key={idx}>
                  {line.trim() === 'AND' ? <div className="font-['Montserrat'] text-[9px] tracking-[0.3em] uppercase text-[#736a5c] my-3">and</div> : <span>{line}</span>}
                </React.Fragment>
              ))}
            </h1>
          </div>
          <div className="max-w-[320px] px-4">
            <p className="font-['Montserrat'] text-[8px] sm:text-[10px] tracking-[0.2em] uppercase leading-relaxed text-[#5c5c5c]">{event.ceremony_message || 'REQUEST THE PLEASURE OF YOUR COMPANY AT THE CEREMONY OF THEIR WEDDING'}</p>
          </div>
          <div className="flex items-center justify-center space-x-6 my-4 py-2 border-y-[0.5px] border-[#a49884]/30 w-[200px]">
             <div className="font-['Montserrat'] text-[10px] tracking-[0.15em] font-medium text-[#736a5c]">{month}</div>
             <div className="flex flex-col items-center justify-center border-x-[0.5px] border-[#a49884]/30 px-6">
                <span className="font-['Montserrat'] text-[9px] tracking-[0.15em] text-[#736a5c] mb-1">{dayOfWeek}</span>
                <span className="font-['Playfair_Display'] text-3xl text-[#4a4238] font-semibold">{dateNum}</span>
             </div>
             <div className="font-['Montserrat'] text-[10px] tracking-[0.15em] font-medium text-[#736a5c]">{year}</div>
          </div>
          <div className="max-w-[280px]">
            <p className="font-['Montserrat'] text-[8.5px] sm:text-[10px] tracking-[0.15em] uppercase leading-relaxed text-[#5c5c5c] whitespace-pre-wrap">{event.time_text || 'TWO THOUSAND THIRTY\nAT NINE O\'CLOCK IN THE AFTERNOON'}</p>
          </div>
          <div className="mt-6">
            <h2 className="font-['Playfair_Display'] text-[13px] sm:text-[15px] tracking-[0.2em] uppercase text-[#4a4238] font-bold mb-2">{event.venue_name || 'YOUR VILLA'}</h2>
            <p className="font-['Montserrat'] text-[8px] sm:text-[9px] tracking-[0.15em] uppercase text-[#736a5c] max-w-[250px] mx-auto leading-relaxed">{event.location || '401 YOUR CITY, YOUR DISTRIC, YOUR COUNTRY'}</p>
          </div>
          <div className="pt-8"><p className="font-['Great_Vibes'] text-xl sm:text-2xl text-[#635c51]">{event.footer_text || 'reception to follow'}</p></div>
        </div>
      </div>
      
      {/* Map Section */}
      <div className="w-full bg-[#eae3d9] pb-20">
         <MapSection event={event} />
      </div>

      <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2 z-50">
        <a href={getGoogleCalendarUrl()} target="_blank" rel="noopener noreferrer" className="group flex items-center px-6 py-3.5 bg-white/90 backdrop-blur-md text-[#4a4238] font-['Montserrat'] text-[11px] uppercase tracking-[0.15em] font-medium rounded-full shadow-[0_4px_20px_rgba(0,0,0,0.1)] border border-[#a49884]/30 hover:bg-[#4a4238] hover:text-white transition-all duration-300">
          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
          Add to Calendar
        </a>
      </div>
    </div>
  );
};
export default Template1;
