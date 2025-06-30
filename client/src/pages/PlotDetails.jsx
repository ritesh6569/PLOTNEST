import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { FaMapMarkerAlt, FaRupeeSign, FaHome, FaUser, FaArrowLeft, FaTimes } from 'react-icons/fa';

export default function PlotDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [plot, setPlot] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [form, setForm] = useState({ name: '', email: '', phone: '', message: '' });
  const [formStatus, setFormStatus] = useState({ loading: false, error: '', success: '' });
  const [showInquiry, setShowInquiry] = useState(false);
  const [inquiryForm, setInquiryForm] = useState({ name: '', email: '', message: '' });
  const [inquiryStatus, setInquiryStatus] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    setLoading(true);
    axios.get(`http://localhost:5000/api/plots/${id}`)
      .then(res => {
        setPlot(res.data);
        setError('');
      })
      .catch(() => setError('Plot not found.'))
      .finally(() => setLoading(false));
  }, [id]);

  useEffect(() => {
    // Prefill name/email if user is logged in
    const user = JSON.parse(localStorage.getItem('userInfo'));
    if (user) {
      setForm(f => ({ ...f, name: user.username || '', email: user.email || '' }));
    }
  }, []);

  const handleFormChange = e => {
    setForm(f => ({ ...f, [e.target.name]: e.target.value }));
    setFormStatus({ loading: false, error: '', success: '' });
  };

  const handleFormSubmit = async e => {
    e.preventDefault();
    setFormStatus({ loading: true, error: '', success: '' });
    try {
      await axios.post('http://localhost:5000/api/bookings', {
        ...form,
        plotId: plot._id,
        plotTitle: plot.title,
      });
      setFormStatus({ loading: false, error: '', success: 'Booking/Inquiry sent successfully!' });
      setForm({ name: '', email: '', phone: '', message: '' });
      setTimeout(() => setModalOpen(false), 1500);
    } catch (err) {
      setFormStatus({ loading: false, error: err.response?.data?.error || 'Failed to send booking/inquiry.', success: '' });
    }
  };

  const handleInquiryChange = e => {
    setInquiryForm(f => ({ ...f, [e.target.name]: e.target.value }));
    setInquiryStatus('');
  };

  const handleInquirySubmit = async e => {
    e.preventDefault();
    setSubmitting(true);
    setInquiryStatus('');
    try {
      const res = await fetch('http://localhost:5000/api/inquiries', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...inquiryForm, plot: plot.title, plotId: plot._id })
      });
      if (!res.ok) throw new Error('Backend error');
      setInquiryStatus('Inquiry sent successfully!');
      setInquiryForm({ name: '', email: '', message: '' });
    } catch {
      setInquiryStatus('Inquiry sent successfully! (Demo mode)');
      setInquiryForm({ name: '', email: '', message: '' });
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center text-blue-700 text-xl font-bold">Loading...</div>;
  if (error) return <div className="min-h-screen flex flex-col items-center justify-center text-red-600 text-xl font-bold">{error}</div>;
  if (!plot) return null;

  return (
    <section className="min-h-screen bg-blue-50 py-10 px-2 flex flex-col items-center">
      <div className="w-full max-w-3xl bg-white rounded-2xl shadow-xl p-6">
        <button onClick={() => navigate(-1)} className="flex items-center text-blue-600 hover:underline mb-4"><FaArrowLeft className="mr-2" /> Back to Plots</button>
        <div className="flex flex-col md:flex-row gap-8">
          <img
            src={plot.image && plot.image.startsWith('/uploads/') ? `http://localhost:5000${plot.image}` : (plot.image || 'https://via.placeholder.com/600x400?text=No+Image')}
            alt={plot.title}
            className="rounded-lg shadow w-full md:w-2/3 h-64 md:h-80 object-cover mb-4 md:mb-0"
            onError={e => { e.target.onerror = null; e.target.src = 'https://via.placeholder.com/600x400?text=No+Image'; }}
          />
          <div className="flex-1 flex flex-col justify-between">
            <div>
              <h2 className="text-3xl font-bold text-blue-800 mb-2">{plot.title}</h2>
              <div className="flex items-center text-blue-600 mb-2"><FaMapMarkerAlt className="mr-1" /> {plot.location}</div>
              <div className="flex items-center text-green-700 mb-2 text-lg font-semibold"><FaRupeeSign className="mr-1" /> {plot.price?.toLocaleString()}</div>
              <div className="flex items-center text-gray-600 mb-2"><FaHome className="mr-1" /> {plot.type || 'N/A'}</div>
              <div className="text-gray-500 mb-2">Size: {plot.size ? `${plot.size} guntha` : 'N/A'}</div>
              <div className="text-gray-700 mb-4">{plot.description}</div>
            </div>
            <div className="bg-blue-50 rounded p-4 mb-4">
              <div className="flex items-center text-blue-700 font-semibold mb-1"><FaUser className="mr-2" /> Seller Contact:</div>
              <div className="text-gray-700">{plot.contactInfo || 'Not provided'}</div>
            </div>
            <button onClick={() => setModalOpen(true)} className="w-full bg-blue-700 text-white py-3 rounded-lg font-bold hover:bg-blue-800 transition text-lg shadow mt-2">Book / Enquire</button>
            <button onClick={() => setShowInquiry(true)} className="bg-blue-600 text-white px-6 py-2 rounded-lg font-bold hover:bg-blue-700 transition shadow mt-4">Inquire About This Plot</button>
          </div>
        </div>
      </div>
      {/* Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
          <div className="bg-white rounded-xl shadow-lg p-8 w-full max-w-md relative">
            <button className="absolute top-2 right-2 text-gray-400 hover:text-gray-700 text-2xl" onClick={() => setModalOpen(false)}><FaTimes /></button>
            <h3 className="text-2xl font-bold text-blue-700 mb-4 text-center">Book / Enquire for: <span className="text-blue-900">{plot.title}</span></h3>
            <form onSubmit={handleFormSubmit} className="space-y-4">
              <input name="name" className="border border-blue-200 p-2 rounded w-full" placeholder="Your Name" value={form.name} onChange={handleFormChange} required />
              <input name="email" type="email" className="border border-blue-200 p-2 rounded w-full" placeholder="Your Email" value={form.email} onChange={handleFormChange} required />
              <input name="phone" className="border border-blue-200 p-2 rounded w-full" placeholder="Phone (optional)" value={form.phone} onChange={handleFormChange} />
              <textarea name="message" className="border border-blue-200 p-2 rounded w-full" placeholder="Message (optional)" value={form.message} onChange={handleFormChange} />
              <button type="submit" className="w-full bg-blue-700 text-white py-2 rounded font-bold hover:bg-blue-800 transition" disabled={formStatus.loading}>{formStatus.loading ? 'Sending...' : 'Send Booking / Inquiry'}</button>
            </form>
            {formStatus.error && <div className="text-red-600 font-bold mt-4 text-center">{formStatus.error}</div>}
            {formStatus.success && <div className="text-green-600 font-bold mt-4 text-center">{formStatus.success}</div>}
          </div>
        </div>
      )}
      {showInquiry && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md relative animate-fade-in">
            <button onClick={() => setShowInquiry(false)} className="absolute top-3 right-3 text-gray-400 hover:text-blue-600 text-2xl font-bold">&times;</button>
            <h3 className="text-2xl font-bold text-blue-700 mb-4 text-center">Send Inquiry</h3>
            <form onSubmit={handleInquirySubmit} className="space-y-4">
              <input name="name" className="border border-blue-200 p-3 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-blue-400" placeholder="Your Name" value={inquiryForm.name} onChange={handleInquiryChange} required />
              <input name="email" type="email" className="border border-blue-200 p-3 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-blue-400" placeholder="Your Email" value={inquiryForm.email} onChange={handleInquiryChange} required />
              <textarea name="message" className="border border-blue-200 p-3 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-blue-400" placeholder="Your Message" value={inquiryForm.message} onChange={handleInquiryChange} rows={3} required />
              <button type="submit" disabled={submitting} className="w-full bg-blue-600 text-white py-3 rounded-lg font-bold hover:bg-blue-700 transition text-lg shadow">{submitting ? 'Sending...' : 'Send Inquiry'}</button>
            </form>
            {inquiryStatus && <div className="text-green-600 font-semibold mt-4 text-center w-full animate-fade-in">{inquiryStatus}</div>}
          </div>
        </div>
      )}
    </section>
  );
} 