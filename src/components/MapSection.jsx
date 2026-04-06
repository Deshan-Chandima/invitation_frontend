import React from 'react';
import { motion } from 'framer-motion';

const MapSection = ({ event }) => {
  if (!event.show_map) return null;

  const fadeUp = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: 'easeOut' } }
  };

  const mapQuery = encodeURIComponent(`${event.venue_name || ''} ${event.location || ''}`);
  const mapUrl = `https://maps.google.com/maps?q=${mapQuery}&t=&z=14&ie=UTF8&iwloc=&output=embed`;
  const directionsUrl = event.google_maps_link || `https://www.google.com/maps/dir/?api=1&destination=${mapQuery}`;

  return (
    <motion.div 
      initial="hidden" 
      whileInView="visible" 
      viewport={{ once: true, amount: 0.2 }}
      variants={fadeUp}
      className="w-full max-w-4xl mx-auto px-4 py-12 text-center"
    >
      <div className="mb-8">
        <h3 className="font-['Playfair_Display'] text-2xl md:text-3xl text-gray-800 mb-2">Location & Directions</h3>
        <div className="w-12 h-[1px] bg-indigo-200 mx-auto"></div>
      </div>
      
      <div className="w-full h-72 md:h-96 rounded-2xl overflow-hidden shadow-xl border-4 border-white mb-8 bg-gray-100">
        <iframe 
          width="100%" 
          height="100%" 
          style={{ border: 0 }} 
          loading="lazy" 
          allowFullScreen 
          referrerPolicy="no-referrer-when-downgrade"
          src={mapUrl}
        ></iframe>
      </div>
      
      <div>
        <a 
          href={directionsUrl}
          target="_blank" 
          rel="noopener noreferrer"
          className="inline-flex items-center bg-indigo-600 text-white font-['Montserrat'] text-[11px] font-bold uppercase tracking-widest px-8 py-4 rounded-full hover:bg-indigo-700 transition-all shadow-lg hover:shadow-indigo-200"
        >
          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>
          Get Directions
        </a>
      </div>
    </motion.div>
  );
};

export default MapSection;
