import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { FaMapMarkerAlt, FaRupeeSign, FaHome, FaSearch, FaRegSadTear } from 'react-icons/fa';
import { Link } from 'react-router-dom';

const dummyPlots = [
  {
    _id: '1',
    title: 'Sunshine Residency',
    location: 'Noida',
    price: 2500000,
    image: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb',
    seller: { username: 'seller1' },
    size: '2000 sqft',
    type: 'Residential',
  },
  {
    _id: '2',
    title: 'Green Valley',
    location: 'Lucknow',
    price: 1800000,
    image: 'https://images.unsplash.com/photo-1464983953574-0892a716854b',
    seller: { username: 'seller2' },
    size: '1500 sqft',
    type: 'Commercial',
  },
  {
    _id: '3',
    title: 'Urban Heights',
    location: 'Pune',
    price: 3200000,
    image: 'https://images.unsplash.com/photo-1507089947368-19c1da9775ae',
    seller: { username: 'seller3' },
    size: '1800 sqft',
    type: 'Residential',
  },
];

export default function BrowsePlots() {
  const [plots, setPlots] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [search, setSearch] = useState('');
  const [location, setLocation] = useState('');
  const [type, setType] = useState('');
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [minSize, setMinSize] = useState('');
  const [maxSize, setMaxSize] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [bookingModal, setBookingModal] = useState({ open: false, plot: null });
  const [bookingForm, setBookingForm] = useState({ name: '', email: '', phone: '', message: '' });
  const [bookingStatus, setBookingStatus] = useState('');
  const [imageErrors, setImageErrors] = useState({});

  useEffect(() => {
    setLoading(true);
    setError('');
    fetch('http://localhost:5000/api/plots')
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data) && data.length > 0) {
          setPlots(data);
        } else {
          setPlots(dummyPlots);
        }
      })
      .catch(() => {
        setPlots(dummyPlots);
        setError('Failed to load real plots. Showing demo data.');
      })
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    let data = plots;
    if (search) {
      data = data.filter(p => p.title.toLowerCase().includes(search.toLowerCase()) || p.location.toLowerCase().includes(search.toLowerCase()));
    }
    if (location) {
      data = data.filter(p => p.location.toLowerCase().includes(location.toLowerCase()));
    }
    if (type) {
      data = data.filter(p => p.type && p.type.toLowerCase() === type.toLowerCase());
    }
    if (minPrice) {
      data = data.filter(p => p.price >= Number(minPrice));
    }
    if (maxPrice) {
      data = data.filter(p => p.price <= Number(maxPrice));
    }
    if (minSize) {
      data = data.filter(p => p.size && p.size >= Number(minSize));
    }
    if (maxSize) {
      data = data.filter(p => p.size && p.size <= Number(maxSize));
    }
    setFiltered(data);
  }, [search, location, type, minPrice, maxPrice, minSize, maxSize, plots]);

  // Collect unique locations and types for filter dropdowns
  const locations = Array.from(new Set(plots.map(p => p.location))).filter(Boolean);
  const types = Array.from(new Set(plots.map(p => p.type))).filter(Boolean);

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
    <section className="bg-[#F3F4F6] min-h-[80vh]">
      <div className="container mx-auto px-4 pt-8 pb-4 flex flex-wrap gap-4 items-center justify-center">
        <div className="flex items-center bg-white rounded-lg shadow px-4 py-2 w-full max-w-xs">
          <FaSearch className="text-blue-400 mr-2" />
          <input type="text" placeholder="Search by title or location" className="bg-transparent outline-none w-full text-lg" value={search} onChange={e => setSearch(e.target.value)} />
        </div>
        <select className="rounded-lg px-4 py-2 border border-blue-100 bg-white text-blue-700" value={location} onChange={e => setLocation(e.target.value)}>
          <option value="">All Locations</option>
          {locations.map(loc => <option key={loc} value={loc}>{loc}</option>)}
        </select>
        <select className="rounded-lg px-4 py-2 border border-blue-100 bg-white text-blue-700" value={type} onChange={e => setType(e.target.value)}>
          <option value="">All Types</option>
          {types.map(t => <option key={t} value={t}>{t}</option>)}
        </select>
        <input type="number" placeholder="Min ₹" className="rounded-lg px-4 py-2 border border-blue-100 bg-white text-blue-700 w-28" value={minPrice} onChange={e => setMinPrice(e.target.value)} min={0} />
        <input type="number" placeholder="Max ₹" className="rounded-lg px-4 py-2 border border-blue-100 bg-white text-blue-700 w-28" value={maxPrice} onChange={e => setMaxPrice(e.target.value)} min={0} />
        <input type="text" placeholder="Min Size" className="rounded-lg px-4 py-2 border border-blue-100 bg-white text-blue-700 w-28" value={minSize} onChange={e => setMinSize(e.target.value)} min={0} />
        <input type="text" placeholder="Max Size" className="rounded-lg px-4 py-2 border border-blue-100 bg-white text-blue-700 w-28" value={maxSize} onChange={e => setMaxSize(e.target.value)} min={0} />
      </div>
      <div className="container mx-auto px-4 mb-8">
        <h3 className="text-lg font-bold text-blue-700 mb-4">Sample Plots</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
          {dummyPlots.map(plot => (
            <div key={plot._id} className="bg-blue-50 rounded-2xl shadow-lg p-6 flex flex-col items-start border-t-4 border-blue-400">
              <img src={plot.image} alt={plot.title} className="w-full h-40 object-cover rounded mb-3" />
              <div className="font-bold text-xl text-blue-800 mb-1">{plot.title}</div>
              <div className="flex items-center text-blue-600 mb-1"><FaMapMarkerAlt className="mr-1" /> {plot.location}</div>
              <div className="flex items-center text-green-700 mb-1 text-lg font-semibold"><FaRupeeSign className="mr-1" /> {plot.price?.toLocaleString()}</div>
              <div className="flex items-center text-gray-600 mb-1"><FaHome className="mr-1" /> {plot.type || 'N/A'}</div>
              <div className="text-gray-500 mb-2">Size: {plot.size || 'N/A'}</div>
              <button className="mt-auto w-full bg-blue-600 text-white py-2 rounded-lg font-bold hover:bg-blue-700 transition shadow">Book now</button>
            </div>
          ))}
        </div>
      </div>
      <div className="container mx-auto px-4 pb-12 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
        {loading ? (
          <div className="col-span-full text-center text-blue-600 text-lg py-12">Loading plots...</div>
        ) : error && plots.length === 0 ? (
          <div className="col-span-full text-center text-red-500 py-12">{error}</div>
        ) : (
          plots.map(plot => (
            <div key={plot._id} className="bg-white rounded-2xl shadow-lg p-6 flex flex-col items-start border-t-4 border-blue-400 hover:scale-105 hover:shadow-2xl transition-transform duration-300 group">
              <img
                src={getImageSrc(plot)}
                alt={plot.title}
                className="w-full h-40 object-cover rounded mb-3"
                onError={() => handleImageError(plot._id)}
              />
              <div className="font-bold text-xl text-blue-800 mb-1">{plot.title}</div>
              <div className="flex items-center text-blue-600 mb-1"><FaMapMarkerAlt className="mr-1" /> {plot.location}</div>
              <div className="flex items-center text-green-700 mb-1 text-lg font-semibold"><FaRupeeSign className="mr-1" /> {plot.price?.toLocaleString()}</div>
              <div className="flex items-center text-gray-600 mb-1"><FaHome className="mr-1" /> {plot.type || 'N/A'}</div>
              <div className="text-gray-500 mb-2">Size: {plot.size || 'N/A'}</div>
              <button
                onClick={() => openBookingModal(plot)}
                className="mt-auto w-full bg-blue-600 text-white py-2 rounded-lg font-bold hover:bg-blue-700 transition shadow"
              >
                Book Now
              </button>
            </div>
          ))
        )}
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
    </section>
  );
} 