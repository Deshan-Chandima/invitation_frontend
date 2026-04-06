import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Template1 from './templates/Template1';
import Template2 from './templates/Template2';
import Template3 from './templates/Template3';
import Template4 from './templates/Template4';

function Dashboard() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentView, setCurrentView] = useState('home'); // 'home', 'create_card', 'create_web'
  const [editingEventId, setEditingEventId] = useState(null);
  const [statusMessage, setStatusMessage] = useState({ type: '', text: '' });

  const initialFormState = {
    invite_type: 'card',
    template_id: 'template_1',
    slug: '',
    title: '', 
    event_date: '',
    time_text: '',
    location: '', 
    venue_name: '',
    host_message: 'TOGETHER WITH THEIR FAMILIES',
    ceremony_message: 'REQUEST THE PLEASURE OF YOUR COMPANY AT THE CEREMONY OF THEIR WEDDING',
    footer_text: 'reception to follow',
    message: '', 
    photo_url: '', 
    envelope_text: 'Please join us',
    loader_type: 'envelope',
    show_map: false,
    google_maps_link: '',
  };

  const [formData, setFormData] = useState(initialFormState);

  const fetchEvents = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/events`);
      setEvents(response.data);
    } catch (err) {
      setStatusMessage({ type: 'error', text: 'Failed to fetch events.' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, [currentView]); // Re-fetch on view change to ensure fresh data

  // Auto-switch template logic when switching tabs
  const handleNavChange = (view) => {
    setStatusMessage({ type: '', text: '' });
    if (editingEventId) handleCancelEdit();
    
    if (view === 'create_card') {
      setFormData({ ...initialFormState, invite_type: 'card', template_id: 'template_1' });
    } else if (view === 'create_web') {
      setFormData({ ...initialFormState, invite_type: 'webpage', template_id: 'template_4' });
    }
    setCurrentView(view);
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({ ...formData, [name]: type === 'checkbox' ? checked : value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatusMessage({ type: '', text: '' });
    try {
      const dateVal = new Date(formData.event_date);
      const formattedDate = dateVal.toISOString().slice(0, 19).replace('T', ' ');

      if (editingEventId) {
        await axios.put(`${import.meta.env.VITE_API_URL}/api/events/${editingEventId}`, {
          ...formData, event_date: formattedDate
        });
        setStatusMessage({ type: 'success', text: 'Invite updated successfully!' });
      } else {
        await axios.post(`${import.meta.env.VITE_API_URL}/api/events`, {
          ...formData, event_date: formattedDate
        });
        setStatusMessage({ type: 'success', text: 'Invite created successfully!' });
      }

      // Reset form but stay on the same tab
      setEditingEventId(null);
      setFormData({ 
        ...initialFormState, 
        invite_type: currentView === 'create_web' ? 'webpage' : 'card',
        template_id: currentView === 'create_web' ? 'template_4' : 'template_1'
      });
      fetchEvents();
      setTimeout(() => setCurrentView('home'), 1500); // Redirect to home after 1.5s
    } catch (err) {
      setStatusMessage({ type: 'error', text: err.response?.data?.message || 'Failed to save event.' });
    }
  };

  const handleEdit = (event) => {
    setEditingEventId(event.id);
    setCurrentView(event.invite_type === 'webpage' ? 'create_web' : 'create_card');
    
    const date = new Date(event.event_date);
    const tzOffset = date.getTimezoneOffset() * 60000;
    const localISOTime = new Date(date.getTime() - tzOffset).toISOString().slice(0, 16);

    setFormData({
      invite_type: event.invite_type || 'card',
      template_id: event.template_id || 'template_1',
      slug: event.slug || '',
      title: event.title || '',
      event_date: localISOTime,
      time_text: event.time_text || '',
      location: event.location || '',
      venue_name: event.venue_name || '',
      host_message: event.host_message || '',
      ceremony_message: event.ceremony_message || '',
      footer_text: event.footer_text || '',
      message: event.message || '',
      photo_url: event.photo_url || '',
      envelope_text: event.envelope_text || 'Please join us',
      loader_type: event.loader_type || 'envelope',
      show_map: !!event.show_map,
      google_maps_link: event.google_maps_link || '',
    });
  };

  const handleCancelEdit = () => {
    setEditingEventId(null);
    setFormData({ 
      ...initialFormState, 
      invite_type: currentView === 'create_web' ? 'webpage' : 'card',
      template_id: currentView === 'create_web' ? 'template_4' : 'template_1'
    });
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this event?')) return;
    try {
      await axios.delete(`${import.meta.env.VITE_API_URL}/api/events/${id}`);
      fetchEvents();
      if (editingEventId === id) handleCancelEdit();
    } catch (err) {
      alert('Failed to delete event.');
    }
  };

  const previewEvent = { 
    ...formData, 
    title: formData.title || "Couple Names",
    event_date: formData.event_date || new Date().toISOString()
  };

  // ------------------------- VIEWS -------------------------
  
  const renderHomeView = () => (
    <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 flex flex-col min-h-[85vh]">
      <div className="flex justify-between items-end mb-8 border-b pb-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">My Invites</h2>
          <p className="text-gray-500 text-sm mt-1">Manage all your currently active digital invitations.</p>
        </div>
        <div className="space-x-3">
          <button onClick={() => handleNavChange('create_card')} className="px-5 py-2 bg-pink-50 text-pink-700 rounded-lg hover:bg-pink-100 font-bold transition">
            + New Card
          </button>
          <button onClick={() => handleNavChange('create_web')} className="px-5 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 font-bold shadow transition">
            + New Web Page
          </button>
        </div>
      </div>
      
      {loading ? (
        <div className="flex justify-center py-20"><div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-indigo-600"></div></div>
      ) : events.length === 0 ? (
        <div className="text-center py-20 text-gray-500 bg-gray-50 rounded-xl border border-dashed border-gray-300">
           It's completely empty! Time to create an invite.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {events.map((evt) => (
            <div key={evt.id} className="relative bg-white border border-gray-200 rounded-2xl p-5 hover:shadow-xl transition-all duration-300 flex flex-col group">
              <div className="absolute top-4 right-4">
                 {evt.invite_type === 'webpage' 
                   ? <span className="bg-indigo-100 text-indigo-800 text-[10px] uppercase font-bold px-2 py-1 rounded-full">Web Page</span>
                   : <span className="bg-pink-100 text-pink-800 text-[10px] uppercase font-bold px-2 py-1 rounded-full">Card</span>
                 }
              </div>
              
              <h3 className="text-xl font-bold text-gray-900 mb-1 pr-16 truncate">{evt.title}</h3>
              <p className="text-sm font-medium text-gray-400 mb-6 flex items-center">
                 <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"></path></svg>
                 /{evt.slug}
              </p>
              
              <div className="bg-gray-50 rounded-xl p-4 mb-6 space-y-2 text-sm flex-grow">
                 <div className="flex justify-between items-center"><span className="text-gray-400">Date</span> <span className="font-semibold text-gray-700">{new Date(evt.event_date).toLocaleDateString()}</span></div>
                 <div className="flex justify-between items-center"><span className="text-gray-400">Venue</span> <span className="font-semibold text-gray-700 truncate w-32 text-right">{evt.venue_name || 'N/A'}</span></div>
              </div>

              <div className="grid grid-cols-3 gap-2 opacity-0 group-hover:opacity-100 transition duration-300">
                <button onClick={() => handleEdit(evt)} className="py-2 text-sm font-bold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 rounded-xl">Edit</button>
                <button onClick={() => { navigator.clipboard.writeText(`${window.location.origin}/invite/${evt.slug}`); alert('Copied!'); }} className="py-2 text-sm font-bold text-indigo-700 bg-indigo-50 hover:bg-indigo-100 rounded-xl">URL</button>
                <button onClick={() => handleDelete(evt.id)} className="py-2 text-sm font-bold text-red-600 bg-red-50 hover:bg-red-100 rounded-xl">Delete</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );

  const renderFormFields = (isWeb) => (
    <>
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-1">URL Slug *</label>
        <input required type="text" name="slug" value={formData.slug} onChange={handleChange} placeholder="sasa-allan" className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500" />
      </div>
      
      <div className="space-y-4">
        <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider border-b pb-1 mt-6">Entry Animation (Loader)</h3>
        <div className="grid grid-cols-2 gap-3">
           <button 
             type="button"
             onClick={() => setFormData({ ...formData, loader_type: 'envelope' })}
             className={`p-3 rounded-xl border-2 transition-all flex flex-col items-center ${formData.loader_type === 'envelope' ? 'border-indigo-600 bg-indigo-50' : 'border-gray-200 bg-white hover:border-gray-300'}`}
           >
              <div className="w-10 h-10 mb-2 flex items-center justify-center bg-white rounded-lg shadow-sm">✉️</div>
              <span className="text-[10px] font-bold uppercase tracking-tight">Modern Envelope</span>
           </button>
           <button 
             type="button"
             onClick={() => setFormData({ ...formData, loader_type: 'betel_leaves' })}
             className={`p-3 rounded-xl border-2 transition-all flex flex-col items-center ${formData.loader_type === 'betel_leaves' ? 'border-green-600 bg-green-50' : 'border-gray-200 bg-white hover:border-gray-300'}`}
           >
              <div className="w-10 h-10 mb-2 flex items-center justify-center bg-white rounded-lg shadow-sm">🍃</div>
              <span className="text-[10px] font-bold uppercase tracking-tight">Betel Leaves</span>
           </button>
        </div>
      </div>

      <div className="space-y-4">
        <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider border-b pb-1 mt-6">Content & Art</h3>
        <div>
          <label className="block text-xs font-semibold text-gray-700 mb-1">Couple Names (Title) *</label>
          <input required type="text" name="title" value={formData.title} onChange={handleChange} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-1 focus:ring-indigo-500" />
        </div>
        <div>
          <label className="block text-xs font-semibold text-gray-700 mb-1">Main Photo URL (Unsplash Link or Image URL)</label>
          <input type="text" name="photo_url" value={formData.photo_url} onChange={handleChange} placeholder="https://unsplash.com/photos/..." className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-1 focus:ring-indigo-500" />
        </div>
        <div>
          <label className="block text-xs font-semibold text-gray-700 mb-1">Envelope Opening Text (e.g. Please Join Us)</label>
          <input type="text" name="envelope_text" value={formData.envelope_text} onChange={handleChange} placeholder="Please joined us" className="w-full px-3 py-2 border border-blue-200 bg-blue-50/30 rounded-lg focus:ring-1 focus:ring-blue-500" />
        </div>
        {!isWeb && (
          <>
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">Host Message</label>
              <input type="text" name="host_message" value={formData.host_message} onChange={handleChange} className="w-full px-3 py-2 border border-gray-300 rounded-lg" />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">Ceremony Message</label>
              <textarea rows="2" name="ceremony_message" value={formData.ceremony_message} onChange={handleChange} className="w-full px-3 py-2 border border-gray-300 rounded-lg"></textarea>
            </div>
          </>
        )}
        {isWeb && (
           <div>
             <label className="block text-xs font-semibold text-gray-700 mb-1">Our Story / Paragraph Message</label>
             <textarea rows="4" name="message" value={formData.message} onChange={handleChange} placeholder="Welcome to our beautiful journey..." className="w-full px-3 py-2 border border-gray-300 rounded-lg"></textarea>
           </div>
        )}
      </div>

      <div className="space-y-4">
        <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider border-b pb-1 mt-6">Date & Location</h3>
        <div>
          <label className="block text-xs font-semibold text-gray-700 mb-1">Actual Date *</label>
          <input required type="datetime-local" name="event_date" value={formData.event_date} onChange={handleChange} className="w-full px-3 py-2 border border-gray-300 rounded-lg" />
        </div>
        {!isWeb && (
           <div>
             <label className="block text-xs font-semibold text-gray-700 mb-1">Spelled Out Time Text (Optional)</label>
             <input type="text" name="time_text" value={formData.time_text} onChange={handleChange} className="w-full px-3 py-2 border border-gray-300 rounded-lg" />
           </div>
        )}
        <div>
          <label className="block text-xs font-semibold text-gray-700 mb-1">Venue Name</label>
          <input type="text" name="venue_name" value={formData.venue_name} onChange={handleChange} className="w-full px-3 py-2 border border-gray-300 rounded-lg" />
        </div>
        <div>
          <label className="block text-xs font-semibold text-gray-700 mb-1">Venue Address</label>
          <input type="text" name="location" value={formData.location} onChange={handleChange} className="w-full px-3 py-2 border border-gray-300 rounded-lg" />
        </div>
        
        <div className="flex items-center space-x-3 pt-2">
           <input 
             type="checkbox" 
             id="show_map" 
             name="show_map" 
             checked={formData.show_map} 
             onChange={handleChange}
             className="w-4 h-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
           />
           <label htmlFor="show_map" className="text-sm font-bold text-gray-700 cursor-pointer flex items-center">
             <svg className="w-4 h-4 mr-1.5 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>
             Display Interactive Map
           </label>
        </div>
        
        {formData.show_map && (
          <div className="pt-2 animate-fade-in">
            <label className="block text-xs font-semibold text-gray-700 mb-1 flex items-center">
              Google Maps URL (Share Link)
              <span className="ml-1 text-[10px] text-indigo-400 font-normal">(Optional for precision)</span>
            </label>
            <input 
              type="text" 
              name="google_maps_link" 
              value={formData.google_maps_link} 
              onChange={handleChange} 
              placeholder="https://maps.app.goo.gl/..." 
              className="w-full px-3 py-2 border border-indigo-100 bg-indigo-50/30 rounded-lg text-xs focus:ring-1 focus:ring-indigo-500" 
            />
            <p className="text-[9px] text-gray-400 mt-1 italic">
              Tip: Go to Google Maps, find your venue, click "Share", and copy the link here.
            </p>
          </div>
        )}

        {!isWeb && (
           <div>
             <label className="block text-xs font-semibold text-gray-700 mb-1">Footer Text</label>
             <input type="text" name="footer_text" value={formData.footer_text} onChange={handleChange} className="w-full px-3 py-2 border border-gray-300 rounded-lg" />
           </div>
        )}
      </div>
    </>
  );

  const renderCreateCardView = () => (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 h-[85vh]">
      <div className="lg:col-span-5 bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col overflow-y-auto">
        <h2 className="text-2xl font-bold mb-4 text-gray-800 sticky top-0 bg-white z-20 py-2 border-b">
           {editingEventId ? 'Edit Card Options' : 'Build a Card Invite'}
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4 flex-grow relative z-10 pb-20">
          <div className="bg-pink-50 p-4 rounded-xl border border-pink-100">
            <label className="block text-sm font-bold text-pink-900 mb-2">Card Theme</label>
            <select name="template_id" value={formData.template_id} onChange={handleChange} className="w-full px-4 py-3 bg-white border border-pink-200 rounded-xl focus:ring-2 focus:ring-pink-500 font-medium">
              <option value="template_1">Template 1: Classic Floral</option>
              <option value="template_2">Template 2: Save the Date Portrait</option>
            </select>
          </div>
          {renderFormFields(false)}
          <div className="sticky bottom-0 pt-4 pb-2 bg-white flex flex-col space-y-2 border-t mt-8">
             <button type="submit" className="w-full font-bold py-4 px-4 bg-pink-600 hover:bg-pink-700 text-white rounded-xl shadow-lg transition duration-200">
               {editingEventId ? 'Save Changes' : 'Generate Aesthetic Card'}
             </button>
             {editingEventId && <button type="button" onClick={handleCancelEdit} className="py-2 text-sm font-semibold text-gray-500">Cancel</button>}
          </div>
        </form>
      </div>

      <div className="lg:col-span-7 flex flex-col bg-gray-50/50 rounded-2xl items-center justify-center relative overflow-hidden">
         <div className="absolute top-4 bg-white/80 backdrop-blur text-pink-800 text-[10px] uppercase tracking-wider px-4 py-1 rounded-full font-bold shadow-sm z-30 border border-pink-100">Live Device Simulation</div>
         <div className="relative w-[375px] h-[750px] max-h-[95%] mt-4 bg-white rounded-[3rem] border-[8px] border-gray-900 shadow-2xl overflow-hidden pointer-events-auto overflow-y-auto no-scrollbar">
            <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-40 h-6 bg-gray-900 rounded-b-xl z-50"></div>
            <div className="w-full min-h-[100%]">
              {formData.template_id === 'template_2' ? <Template2 event={previewEvent} /> : <Template1 event={previewEvent} />}
            </div>
         </div>
      </div>
    </div>
  );

  const renderCreateWebView = () => (
    <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 h-[85vh]">
      <div className="xl:col-span-4 bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col overflow-y-auto">
        <h2 className="text-2xl font-bold mb-4 text-gray-800 sticky top-0 bg-white z-20 py-2 border-b">
           {editingEventId ? 'Edit Web Options' : 'Build a Web Invite'}
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4 flex-grow relative z-10 pb-20">
          <div className="bg-indigo-50 p-4 rounded-xl border border-indigo-100">
             <label className="block text-sm font-bold text-indigo-900 mb-2">Web Theme</label>
             <select name="template_id" value={formData.template_id} onChange={handleChange} className="w-full px-4 py-3 bg-white border border-indigo-200 rounded-xl font-medium focus:ring-2 focus:ring-indigo-500">
               <option value="template_3">Template 3: Interactive Parallax</option>
               <option value="template_4">Template 4: Cinematic Animated Web</option>
             </select>
          </div>
          <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded text-sm text-blue-700">Web invites are fully responsive scrolling pages meant for detailed storytelling.</div>
          {renderFormFields(true)}
          <div className="sticky bottom-0 pt-4 pb-2 bg-white flex flex-col space-y-2 border-t mt-8">
             <button type="submit" className="w-full font-bold py-4 px-4 bg-indigo-600 hover:bg-indigo-700 text-white shadow-xl rounded-xl transition duration-200">
               {editingEventId ? 'Save Changes' : 'Publish Web Invite'}
             </button>
             {editingEventId && <button type="button" onClick={handleCancelEdit} className="py-2 text-sm font-semibold text-gray-500">Cancel</button>}
          </div>
        </form>
      </div>

      <div className="xl:col-span-8 flex flex-col bg-gray-900 rounded-2xl relative overflow-hidden shadow-inner">
         <div className="absolute top-4 left-4 bg-black/50 backdrop-blur text-white text-[10px] uppercase font-bold tracking-widest px-4 py-1.5 rounded-md z-30">Browser Simulation</div>
         <div className="w-full h-full pt-14 px-4 pb-4">
            <div className="w-full h-[100%] bg-white rounded-b-xl overflow-y-auto border-t-8 border-gray-800 shadow-2xl relative">
              {formData.template_id === 'template_4' ? <Template4 event={previewEvent} /> : <Template3 event={previewEvent} />}
            </div>
         </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 font-sans text-gray-800 flex overflow-hidden">
      
      {/* Side Navigation */}
      <aside className="w-64 bg-white border-r border-gray-200 shadow-sm flex flex-col z-50">
        <div className="h-20 flex items-center px-6 border-b border-gray-100">
          <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center mr-3 text-white font-bold text-xl leading-none">S</div>
          <span className="font-extrabold text-lg text-gray-900 tracking-tight">Syntech Invites</span>
        </div>
        <nav className="flex-grow p-4 space-y-2 mt-4">
          <button 
            onClick={() => handleNavChange('home')}
            className={`w-full text-left px-4 py-3 rounded-xl font-bold transition flex items-center ${currentView === 'home' ? 'bg-gray-100 text-indigo-700' : 'text-gray-500 hover:bg-gray-50 hover:text-gray-900'}`}
          >
            <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"></path></svg>
            My Invites
          </button>
          
          <div className="pt-6 pb-2 px-4">
             <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Create Workspace</p>
          </div>
          
          <button 
            onClick={() => handleNavChange('create_card')}
            className={`w-full text-left px-4 py-3 rounded-xl font-bold transition flex items-center ${currentView === 'create_card' ? 'bg-pink-50 text-pink-700' : 'text-gray-500 hover:bg-gray-50 hover:text-gray-900'}`}
          >
            <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"></path></svg>
            Mobile Card
          </button>
          
          <button 
            onClick={() => handleNavChange('create_web')}
            className={`w-full text-left px-4 py-3 rounded-xl font-bold transition flex items-center ${currentView === 'create_web' ? 'bg-indigo-50 text-indigo-700' : 'text-gray-500 hover:bg-gray-50 hover:text-gray-900'}`}
          >
            <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path></svg>
            Interactive Web Page
          </button>
        </nav>
      </aside>

      {/* Main Container */}
      <main className="flex-1 p-6 md:p-10 h-screen overflow-y-auto">
        <div className="max-w-[1600px] mx-auto">
          {statusMessage.text && (
            <div className={`p-4 rounded-xl font-medium mb-6 ${statusMessage.type === 'success' ? 'bg-green-100 text-green-800 border border-green-200' : 'bg-red-100 text-red-800 border border-red-200'}`}>
              {statusMessage.text}
            </div>
          )}
          
          {currentView === 'home' && renderHomeView()}
          {currentView === 'create_card' && renderCreateCardView()}
          {currentView === 'create_web' && renderCreateWebView()}
        </div>
      </main>

      <style>{`
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>
    </div>
  );
}

export default Dashboard;
