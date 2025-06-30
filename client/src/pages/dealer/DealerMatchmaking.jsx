import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FaUser, FaUserTie, FaHandshake } from 'react-icons/fa';

const dummyBuyers = [
  { id: 1, name: 'Amit Sharma', email: 'amit@example.com', interestedPlot: 'Sunshine Residency' },
  { id: 2, name: 'Ravi Kumar', email: 'ravi@example.com', interestedPlot: 'Green Valley' },
];
const dummySellers = [
  { id: 1, name: 'Priya Singh', email: 'priya@example.com', plot: 'Sunshine Residency' },
  { id: 2, name: 'Sunil Mehta', email: 'sunil@example.com', plot: 'Green Valley' },
];

export default function DealerMatchmaking() {
  const [buyers, setBuyers] = useState(dummyBuyers);
  const [sellers, setSellers] = useState(dummySellers);
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      axios.get('https://plotnest.onrender.com/api/admin/users'),
      axios.get('https://plotnest.onrender.com/api/plots')
    ])
      .then(([usersRes, plotsRes]) => {
        const users = usersRes.data || [];
        const plots = plotsRes.data || [];
        const buyersList = users.filter(u => u.role === 'buyer').map((b, i) => ({
          id: b._id || i,
          name: b.username,
          email: b.email,
          interestedPlot: plots[i % plots.length]?.title || 'N/A',
        }));
        const sellersList = users.filter(u => u.role === 'seller').map((s, i) => ({
          id: s._id || i,
          name: s.username,
          email: s.email,
          plot: plots[i % plots.length]?.title || 'N/A',
        }));
        setBuyers(buyersList.length ? buyersList : dummyBuyers);
        setSellers(sellersList.length ? sellersList : dummySellers);
      })
      .catch(() => {
        setBuyers(dummyBuyers);
        setSellers(dummySellers);
      })
      .finally(() => setLoading(false));
  }, []);

  const handleMatch = (buyer, seller) => {
    setMatches([...matches, { buyer, seller }]);
  };

  if (loading) {
    return (
      <section className="min-h-screen flex items-center justify-center bg-gradient-to-br from-brand-gray via-white to-brand-blue/10">
        <div className="text-2xl font-bold text-brand-blue animate-pulse">Loading matchmaking...</div>
      </section>
    );
  }

  return (
    <section className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-brand-gray via-white to-brand-blue/10 py-12 px-2">
      <div className="w-full max-w-5xl bg-white/95 rounded-3xl shadow-2xl p-10 flex flex-col items-center border border-brand-blue/10 backdrop-blur-md">
        <h2 className="text-3xl font-bold text-brand-blue mb-8 text-center flex items-center gap-2"><FaHandshake className="text-brand-blue" /> Dealer Matchmaking</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full mb-8">
          <div>
            <h3 className="text-lg font-bold text-blue-700 mb-4 flex items-center gap-2"><FaUser className="text-blue-600" /> Buyers</h3>
            <ul>
              {buyers.map(buyer => (
                <li key={buyer.id} className="bg-blue-50 rounded-xl p-4 mb-4 shadow flex flex-col">
                  <span className="font-semibold text-blue-900">{buyer.name}</span>
                  <span className="text-gray-600 text-sm">{buyer.email}</span>
                  <span className="text-gray-500 text-sm">Interested: {buyer.interestedPlot}</span>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-bold text-green-700 mb-4 flex items-center gap-2"><FaUserTie className="text-green-600" /> Sellers</h3>
            <ul>
              {sellers.map(seller => (
                <li key={seller.id} className="bg-green-50 rounded-xl p-4 mb-4 shadow flex flex-col">
                  <span className="font-semibold text-green-900">{seller.name}</span>
                  <span className="text-gray-600 text-sm">{seller.email}</span>
                  <span className="text-gray-500 text-sm">Plot: {seller.plot}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
        <div className="w-full mt-8">
          <h3 className="text-lg font-bold text-brand-blue mb-4 flex items-center gap-2"><FaHandshake className="text-brand-blue" /> Suggested Matches</h3>
          <ul>
            {matches.length === 0 && <li className="text-gray-400">No matches suggested yet.</li>}
            {matches.map((m, idx) => (
              <li key={idx} className="bg-yellow-50 rounded-xl p-4 mb-2 shadow flex flex-col md:flex-row md:items-center md:gap-4">
                <span className="text-blue-900 font-semibold">{m.buyer.name}</span>
                <span className="text-gray-500 text-sm">({m.buyer.interestedPlot})</span>
                <span className="mx-2">→</span>
                <span className="text-green-900 font-semibold">{m.seller.name}</span>
                <span className="text-gray-500 text-sm">({m.seller.plot})</span>
              </li>
            ))}
          </ul>
        </div>
        <div className="w-full mt-8 flex flex-col md:flex-row flex-wrap gap-4 justify-center">
          {buyers.map(buyer => (
            sellers.map(seller => (
              <button key={buyer.id + '-' + seller.id} onClick={() => handleMatch(buyer, seller)} className="bg-brand-blue text-white px-5 py-2 rounded-lg font-semibold hover:bg-brand-green transition shadow flex items-center gap-2 text-base mb-2 md:mb-0">
                <FaHandshake /> Suggest Match: <span className="font-bold">{buyer.name}</span> <span className="mx-1">↔</span> <span className="font-bold">{seller.name}</span>
              </button>
            ))
          ))}
        </div>
      </div>
    </section>
  );
} 