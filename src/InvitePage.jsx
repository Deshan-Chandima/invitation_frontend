import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import Template1 from './templates/Template1';
import Template2 from './templates/Template2';
import Template3 from './templates/Template3';
import Template4 from './templates/Template4';
import EnvelopePremium from './components/EnvelopePremium';
import BetelLeavesLoader from './components/BetelLeavesLoader';

function InvitePage() {
  const { slug } = useParams();
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [envelopeOpened, setEnvelopeOpened] = useState(false);

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/events/${slug}`);
        setEvent(response.data);
        setLoading(false);
      } catch (err) {
        setLoading(false);
        if (err.response && err.response.status === 404) {
          setError('Invitation not found.');
        } else {
          setError('Failed to fetch invitation details.');
        }
      }
    };
    fetchEvent();
  }, [slug]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#f8f5f2] flex items-center justify-center p-4">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-800"></div>
      </div>
    );
  }

  if (error || !event) {
    return (
      <div className="min-h-screen bg-[#f8f5f2] flex items-center justify-center p-4">
        <div className="bg-white border border-gray-200 p-8 rounded shadow-lg max-w-md w-full text-center">
          <h2 className="text-2xl font-serif mb-2 text-gray-800">Oops!</h2>
          <p className="text-gray-600">{error || 'Event not found'}</p>
        </div>
      </div>
    );
  }

  const renderTemplate = () => {
    switch (event.template_id) {
      case 'template_4':
        return <Template4 event={event} />;
      case 'template_3':
        return <Template3 event={event} />;
      case 'template_2':
        return <Template2 event={event} />;
      case 'template_1':
      default:
        return <Template1 event={event} />;
    }
  };

  const renderLoader = () => {
    if (event.loader_type === 'betel_leaves') {
      return <BetelLeavesLoader event={event} onOpenComplete={() => setEnvelopeOpened(true)} />;
    }
    return <EnvelopePremium event={event} onOpenComplete={() => setEnvelopeOpened(true)} />;
  };

  return (
    <>
      {!envelopeOpened && event && renderLoader()}
      {renderTemplate()}
    </>
  );
}

export default InvitePage;
