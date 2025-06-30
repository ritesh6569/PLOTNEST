import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { FaClipboardList, FaSearch, FaUserCircle, FaClock, FaEnvelopeOpenText, FaHome } from 'react-icons/fa';
import DealChat from '../components/DealChat';
import axios from 'axios';

function getGreeting() {
  const hour = new Date().getHours();
  if (hour < 12) return 'Good morning';
  if (hour < 18) return 'Good afternoon';
  return 'Good evening';
}

const dummyInquiries = [
  { id: 1, plot: 'Sunshine Residency', date: '2024-06-01', status: 'Pending' },
  { id: 2, plot: 'Green Valley', date: '2024-06-02', status: 'Replied' },
];
const dummyBookings = [
  { id: 1, plot: 'Urban Heights', date: '2024-06-03', status: 'Confirmed' },
];
const dummyNewPlots = 5;

export default function BuyerDashboard() {
  const user = JSON.parse(localStorage.getItem('userInfo'));
  const [inquiries, setInquiries] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [newPlots, setNewPlots] = useState(dummyNewPlots);
  const [showDealModal, setShowDealModal] = useState(false);
  const [selectedDeal, setSelectedDeal] = useState(null);
  const [plots, setPlots] = useState([]);
  const [inquiry, setInquiry] = useState({ name: '', email: '', message: '' });
  const [message, setMessage] = useState('');
  const [imageErrors, setImageErrors] = useState({});
  const [bookingModal, setBookingModal] = useState({ open: false, plot: null });
  const [bookingForm, setBookingForm] = useState({ name: '', email: '', phone: '', message: '' });
  const [bookingStatus, setBookingStatus] = useState('');

  useEffect(() => {
    setLoading(true);
    setError('');
    const token = localStorage.getItem('userToken');
    if (!token) {
      setInquiries(dummyInquiries);
      setBookings(dummyBookings);
      setLoading(false);
      return;
    }
    Promise.all([
      fetch('http://localhost:5000/api/inquiries', {
        headers: { Authorization: `Bearer ${token}` }
      }).then(res => res.json()).catch(() => dummyInquiries),
      fetch('http://localhost:5000/api/bookings', {
        headers: { Authorization: `Bearer ${token}` }
      }).then(res => res.json()).catch(() => dummyBookings),
      fetch('http://localhost:5000/api/plots').then(res => res.json()).catch(() => Array(dummyNewPlots).fill({}))
    ])
      .then(([inq, book, plots]) => {
        setInquiries(Array.isArray(inq) ? inq.filter(b => b.email === user?.email) : dummyInquiries);
        setBookings(Array.isArray(book) ? book.filter(b => b.email === user?.email) : dummyBookings);
        setNewPlots(Array.isArray(plots) ? plots.length : dummyNewPlots);
      })
      .catch(() => {
        setInquiries(dummyInquiries);
        setBookings(dummyBookings);
        setNewPlots(dummyNewPlots);
        setError('Failed to load some data. Showing demo info.');
      })
      .finally(() => setLoading(false));
  }, [user]);

  useEffect(() => {
    axios.get('http://localhost:5000/api/plots').then(res => setPlots(res.data));
  }, []);

  const handleImageError = (plotId) => {
    setImageErrors(prev => ({ ...prev, [plotId]: true }));
  };

  const getImageSrc = (plot) => {
    if (imageErrors[plot._id]) {
      return 'https://images.unsplash.com/photo-1506744038136-46273834b3fb';
    }
    if (plot.image && plot.image.startsWith('/uploads/')) {
      return `http://localhost:5000${plot.image}`;
    }
    if (plot.image && plot.image.startsWith('http')) {
      return plot.image;
    }
    return 'https://images.unsplash.com/photo-1506744038136-46273834b3fb';
  };

  const handleInquiry = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:5000/api/inquiries', { ...inquiry, type: 'plot' });
      setMessage('Inquiry sent successfully!');
      setInquiry({ name: '', email: '', message: '' });
    } catch (err) {
      setMessage('Error sending inquiry. Please try again.');
    }
  };

  const openBookingModal = (plot) => {
    setBookingModal({ open: true, plot });
    setBookingForm({ name: '', email: '', phone: '', message: '' });
    setBookingStatus('');
  };
  const closeBookingModal = () => {
    setBookingModal({ open: false, plot: null });
    setBookingStatus('');
  };
  const handleBookingChange = (e) => {
    setBookingForm(f => ({ ...f, [e.target.name]: e.target.value }));
  };
  const handleBookingSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:5000/api/bookings', {
        ...bookingForm,
        plotId: bookingModal.plot._id,
        plotTitle: bookingModal.plot.title,
      });
      setBookingStatus('Booking request sent!');
      setTimeout(() => closeBookingModal(), 1500);
    } catch (err) {
      setBookingStatus('Error sending booking.');
    }
  };

  return (
    <section className="min-h-screen flex flex-col items-center justify-center py-12 bg-gradient-to-br from-blue-50 via-white to-green-50">
      <div className="w-full max-w-4xl bg-white/90 rounded-3xl shadow-2xl p-10 flex flex-col items-center border border-blue-100 backdrop-blur-md">
        <div className="flex flex-col items-center mb-6">
          <FaUserCircle className="text-5xl text-blue-400 mb-2" />
          <div className="text-2xl font-bold text-blue-800 mb-1">{getGreeting()}, {user?.username || 'Buyer'}!</div>
          <div className="text-gray-500 text-center">Welcome to your buyer dashboard.</div>
        </div>
        {/* Quick Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 w-full mb-8">
          <div className="bg-blue-50 rounded-xl p-6 flex flex-col items-center shadow">
            <FaClipboardList className="text-2xl text-blue-600 mb-1" />
            <div className="text-lg font-bold text-blue-800">{inquiries.length}</div>
            <div className="text-gray-600 text-sm">My Inquiries</div>
          </div>
          <div className="bg-green-50 rounded-xl p-6 flex flex-col items-center shadow">
            <FaEnvelopeOpenText className="text-2xl text-green-600 mb-1" />
            <div className="text-lg font-bold text-green-800">{bookings.length}</div>
            <div className="text-gray-600 text-sm">My Bookings</div>
          </div>
          <div className="bg-yellow-50 rounded-xl p-6 flex flex-col items-center shadow">
            <FaHome className="text-2xl text-yellow-600 mb-1" />
            <div className="text-lg font-bold text-yellow-800">{newPlots}</div>
            <div className="text-gray-600 text-sm">New Plots</div>
          </div>
        </div>
        {/* Action Center */}
        <div className="flex flex-col sm:flex-row gap-4 mb-8 w-full justify-center">
          <Link to="/buyer/plots" className="bg-blue-600 text-white px-6 py-3 rounded-xl font-bold flex items-center gap-2 shadow hover:bg-blue-700 transition text-lg justify-center"><FaSearch /> Browse Plots</Link>
          <Link to="/buyer/inquiries" className="bg-green-600 text-white px-6 py-3 rounded-xl font-bold flex items-center gap-2 shadow hover:bg-green-700 transition text-lg justify-center"><FaClipboardList /> My Inquiries</Link>
        </div>
        {/* Recent Activity */}
        <div className="w-full">
          <h3 className="text-xl font-bold text-blue-700 mb-4">Recent Activity</h3>
          {/* Sample Activity always visible for demo */}
          <div className="mb-8 w-full">
            <h4 className="text-lg font-bold text-blue-700 mb-2">Sample Activity</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-blue-50 rounded-xl p-4 shadow flex flex-col">
                <h5 className="font-bold text-blue-800 mb-2">Sample Inquiries</h5>
                <ul>
                  {dummyInquiries.map(i => (
                    <li key={i.id} className="mb-2 flex items-center gap-2 cursor-pointer hover:bg-blue-100 rounded px-2 py-1" onClick={() => { setSelectedDeal({ _id: i.id, plot: i.plot, status: i.status, date: i.date }); setShowDealModal(true); }}>
                      <FaClipboardList className="text-blue-400" />
                      <span className="font-semibold text-blue-900">{i.plot}</span>
                      <span className="text-xs bg-blue-100 text-blue-700 rounded px-2 py-0.5 ml-2">{i.status}</span>
                      <span className="text-xs text-gray-400 ml-auto">{i.date}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="bg-green-50 rounded-xl p-4 shadow flex flex-col">
                <h5 className="font-bold text-green-800 mb-2">Sample Bookings</h5>
                <ul>
                  {dummyBookings.map(b => (
                    <li key={b.id} className="mb-2 flex items-center gap-2">
                      <FaEnvelopeOpenText className="text-green-400" />
                      <span className="font-semibold text-green-900">{b.plot}</span>
                      <span className="text-xs bg-green-100 text-green-700 rounded px-2 py-0.5 ml-2">{b.status}</span>
                      <span className="text-xs text-gray-400 ml-auto">{b.date}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
          {/* Deal Details Modal for Buyer */}
          {showDealModal && selectedDeal && (
            <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
              <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md relative">
                <button className="absolute top-2 right-2 text-xl" onClick={() => setShowDealModal(false)}>&times;</button>
                <h2 className="text-xl font-bold mb-2">Deal Details</h2>
                <div className="mb-2"><strong>Plot:</strong> {selectedDeal.plot}</div>
                <div className="mb-2"><strong>Status:</strong> {selectedDeal.status}</div>
                <div className="mb-2"><strong>Date:</strong> {selectedDeal.date}</div>
                {/* Chat for this deal */}
                <DealChat
                  dealId={selectedDeal._id}
                  userId={user?._id || 'dummyBuyerId'}
                  username={user?.username || 'Buyer'}
                />
              </div>
            </div>
          )}
          {loading ? (
            <div className="flex justify-center items-center py-8"><FaClock className="animate-spin text-2xl text-blue-600 mr-2" /> Loading...</div>
          ) : error ? (
            <div className="text-red-500 text-center py-8">{error}</div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-blue-50 rounded-xl p-4 shadow flex flex-col">
                <h4 className="font-bold text-blue-800 mb-2">Recent Inquiries</h4>
                {inquiries.length === 0 ? <div className="text-gray-400">No inquiries yet.</div> : (
                  <ul>
                    {inquiries.slice(0, 3).map(i => (
                      <li key={i.id || i._id} className="mb-2 flex items-center gap-2">
                        <FaClipboardList className="text-blue-400" />
                        <span className="font-semibold text-blue-900">{i.plot || i.plotTitle}</span>
                        <span className="text-xs bg-blue-100 text-blue-700 rounded px-2 py-0.5 ml-2">{i.status || 'Pending'}</span>
                        <span className="text-xs text-gray-400 ml-auto">{i.date ? new Date(i.date).toLocaleDateString() : ''}</span>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
              <div className="bg-green-50 rounded-xl p-4 shadow flex flex-col">
                <h4 className="font-bold text-green-800 mb-2">Recent Bookings</h4>
                {bookings.length === 0 ? <div className="text-gray-400">No bookings yet.</div> : (
                  <ul>
                    {bookings.slice(0, 3).map(b => (
                      <li key={b.id || b._id} className="mb-2 flex items-center gap-2">
                        <FaEnvelopeOpenText className="text-green-400" />
                        <span className="font-semibold text-green-900">{b.plot || b.plotTitle}</span>
                        <span className="text-xs bg-green-100 text-green-700 rounded px-2 py-0.5 ml-2">{b.status || 'Confirmed'}</span>
                        <span className="text-xs text-gray-400 ml-auto">{b.date ? new Date(b.date).toLocaleDateString() : ''}</span>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
          )}
        </div>
        {/* Inquiry Section */}
        <div className="container mx-auto px-4 mb-12 flex justify-center">
          <div className="bg-white rounded-lg shadow-lg p-8 max-w-lg w-full border border-[#6EE7B7]">
            <h3 className="text-2xl font-bold text-[#334155] mb-2 text-center">Interested? Send an Inquiry</h3>
            <form onSubmit={handleInquiry}>
              <input className="border border-[#6EE7B7] bg-white text-[#1E293B] p-2 rounded w-full mb-2 placeholder-black focus:border-[#10B981]" placeholder="Your Name" value={inquiry.name} onChange={e => setInquiry(f => ({ ...f, name: e.target.value }))} required />
              <input className="border border-[#6EE7B7] bg-white text-[#1E293B] p-2 rounded w-full mb-2 placeholder-black focus:border-[#10B981]" placeholder="Your Email" value={inquiry.email} onChange={e => setInquiry(f => ({ ...f, email: e.target.value }))} required />
              <textarea className="border border-[#6EE7B7] bg-white text-[#1E293B] p-2 rounded w-full mb-2 placeholder-black focus:border-[#10B981]" placeholder="Message" value={inquiry.message} onChange={e => setInquiry(f => ({ ...f, message: e.target.value }))} required />
              <button className="bg-[#10B981] text-white px-4 py-2 rounded font-bold w-full hover:bg-[#059669] transition" type="submit">Send Inquiry</button>
            </form>
            {message && <div className="text-green-600 font-bold mt-2 text-center">{message}</div>}
          </div>
        </div>
        {/* Booking Modal */}
        {bookingModal.open && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
            <div className="bg-white rounded-lg shadow-lg p-8 w-full max-w-md relative">
              <button className="absolute top-2 right-2 text-gray-400 hover:text-gray-700 text-2xl" onClick={closeBookingModal}>&times;</button>
              <h3 className="text-2xl font-bold text-[#334155] mb-4 text-center">Book Plot: <span className="text-[#10B981]">{bookingModal.plot.title}</span></h3>
              <form onSubmit={handleBookingSubmit} className="space-y-4">
                <input name="name" className="border border-[#6EE7B7] bg-white text-[#1E293B] p-2 rounded w-full placeholder-black focus:border-[#10B981]" placeholder="Your Name" value={bookingForm.name} onChange={handleBookingChange} required />
                <input name="email" type="email" className="border border-[#6EE7B7] bg-white text-[#1E293B] p-2 rounded w-full placeholder-black focus:border-[#10B981]" placeholder="Your Email" value={bookingForm.email} onChange={handleBookingChange} required />
                <input name="phone" className="border border-[#6EE7B7] bg-white text-[#1E293B] p-2 rounded w-full placeholder-black focus:border-[#10B981]" placeholder="Phone (optional)" value={bookingForm.phone} onChange={handleBookingChange} />
                <textarea name="message" className="border border-[#6EE7B7] bg-white text-[#1E293B] p-2 rounded w-full placeholder-black focus:border-[#10B981]" placeholder="Message (optional)" value={bookingForm.message} onChange={handleBookingChange} />
                <button className="bg-[#10B981] text-white px-4 py-2 rounded font-bold w-full hover:bg-[#059669] transition" type="submit">Send Booking</button>
              </form>
              {bookingStatus && <div className="mt-4 text-center font-bold text-[#10B981]">{bookingStatus}</div>}
            </div>
          </div>
        )}
      </div>
    </section>
  );
} 