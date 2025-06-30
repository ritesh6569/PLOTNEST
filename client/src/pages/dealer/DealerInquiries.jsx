import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FaClipboardList } from 'react-icons/fa';

const dummyInquiries = [
  { id: 1, from: 'Buyer', name: 'Amit Sharma', plot: 'Sunshine Residency', message: 'Is this plot available?', date: '2024-06-03' },
  { id: 2, from: 'Seller', name: 'Priya Singh', plot: 'Green Valley', message: 'Can you connect me to a buyer?', date: '2024-06-04' },
];

export default function DealerInquiries() {
  const [inquiries, setInquiries] = useState(dummyInquiries);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get('http://localhost:5000/api/inquiries')
      .then(res => {
        if (Array.isArray(res.data) && res.data.length > 0) {
          setInquiries(res.data.map((i, idx) => ({
            id: i._id || idx,
            from: i.type === 'plot' ? 'Buyer' : 'Seller',
            name: i.name,
            plot: i.plotTitle || 'Plot',
            message: i.message,
            date: i.createdAt ? i.createdAt.slice(0, 10) : '',
          })));
        } else {
          setInquiries(dummyInquiries);
        }
      })
      .catch(() => setInquiries(dummyInquiries))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <section className="min-h-screen flex items-center justify-center bg-gradient-to-br from-yellow-50 via-white to-blue-50">
        <div className="text-2xl font-bold text-brand-blue animate-pulse">Loading inquiries...</div>
      </section>
    );
  }

  return (
    <section className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-yellow-50 via-white to-blue-50 py-12 px-2">
      <div className="w-full max-w-4xl bg-white/90 rounded-3xl shadow-2xl p-10 flex flex-col items-center border border-yellow-100 backdrop-blur-md">
        <h2 className="text-2xl md:text-3xl font-extrabold text-yellow-700 mb-8 drop-shadow flex items-center gap-2"><FaClipboardList className="text-yellow-500" /> Dealer Inquiries</h2>
        <div className="w-full overflow-x-auto">
          <table className="w-full text-left border-collapse rounded-xl overflow-hidden shadow">
            <thead>
              <tr className="bg-yellow-50">
                <th className="p-4 font-semibold text-yellow-700">From</th>
                <th className="p-4 font-semibold text-yellow-700">Name</th>
                <th className="p-4 font-semibold text-yellow-700">Plot</th>
                <th className="p-4 font-semibold text-yellow-700">Message</th>
                <th className="p-4 font-semibold text-yellow-700">Date</th>
              </tr>
            </thead>
            <tbody>
              {inquiries.map(i => (
                <tr key={i.id} className="border-b hover:bg-yellow-50 transition">
                  <td className="p-4 text-yellow-700 font-semibold">{i.from}</td>
                  <td className="p-4 text-yellow-900">{i.name}</td>
                  <td className="p-4 text-blue-700">{i.plot}</td>
                  <td className="p-4 text-gray-700">{i.message}</td>
                  <td className="p-4 text-gray-500">{i.date}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
} 