import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { FaMapMarkerAlt, FaRupeeSign, FaHome } from 'react-icons/fa';

const heroImage = 'https://images.unsplash.com/photo-1464983953574-0892a716854b';
const demoImage = 'https://images.unsplash.com/photo-1506744038136-46273834b3fb';

export default function PlotMarket() {
  const [plots, setPlots] = useState([]);
  const [imageErrors, setImageErrors] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    axios.get('https://plotnest.onrender.com/api/plots').then(res => {
      setPlots(res.data);
      setLoading(false);
    }).catch(err => {
      setError(err.response?.data?.message || 'An error occurred');
      setLoading(false);
    });
  }, []);

  const handleImageError = (plotId) => {
    setImageErrors(prev => ({ ...prev, [plotId]: true }));
  };

  const getImageSrc = (plot) => {
    if (imageErrors[plot._id]) {
      return demoImage;
    }
    if (plot.image && plot.image.startsWith('/uploads/')) {
      const imageUrl = `https://plotnest.onrender.com${plot.image}`;
      return imageUrl;
    }
    if (plot.image && plot.image.startsWith('http')) {
      return plot.image;
    }
    return demoImage;
  };

  return (
    <section className="bg-[#F3F4F6] min-h-[80vh]">
      <div className="relative w-full h-64 md:h-80 flex items-center justify-center mb-12">
        <img src={heroImage} alt="Plots" className="absolute inset-0 w-full h-full object-cover opacity-70" />
        <div className="absolute inset-0 bg-[#10B981] opacity-30" />
        <div className="relative z-10 text-center">
          <h2 className="text-4xl md:text-5xl font-bold text-[#334155] drop-shadow mb-2">Plot Market</h2>
          <p className="text-lg md:text-xl text-[#1E293B] font-medium drop-shadow">Find your perfect plot or list your property with us.</p>
        </div>
      </div>
      <div className="container mx-auto px-4 pt-8 pb-4 flex flex-wrap gap-4 items-center justify-center">
        <h2 className="text-2xl font-bold text-blue-700 mb-4 w-full text-center">Available Plots</h2>
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
            </div>
          ))
        )}
      </div>
    </section>
  );
} 