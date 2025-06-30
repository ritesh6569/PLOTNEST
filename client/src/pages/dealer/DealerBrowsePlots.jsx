import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FaMapMarkerAlt, FaRupeeSign, FaHome, FaUserTie, FaHandshake } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

export default function DealerBrowsePlots() {
  const [plots, setPlots] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    setLoading(true);
    setError('');
    axios.get('http://localhost:5000/api/plots')
      .then(res => {
        if (Array.isArray(res.data) && res.data.length > 0) {
          setPlots(res.data);
        } else {
          setPlots([]);
          setError('No plots found.');
        }
      })
      .catch(() => {
        setPlots([]);
        setError('Failed to load plots.');
      })
      .finally(() => setLoading(false));
  }, []);

  // Handler for Match Buyer/Seller button
  const handleMatch = (plot) => {
    navigate(`/dealer/matching/${plot._id}`);
  };

  return (
    <section className="bg-[#F3F4F6] min-h-[80vh] py-8">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-yellow-700 mb-8 text-center">Browse Plots (Dealer)</h2>
        {loading ? (
          <div className="flex justify-center items-center py-12">
            <span className="text-2xl font-bold text-yellow-700 animate-pulse">Loading plots...</span>
          </div>
        ) : error ? (
          <div className="flex justify-center items-center py-12">
            <span className="text-red-600 text-lg">{error}</span>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
            {plots.map(plot => (
              <div
                key={plot._id}
                className="bg-white rounded-2xl shadow-lg p-6 flex flex-col items-start border-t-4 border-yellow-400 hover:scale-105 hover:shadow-2xl transition-transform duration-300 group"
              >
                <img
                  src={
                    plot.image && (plot.image.startsWith('http://') || plot.image.startsWith('https://'))
                      ? plot.image
                      : plot.image && plot.image.startsWith('/uploads/')
                        ? `http://localhost:5000${plot.image}`
                        : 'https://via.placeholder.com/300x200?text=No+Image'
                  }
                  alt={plot.title}
                  className="w-full h-40 object-cover rounded mb-3"
                  onError={e => { e.target.onerror = null; e.target.src = 'https://via.placeholder.com/300x200?text=No+Image'; }}
                />
                <div className="font-bold text-xl text-yellow-800 mb-1">{plot.title}</div>
                <div className="flex items-center text-yellow-600 mb-1">
                  <FaMapMarkerAlt className="mr-1" /> {plot.location}
                </div>
                <div className="flex items-center text-green-700 mb-1 text-lg font-semibold">
                  <FaRupeeSign className="mr-1" /> {plot.price?.toLocaleString()}
                </div>
                <div className="flex items-center text-gray-600 mb-1">
                  <FaHome className="mr-1" /> {plot.type || 'N/A'}
                </div>
                <div className="flex items-center text-blue-700 mb-2">
                  <FaUserTie className="mr-1" /> {plot.seller?.username || plot.seller || 'N/A'}
                </div>
                <button
                  className="mt-auto w-full bg-yellow-500 text-white py-2 rounded-lg font-bold hover:bg-yellow-600 transition shadow flex items-center justify-center gap-2"
                  onClick={() => handleMatch(plot)}
                >
                  <FaHandshake /> Match Buyer/Seller
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
} 