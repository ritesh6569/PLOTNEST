import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaPlus, FaClipboardList, FaEnvelope, FaEdit, FaTrash } from 'react-icons/fa';

const dummyPlots = [
  { id: 1, title: 'Sunshine Residency', price: 2500000, location: 'Sector 45, Noida', image: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb', inquiries: 2 },
  { id: 2, title: 'Green Valley', price: 1800000, location: 'Golf City, Lucknow', image: 'https://images.unsplash.com/photo-1464983953574-0892a716854b', inquiries: 1 },
  { id: 3, title: 'Urban Heights', price: 3200000, location: 'Baner, Pune', image: 'https://images.unsplash.com/photo-1507089947368-19c1da9775ae', inquiries: 0 },
];
const dummyInquiries = 5;

export default function SellerDashboard() {
  const [plots] = useState(dummyPlots);
  const navigate = useNavigate();

  return (
    <section className="min-h-screen flex flex-col items-center justify-center py-12 bg-gradient-to-br from-green-50 to-blue-50">
      <div className="w-full max-w-4xl bg-white rounded-2xl shadow-xl p-8 flex flex-col items-center">
        <div className="flex flex-col items-center mb-6">
          <h2 className="text-3xl font-extrabold text-green-700 mb-2 drop-shadow">Welcome, Seller!</h2>
          <div className="text-gray-500 text-center">Manage your plots and inquiries from your dashboard.</div>
        </div>
        {/* Quick Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 w-full mb-8">
          <div className="bg-green-50 rounded-xl p-4 flex flex-col items-center shadow">
            <FaClipboardList className="text-2xl text-green-600 mb-1" />
            <div className="text-lg font-bold text-green-800">{plots.length}</div>
            <div className="text-gray-600 text-sm">Total Listings</div>
          </div>
          <div className="bg-blue-50 rounded-xl p-4 flex flex-col items-center shadow">
            <FaEnvelope className="text-2xl text-blue-600 mb-1" />
            <div className="text-lg font-bold text-blue-800">{dummyInquiries}</div>
            <div className="text-gray-600 text-sm">Total Inquiries</div>
          </div>
        </div>
        {/* Action Buttons */}
        <div className="flex gap-4 mb-8">
          <button onClick={() => navigate('/seller/add-plot')} className="bg-green-600 text-white px-6 py-2 rounded-lg font-bold flex items-center gap-2 shadow hover:bg-green-700 transition"><FaPlus /> Add New Plot</button>
          <button onClick={() => navigate('/seller/manage-listings')} className="bg-blue-600 text-white px-6 py-2 rounded-lg font-bold flex items-center gap-2 shadow hover:bg-blue-700 transition"><FaClipboardList /> Manage Listings</button>
        </div>
        {/* Recent Listings */}
        <div className="w-full">
          <h3 className="text-xl font-bold text-green-700 mb-4">Recent Listings</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {plots.map(plot => (
              <div key={plot.id} className="bg-white rounded-xl shadow p-4 flex flex-col items-center border-t-4 border-green-400">
                <img src={plot.image} alt={plot.title} className="w-full h-32 object-cover rounded mb-3" />
                <div className="font-bold text-green-800 text-lg mb-1">{plot.title}</div>
                <div className="text-gray-600 text-sm mb-1">{plot.location}</div>
                <div className="text-green-700 font-semibold mb-2">₹{plot.price.toLocaleString()}</div>
                <div className="flex gap-2">
                  <button className="bg-blue-100 text-blue-700 px-3 py-1 rounded flex items-center gap-1 text-sm font-semibold"><FaEdit /> Edit</button>
                  <button className="bg-red-100 text-red-700 px-3 py-1 rounded flex items-center gap-1 text-sm font-semibold"><FaTrash /> Delete</button>
                </div>
                <button onClick={() => navigate(`/seller/plot-inquiries/${plot.id}`)} className="mt-2 text-blue-600 hover:underline text-sm">View Inquiries ({plot.inquiries})</button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
} 