import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FaHandshake, FaClipboardList, FaSearch, FaUserTie, FaUser, FaHome } from 'react-icons/fa';
import axios from 'axios';
import DealProgressTracker from '../../components/DealProgressTracker';
import DealChat from '../../components/DealChat';

const dummyStats = {
  matches: 4,
  inquiries: 7,
  listings: 3,
};

const dummyMatches = [
  { id: 1, buyer: 'Amit Sharma', seller: 'Priya Singh', plot: 'Sunshine Residency', date: '2024-06-01' },
  { id: 2, buyer: 'Ravi Kumar', seller: 'Sunil Mehta', plot: 'Green Valley', date: '2024-06-02' },
];
const dummyInquiries = [
  { id: 1, from: 'Buyer', name: 'Amit Sharma', plot: 'Sunshine Residency', date: '2024-06-03' },
  { id: 2, from: 'Seller', name: 'Priya Singh', plot: 'Green Valley', date: '2024-06-04' },
];

export default function DealerDashboard() {
  const dealer = JSON.parse(localStorage.getItem('userInfo'));
  const [stats, setStats] = useState(dummyStats);
  const [matches, setMatches] = useState(dummyMatches);
  const [inquiries, setInquiries] = useState(dummyInquiries);
  const [loading, setLoading] = useState(true);
  const [showDealModal, setShowDealModal] = useState(false);
  const [selectedDeal, setSelectedDeal] = useState(null);
  const dealerId = dealer?._id || 'dummyDealerId'; // Replace with real dealer ID logic

  useEffect(() => {
    axios.get('https://plotnest.onrender.com/api/plots/dealer/stats')
      .then(res => {
        setStats({
          matches: res.data.matches,
          inquiries: res.data.inquiries,
          listings: res.data.plots,
        });
        setMatches(
          (res.data.recentMatches || []).map((m, i) => ({
            id: m._id || i,
            buyer: m.name || 'Buyer',
            seller: m.seller || 'Seller',
            plot: m.plotTitle || 'Plot',
            date: m.createdAt ? m.createdAt.slice(0, 10) : '',
          }))
        );
        setInquiries(
          (res.data.recentInquiries || []).map((inq, i) => ({
            id: inq._id || i,
            from: inq.type === 'plot' ? 'Buyer' : 'Seller',
            name: inq.name,
            plot: inq.plotTitle || 'Plot',
            date: inq.createdAt ? inq.createdAt.slice(0, 10) : '',
          }))
        );
      })
      .catch(() => {
        setStats(dummyStats);
        setMatches(dummyMatches);
        setInquiries(dummyInquiries);
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <section className="min-h-screen flex items-center justify-center bg-gradient-to-br from-brand-gray via-white to-brand-blue/10">
        <div className="text-2xl font-bold text-brand-blue animate-pulse">Loading dashboard...</div>
      </section>
    );
  }

  return (
    <section className="min-h-screen flex flex-col items-center justify-center py-12 bg-gradient-to-br from-brand-gray via-white to-brand-blue/10">
      <div className="w-full max-w-5xl bg-white/95 rounded-3xl shadow-2xl p-10 flex flex-col items-center border border-brand-blue/10 backdrop-blur-md">
        <div className="flex flex-col items-center mb-6">
          <FaUserTie className="text-5xl text-brand-blue mb-2" />
          <div className="text-2xl font-bold text-brand-blue mb-1">Welcome, {dealer?.username || 'Dealer'}!</div>
          <div className="text-gray-500 text-center">Manage your matches, listings, and inquiries from your dashboard.</div>
        </div>
        {/* Quick Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 w-full mb-8">
          <div className="bg-brand-blue/5 rounded-xl p-6 flex flex-col items-center shadow">
            <FaHandshake className="text-2xl text-brand-blue mb-1" />
            <div className="text-lg font-bold text-brand-blue">{stats.matches}</div>
            <div className="text-gray-600 text-sm">Matches Made</div>
          </div>
          <div className="bg-brand-green/5 rounded-xl p-6 flex flex-col items-center shadow">
            <FaClipboardList className="text-2xl text-brand-green mb-1" />
            <div className="text-lg font-bold text-brand-green">{stats.inquiries}</div>
            <div className="text-gray-600 text-sm">Inquiries</div>
          </div>
          <div className="bg-brand-yellow/10 rounded-xl p-6 flex flex-col items-center shadow">
            <FaHome className="text-2xl text-brand-yellow mb-1" />
            <div className="text-lg font-bold text-brand-yellow">{stats.listings}</div>
            <div className="text-gray-600 text-sm">Active Listings</div>
          </div>
        </div>
        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 mb-8 w-full justify-center">
          <Link to="/dealer/browse-plots" className="bg-brand-blue text-white px-6 py-3 rounded-xl font-bold flex items-center gap-2 shadow hover:bg-brand-green transition text-lg justify-center"><FaSearch /> Browse Plots</Link>
          <Link to="/dealer/matchmaking" className="bg-brand-green text-white px-6 py-3 rounded-xl font-bold flex items-center gap-2 shadow hover:bg-brand-blue transition text-lg justify-center"><FaHandshake /> Match Buyers/Sellers</Link>
          <Link to="/dealer/inquiries" className="bg-brand-yellow text-white px-6 py-3 rounded-xl font-bold flex items-center gap-2 shadow hover:bg-brand-blue transition text-lg justify-center"><FaClipboardList /> View Inquiries</Link>
        </div>
        {/* Recent Activity */}
        <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-brand-blue/5 rounded-xl p-6 shadow flex flex-col">
            <h3 className="text-lg font-bold text-brand-blue mb-3">Recent Matches</h3>
            <ul>
              {matches.map(m => (
                <li key={m.id} className="mb-2 flex items-center gap-2 cursor-pointer hover:bg-brand-blue/10 rounded px-2 py-1" onClick={() => { setSelectedDeal(m); setShowDealModal(true); }}>
                  <FaHandshake className="text-brand-blue" />
                  <span className="font-semibold text-brand-blue">{m.buyer}</span>
                  <span className="text-xs bg-brand-blue/10 text-brand-blue rounded px-2 py-0.5 ml-2">Buyer</span>
                  <span className="font-semibold text-brand-green">{m.seller}</span>
                  <span className="text-xs bg-brand-green/10 text-brand-green rounded px-2 py-0.5 ml-2">Seller</span>
                  <span className="text-brand-yellow ml-2">{m.plot}</span>
                  <span className="text-xs text-gray-400 ml-auto">{m.date}</span>
                </li>
              ))}
            </ul>
          </div>
          <div className="bg-brand-green/5 rounded-xl p-6 shadow flex flex-col">
            <h3 className="text-lg font-bold text-brand-green mb-3">Recent Inquiries</h3>
            <ul>
              {inquiries.map(i => (
                <li key={i.id} className="mb-2 flex items-center gap-2">
                  <FaClipboardList className="text-brand-green" />
                  <span className="font-semibold text-brand-green">{i.name}</span>
                  <span className="text-xs bg-brand-green/10 text-brand-green rounded px-2 py-0.5 ml-2">{i.from}</span>
                  <span className="text-brand-blue ml-2">{i.plot}</span>
                  <span className="text-xs text-gray-400 ml-auto">{i.date}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
        {/* Deal Details Modal */}
        {showDealModal && selectedDeal && (
          <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
            <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md relative">
              <button className="absolute top-2 right-2 text-xl" onClick={() => setShowDealModal(false)}>&times;</button>
              <h2 className="text-xl font-bold mb-2">Deal Details</h2>
              <div className="mb-2"><strong>Buyer:</strong> {selectedDeal.buyer}</div>
              <div className="mb-2"><strong>Seller:</strong> {selectedDeal.seller}</div>
              <div className="mb-2"><strong>Plot:</strong> {selectedDeal.plot}</div>
              <div className="mb-2"><strong>Date:</strong> {selectedDeal.date}</div>
              <DealProgressTracker currentStage={selectedDeal.status || 'Inquiry'} />
              {/* Chat for this deal */}
              <DealChat
                dealId={selectedDeal._id || selectedDeal.id}
                userId={dealer?._id || 'dummyDealerId'}
                username={dealer?.username || 'Dealer'}
              />
              {/* Always show the button for testing */}
              <button
                className="mt-4 px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
                onClick={() => {
                  const stages = ['Inquiry', 'Dealer Assigned', 'Site Visit', 'Negotiation', 'Finalized'];
                  const idx = stages.indexOf(selectedDeal.status || 'Inquiry');
                  const nextStatus = stages[idx + 1] || 'Finalized';
                  setSelectedDeal({ ...selectedDeal, status: nextStatus });
                }}
              >
                Move to Next Stage
              </button>
            </div>
          </div>
        )}
      </div>
    </section>
  );
} 